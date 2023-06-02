import type { Canvas as CKCanvas } from "canvaskit-wasm";

import type { Info } from "./components";
import { Canvas, useOnDraw } from "./components";
import { mix, polar2Canvas, vec } from "./components/math";

const progress = 1;

const root = new CanvasKit.Paint();
root.setBlendMode(CanvasKit.BlendMode.Screen);
root.setMaskFilter(
  CanvasKit.MaskFilter.MakeBlur(CanvasKit.BlurStyle.Solid, 10, false)
);

const c1 = root.copy();
c1.setColor(CanvasKit.parseColorString("#61bea2"));

const c2 = root.copy();
c2.setColor(CanvasKit.parseColorString("#529ca0"));

const drawRing = (canvas: CKCanvas, { width, height }: Info, index: number) => {
  const r = height / 4;
  const center = vec(width / 2, height / 2);
  const theta = (index * (2 * Math.PI)) / 6;
  const translation = polar2Canvas({ theta, radius: progress * r }, vec(0, 0));
  const scale = mix(progress, 0.3, 1);
  canvas.save();
  canvas.translate(center[0], center[1]);
  canvas.translate(translation[0], translation[1]);
  canvas.scale(scale, scale);
  canvas.translate(-center[0], -center[1]);
  canvas.drawCircle(center[0], center[1], r, index % 2 ? c1 : c2);
  canvas.restore();
};

const drawRings = (canvas: CKCanvas, info: Info) => {
  const { width, height } = info;
  console.log({ width, height });
  const center = vec(width / 2, height / 2);
  const bgColor = CanvasKit.parseColorString("#242b38");
  canvas.drawColor(bgColor);
  const rotate = mix(progress, -Math.PI, 0);
  canvas.save();
  canvas.translate(center[0], center[1]);
  canvas.rotate(rotate, center[0], center[1]);
  canvas.translate(-center[0], -center[1]);
  new Array(6).fill(0).map((_, index) => {
    drawRing(canvas, info, index);
  });
  canvas.restore();
};

export const Breathe = () => {
  const onDraw = useOnDraw(drawRings);
  return <Canvas onDraw={onDraw} />;
};
