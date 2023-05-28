import { checkImage, skia } from "./setup";

describe("Images", () => {
  it("should display an image", async () => {
    const image = await skia.eval(({ canvas, assets: { zurich } }) => {
      canvas.drawImage(zurich, 0, 0, null);
    });
    checkImage(image, "snapshots/zurich.png", { overwrite: true });
  });
  it("should display a scaled image", async () => {
    const image = await skia.eval(
      ({ canvas, width, height, assets: { zurich } }) => {
        const input = CanvasKit.XYWHRect(0, 0, zurich.width(), zurich.height());
        const output = CanvasKit.XYWHRect(0, 0, width, height);
        const paint = new CanvasKit.Paint();
        canvas.drawImageRect(zurich, input, output, paint);
      }
    );
    checkImage(image, "snapshots/zurich2.png", { overwrite: true });
  });
});
