import { checkImage, skia } from "./setup";

describe("Images", () => {
  it("should display an image", async () => {
    const image = await skia.draw(({ canvas, assets: { zurich } }) => {
      canvas.drawImage(zurich, 0, 0, null);
    });
    checkImage(image, "snapshots/zurich.png");
  });
  it("should strecht an image to fit", async () => {
    const image = await skia.draw(
      ({ canvas, width, height, assets: { zurich } }) => {
        const src = CanvasKit.XYWHRect(0, 0, zurich.width(), zurich.height());
        const dst = CanvasKit.XYWHRect(0, 0, width, height);
        const paint = new CanvasKit.Paint();
        canvas.drawImageRect(zurich, src, dst, paint);
      }
    );
    checkImage(image, "snapshots/zurich-strech.png");
  });

  it("should display an image with cover", async () => {
    const image = await skia.draw(
      ({ canvas, width, height, assets: { zurich }, lib: { fitRects } }) => {
        const input = CanvasKit.XYWHRect(0, 0, zurich.width(), zurich.height());
        const output = CanvasKit.XYWHRect(0, 0, width, height);
        const paint = new CanvasKit.Paint();
        const { src, dst } = fitRects("cover", input, output);
        canvas.drawImageRect(zurich, src, dst, paint);
      }
    );
    checkImage(image, "snapshots/zurich-cover.png");
  });

  it("should display an image and clip it", async () => {
    const image = await skia.draw(
      ({ canvas, width, height, assets: { zurich }, lib: { fitRects } }) => {
        const input = CanvasKit.XYWHRect(0, 0, zurich.width(), zurich.height());
        const output = CanvasKit.XYWHRect(0, 0, width, height);
        const paint = new CanvasKit.Paint();
        const { src, dst } = fitRects("cover", input, output);
        canvas.save();
        canvas.clipPath(
          CanvasKit.Path.MakeFromSVGString(
            // eslint-disable-next-line max-len
            "M128 200 L48.78 250.9 L61.24 158.55 L0 97.09 L92.39 84.63 L128 0 L163.61 84.63 L256 97.09 L194.76 158.55 L207.22 250.9 Z"
          )!,
          CanvasKit.ClipOp.Intersect,
          true
        );
        canvas.drawImageRect(zurich, src, dst, paint);
        canvas.restore();
      }
    );
    checkImage(image, "snapshots/zurich-clipped.png");
  });

  it("should display an image with contain", async () => {
    const image = await skia.draw(
      ({ canvas, width, height, assets: { zurich }, lib: { fitRects } }) => {
        const input = CanvasKit.XYWHRect(0, 0, zurich.width(), zurich.height());
        const output = CanvasKit.XYWHRect(0, 0, width, height);
        const paint = new CanvasKit.Paint();
        const { src, dst } = fitRects("contain", input, output);
        canvas.drawImageRect(zurich, src, dst, paint);
      }
    );
    checkImage(image, "snapshots/zurich-contain.png", { threshold: 0.2 });
  });

  it("should display an image with contain and blurred", async () => {
    const image = await skia.draw(
      ({ canvas, width, height, assets: { zurich }, lib: { fitRects } }) => {
        const input = CanvasKit.XYWHRect(0, 0, zurich.width(), zurich.height());
        const output = CanvasKit.XYWHRect(0, 0, width, height);
        const paint = new CanvasKit.Paint();
        // const colorFilter = CanvasKit.ImageFilter.MakeColorFilter(cf, null);
        paint.setImageFilter(
          CanvasKit.ImageFilter.MakeBlur(10, 10, CanvasKit.TileMode.Clamp, null)
        );
        const { src, dst } = fitRects("contain", input, output);
        canvas.drawImageRect(zurich, src, dst, paint);
      }
    );
    checkImage(image, "snapshots/zurich-blurred.png");
  });
});
