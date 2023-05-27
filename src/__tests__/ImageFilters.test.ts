import { checkImage, skia } from "./setup";

describe("ImageFilters", () => {
  it("should blur the hello world example", async () => {
    const image = await skia.eval(({ CanvasKit, width, height, canvas }) => {
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
    });

    checkImage(image, "snapshots/image-filters/blur.png");
  });
});
