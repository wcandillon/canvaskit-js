import fs from "fs";

import type { CanvasKit, Surface } from "canvaskit-wasm";
import type { Browser, Page } from "puppeteer";
import puppeteer from "puppeteer";

// import { processResult, setupSkia } from "./setup";
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
    width: number,
    height: number,
    fn: (Skia: CanvasKit, surface: Surface) => unknown
  ) {
    if (!this.page) {
      throw new Error("RemoteSurface not initialized");
    }
    const result = await this.page.evaluate(
      `(async function Main(){ 
        const canvas = document.createElement("canvas");
        canvas.width = ${width};
        canvas.height = ${height};
        document.body.appendChild(canvas);

        const surface = CanvasKit.MakeCanvasSurface(canvas);
        (${fn.toString()})(CanvasKit, surface);
        return canvas.toDataURL();
      })();`
    );
    console.log(result);
  }
}

declare global {
  // eslint-disable-next-line no-var
  var surface: RemoteSurface;
}

beforeAll(async () => {
  global.surface = new RemoteSurface();
  await global.surface.init();
});

afterAll(async () => {
  await global.surface.dispose();
});

describe("ImageFilters", () => {
  it("should blur the hello world example", async () => {
    const image = await global.surface.eval(256, 256, (CanvasKit, surface) => {
      const width = 256;
      const height = 256;
      const canvas = surface.getCanvas();
      const paint = new CanvasKit.Paint();
      paint.setBlendMode(CanvasKit.BlendMode.Multiply);
      paint.setImageFilter(
        CanvasKit.ImageFilter.MakeBlur(10, 10, CanvasKit.TileMode.Clamp, null)
      );
      const cyan = paint.copy();
      const r = 92;
      cyan.setColor(CanvasKit.CYAN);
      canvas.drawCircle(r, r, r, cyan);
      // Magenta Circle
      const magenta = paint.copy();
      magenta.setColor(CanvasKit.MAGENTA);
      canvas.drawCircle(width - r, r, r, magenta);
      // Yellow Circle
      const yellow = paint.copy();
      yellow.setColor(CanvasKit.YELLOW);
      canvas.drawCircle(width / 2, height - r, r, yellow);
    });

    // processResult(surface, "snapshots/image-filters/blur.png");
  });
});
