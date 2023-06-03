import type { Canvas as CKCanvas, Surface } from "canvaskit-wasm";
import type { DependencyList } from "react";
import { useEffect, useCallback, useRef } from "react";

import type { CanvasRef } from "./Platform";
import { useElementLayout } from "./Platform";
import type { AnimationValue } from "./animations";
import { startAnimations } from "./animations";

export interface Info {
  width: number;
  height: number;
}

export type OnDraw = (canvas: CKCanvas, info: Info) => void;

interface CanvasProps {
  onDraw: OnDraw;
  deps: AnimationValue[];
}

const pd = 1; //window.devicePixelRatio;

export const Canvas = ({ onDraw, deps }: CanvasProps) => {
  const surfaceRef = useRef<Surface>();
  const info = useRef<Info>({ width: -1, height: -1 });
  const ref = useRef<CanvasRef>(null);
  const draw = useCallback(() => {
    if (surfaceRef.current) {
      const canvas = surfaceRef.current.getCanvas();
      canvas.clear(Float32Array.of(0, 0, 0, 0));
      canvas.save();
      canvas.scale(pd, pd);
      onDraw(canvas, info.current);
      canvas.restore();
    }
  }, [onDraw]);
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
        info.current = { width, height };
        const surface = CanvasKit.MakeWebGLCanvasSurface(ref.current);
        if (!surface) {
          throw new Error("Could not make canvas surface");
        }
        surfaceRef.current = surface;
        draw();
      }
    }
  );
  useEffect(() => {
    startAnimations(deps, draw);
  }, [deps, draw]);
  return <canvas style={{ width: "100%", height: "100vh" }} ref={ref} />;
};

export const useOnDraw = (cb: OnDraw, deps: DependencyList = []) =>
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useCallback(cb, deps);
