import { checkImage, processResult, setupRealSkia, skia } from "./setup";

describe("Paint", () => {
  it("should calculate local coordinates from device coordinates", async () => {
    const image = await skia.draw(
      ({ canvas }) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const ctx = (canvas as any).ctx.ctx
          .renderingCtx as CanvasRenderingContext2D;
        ctx.save();
        ctx.scale(2, 2);
        ctx.translate(100, 100);
        ctx.rotate(Math.PI / 4);

        const m = ctx.getTransform().invertSelf();
        const topLeft = new DOMPoint(0, 0).matrixTransform(m);
        const topRight = new DOMPoint(512, 0).matrixTransform(m);
        const bottomRight = new DOMPoint(512, 512).matrixTransform(m);
        const bottomLeft = new DOMPoint(0, 512).matrixTransform(m);

        ctx.beginPath();
        ctx.arc(topLeft.x, topLeft.y, 50, 0, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(topRight.x, topRight.y, 50, 0, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(bottomRight.x, bottomRight.y, 50, 0, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(bottomLeft.x, bottomLeft.y, 50, 0, 2 * Math.PI);
        ctx.fill();

        ctx.restore();
      },
      { width: 512, height: 512 }
    );
    checkImage(image, "snapshots/paint/test.png");
  });
  it("should draw a paint as reference (1)", async () => {
    const { surface, canvas } = setupRealSkia();
    canvas.save();
    canvas.scale(3, 1.5);
    canvas.translate(100, 100);
    const paint = new RealCanvasKit.Paint();
    canvas.drawPaint(paint);
    canvas.restore();
    processResult(surface, "snapshots/paint/black.png");
  });
  it("should draw a paint", async () => {
    const image = await skia.draw(({ CanvasKit, canvas }) => {
      canvas.save();
      canvas.scale(3, 1.5);
      canvas.translate(100, 100);
      const paint = new CanvasKit.Paint();
      canvas.drawPaint(paint);
      canvas.restore();
    });
    checkImage(image, "snapshots/paint/black.png");
  });

  it("should draw a paint (2)", async () => {
    const image = await skia.draw(({ CanvasKit, canvas }) => {
      canvas.save();
      canvas.scale(0.5, 1.5);
      canvas.translate(100, 100);
      canvas.rotate(45, 128, 128);
      const paint = new CanvasKit.Paint();
      canvas.drawPaint(paint);
      canvas.restore();
    });
    checkImage(image, "snapshots/paint/black.png");
  });

  it("should draw a paint (3)", async () => {
    const image = await skia.draw(({ CanvasKit, canvas }) => {
      canvas.save();
      canvas.scale(0.5, 1.5);
      canvas.translate(100, 100);
      canvas.rotate(45, 128, 128);
      canvas.clear(CanvasKit.BLACK);
      canvas.restore();
    });
    checkImage(image, "snapshots/paint/black.png");
  });

  it("should draw a paint (4)", async () => {
    const image = await skia.draw(({ CanvasKit, canvas }) => {
      canvas.save();
      canvas.scale(0.5, 1.5);
      canvas.translate(100, 100);
      canvas.rotate(45, 128, 128);
      canvas.clear(CanvasKit.BLUE);
      canvas.restore();
    });
    checkImage(image, "snapshots/paint/blue.png");
  });

  it("should draw a paint (5)", async () => {
    const image = await skia.draw(({ CanvasKit, canvas }) => {
      canvas.save();
      canvas.scale(0.5, 1.5);
      canvas.translate(100, 100);
      canvas.rotate(45, 128, 128);
      canvas.clear(CanvasKit.WHITE);
      const paint = new CanvasKit.Paint();
      paint.setColor(CanvasKit.BLUE);
      paint.setAlphaf(0.5);
      canvas.drawPaint(paint);
      canvas.restore();
    });
    checkImage(image, "snapshots/paint/lightblue.png");
  });

  it("should draw a paint (6)", async () => {
    const image = await skia.draw(({ CanvasKit, canvas }) => {
      canvas.save();
      canvas.scale(0.5, 1.5);
      canvas.translate(100, 100);
      canvas.rotate(45, 128, 128);
      canvas.clear(CanvasKit.WHITE);
      const paint = new CanvasKit.Paint();
      paint.setColor(CanvasKit.parseColorString("#0000ff55"));
      canvas.drawPaint(paint);
      canvas.restore();
    });
    checkImage(image, "snapshots/paint/lightblue2.png");
  });

  it("should draw a blue paint via setColorInt", async () => {
    const image = await skia.draw(({ CanvasKit, canvas }) => {
      const paint = new CanvasKit.Paint();
      paint.setColorInt(0xff0000ff);
      canvas.save();
      canvas.drawPaint(paint);
      canvas.restore();
    });
    checkImage(image, "snapshots/paint/blue.png");
  });

  it("should draw a red paint via setColorInt", async () => {
    const image = await skia.draw(({ CanvasKit, canvas }) => {
      const paint = new CanvasKit.Paint();
      paint.setColorInt(0xffff0000);
      canvas.save();
      canvas.drawPaint(paint);
      canvas.restore();
    });
    checkImage(image, "snapshots/paint/red.png");
  });
  it("should only fill the clip (reference)", async () => {
    const { surface, canvas } = setupRealSkia();
    canvas.save();
    const colors = [RealCanvasKit.RED, RealCanvasKit.GREEN, RealCanvasKit.BLUE];
    const pos = [0, 0.5, 1];
    const paint = new RealCanvasKit.Paint();
    paint.setShader(
      RealCanvasKit.Shader.MakeSweepGradient(
        0,
        0,
        colors,
        pos,
        RealCanvasKit.TileMode.Clamp
      )
    );
    const rect = RealCanvasKit.XYWHRect(0, 0, 150, 150);
    canvas.clipRect(rect, RealCanvasKit.PathOp.Intersect, true);
    canvas.drawPaint(paint);
    canvas.restore();
    processResult(surface, "snapshots/paint/clip.png");
  });
  it("should only fill the clip", async () => {
    const image = await skia.draw(({ CanvasKit, canvas }) => {
      canvas.save();
      const colors = [CanvasKit.RED, CanvasKit.GREEN, CanvasKit.BLUE];
      const pos = [0, 0.5, 1];
      const paint = new CanvasKit.Paint();
      paint.setShader(
        CanvasKit.Shader.MakeSweepGradient(
          0,
          0,
          colors,
          pos,
          CanvasKit.TileMode.Clamp
        )
      );
      const rect = CanvasKit.XYWHRect(0, 0, 150, 150);
      canvas.clipRect(rect, CanvasKit.PathOp.Intersect, true);
      canvas.drawPaint(paint);
      canvas.restore();
    });
    checkImage(image, "snapshots/paint/clip.png");
  });

  it("should clear", async () => {
    const image = await skia.draw(({ CanvasKit, canvas }) => {
      canvas.save();
      canvas.translate(100, 100);
      canvas.clear(CanvasKit.BLACK);
      canvas.restore();
    });
    checkImage(image, "snapshots/paint/black.png");
  });

  it("should draw a shape with a stroke", async () => {
    const image = await skia.draw(({ CanvasKit, canvas, width }) => {
      const size = width / 2;
      const paint = new CanvasKit.Paint();
      paint.setColor(CanvasKit.parseColorString("cyan"));
      paint.setStyle(CanvasKit.PaintStyle.Stroke);
      paint.setStrokeWidth(4);
      canvas.drawCircle(size, size, size, paint);
      // We have this unbalenced restore() call on purpose
      canvas.restore();
    });
    checkImage(image, "snapshots/paint/circle-stroke.png");
  });
});
