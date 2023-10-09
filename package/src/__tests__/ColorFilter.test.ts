import { checkImage, skia } from "./setup";

describe("ColorFilter", () => {
  it("should apply a color filter matrix", async () => {
    const image = await skia.draw(
      ({
        CanvasKit,
        canvas,
        width,
        height,
        assets: { oslo },
        lib: { fitRects },
      }) => {
        const input = CanvasKit.XYWHRect(0, 0, oslo.width(), oslo.height());
        const output = CanvasKit.XYWHRect(0, 0, width, height);
        const paint = new CanvasKit.Paint();
        paint.setColorFilter(
          CanvasKit.ColorFilter.MakeMatrix([
            -0.578, 0.99, 0.588, 0, 0, 0.469, 0.535, -0.003, 0, 0, 0.015, 1.69,
            -0.703, 0, 0, 0, 0, 0, 1, 0,
          ])
        );
        const { src, dst } = fitRects("cover", input, output);
        canvas.drawImageRect(oslo, src, dst, paint);
      }
    );
    checkImage(image, "snapshots/color-filters/matrix.png", {
      overwrite: true,
    });
  });
});
