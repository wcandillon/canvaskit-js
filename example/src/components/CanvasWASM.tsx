import type { Surface, Canvas as SkCanvas } from "canvaskit-wasm";
import { useCallback, useEffect, useRef, useState } from "react";

import type { CanvasProps, Info } from "./Canvas";
import type { CanvasRef } from "./Platform";
import { useElementLayout } from "./Platform";
import { startAnimations } from "./animations";
import { useCanvasKitWASM } from "./CanvasKitContext";

const pd = 1; //window.devicePixelRatio;

export const CanvasWASM = ({ onDraw, deps }: CanvasProps) => {
  const CanvasKit = useCanvasKitWASM();
  const surfaceRef = useRef<Surface>();
  const info = useRef<Info | null>(null);
  const ref = useRef<CanvasRef>(null);
  const draw = useCallback(() => {
    if (surfaceRef.current) {
      const canvas = surfaceRef.current.getCanvas();
      canvas.clear(Float32Array.of(0, 0, 0, 0));
      canvas.save();
      canvas.scale(pd, pd);
      onDraw(canvas, info.current!);
      canvas.restore();
      surfaceRef.current.flush();
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
        info.current = {
          width,
          height,
          center: Float32Array.of(width / 2, height / 2),
        };
        const surface = CanvasKit.MakeWebGLCanvasSurface(ref.current);
        if (!surface) {
          throw new Error("Could not make canvas surface");
        }
        if (surfaceRef.current) {
          surfaceRef.current.dispose();
        }
        surfaceRef.current = surface;
        draw();
      }
    }
  );
  useEffect(() => {
    return startAnimations(deps, draw);
  }, [deps, draw]);
  useEffect(() => {
    return () => {
      if (surfaceRef.current) {
        surfaceRef.current.dispose();
      }
    };
  }, []);
  if (CanvasKit === null) {
    return null;
  }
  return <canvas style={{ width: "100%", height: "100vh" }} ref={ref} />;
};
