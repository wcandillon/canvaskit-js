import { checkImage, skia } from "./setup";

describe("ImageFilters", () => {
  it("should blur the hello world example 1", async () => {
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
  it("should blur the hello world example 2", async () => {
    const image = await skia.eval(({ CanvasKit, width, height, canvas }) => {
      const paint = new CanvasKit.Paint();
      paint.setBlendMode(CanvasKit.BlendMode.Multiply);
      paint.setImageFilter(
        CanvasKit.ImageFilter.MakeBlur(50, 50, CanvasKit.TileMode.Clamp, null)
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

    checkImage(image, "snapshots/image-filters/blur2.png");
  });

  it("should compose the color filter with the image filter (1)", async () => {
    const image = await skia.eval(
      ({
        CanvasKit,
        width,
        height,
        canvas,
        assets: { oslo },
        lib: { fitRects },
      }) => {
        const input = CanvasKit.XYWHRect(0, 0, oslo.width(), oslo.height());
        const output = CanvasKit.XYWHRect(0, 0, width, height);
        const paint = new CanvasKit.Paint();
        const cf = CanvasKit.ImageFilter.MakeColorFilter(
          CanvasKit.ColorFilter.MakeMatrix([
            -0.578, 0.99, 0.588, 0, 0, 0.469, 0.535, -0.003, 0, 0, 0.015, 1.69,
            -0.703, 0, 0, 0, 0, 0, 1, 0,
          ]),
          null
        );
        const blur = CanvasKit.ImageFilter.MakeBlur(
          5,
          5,
          CanvasKit.TileMode.Clamp,
          null
        );
        paint.setImageFilter(CanvasKit.ImageFilter.MakeCompose(cf, blur));
        const { src, dst } = fitRects("cover", input, output);
        canvas.drawImageRect(oslo, src, dst, paint);
      }
    );
    checkImage(image, "snapshots/image-filters/compose.png");
  });

  it("should compose the color filter with the image filter (2)", async () => {
    const image = await skia.eval(
      ({
        CanvasKit,
        width,
        height,
        canvas,
        assets: { oslo },
        lib: { fitRects },
      }) => {
        const input = CanvasKit.XYWHRect(0, 0, oslo.width(), oslo.height());
        const output = CanvasKit.XYWHRect(0, 0, width, height);
        const paint = new CanvasKit.Paint();
        const blur = CanvasKit.ImageFilter.MakeBlur(
          5,
          5,
          CanvasKit.TileMode.Clamp,
          null
        );
        const cf = CanvasKit.ImageFilter.MakeColorFilter(
          CanvasKit.ColorFilter.MakeMatrix([
            -0.578, 0.99, 0.588, 0, 0, 0.469, 0.535, -0.003, 0, 0, 0.015, 1.69,
            -0.703, 0, 0, 0, 0, 0, 1, 0,
          ]),
          blur
        );
        paint.setImageFilter(cf);
        const { src, dst } = fitRects("cover", input, output);
        canvas.drawImageRect(oslo, src, dst, paint);
      }
    );

    checkImage(image, "snapshots/image-filters/compose.png");
  });
});
