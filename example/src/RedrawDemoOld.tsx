import { useEffect, useRef } from "react";

import type { Canvas, Surface } from "./components/redraw-old";
import { Instance, Paint, BlendMode } from "./components/redraw-old";
import type { AnimationValue, Info } from "./components";
import { mix, polar2Canvas, useLoop, useOnFrame, vec } from "./components";

const pd = window.devicePixelRatio;

interface Size {
  width: number;
  height: number;
}

const totalRings = 6;
const bg = new Paint();
bg.setColor("#242b38");

const drawRing = (
  progress: AnimationValue,
  canvas: Canvas,
  { width, height }: Size,
  index: number,
  c1: Paint,
  c2: Paint
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
  canvas.drawCircle(center, r, index % 2 ? c1 : c2);
  canvas.restore();
};

const drawRings = (
  progress: AnimationValue,
  canvas: Canvas,
  info: Info,
  c1: Paint,
  c2: Paint
) => {
  canvas.fill(bg);
  const rotate = mix(progress.value, 0, Math.PI);
  canvas.save();
  canvas.rotate(rotate, info.center[0], info.center[1]);
  new Array(totalRings).fill(0).map((_, index) => {
    drawRing(progress, canvas, info, index, c1, c2);
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
    })();
  });
  useOnFrame(() => {
    if (surface.current && Redraw.current) {
      const { width, height } = surface.current;
      const canvas = surface.current.getCanvas();
      canvas.save();
      canvas.scale(pd, pd);
      const c1 = new Paint();
      c1.setColor("#61bea2");
      c1.setBlendMode(BlendMode.Screen);

      const c2 = c1.copy();
      c2.setShader(Redraw.current.Shader.MakeColor("purple"));

      c2.setColor("#529ca0");
      //const imageFilter = Redraw.current.ImageFilter.MakeBlur({ radius: 10 });
      // const imageFilter = Redraw.current.ImageFilter.MakeColorMatrix({
      //   matrix: [
      //     1, -0.2, 0, 0, 0, 0, 1, 0, -0.1, 0, 0, 1.2, 1, 0.1, 0, 0, 0, 1.7, 1,
      //     0,
      //   ],
      // });
      //c1.setImageFilter(imageFilter);
      //c2.setImageFilter(imageFilter);
      const c1b = c1.copy();
      c1b.setImageFilter(null);
      const c2b = c2.copy();
      c2b.setImageFilter(null);
      drawRings(
        progress,
        canvas,
        {
          width: width / pd,
          height: height / pd,
          center: Float32Array.of(width / pd / 2, height / pd / 2),
        },
        c1,
        c2
      );
      // drawRings(
      //   progress,
      //   canvas,
      //   {
      //     width: width / pd,
      //     height: height / pd,
      //     center: Float32Array.of(width / pd / 2, height / pd / 2),
      //   },
      //   c1b,
      //   c2b
      // );
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
