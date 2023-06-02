import type { Canvas as CKCanvas } from "canvaskit-wasm";
import type { DependencyList } from "react";
import { useCallback, useEffect, useRef } from "react";

interface Info {
  width: number;
  height: number;
}

type OnDraw = (canvas: CKCanvas, info: Info) => void;

interface CanvasProps {
  onDraw: OnDraw;
}

export const Canvas = ({ onDraw }: CanvasProps) => {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) {
      throw new Error("Canvas not found");
    }
    const surface = CanvasKit.MakeWebGLCanvasSurface(ref.current);
    if (!surface) {
      throw new Error("Could not make canvas surface");
    }
    const canvas = surface.getCanvas();
    const width = surface.width();
    const height = surface.height();
    onDraw(canvas, { width, height });
  }, [onDraw]);
  return <canvas style={{ width: "100%", height: "100vh" }} ref={ref} />;
};

export const useOnDraw = (cb: OnDraw, deps: DependencyList = []) =>
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useCallback(cb, deps);
