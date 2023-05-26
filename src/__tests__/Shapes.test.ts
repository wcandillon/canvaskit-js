import type { Surface } from "canvaskit-wasm";

import { vec } from "../Values";
import { polar2Canvas, mix } from "../math";

import { processResult, setupSkia } from "./setup";

//const root = new CanvasKit.Paint();
//root.setBlendMode(CanvasKit.BlendMode.Screen);

const c1 = new CanvasKit.Paint();
c1.setColor(CanvasKit.parseColorString("#61bea2"));
c1.setAlphaf(0.2);

const c2 = new CanvasKit.Paint();
c2.setColor(CanvasKit.parseColorString("#529ca0"));
c2.setAlphaf(0.2);

const drawRing = (surface: Surface, index: number, progress: number) => {
  const width = surface.width();
  const height = surface.height();
  const canvas = surface.getCanvas();
  const r = width / 4;
  const center = vec(width / 2, height / 2 - 64);
  const theta = (index * (2 * Math.PI)) / 6;
  // const transform = useComputedValue(() => {
  const [x, y] = polar2Canvas({ theta, radius: progress * r }, vec(0, 0));
  const scale = mix(progress, 0.3, 1);
  canvas.translate(center[0], center[1]);
  canvas.translate(x, y);
  canvas.scale(scale, scale);
  canvas.drawCircle(center[0], center[1], r, index % 2 ? c1 : c2);
  canvas.translate(-center[0], -center[1]);
};

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

  it("should draw the apple breathe example", () => {
    const { surface } = setupSkia(1024, 1024);
    const canvas = surface.getCanvas();
    const bgColor = CanvasKit.parseColorString("#242b38");
    canvas.drawColor(bgColor);
    new Array(6).fill(0).map((_, index) => {
      drawRing(surface, index, 1);
    });
    processResult(surface, "snapshots/breathe.png", true);
  });
});
