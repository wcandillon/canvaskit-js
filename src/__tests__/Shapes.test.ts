import type { Surface } from "canvaskit-wasm";

import { vec } from "../Values";
import { mix, polar2Canvas } from "../math";

import { processResult, setupSkia } from "./setup";

describe("Shapes", () => {
  it("should draw a paint", () => {
    const { surface } = setupSkia();
    const canvas = surface.getCanvas();
    const paint = new CanvasKit.Paint();
    paint.setColor(CanvasKit.RED);
    canvas.drawPaint(paint);
    processResult(surface, "snapshots/red.png");
  });

  it("should draw a color", () => {
    const { surface, canvas } = setupSkia();
    const color = CanvasKit.parseColorString("#242b38");
    expect(color).toEqual(
      new Float32Array([
        0.1411764770746231, 0.16862745583057404, 0.21960784494876862, 1,
      ])
    );
    canvas.drawColor(color);
    processResult(surface, "snapshots/background.png", true);
  });

  it("should draw a circle", () => {
    const { surface, width, height } = setupSkia();
    const canvas = surface.getCanvas();
    const paint = new CanvasKit.Paint();
    paint.setColor(CanvasKit.CYAN);
    canvas.drawCircle(width / 2, height / 2, width / 2, paint);
    processResult(surface, "snapshots/circle.png");
  });

  it("should draw a circle2", () => {
    const { surface, width, height } = setupSkia();
    const canvas = surface.getCanvas();
    const paint = new CanvasKit.Paint();
    paint.setColor(CanvasKit.CYAN);
    canvas.drawCircle(25, height / 2, width / 2, paint);
    canvas.drawCircle(width - 25, height / 2, width / 2, paint);
    processResult(surface, "snapshots/circles.png");
  });

  it("should draw the hello world example", () => {
    const { surface, width, height } = setupSkia();
    const canvas = surface.getCanvas();
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
    processResult(surface, "snapshots/helloworld.png");
  });

  const root = new CanvasKit.Paint();
  root.setBlendMode(CanvasKit.BlendMode.Screen);

  const c1 = root.copy();
  c1.setColor(CanvasKit.parseColorString("#61bea2"));

  const c2 = root.copy();
  c2.setColor(CanvasKit.parseColorString("#529ca0"));

  const drawRing = (surface: Surface, index: number, progress: number) => {
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

  const drawDemo = (progress: number, surface: Surface) => {
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
      drawRing(surface, index, progress);
    });
    canvas.restore();
  };

  it("should draw the apple breathe example at progress=0", () => {
    const { surface } = setupSkia();
    const progress = 0;
    drawDemo(progress, surface);
    processResult(surface, "snapshots/breathe0.png");
  });

  it("should draw the apple breathe example at progress=half", () => {
    const { surface } = setupSkia();
    const progress = 0.5;
    drawDemo(progress, surface);
    processResult(surface, "snapshots/breathe-half.png");
  });

  it("should draw the apple breathe example at progress=1", () => {
    const { surface } = setupSkia();
    const progress = 1;
    drawDemo(progress, surface);
    processResult(surface, "snapshots/breathe1.png");
  });
});
