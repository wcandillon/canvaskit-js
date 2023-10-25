import path from "path";
import fs from "fs";

import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";
import type { Browser, Page } from "puppeteer";
import puppeteer from "puppeteer";

import type { Canvas } from "../Canvas";
import type { Paint } from "../Paint";
import type { Path } from "../Path";
import type { BlurImageFilter } from "../ImageFilter";
import type { LinearGradient, WebGLShader, WebGLContext } from "../Shader";

const DEBUG = process.env.DEBUG === "true";

type EvalOptions = {
  width?: number;
  height?: number;
};

const defaultEvalOptions: Required<EvalOptions> = {
  width: 256,
  height: 256,
};

interface DrawingContext {
  canvas: Canvas;
  width: number;
  height: number;
  center: { x: number; y: number };
  c2d: {
    Path: typeof Path;
    Paint: typeof Paint;
    BlurImageFilter: typeof BlurImageFilter;
    WebGLShader: typeof WebGLShader;
    WebGLContext: typeof WebGLContext;
    LinearGradient: typeof LinearGradient;
  };
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
    const bundle = `${fs.readFileSync("./dist/index.global.js", "utf8")}
`;
    await page.evaluate(bundle);
    await page.evaluate(
      `
       const assets = {};
       
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
    return `const canvasElement = document.createElement("canvas");
    canvasElement.width = ${width};
    canvasElement.height = ${height};
    document.body.appendChild(canvasElement);
    const width = ${width};
    const height = ${height};
    const center = { x: width/2, y: height/2 };
    const canvas = new C2D.Canvas(canvasElement.getContext("2d"));
    const c2d = {
      Path: C2D.Path,
      Paint: C2D.Paint,
      BlurImageFilter: C2D.BlurImageFilter,
      WebGLShader: C2D.WebGLShader,
      WebGLContext: C2D.WebGLContext,
      LinearGradient: C2D.LinearGradient,
    };
    const ctx = {
      width,
      height,
      center,
      canvas,
      c2d
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
      const dataURL = canvasElement.toDataURL("image/png");
      const response = await fetch(dataURL);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = function() {
            // Convert array buffer to byte array
            const byteArray = new Uint8Array(reader.result);
            resolve(byteArray);
        }
        reader.onerror = reject;
        reader.readAsArrayBuffer(blob);
      });
    })();`;
    const data = await this.page.evaluate(source);
    return PNG.sync.read(
      Buffer.from(
        new Uint8Array(Object.values(data as { [s: string]: number }))
      )
    );
  }
}

export const remoteSurface = new RemoteSurface();

beforeAll(async () => {
  await remoteSurface.init();
});

afterAll(async () => {
  await remoteSurface.dispose();
});

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
