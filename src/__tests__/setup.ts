import path from "path";
import fs from "fs";

import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";
/* eslint-disable no-var */
import type {
  CanvasKit as CanvasKitType,
  Image,
  Surface,
} from "canvaskit-wasm";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import CanvasKitInit from "canvaskit-wasm/bin/full/canvaskit";
import { createCanvas } from "canvas";

import { CanvasKitLite } from "../CanvasKit";

declare global {
  var CanvasKit: CanvasKitType;
  var RealCanvasKit: CanvasKitType;
}

global.CanvasKit = new CanvasKitLite();

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

export const setupSkia = (width = 256, height = 256) => {
  const htmlCanvas = createCanvas(
    width,
    height
  ) as unknown as HTMLCanvasElement;
  const surface = CanvasKit.MakeCanvasSurface(htmlCanvas)!;
  const canvas = surface.getCanvas();
  return { surface, width, height, htmlCanvas, canvas };
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
  threshold: 0.1,
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
