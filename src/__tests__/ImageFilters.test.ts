import puppeteer from "puppeteer";

// import { processResult, setupSkia } from "./setup";

beforeAll(async () => {
  // Launch the browser
  const browser = await puppeteer.launch();

  // Create a page
  const page = await browser.newPage();

  // Evaluate JavaScript
  const three = await page.evaluate(async () => {
    function blobToBase64(blob: Blob) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    }

    const offscreen = new OffscreenCanvas(256, 256);
    const context = offscreen.getContext("2d")!;
    context.fillStyle = "red";
    context.fillRect(0, 0, 256, 256);
    const blob = await context.canvas.convertToBlob();
    return blobToBase64(blob);
  });

  console.log(three);

  // Close browser.
  await browser.close();
});

describe("ImageFilters", () => {
  it("should blur the hello world example", () => {
    // const { surface, width, height } = setupSkia();
    // const canvas = surface.getCanvas();
    // const paint = new CanvasKit.Paint();
    // paint.setBlendMode(CanvasKit.BlendMode.Multiply);
    // paint.setImageFilter(
    //   CanvasKit.ImageFilter.MakeBlur(10, 10, CanvasKit.TileMode.Clamp, null)
    // );
    // const cyan = paint.copy();
    // const r = 92;
    // cyan.setColor(CanvasKit.CYAN);
    // canvas.drawCircle(r, r, r, cyan);
    // // Magenta Circle
    // const magenta = paint.copy();
    // magenta.setColor(CanvasKit.MAGENTA);
    // canvas.drawCircle(width - r, r, r, magenta);
    // // Yellow Circle
    // const yellow = paint.copy();
    // yellow.setColor(CanvasKit.YELLOW);
    // canvas.drawCircle(width / 2, height - r, r, yellow);
    // processResult(surface, "snapshots/image-filters/blur.png");
  });
});
