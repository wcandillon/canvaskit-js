import { checkImage, skia, setupRealSkia, processResult } from "./setup";

describe("BackdropFilter", () => {
  it("Build reference example", () => {
    const { width, canvas, surface } = setupRealSkia();
    const r = width / 2;
    canvas.drawColor(RealCanvasKit.BLACK);
    const paint = new RealCanvasKit.Paint();
    const colors = ["#FFF723", "#E70696"].map((cl) =>
      RealCanvasKit.parseColorString(cl)
    );
    paint.setShader(
      RealCanvasKit.Shader.MakeLinearGradient(
        [0, 0],
        [0, 2 * r],
        colors,
        null,
        RealCanvasKit.TileMode.Clamp
      )
    );
    canvas.drawCircle(r, r, r, paint);
    const filter = RealCanvasKit.ImageFilter.MakeBlur(
      10,
      10,
      RealCanvasKit.TileMode.Clamp,
      null
    );
    canvas.clipRect(
      RealCanvasKit.XYWHRect(0, r, 2 * r, r),
      RealCanvasKit.ClipOp.Intersect,
      true
    );
    canvas.drawColor(Float32Array.of(0, 0, 0, 0.3));
    canvas.saveLayer(undefined, undefined, filter);
    canvas.restore();
    processResult(surface, "snapshots/backdrop-filters/reference.png");
  });
  it("Blur backdrop filter", async () => {
    const image = await skia.eval(({ CanvasKit, width, canvas }) => {
      const r = width / 2;
      canvas.drawColor(CanvasKit.BLACK);
      const paint = new CanvasKit.Paint();
      const colors = ["#FFF723", "#E70696"].map((cl) =>
        CanvasKit.parseColorString(cl)
      );
      paint.setShader(
        CanvasKit.Shader.MakeLinearGradient(
          [0, 0],
          [0, 2 * r],
          colors,
          null,
          CanvasKit.TileMode.Clamp
        )
      );
      canvas.drawCircle(r, r, r, paint);
      const filter = CanvasKit.ImageFilter.MakeBlur(
        10,
        10,
        CanvasKit.TileMode.Clamp,
        null
      );
      canvas.clipRect(
        CanvasKit.XYWHRect(0, r, 2 * r, r),
        CanvasKit.ClipOp.Intersect,
        true
      );
      canvas.drawColor(Float32Array.of(0, 0, 0, 0.3));
      canvas.saveLayer(undefined, undefined, filter);
      canvas.restore();
    });
    checkImage(image, "snapshots/backdrop-filters/reference.png", {
      threshold: 0.2,
    });
  });
});