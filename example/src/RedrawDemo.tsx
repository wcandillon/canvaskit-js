import { useEffect, useRef } from "react";
import { vec2 } from "wgpu-matrix";

import { Instance, Paint } from "./components/redraw/Redraw";

const pd = window.devicePixelRatio;

export const RedrawDemo = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    (async () => {
      const adapter = await navigator.gpu.requestAdapter();
      if (!adapter) {
        throw new Error("WebGPU not supported");
      }
      const device = await adapter.requestDevice();
      const Redraw = new Instance(device);
      const surface = Redraw.Surface.MakeFromCanvas(ref.current!);
      const canvas = surface.getCanvas();
      const paint = new Paint();
      canvas.save();
      canvas.scale(pd, pd);
      canvas.drawCircle(vec2.create(400, 300), 100, paint);
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
