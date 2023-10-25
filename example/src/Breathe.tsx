import type { Canvas as CKCanvas } from "canvaskit-wasm";

import type { Info } from "./components";
import { Canvas, useOnDraw } from "./components";
import { mix, polar2Canvas, vec } from "./components/math";
import type { AnimationValue } from "./components/animations";
import { useLoop } from "./components/animations";

const root = new CanvasKit.Paint();
root.setBlendMode(CanvasKit.BlendMode.Screen);
root.setMaskFilter(
  CanvasKit.MaskFilter.MakeBlur(CanvasKit.BlurStyle.Solid, 50, false)
);

const c1 = root.copy();
c1.setColor(CanvasKit.parseColorString("#61bea2"));

const c2 = root.copy();
c2.setColor(CanvasKit.parseColorString("#529ca0"));

const bgColor = CanvasKit.parseColorString("#242b38");

const drawRing = (
  progress: AnimationValue,
  canvas: CKCanvas,
  { width, height }: Info,
  index: number
) => {
  const r = height / 4;
  const center = vec(width / 2, height / 2);
  const theta = (index * (2 * Math.PI)) / 6;
  const translation = polar2Canvas(
    { theta, radius: progress.value * r },
    vec(0, 0)
  );
  const scale = mix(progress.value, 0.2, 1);
  canvas.save();
  canvas.translate(center[0], center[1]);
  canvas.translate(translation[0], translation[1]);
  canvas.scale(scale, scale);
  canvas.translate(-center[0], -center[1]);
  canvas.drawCircle(center[0], center[1], r, index % 2 ? c1 : c2);
  canvas.restore();
};

const drawRings = (progress: AnimationValue, canvas: CKCanvas, info: Info) => {
  const { center } = info;
  canvas.drawColor(bgColor);
  const rotate = mix(progress.value, 0, 180);
  canvas.save();
  canvas.rotate(rotate, center[0], center[1]);
  new Array(6).fill(0).map((_, index) => {
    drawRing(progress, canvas, info, index);
  });
  canvas.restore();
};

export const Breathe = () => {
  const progress = useLoop();
  const onDraw = useOnDraw(drawRings.bind(null, progress));
  return <Canvas onDraw={onDraw} deps={[progress]} />;
};
