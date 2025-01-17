import { useEffect, useRef } from "react";

import type { Canvas, Surface } from "./components/redraw";
import { Instance, Paint, BlendMode, ImageFilter } from "./components/redraw";
import type { AnimationValue, Info } from "./components";
import { mix, polar2Canvas, useLoop, useOnFrame, vec } from "./components";

const pd = window.devicePixelRatio;
const c1 = "#61bea2";
const c2 = "#529ca0";
const bgColor = "#242b38";

interface Size {
  width: number;
  height: number;
}

const totalRings = 6;

const drawRing = (
  progress: AnimationValue,
  canvas: Canvas,
  { width, height }: Size,
  index: number
) => {
  const r = height / 4;
  const center = vec(width / 2, height / 2);
  const theta = (index * (2 * Math.PI)) / totalRings;
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
  const paint = new Paint();
  paint.setBlendMode(BlendMode.Screen);
  paint.setColor(index % 2 ? c1 : c2);
  paint.setImageFilter(new ImageFilter());
  canvas.drawCircle(center, r, paint);
  canvas.restore();
};

const drawRings = (progress: AnimationValue, canvas: Canvas, info: Info) => {
  const paint = new Paint();
  paint.setColor(bgColor);
  canvas.fill(paint);
  const rotate = mix(progress.value, 0, Math.PI);
  canvas.save();
  canvas.rotate(rotate, info.center[0], info.center[1]);
  new Array(totalRings).fill(0).map((_, index) => {
    drawRing(progress, canvas, info, index);
  });
  canvas.restore();
};

export const RedrawDemo = () => {
  const progress = useLoop();
  const ref = useRef<HTMLCanvasElement>(null);
  const Redraw = useRef<Instance>();
  const surface = useRef<Surface>();
  useEffect(() => {
    (async () => {
      Redraw.current = await Instance.get();
      surface.current = Redraw.current.Surface.MakeFromCanvas(ref.current!);
      progress.value = 0.5;
    })();
  });
  useOnFrame(() => {
    if (surface.current) {
      const { width, height } = surface.current;
      const canvas = surface.current.getCanvas();
      canvas.save();
      canvas.scale(pd, pd);
      drawRings(progress, canvas, {
        width: width / pd,
        height: height / pd,
        center: Float32Array.of(width / pd / 2, height / pd / 2),
      });
      canvas.restore();
      surface.current.flush();
    }
  }, [progress]);
  return (
    <div
      style={{
        width: 1080,
        height: 720,
        backgroundColor: "cyan",
      }}
    >
      <canvas
        ref={ref}
        style={{ display: "flex", flex: 1, width: "100%", height: "100%" }}
      />
    </div>
  );
};
