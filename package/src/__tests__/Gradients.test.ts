import { checkImage, processResult, setupRealSkia, skia } from "./setup";

describe("Gradients", () => {
  it("should draw a linear gradient 1", async () => {
    const image = await skia.draw(({ CanvasKit, canvas, width }) => {
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
    });
    checkImage(image, "snapshots/gradients/linear-gradient1.png");
  });
  it("should draw a radial gradient 1", async () => {
    const image = await skia.draw(({ CanvasKit, canvas, width }) => {
      const paint = new CanvasKit.Paint();
      const radius = Math.sqrt(width ** 2 + width ** 2);
      const shader = CanvasKit.Shader.MakeRadialGradient(
        [0, 0],
        radius,
        [CanvasKit.BLUE, CanvasKit.YELLOW],
        null,
        CanvasKit.TileMode.Clamp
      );
      paint.setShader(shader);
      canvas.drawPaint(paint);
    });
    checkImage(image, "snapshots/gradients/radial-gradient1.png");
  });
  it("should draw a sweep gradient", async () => {
    const image = await skia.draw(({ CanvasKit, canvas, width }) => {
      const paint = new CanvasKit.Paint();
      const cx = width / 2;
      const cy = width / 2;
      const shader = CanvasKit.Shader.MakeSweepGradient(
        cx,
        cy,
        [CanvasKit.CYAN, CanvasKit.YELLOW, CanvasKit.MAGENTA, CanvasKit.CYAN],
        null,
        CanvasKit.TileMode.Clamp
      );
      paint.setShader(shader);
      canvas.drawPaint(paint);
    });
    checkImage(image, "snapshots/gradients/sweep-gradient.png");
  });
  it("should draw a two point conical gradient", async () => {
    const image = await skia.draw(({ CanvasKit, canvas, width }) => {
      const paint = new CanvasKit.Paint();
      const cx = width / 2;
      const cy = width / 2;
      const shader = CanvasKit.Shader.MakeTwoPointConicalGradient(
        [cx, cy],
        cy,
        [cx, 16],
        16,
        [CanvasKit.BLUE, CanvasKit.YELLOW],
        null,
        CanvasKit.TileMode.Clamp
      );
      paint.setShader(shader);
      canvas.drawPaint(paint);
    });
    checkImage(image, "snapshots/gradients/two-point-gradient.png");
  });
  it("should draw a two point conical gradient (reference) (2)", async () => {
    const { surface, canvas, width } = setupRealSkia();

    const cx = width / 2;
    const cy = width / 2;
    const shader = RealCanvasKit.Shader.MakeTwoPointConicalGradient(
      [cx, cy],
      cy,
      [cx, 16],
      16,
      [RealCanvasKit.BLUE, RealCanvasKit.YELLOW],
      null,
      RealCanvasKit.TileMode.Clamp
    );
    canvas.save();
    canvas.scale(3, 1.5);
    const paint = new RealCanvasKit.Paint();
    paint.setShader(shader);
    canvas.drawPaint(paint);
    canvas.restore();
    processResult(surface, "snapshots/gradients/two-point-gradient2.png");
  });
  it("should draw a two point conical gradient (2)", async () => {
    const image = await skia.draw(({ CanvasKit, canvas, width }) => {
      const cx = width / 2;
      const cy = width / 2;
      const shader = CanvasKit.Shader.MakeTwoPointConicalGradient(
        [cx, cy],
        cy,
        [cx, 16],
        16,
        [CanvasKit.BLUE, CanvasKit.YELLOW],
        null,
        CanvasKit.TileMode.Clamp
      );
      canvas.save();
      canvas.scale(3, 1.5);
      const paint = new CanvasKit.Paint();
      paint.setShader(shader);
      canvas.drawPaint(paint);
      canvas.restore();
    });
    checkImage(image, "snapshots/gradients/two-point-gradient2.png", {
      maxPixelDiff: 600,
    });
  });
  it("should draw a two point conical gradient (3)", async () => {
    const image = await skia.draw(({ CanvasKit, canvas, width, height }) => {
      const cx = width / 2;
      const cy = width / 2;
      const shader = CanvasKit.Shader.MakeTwoPointConicalGradient(
        [cx, cy],
        cy,
        [cx, 16],
        16,
        [CanvasKit.BLUE, CanvasKit.YELLOW],
        null,
        CanvasKit.TileMode.Clamp
      );
      canvas.save();
      canvas.scale(3, 1.5);
      const paint = new CanvasKit.Paint();
      paint.setShader(shader);
      canvas.drawRect(CanvasKit.XYWHRect(0, 0, width, height), paint);
      canvas.restore();
    });
    checkImage(image, "snapshots/gradients/two-point-gradient2.png", {
      maxPixelDiff: 600,
    });
  });
});
