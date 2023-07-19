import { checkImage, processResult, setupRealSkia, skia } from "./setup";

describe("DRRect", () => {
  it("should draw a DRRect (reference)", () => {
    const { canvas, surface } = setupRealSkia();
    const paint = new RealCanvasKit.Paint();

    paint.setStyle(RealCanvasKit.PaintStyle.Fill);
    paint.setStrokeWidth(3.0);
    paint.setAntiAlias(true);
    paint.setColor(RealCanvasKit.BLACK);

    const outer = RealCanvasKit.RRectXY(
      RealCanvasKit.LTRBRect(10, 60, 210, 260),
      10,
      5
    );
    const inner = RealCanvasKit.RRectXY(
      RealCanvasKit.LTRBRect(50, 90, 160, 210),
      30,
      30
    );
    canvas.drawDRRect(outer, inner, paint);

    processResult(surface, "snapshots/drrect.png");
  });
  it("should draw a DRRect", async () => {
    const image = await skia.draw(({ canvas }) => {
      const paint = new CanvasKit.Paint();

      paint.setStyle(CanvasKit.PaintStyle.Fill);
      paint.setStrokeWidth(3.0);
      paint.setAntiAlias(true);
      paint.setColor(CanvasKit.BLACK);

      const outer = CanvasKit.RRectXY(
        CanvasKit.LTRBRect(10, 60, 210, 260),
        10,
        5
      );
      const inner = CanvasKit.RRectXY(
        CanvasKit.LTRBRect(50, 90, 160, 210),
        30,
        30
      );
      canvas.drawDRRect(outer, inner, paint);
    });
    checkImage(image, "snapshots/drrect.png");
  });
});
