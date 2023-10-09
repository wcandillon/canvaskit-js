import { checkImage, skia, setupRealSkia, processResult } from "./setup";

describe("BackdropFilter", () => {
  it("Build reference example", () => {
    const { width, canvas, surface } = setupRealSkia();
    const r = width / 2;
    canvas.drawColor(RealCanvasKit.BLACK);
    const paint = new RealCanvasKit.Paint();
    const colors = ["#FFF723", "#E70696"].map((cl) =>
      RealCanvasKit.parseColorString(cl)
    );
    paint.setShader(
      RealCanvasKit.Shader.MakeLinearGradient(
        [0, 0],
        [0, 2 * r],
        colors,
        null,
        RealCanvasKit.TileMode.Decal
      )
    );
    canvas.drawCircle(r, r, r, paint);
    const filter = RealCanvasKit.ImageFilter.MakeBlur(
      10,
      10,
      RealCanvasKit.TileMode.Decal,
      null
    );
    canvas.clipRect(
      RealCanvasKit.XYWHRect(0, r, 2 * r, r),
      RealCanvasKit.ClipOp.Intersect,
      true
    );
    canvas.drawColor(Float32Array.of(0, 0, 0, 0.3));
    canvas.saveLayer(undefined, undefined, filter);
    canvas.restore();
    processResult(surface, "snapshots/backdrop-filters/reference.png", true);
  });
  it("Blur backdrop filter", async () => {
    const image = await skia.draw(({ CanvasKit, width, canvas }) => {
      const r = width / 2;
      canvas.drawColor(CanvasKit.BLACK);
      const paint = new CanvasKit.Paint();
      const colors = ["#FFF723", "#E70696"].map((cl) =>
        CanvasKit.parseColorString(cl)
      );
      paint.setShader(
        CanvasKit.Shader.MakeLinearGradient(
          [0, 0],
          [0, 2 * r],
          colors,
          null,
          CanvasKit.TileMode.Decal
        )
      );
      canvas.drawCircle(r, r, r, paint);
      const filter = CanvasKit.ImageFilter.MakeBlur(
        10,
        10,
        CanvasKit.TileMode.Decal,
        null
      );
      canvas.clipRect(
        CanvasKit.XYWHRect(0, r, 2 * r, r),
        CanvasKit.ClipOp.Intersect,
        true
      );
      canvas.drawColor(Float32Array.of(0, 0, 0, 0.3));
      canvas.saveLayer(undefined, undefined, filter);
      canvas.restore();
    });
    checkImage(image, "snapshots/backdrop-filters/reference.png", {
      threshold: 0.2,
    });
  });

  it("Blur backdrop filter (2)", async () => {
    const image = await skia.draw(
      ({ CanvasKit, width, canvas, center }) => {
        const mix = (value: number, x: number, y: number) =>
          x * (1 - value) + y * value;
        const filter = CanvasKit.ImageFilter.MakeBlur(
          10,
          10,
          CanvasKit.TileMode.Decal,
          null
        );

        const r = mix(1, width / 4, width / 8);
        canvas.drawColor(CanvasKit.BLACK);
        const paint = new CanvasKit.Paint();
        const colors = ["#FFF723", "#E70696"].map((cl) =>
          CanvasKit.parseColorString(cl)
        );
        paint.setShader(
          CanvasKit.Shader.MakeLinearGradient(
            [center.x, center.y - r],
            [center.x, center.y + r],
            colors,
            null,
            CanvasKit.TileMode.Decal
          )
        );
        canvas.save();
        canvas.drawCircle(center.x, center.y, r, paint);
        canvas.restore();

        const bounds = CanvasKit.XYWHRect(0, center.y, width, center.y);
        canvas.clipRect(bounds, CanvasKit.ClipOp.Intersect, true);
        canvas.drawColor(Float32Array.of(0, 0, 0, 0.3));
        canvas.saveLayer(undefined, bounds, filter);
        canvas.restore();
      },
      { width: 1024, height: 1024 }
    );
    checkImage(image, "snapshots/backdrop-filters/backdrop-blur.png");
  });
  it("Blur backdrop filter (3)", async () => {
    const image = await skia.draw(
      ({ CanvasKit, width, canvas, center }) => {
        const mix = (value: number, x: number, y: number) =>
          x * (1 - value) + y * value;
        const filter = CanvasKit.ImageFilter.MakeBlur(
          10,
          10,
          CanvasKit.TileMode.Decal,
          null
        );
        let r = mix(0, width / 4, width / 8);
        const paint = new CanvasKit.Paint();
        const colors = ["#FFF723", "#E70696"].map((cl) =>
          CanvasKit.parseColorString(cl)
        );
        paint.setShader(
          CanvasKit.Shader.MakeLinearGradient(
            [center.x, center.y - r],
            [center.x, center.y + r],
            colors,
            null,
            CanvasKit.TileMode.Decal
          )
        );

        canvas.save();
        canvas.drawColor(CanvasKit.BLACK);

        canvas.save();
        canvas.drawCircle(center.x, center.y, r, paint);
        canvas.restore();
        canvas.clipRect(
          CanvasKit.XYWHRect(0, center.y, width, center.y),
          CanvasKit.ClipOp.Intersect,
          true
        );
        canvas.drawColor(Float32Array.of(0, 0, 0, 0.3));
        canvas.saveLayer(undefined, undefined, filter);
        canvas.restore();
        canvas.restore();
        canvas.clear(Float32Array.of(0, 0, 0, 0));
        canvas.save();
        r = mix(1, width / 4, width / 8);
        canvas.drawColor(CanvasKit.BLACK);
        canvas.save();
        paint.setShader(
          CanvasKit.Shader.MakeLinearGradient(
            [center.x, center.y - r],
            [center.x, center.y + r],
            colors,
            null,
            CanvasKit.TileMode.Decal
          )
        );
        canvas.drawCircle(center.x, center.y, r, paint);
        canvas.restore();
        canvas.clipRect(
          CanvasKit.XYWHRect(0, center.y, width, center.y),
          CanvasKit.ClipOp.Intersect,
          true
        );
        canvas.drawColor(Float32Array.of(0, 0, 0, 0.3));
        canvas.saveLayer(undefined, undefined, filter);
        canvas.restore();
        canvas.restore();
      },
      { width: 1024, height: 1024 }
    );
    checkImage(image, "snapshots/backdrop-filters/backdrop-blur.png");
  });
});
