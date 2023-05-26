import { processResult, setupSkia } from "./setup";

describe("Shapes", () => {
  it("should draw a paint", () => {
    const { surface } = setupSkia();
    const canvas = surface.getCanvas();
    const paint = new CanvasKit.Paint();
    paint.setColor(CanvasKit.RED);
    canvas.drawPaint(paint);
    processResult(surface, "snapshots/red.png");
  });

  it("should draw a circle", () => {
    const { surface, width, height } = setupSkia();
    const canvas = surface.getCanvas();
    const paint = new CanvasKit.Paint();
    paint.setColor(CanvasKit.CYAN);
    canvas.drawCircle(width / 2, height / 2, width / 2, paint);
    processResult(surface, "snapshots/circle.png");
  });

  it("should draw a linear gradient", () => {
    const { surface, width } = setupSkia();
    const canvas = surface.getCanvas();
    const paint = new CanvasKit.Paint();
    const shader = CanvasKit.Shader.MakeLinearGradient(
      [0, 0],
      [width, 0],
      [CanvasKit.RED, CanvasKit.GREEN, CanvasKit.BLUE],
      null,
      { value: 0 }
    );
    paint.setShader(shader);
    canvas.drawPaint(paint);
    processResult(surface, "snapshots/linear-gradient.png");
  });

  it("should draw the apple breathe example", () => {
    const { surface, width, height } = setupSkia();
    const canvas = surface.getCanvas();
    const root = new CanvasKit.Paint();
    root.setBlendMode(CanvasKit.BlendMode.Screen);
    const bg = root.copy();
    bg.setColor(CanvasKit.parseColorString("#242b38"));
    const c1 = root.copy();
    c1.setColor(CanvasKit.parseColorString("#61bea2"));
    const c2 = root.copy();
    c2.setColor(CanvasKit.parseColorString("#529ca0"));
    canvas.drawPaint(bg);
    canvas.drawCircle(width / 4, height / 2, width / 2, c1);
    canvas.drawCircle(width - width / 4, height / 2, width / 2, c2);
    processResult(surface, "snapshots/breathe.png", true);
  });
});
