import { useEffect, useRef } from "react";
import { vec2 } from "wgpu-matrix";

import { Instance, Paint } from "./components/redraw";

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
      paint.setColor(Redraw.Color("rgb(36,43,56)"));
      canvas.save();
      canvas.scale(pd, pd);
      canvas.fill(paint);
      paint.setColor(Redraw.Color("#61bea2"));
      canvas.drawCircle(vec2.create(400, 300), 100, paint);
      paint.setColor(Redraw.Color("#529ca0"));
      canvas.drawCircle(vec2.create(0, 0), 100, paint);
      paint.setColor(Redraw.Color("rgba(255, 0, 0, 0.0)"));
      canvas.fill(paint);
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
