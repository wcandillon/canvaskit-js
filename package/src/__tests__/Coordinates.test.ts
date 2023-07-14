import { checkImage, processResult, setupRealSkia, skia } from "./setup";

describe("Coordinates", () => {
  it("Build the reference result (1)", () => {
    const width = 256;
    const height = 256;
    const pd = 2;
    const { surface, canvas } = setupRealSkia(width * pd, height * pd);
    canvas.save();
    canvas.scale(pd, pd);
    const m = RealCanvasKit.Matrix.rotated(Math.PI / 4, 25, 25);
    const paint = new RealCanvasKit.Paint();
    const colors = [RealCanvasKit.GREEN, RealCanvasKit.BLUE];
    paint.setShader(
      RealCanvasKit.Shader.MakeLinearGradient(
        [0, 0],
        [50, 0],
        colors,
        null,
        RealCanvasKit.TileMode.Clamp
      )
    );
    canvas.translate(50, 50);
    canvas.concat(m);
    canvas.drawRect(RealCanvasKit.XYWHRect(0, 0, 50, 50), paint);
    canvas.restore();
    processResult(surface, "snapshots/coordinates/test1.png");
  });
  it("Test shader local coordinates", async () => {
    const image = await skia.draw(
      ({ CanvasKit, canvas }) => {
        const pd = 2;
        canvas.save();
        canvas.scale(pd, pd);
        const m = CanvasKit.Matrix.rotated(Math.PI / 4, 25, 25);
        const paint = new CanvasKit.Paint();
        const colors = [CanvasKit.GREEN, CanvasKit.BLUE];
        paint.setShader(
          CanvasKit.Shader.MakeLinearGradient(
            [0, 0],
            [50, 0],
            colors,
            null,
            CanvasKit.TileMode.Clamp
          )
        );
        canvas.translate(50, 50);
        canvas.concat(m);
        canvas.drawRect(CanvasKit.XYWHRect(0, 0, 50, 50), paint);
        canvas.restore();
      },
      {
        width: 512,
        height: 512,
      }
    );
    checkImage(image, "snapshots/coordinates/test1.png");
  });
  it("Build the reference result (2)", () => {
    const width = 256;
    const height = 256;
    const pd = 2;
    const { surface, canvas } = setupRealSkia(width * pd, height * pd);
    canvas.save();
    canvas.scale(pd, pd);
    const paint = new RealCanvasKit.Paint();
    const colors = [
      RealCanvasKit.CYAN,
      RealCanvasKit.MAGENTA,
      RealCanvasKit.YELLOW,
    ];
    paint.setShader(
      RealCanvasKit.Shader.MakeLinearGradient(
        [0, 0],
        [width, height],
        colors,
        null,
        RealCanvasKit.TileMode.Clamp
      )
    );
    canvas.drawPaint(paint);
    canvas.restore();
    processResult(surface, "snapshots/coordinates/test2.png");
  });
  it("should draw a gradient", async () => {
    const image = await skia.draw(
      ({ CanvasKit, canvas }) => {
        canvas.save();
        const width = 256;
        const height = 256;
        const pd = 2;
        canvas.scale(pd, pd);
        const paint = new CanvasKit.Paint();
        const colors = [CanvasKit.CYAN, CanvasKit.MAGENTA, CanvasKit.YELLOW];
        paint.setShader(
          CanvasKit.Shader.MakeLinearGradient(
            [0, 0],
            [width, height],
            colors,
            null,
            CanvasKit.TileMode.Clamp
          )
        );
        canvas.drawPaint(paint);
        canvas.restore();
      },
      {
        width: 512,
        height: 512,
      }
    );
    checkImage(image, "snapshots/coordinates/test2.png", {
      maxPixelDiff: 1000,
    });
  });
});
