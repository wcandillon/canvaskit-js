import type { Point } from "canvaskit-wasm";

import type { DrawingContext } from "./setup";
import { checkImage, processResult, setupRealSkia, skia } from "./setup";

type Vector = Point;
export interface PolarPoint {
  theta: number;
  radius: number;
}

describe("Shapes", () => {
  it("should clear a paint", async () => {
    const image = await skia.draw(({ CanvasKit, canvas }) => {
      const paint = new CanvasKit.Paint();
      paint.setColor(CanvasKit.RED);
      canvas.drawPaint(paint);
      canvas.clear(Float32Array.of(0, 0, 0, 0));
    });
    checkImage(image, "snapshots/transparent.png");
  });
  it("should draw a paint", async () => {
    const image = await skia.draw(({ CanvasKit, canvas }) => {
      const paint = new CanvasKit.Paint();
      paint.setColor(CanvasKit.RED);
      canvas.drawPaint(paint);
    });
    checkImage(image, "snapshots/red.png");
  });

  it("should draw a color", async () => {
    const image = await skia.draw(({ CanvasKit, canvas }) => {
      const color = CanvasKit.parseColorString("#242b38");
      canvas.drawColor(color);
    });
    checkImage(image, "snapshots/background.png");
  });

  it("should draw a circle", async () => {
    const image = await skia.draw(({ CanvasKit, canvas, width, height }) => {
      const paint = new CanvasKit.Paint();
      paint.setColor(CanvasKit.CYAN);
      canvas.drawCircle(width / 2, height / 2, width / 2, paint);
    });
    checkImage(image, "snapshots/circle.png");
  });

  it("should draw a circle2", async () => {
    const image = await skia.draw(({ CanvasKit, canvas, width, height }) => {
      const paint = new CanvasKit.Paint();
      paint.setColor(CanvasKit.CYAN);
      canvas.drawCircle(25, height / 2, width / 2, paint);
      canvas.drawCircle(width - 25, height / 2, width / 2, paint);
    });
    checkImage(image, "snapshots/circles.png");
  });

  it("should draw the hello world example", async () => {
    const image = await skia.draw(({ CanvasKit, canvas, width, height }) => {
      const paint = new CanvasKit.Paint();
      paint.setBlendMode(CanvasKit.BlendMode.Multiply);

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
    checkImage(image, "snapshots/helloworld.png");
  });

  it("should draw the hello world example but with rects (reference)", async () => {
    const { width, height, canvas, surface } = setupRealSkia();

    const CanvasKit = RealCanvasKit;

    const fromCircle = (x: number, y: number, r: number) => {
      return CanvasKit.XYWHRect(x - r, y - r, r * 2, r * 2);
    };
    const paint = new CanvasKit.Paint();
    paint.setBlendMode(CanvasKit.BlendMode.Multiply);

    const cyan = paint.copy();
    const r = 92;
    cyan.setColor(CanvasKit.CYAN);
    canvas.drawRect(fromCircle(r, r, r), cyan);
    // Magenta Circle
    const magenta = paint.copy();
    magenta.setColor(CanvasKit.MAGENTA);
    canvas.drawRect(fromCircle(width - r, r, r), magenta);
    // Yellow Circle
    const yellow = paint.copy();
    yellow.setColor(CanvasKit.YELLOW);
    canvas.drawRect(fromCircle(width / 2, height - r, r), yellow);

    processResult(surface, "snapshots/helloworld2.png");
  });

  it("should draw the hello world example but with rects", async () => {
    const image = await skia.draw(({ CanvasKit, canvas, width, height }) => {
      const fromCircle = (x: number, y: number, r: number) => {
        return CanvasKit.XYWHRect(x - r, y - r, r * 2, r * 2);
      };
      const paint = new CanvasKit.Paint();
      paint.setBlendMode(CanvasKit.BlendMode.Multiply);

      const cyan = paint.copy();
      const r = 92;
      cyan.setColor(CanvasKit.CYAN);
      canvas.drawRect(fromCircle(r, r, r), cyan);
      // Magenta Circle
      const magenta = paint.copy();
      magenta.setColor(CanvasKit.MAGENTA);
      canvas.drawRect(fromCircle(width - r, r, r), magenta);
      // Yellow Circle
      const yellow = paint.copy();
      yellow.setColor(CanvasKit.YELLOW);
      canvas.drawRect(fromCircle(width / 2, height - r, r), yellow);
    });
    checkImage(image, "snapshots/helloworld2.png");
  });

  const demo = ({ CanvasKit, surface }: DrawingContext, progress: number) => {
    const mix = (value: number, x: number, y: number) =>
      x * (1 - value) + y * value;

    const cartesian2Canvas = (v: Vector, center: Vector) =>
      vec(v[0] + center[0], -1 * v[1] + center[1]);

    const polar2Cartesian = (p: PolarPoint) =>
      vec(p.radius * Math.cos(p.theta), p.radius * Math.sin(p.theta));

    const polar2Canvas = (p: PolarPoint, center: Vector) =>
      cartesian2Canvas(polar2Cartesian(p), center);

    const vec = (x: number, y: number) => Float32Array.of(x, y);
    const root = new CanvasKit.Paint();
    root.setBlendMode(CanvasKit.BlendMode.Screen);
    root.setMaskFilter(
      CanvasKit.MaskFilter.MakeBlur(CanvasKit.BlurStyle.Solid, 10, false)
    );

    const c1 = root.copy();
    c1.setColor(CanvasKit.parseColorString("#61bea2"));

    const c2 = root.copy();
    c2.setColor(CanvasKit.parseColorString("#529ca0"));

    const drawRing = (index: number) => {
      const width = surface.width();
      const height = surface.height();
      const canvas = surface.getCanvas();
      const r = width / 4;
      const center = vec(width / 2, height / 2);
      const theta = (index * (2 * Math.PI)) / 6;
      const [x, y] = polar2Canvas({ theta, radius: progress * r }, vec(0, 0));
      const scale = mix(progress, 0.3, 1);
      canvas.save();
      canvas.translate(center[0], center[1]);
      canvas.translate(x, y);
      canvas.scale(scale, scale);
      canvas.translate(-center[0], -center[1]);
      canvas.drawCircle(center[0], center[1], r, index % 2 ? c1 : c2);
      canvas.restore();
    };

    const canvas = surface.getCanvas();
    const width = surface.width();
    const height = surface.height();
    const center = vec(width / 2, height / 2);
    const bgColor = CanvasKit.parseColorString("#242b38");
    canvas.drawColor(bgColor);
    const rotate = mix(progress, -Math.PI, 0);
    canvas.save();
    canvas.translate(center[0], center[1]);
    canvas.rotate(rotate, center[0], center[1]);
    canvas.translate(-center[0], -center[1]);
    new Array(6).fill(0).map((_, index) => {
      drawRing(index);
    });
    canvas.restore();
  };
  skia.addFunction("demo", demo);

  it("should draw the apple breathe example at progress=0", async () => {
    const image = await skia.draw((ctx) => {
      demo(ctx, 0);
    });
    checkImage(image, "snapshots/breathe0.png");
  });

  it("should draw the apple breathe example at progress=half", async () => {
    const image = await skia.draw((ctx) => {
      demo(ctx, 0.5);
    });
    checkImage(image, "snapshots/breathe-half.png");
  });

  it("should draw the apple breathe example at progress=1", async () => {
    const image = await skia.draw((ctx) => {
      demo(ctx, 1);
    });
    checkImage(image, "snapshots/breathe1.png");
  });
});
