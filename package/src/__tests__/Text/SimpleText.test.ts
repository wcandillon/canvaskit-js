import { checkImage, skia } from "../setup";

describe("Simple Text", () => {
  it("should draw a simple text (1)", async () => {
    const image = await skia.draw(({ CanvasKit, canvas }) => {
      const paint = new CanvasKit.Paint();
      paint.setColor(CanvasKit.CYAN);
      const font = new CanvasKit.Font();
      canvas.drawText("Hello World", 10, 50, paint, font);
    });
    checkImage(image, "snapshots/text/simple-text-default.png");
  });
  it("should draw a simple text (2)", async () => {
    const image = await skia.draw(
      ({ CanvasKit, canvas, assets: { RobotoLight } }) => {
        const paint = new CanvasKit.Paint();
        paint.setColor(CanvasKit.CYAN);
        const font = new CanvasKit.Font(RobotoLight, 64);
        canvas.drawText("Hello Roboto", 10, 50, paint, font);
      }
    );
    checkImage(image, "snapshots/text/simple-text-light.png");
  });

  it("should draw a simple text (3)", async () => {
    const image = await skia.draw(
      ({ CanvasKit, canvas, assets: { RobotoMedium } }) => {
        const paint = new CanvasKit.Paint();
        paint.setColor(CanvasKit.CYAN);
        const font = new CanvasKit.Font(RobotoMedium, 64);
        canvas.drawText("Hello Roboto", 10, 50, paint, font);
      }
    );
    checkImage(image, "snapshots/text/simple-text-medium.png");
  });
});
