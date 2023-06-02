import type { Canvas as CKCanvas } from "canvaskit-wasm";
import type { DependencyList } from "react";
import { useCallback, useRef } from "react";

import type { CanvasRef } from "./Platform";
import { useElementLayout } from "./Platform";

export interface Info {
  width: number;
  height: number;
}

export type OnDraw = (canvas: CKCanvas, info: Info) => void;

interface CanvasProps {
  onDraw: OnDraw;
}

const pd = window.devicePixelRatio;

export const Canvas = ({ onDraw }: CanvasProps) => {
  const ref = useRef<CanvasRef>(null);
  useElementLayout(
    ref,
    ({
      nativeEvent: {
        layout: { width, height },
      },
    }) => {
      if (ref.current) {
        ref.current.width = width * pd;
        ref.current.height = height * pd;
        const surface = CanvasKit.MakeWebGLCanvasSurface(ref.current);
        if (!surface) {
          throw new Error("Could not make canvas surface");
        }
        const canvas = surface.getCanvas();
        canvas.clear(Float32Array.of(0, 0, 0, 0));
        canvas.save();
        canvas.scale(pd, pd);
        onDraw(canvas, { width, height });
        canvas.restore();
      }
    }
  );
  return <canvas style={{ width: "100%", height: "100vh" }} ref={ref} />;
};

export const useOnDraw = (cb: OnDraw, deps: DependencyList = []) =>
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useCallback(cb, deps);
