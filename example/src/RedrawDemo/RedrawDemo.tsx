import { useEffect, useRef } from "react";
import { mat4 } from "wgpu-matrix";

import { useLoop, useOnFrame } from "../components";
import type { Surface } from "../components/redraw";
import { RedrawInstance } from "../components/redraw";
import { CircleShader } from "../components/redraw/Drawings";
import { BlendMode } from "../components/redraw/Paint";

const pd = window.devicePixelRatio;

export const RedrawDemo = () => {
  const progress = useLoop();
  const ref = useRef<HTMLCanvasElement>(null);
  const Redraw = useRef<RedrawInstance>();
  const surface = useRef<Surface>();
  useEffect(() => {
    (async () => {
      const adapter = await navigator.gpu.requestAdapter();
      if (!adapter) {
        throw new Error("WebGPU not supported");
      }
      const device = await adapter.requestDevice();
      Redraw.current = new RedrawInstance(device);
      surface.current = Redraw.current.Surface.MakeFromCanvas(ref.current!);
    })();
  });
  useOnFrame(() => {
    if (surface.current && Redraw.current) {
      const recorder = surface.current.getRecorder();
      const paint = {
        useColor: 1,
        useStroke: 0,
        strokeWidth: 0,
        color: Float32Array.of(1, 0, 0, 1),
      };
      const matrix = mat4.identity();
      recorder.draw(
        "circle",
        CircleShader,
        BlendMode.SrcOver,
        paint,
        matrix,
        {
          radius: 200,
          center: [540, 360],
        },
        [],
        3
      );
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
