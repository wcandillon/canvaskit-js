import { processResult, setupSkia } from "./setup";

describe("ImageFilters", () => {
  it("should blur the hello world example", () => {
    const { surface, width, height } = setupSkia();
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
    processResult(surface, "snapshots/image-filters/blur.png");
  });
});
