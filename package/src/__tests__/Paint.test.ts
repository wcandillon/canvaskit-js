import { checkImage, processResult, setupRealSkia, skia } from "./setup";

describe("Paint", () => {
  it("should draw a paint as reference (1)", async () => {
    const { surface, canvas } = setupRealSkia();
    canvas.save();
    canvas.scale(3, 1.5);
    canvas.translate(100, 100);
    const paint = new RealCanvasKit.Paint();
    canvas.drawPaint(paint);
    canvas.restore();
    processResult(surface, "snapshots/paint/black.png");
  });
  it("should draw a paint", async () => {
    const image = await skia.eval(({ CanvasKit, canvas }) => {
      canvas.save();
      canvas.scale(3, 1.5);
      canvas.translate(100, 100);
      const paint = new CanvasKit.Paint();
      canvas.drawPaint(paint);
      canvas.restore();
    });
    checkImage(image, "snapshots/paint/black.png");
  });

  it("should draw a paint (2)", async () => {
    const image = await skia.eval(({ CanvasKit, canvas }) => {
      canvas.save();
      canvas.scale(0.5, 1.5);
      canvas.translate(100, 100);
      canvas.rotate(45, 128, 128);
      const paint = new CanvasKit.Paint();
      canvas.drawPaint(paint);
      canvas.restore();
    });
    checkImage(image, "snapshots/paint/black.png");
  });

  it("should draw a paint (3)", async () => {
    const image = await skia.eval(({ CanvasKit, canvas }) => {
      canvas.save();
      canvas.scale(0.5, 1.5);
      canvas.translate(100, 100);
      canvas.rotate(45, 128, 128);
      canvas.clear(CanvasKit.BLACK);
      canvas.restore();
    });
    checkImage(image, "snapshots/paint/black.png");
  });
  it("should clear", async () => {
    const image = await skia.eval(({ CanvasKit, canvas }) => {
      canvas.save();
      canvas.translate(100, 100);
      canvas.clear(CanvasKit.BLACK);
      canvas.restore();
    });
    checkImage(image, "snapshots/paint/black.png");
  });
});
