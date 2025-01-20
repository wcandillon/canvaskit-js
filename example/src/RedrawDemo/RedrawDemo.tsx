import { useEffect, useRef } from "react";

import { useLoop, useOnFrame } from "../components";
import type { Surface } from "../components/redraw";
import { RedrawInstance } from "../components/redraw";

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
