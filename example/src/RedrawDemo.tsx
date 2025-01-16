import { useEffect, useRef } from "react";

import type { Canvas } from "./components/redraw";
import { Instance, Paint } from "./components/redraw";
import type { AnimationValue, Info } from "./components";
import { mix, polar2Canvas, useLoop, vec } from "./components";

const pd = window.devicePixelRatio;
const c1 = "#61bea2";
const c2 = "#529ca0";
const bgColor = "#242b38";

interface Size {
  width: number;
  height: number;
}

const drawRing = (
  Redraw: Instance,
  progress: AnimationValue,
  canvas: Canvas,
  { width, height }: Size,
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
  // canvas.scale(scale, scale);
  canvas.translate(-center[0], -center[1]);
  const paint = new Paint();
  paint.setColor(index % 2 ? c1 : c2);
  canvas.drawCircle(center, r, paint);
  canvas.restore();
};

const drawRings = (
  Redraw: Instance,
  progress: AnimationValue,
  canvas: Canvas,
  info: Info
) => {
  const paint = new Paint();
  paint.setColor(bgColor);
  canvas.fill(paint);
  const rotate = mix(progress.value, 0, Math.PI);
  canvas.save();
  //canvas.rotate(rotate, info.center[0], info.center[1]);
  new Array(6).fill(0).map((_, index) => {
    drawRing(Redraw, progress, canvas, info, index);
  });
  canvas.restore();
  paint.setColor(Redraw.Color(c1));
};

export const RedrawDemo = () => {
  const progress = useLoop();
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    (async () => {
      const Redraw = await Instance.get();
      const surface = Redraw.Surface.MakeFromCanvas(ref.current!);
      const canvas = surface.getCanvas();
      canvas.scale(pd, pd);
      console.log(surface.width, surface.height);
      drawRings(Redraw, progress, canvas, {
        width: surface.width,
        height: surface.height,
        center: Float32Array.of(surface.width / 2, surface.height / 2),
      });
      canvas.restore();
      surface.flush();
    })();
  });
  return (
    <div
      style={{
        width: 800,
        height: 600,
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
