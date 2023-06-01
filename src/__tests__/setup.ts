import path from "path";
import fs from "fs";

import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";
/* eslint-disable no-var */
import type {
  CanvasKit,
  CanvasKit as CanvasKitType,
  Surface,
  Canvas,
  Image,
} from "canvaskit-wasm";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import CanvasKitInit from "canvaskit-wasm/bin/full/canvaskit";
import type { Browser, Page } from "puppeteer";
import puppeteer from "puppeteer";

import { CanvasKitJS } from "../CanvasKit";
import { vec } from "../Values";

const DEBUG = false;

export interface DrawingContext {
  CanvasKit: CanvasKit;
  surface: Surface;
  width: number;
  height: number;
  canvas: Canvas;
  center: { x: number; y: number };
  assets: { zurich: Image };
}

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
    await page.evaluate(fs.readFileSync("./dist/index.global.js", "utf8"));
    const img = fs.readFileSync("./src/__tests__/assets/zurich.jpg");
    await page.evaluate(
      `const zurichRaw = new Uint8Array([${img.join(",")}]);
       const assets = {};
       CanvasKit.MakeImageFromEncodedAsync(zurichRaw).then((zurich) => {
          assets.zurich = zurich;
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

  async eval(fn: (opts: DrawingContext) => unknown, width = 256, height = 256) {
    if (!this.page) {
      throw new Error("RemoteSurface not initialized");
    }
    const source = `(async function Main(){ 
      const canvas = document.createElement("canvas");
      canvas.width = ${width};
      canvas.height = ${height};
      document.body.appendChild(canvas);
      const surface = CanvasKit.MakeCanvasSurface(canvas);
      const width = ${width};
      const height = ${height};
      const center = { x: width/2, y: height/2 };
      const ctx = { 
        CanvasKit, surface, width, height, canvas: surface.getCanvas(), center, assets
      };
      ${Object.keys(this.functions)
        .map((name) => {
          return `const ${name} = ${this.functions[name]}`;
        })
        .join("\n")}
      (${fn.toString()})(ctx);
      return surface.makeImageSnapshot().encodeToBytes();
    })();`;
    console.log(source);
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
  await skia.init();
});

afterAll(async () => {
  await skia.dispose();
});

declare global {
  var CanvasKit: CanvasKitType;
  var RealCanvasKit: CanvasKitType;
}

global.CanvasKit = CanvasKitJS.getInstance();

beforeAll(async () => {
  const CanvasKit = await CanvasKitInit({});
  // The CanvasKit API is stored on the global object and used
  // to create the JsiSKApi in the Skia.web.ts file.
  global.RealCanvasKit = CanvasKit;
});

export const testCanvasKitMethod = (
  name: keyof CanvasKitType,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...args: any[]
) => {
  it(`${name}(${args.join(", ")})`, () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(global.CanvasKit[name](...args)).toEqual(
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
    center: vec(width / 2, height / 2),
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
}

// On Github Action, the image decoding is slightly different
// all tests that show the oslo.jpg have small differences but look ok
const defaultCheckImageOptions = {
  maxPixelDiff: 200,
  threshold: 0.05,
  overwrite: false,
  mute: false,
  shouldFail: false,
};

export const checkImage = (
  toTest: PNG,
  relPath: string,
  opts?: CheckImageOptions
) => {
  const options = { ...defaultCheckImageOptions, ...opts };
  const { overwrite, threshold, mute, maxPixelDiff, shouldFail } = options;
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
        fs.writeFileSync(`${p}-diff-test.png`, PNG.sync.write(diffImage));
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
