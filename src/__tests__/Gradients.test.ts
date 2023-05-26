import { processResult, setupSkia } from "./setup";

describe("Gradients", () => {
  it("should draw a linear gradient 1", () => {
    const { surface, width, canvas } = setupSkia();
    const paint = new CanvasKit.Paint();
    const shader = CanvasKit.Shader.MakeLinearGradient(
      [0, 0],
      [width, 0],
      [CanvasKit.RED, CanvasKit.GREEN, CanvasKit.BLUE],
      null,
      CanvasKit.TileMode.Clamp
    );
    paint.setShader(shader);
    canvas.drawPaint(paint);
    processResult(surface, "snapshots/linear-gradient1.png");
  });
  it("should draw a linear gradient 2", () => {
    const { surface, canvas } = setupSkia();
    canvas.scale(2, 2);
    const strokePaint = new CanvasKit.Paint();
    strokePaint.setStyle(CanvasKit.PaintStyle.Stroke);
    strokePaint.setColor(CanvasKit.BLACK);

    const paint = new CanvasKit.Paint();
    paint.setStyle(CanvasKit.PaintStyle.Fill);
    const transparentGreen = CanvasKit.Color(0, 255, 255, 0);

    const lgs = CanvasKit.Shader.MakeLinearGradient(
      [0, 0],
      [50, 100], // start and stop points
      [transparentGreen, CanvasKit.BLUE, CanvasKit.RED],
      [0, 0.65, 1.0],
      CanvasKit.TileMode.Mirror
    );
    paint.setShader(lgs);
    let r = CanvasKit.LTRBRect(0, 0, 100, 100);
    canvas.drawRect(r, paint);
    canvas.drawRect(r, strokePaint);

    const lgsPremul = CanvasKit.Shader.MakeLinearGradient(
      [100, 0],
      [150, 100], // start and stop points
      Uint32Array.of(
        CanvasKit.ColorAsInt(0, 255, 255, 0),
        CanvasKit.ColorAsInt(0, 0, 255, 255),
        CanvasKit.ColorAsInt(255, 0, 0, 255)
      ),
      [0, 0.65, 1.0],
      CanvasKit.TileMode.Mirror,
      undefined, // no local matrix
      1 // interpolate colors in premul
    );
    paint.setShader(lgsPremul);
    r = CanvasKit.LTRBRect(100, 0, 200, 100);
    canvas.drawRect(r, paint);
    canvas.drawRect(r, strokePaint);

    const lgs45 = CanvasKit.Shader.MakeLinearGradient(
      [0, 100],
      [50, 200], // start and stop points
      Float32Array.of(...transparentGreen, ...CanvasKit.BLUE, ...CanvasKit.RED),
      [0, 0.65, 1.0],
      CanvasKit.TileMode.Mirror,
      CanvasKit.Matrix.rotated(Math.PI / 4, 0, 100)
    );
    paint.setShader(lgs45);
    r = CanvasKit.LTRBRect(0, 100, 100, 200);
    canvas.drawRect(r, paint);
    canvas.drawRect(r, strokePaint);

    // malloc'd color array
    const lgs45Premul = CanvasKit.Shader.MakeLinearGradient(
      [100, 100],
      [150, 200], // start and stop points
      [transparentGreen, CanvasKit.BLUE, CanvasKit.RED],
      [0, 0.65, 1.0],
      CanvasKit.TileMode.Mirror,
      CanvasKit.Matrix.rotated(Math.PI / 4, 100, 100),
      1 // interpolate colors in premul
    );
    paint.setShader(lgs45Premul);
    r = CanvasKit.LTRBRect(100, 100, 200, 200);
    canvas.drawRect(r, paint);
    canvas.drawRect(r, strokePaint);
    processResult(surface, "snapshots/linear-gradient2.png", true);
  });
});
