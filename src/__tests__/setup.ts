import path from "path";
import fs from "fs";

import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";
/* eslint-disable no-var */
import type {
  CanvasKit,
  CanvasKit as CanvasKitType,
  Image,
  Surface,
  Canvas,
} from "canvaskit-wasm";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import CanvasKitInit from "canvaskit-wasm/bin/full/canvaskit";
import type { Browser, Page } from "puppeteer";
import puppeteer from "puppeteer";

import { CanvasKitLite } from "../CanvasKit";
import { vec } from "../Values";
import { ImageLite } from "../Image";

class RemoteSurface {
  private browser: Browser | null = null;
  private page: Page | null = null;

  async init() {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.evaluate(fs.readFileSync("./dist/index.global.js", "utf8"));
    await page.evaluate(`function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });}`);
    this.browser = browser;
    this.page = page;
  }

  async dispose() {
    if (this.browser) {
      this.browser.close();
    }
  }

  async eval(
    fn: (opts: {
      CanvasKit: CanvasKit;
      surface: Surface;
      width: number;
      height: number;
      canvas: Canvas;
      center: { x: number; y: number };
    }) => unknown,
    width = 256,
    height = 256
  ) {
    if (!this.page) {
      throw new Error("RemoteSurface not initialized");
    }
    const dataURL = await this.page.evaluate(
      `(async function Main(){ 
        const canvas = document.createElement("canvas");
        canvas.width = ${width};
        canvas.height = ${height};
        document.body.appendChild(canvas);
        const surface = CanvasKit.MakeCanvasSurface(canvas);
        const width = ${width};
        const height = ${height};
        const ctx = { 
          CanvasKit, surface, width, height, canvas: surface.getCanvas(), center: {x: width/2, y: height/2}
        };
        (${fn.toString()})(ctx);
        return canvas.toDataURL();
      })();`
    );
    return new ImageLite(dataURL as string);
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

global.CanvasKit = CanvasKitLite.getInstance();

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
  return checkImage(image, relPath, { overwrite });
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
  image: Image,
  relPath: string,
  opts?: CheckImageOptions
) => {
  const options = { ...defaultCheckImageOptions, ...opts };
  const { overwrite, threshold, mute, maxPixelDiff, shouldFail } = options;
  const png = image.encodeToBytes();
  if (!png) {
    throw new Error("Unable to encode image");
  }
  const p = path.resolve(__dirname, relPath);
  if (fs.existsSync(p) && !overwrite) {
    const ref = fs.readFileSync(p);
    const baseline = PNG.sync.read(ref);

    const toTest = PNG.sync.read(Buffer.from(image.encodeToBytes()!));
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
    fs.writeFileSync(p, png);
  }
  return 0;
};
