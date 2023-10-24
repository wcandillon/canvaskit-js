import path from "path";
import fs from "fs";

import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";
/* eslint-disable no-var */
import { CanvasKit } from "canvaskit-wasm";
import type {
  CanvasKit as CanvasKitType,
  Surface,
  Canvas,
  Image,
  PathConstructorAndFactory,
  Rect,
  ContourMeasureIterConstructor,
  Typeface,
} from "canvaskit-wasm";
import type { Browser, Page } from "puppeteer";
import puppeteer from "puppeteer";

import { CoreCanvasKit } from "../Core";
import { PathJS } from "../Path";
import { ContourMeasureIterJS } from "../Path/ContourMeasure";
import { TypefaceFactory } from "../Text/TypefaceFactory";

import { DOMPoint } from "./DOMPoint";
import { fitRects } from "./lib/FitRect";

import "./matchers";

const DEBUG = process.env.DEBUG === "true";

export const RobotoLightData = fs.readFileSync(
  "./src/__tests__/assets/Roboto-Light.ttf"
);
export const RobotoMediumData = fs.readFileSync(
  "./src/__tests__/assets/Roboto-Medium.ttf"
);
export const Pacifico = fs.readFileSync(
  "./src/__tests__/assets/Pacifico-Regular.ttf"
);
export const RoboBlackItalic = fs.readFileSync(
  "./src/__tests__/assets/Roboto-BlackItalic.ttf"
);
export const MaterialIconsData = fs.readFileSync(
  "./src/__tests__/assets/MaterialIcons-Regular.otf"
);

export interface DrawingContext {
  CanvasKit: CanvasKit;
  surface: Surface;
  width: number;
  height: number;
  canvas: Canvas;
  center: { x: number; y: number };
  assets: {
    zurich: Image;
    oslo: Image;
    RobotoLight: Typeface;
    RobotoMedium: Typeface;
    MaterialIcons: Typeface;
  };
  lib: {
    fitRects: (fit: string, src: Rect, dst: Rect) => { src: Rect; dst: Rect };
  };
}

type EvalOptions = {
  width?: number;
  height?: number;
};

const defaultEvalOptions: Required<EvalOptions> = {
  width: 256,
  height: 256,
};

class RemoteSurface {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private functions: { [name: string]: string } = {};

  async init() {
    const browser = await puppeteer.launch({ headless: DEBUG ? false : "new" });
    const page = await browser.newPage();
    page.on("console", (msg) => console.log(msg.text()));
    page.on("pageerror", (error) => {
      console.error(error.message);
    });
    const bundle = `${fs.readFileSync("./dist/index.global.js", "utf8")}
if (window) {
  window.CanvasKit = window.CanvasKitJS;
}`;
    await page.evaluate(bundle);
    const zurich = fs.readFileSync("./src/__tests__/assets/zurich.jpg");
    const oslo = fs.readFileSync("./src/__tests__/assets/oslo.jpg");
    await page.evaluate(
      `const zurichRaw = new Uint8Array([${zurich.join(",")}]);
       const osloRaw = new Uint8Array([${oslo.join(",")}]);
       const RobotoLight = new Uint8Array([${RobotoLightData.join(",")}]);
       const RobotoMedium = new Uint8Array([${RobotoMediumData.join(",")}]);
       const MaterialIcons = new Uint8Array([${MaterialIconsData.join(",")}]);
       const assets = {};
       assets.RobotoLight = CanvasKit.Typeface.MakeFreeTypeFaceFromData(RobotoLight.buffer);
       assets.RobotoMedium = CanvasKit.Typeface.MakeFreeTypeFaceFromData(RobotoMedium.buffer);
       assets.MaterialIcons = CanvasKit.Typeface.MakeFreeTypeFaceFromData(MaterialIcons.buffer);
       Promise.all([
        CanvasKit.MakeImageFromEncodedAsync(zurichRaw),
        CanvasKit.MakeImageFromEncodedAsync(osloRaw)
       ]).then(([zurich, oslo]) => {
          assets.zurich = zurich;
          assets.oslo = oslo;
       });
      `
    );
    this.browser = browser;
    this.page = page;
  }

  async dispose() {
    if (this.browser && !DEBUG) {
      this.browser.close();
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addFunction(name: string, fn: any) {
    this.functions[name] = fn.toString();
  }

  private baseCode(
    width: number,
    height: number,
    fn: (opts: DrawingContext) => unknown
  ) {
    return `const canvas = document.createElement("canvas");
    canvas.width = ${width};
    canvas.height = ${height};
    document.body.appendChild(canvas);
    const surface = CanvasKit.MakeCanvasSurface(canvas);
    const width = ${width};
    const height = ${height};
    const center = { x: width/2, y: height/2 };
    const ctx = { 
      CanvasKit, surface, width, height,
      canvas: surface.getCanvas(), center, assets,
      lib: { fitRects: ${fitRects.toString()} }
    };
    ${Object.keys(this.functions)
      .map((name) => {
        return `const ${name} = ${this.functions[name]}`;
      })
      .join("\n")}
    const result = (${fn.toString()})(ctx);`;
  }

  async eval(fn: (opts: DrawingContext) => unknown, opts?: EvalOptions) {
    const { width, height } = { ...defaultEvalOptions, ...opts };
    if (!this.page) {
      throw new Error("RemoteSurface not initialized");
    }
    const source = `(async function Main(){ 
      ${this.baseCode(width, height, fn)}
      return JSON.stringify(result);
    })();`;
    const data = await this.page.evaluate(source);
    return JSON.parse(data as string);
  }

  async draw(fn: (opts: DrawingContext) => unknown, opts?: EvalOptions) {
    const { width, height } = { ...defaultEvalOptions, ...opts };
    if (!this.page) {
      throw new Error("RemoteSurface not initialized");
    }
    const source = `(async function Main(){ 
      ${this.baseCode(width, height, fn)}
      surface.flush();
      return surface.makeImageSnapshot().encodeToBytes();
    })();`;
    const data = await this.page.evaluate(source);
    return PNG.sync.read(
      Buffer.from(
        new Uint8Array(Object.values(data as { [s: string]: number }))
      )
    );
  }
}

export const skia = new RemoteSurface();

beforeAll(async () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const CanvasKitInit = require("canvaskit-wasm/full");
  global.RealCanvasKit = await CanvasKitInit({});
  global.DOMPoint = DOMPoint;
  await skia.init();
});

afterAll(async () => {
  await skia.dispose();
});

declare global {
  var CanvasKit: CanvasKitType;
  var RealCanvasKit: CanvasKitType;
  var DOMPoint: typeof DOMPoint;
}

class HeadlessCanvasKit extends CoreCanvasKit {
  Typeface = TypefaceFactory;
  Path = PathJS as unknown as PathConstructorAndFactory;
  ContourMeasureIter =
    ContourMeasureIterJS as unknown as ContourMeasureIterConstructor;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
global.CanvasKit = new HeadlessCanvasKit() as any;

export const testCanvasKitMethod = (
  name: keyof CanvasKitType,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...args: any[]
) => {
  it(`${name}(${args.join(", ")})`, () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(CanvasKit[name](...args)).toEqual(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      global.RealCanvasKit[name](...args)
    );
  });
};

export const setupRealSkia = (width = 256, height = 256) => {
  const surface = RealCanvasKit.MakeSurface(width, height)!;
  const canvas = surface.getCanvas();
  return {
    surface,
    width,
    height,
    canvas,
    center: Float32Array.of(width / 2, height / 2),
  };
};

export const processResult = (
  surface: Surface,
  relPath: string,
  overwrite = false
) => {
  surface.flush();
  const image = surface.makeImageSnapshot();
  surface.getCanvas().clear(Float32Array.of(0, 0, 0, 0));
  return checkImage(
    PNG.sync.read(Buffer.from(image.encodeToBytes()!)),
    relPath,
    { overwrite }
  );
};

interface CheckImageOptions {
  maxPixelDiff?: number;
  threshold?: number;
  overwrite?: boolean;
  mute?: boolean;
  shouldFail?: boolean;
  showDiff?: boolean;
}

// On Github Action, the image decoding is slightly different
// all tests that show the oslo.jpg have small differences but it looks ok
const defaultCheckImageOptions = {
  maxPixelDiff: 200,
  threshold: 0.05,
  overwrite: false,
  mute: false,
  shouldFail: false,
  showDiff: false,
};

export const checkImage = (
  toTest: PNG,
  relPath: string,
  opts?: CheckImageOptions
) => {
  const options = { ...defaultCheckImageOptions, ...opts };
  const { overwrite, threshold, mute, maxPixelDiff, shouldFail, showDiff } =
    options;
  const p = path.resolve(__dirname, relPath);
  if (fs.existsSync(p) && !overwrite) {
    const ref = fs.readFileSync(p);
    const baseline = PNG.sync.read(ref);
    const diffImage = new PNG({
      width: baseline.width,
      height: baseline.height,
    });
    const diffPixelsCount = pixelmatch(
      baseline.data,
      toTest.data,
      diffImage.data,
      baseline.width,
      baseline.height,
      { threshold }
    );
    if (!mute) {
      if (diffPixelsCount > maxPixelDiff && !shouldFail) {
        console.log(`${p} didn't match`);
        fs.writeFileSync(`${p}.test.png`, PNG.sync.write(toTest));
        if (showDiff) {
          fs.writeFileSync(`${p}-diff-test.png`, PNG.sync.write(diffImage));
        }
      }
      if (shouldFail) {
        expect(diffPixelsCount).not.toBeLessThanOrEqual(maxPixelDiff);
      } else {
        expect(diffPixelsCount).toBeLessThanOrEqual(maxPixelDiff);
      }
    }
    return diffPixelsCount;
  } else {
    fs.writeFileSync(p, PNG.sync.write(toTest));
  }
  return 0;
};
