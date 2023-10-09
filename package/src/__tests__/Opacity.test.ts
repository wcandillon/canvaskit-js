import { checkImage, processResult, setupRealSkia, skia } from "./setup";

describe("Opacity", () => {
  it("Build reference result", async () => {
    const image = await skia.draw(({ CanvasKit, canvas }) => {
      canvas.drawColor(CanvasKit.WHITE);
      canvas.drawColor(Float32Array.of(0, 0, 1, 0.25));
    });
    checkImage(image, "snapshots/opacity/violet.png");
  });
  it("Should multiply multiply the color opacity (reference)", () => {
    const { surface, canvas } = setupRealSkia();
    canvas.drawColor(RealCanvasKit.WHITE);
    const paint = new RealCanvasKit.Paint();
    paint.setColor(RealCanvasKit.Color(0, 0, 255, 0.5));
    paint.setAlphaf(0.25);
    canvas.drawPaint(paint);
    processResult(surface, "snapshots/opacity/violet.png");
  });
  it("Should multiply multiply the color opacity", async () => {
    const image = await skia.draw(({ CanvasKit, canvas }) => {
      canvas.drawColor(CanvasKit.WHITE);
      const paint = new CanvasKit.Paint();
      paint.setColor(CanvasKit.Color(0, 0, 255, 0.5));
      paint.setAlphaf(0.25);
      canvas.drawPaint(paint);
    });
    checkImage(image, "snapshots/opacity/violet.png");
  });
  it("Should set the opacity", async () => {
    const image = await skia.draw(({ CanvasKit, canvas }) => {
      canvas.drawColor(CanvasKit.WHITE);
      const paint = new CanvasKit.Paint();
      paint.setColor(CanvasKit.Color(0, 0, 255, 1));
      paint.setAlphaf(0.25);
      canvas.drawPaint(paint);
    });
    checkImage(image, "snapshots/opacity/violet.png");
  });
  it("Opacity applies to shaders", async () => {
    const image = await skia.draw(({ CanvasKit, canvas }) => {
      canvas.drawColor(CanvasKit.WHITE);
      const paint = new CanvasKit.Paint();
      paint.setShader(
        CanvasKit.Shader.MakeColor(
          CanvasKit.Color(0, 0, 255),
          CanvasKit.ColorSpace.SRGB
        )
      );
      paint.setAlphaf(0.25);
      canvas.drawPaint(paint);
    });
    checkImage(image, "snapshots/opacity/violet.png");
  });

  it("Opacity applies to shaders (2 - reference)", async () => {
    const { surface, canvas } = setupRealSkia();
    canvas.drawColor(RealCanvasKit.WHITE);
    const paint = new RealCanvasKit.Paint();
    paint.setShader(
      RealCanvasKit.Shader.MakeColor(
        RealCanvasKit.Color(0, 0, 255, 0.25),
        RealCanvasKit.ColorSpace.SRGB
      )
    );
    canvas.drawPaint(paint);
    processResult(surface, "snapshots/opacity/violet.png");
  });

  it("Opacity applies to shaders 2", async () => {
    const image = await skia.draw(({ CanvasKit, canvas }) => {
      canvas.drawColor(CanvasKit.WHITE);
      const paint = new CanvasKit.Paint();
      paint.setShader(
        CanvasKit.Shader.MakeColor(
          CanvasKit.Color(0, 0, 255, 0.25),
          CanvasKit.ColorSpace.SRGB
        )
      );
      canvas.drawPaint(paint);
    });
    checkImage(image, "snapshots/opacity/violet.png");
  });
});
