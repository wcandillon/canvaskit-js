import type { DependencyList } from "react";
import { useEffect, useCallback, useRef } from "react";

import type { CanvasRef } from "./Platform";
import { useElementLayout } from "./Platform";
import type { AnimationValue } from "./animations";
import { startAnimations } from "./animations";

type Info = {
  width: number;
  height: number;
  center: Float32Array;
};
type OnDraw = (ctx: CanvasRenderingContext2D, info: Info) => void;

interface CanvasProps {
  onDraw: OnDraw;
  deps?: AnimationValue[];
}

const pd = window.devicePixelRatio;

export const NativeCanvas = ({ onDraw, deps }: CanvasProps) => {
  const info = useRef<Info | null>(null);
  const ref = useRef<CanvasRef>(null);
  const draw = useCallback(() => {
    if (ref.current && info.current) {
      const ctx = ref.current.getContext("2d")!;
      ctx.save();
      ctx.globalCompositeOperation = "copy";
      ctx.fillStyle = "transparent";
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.restore();
      ctx.save();
      ctx.scale(pd, pd);
      onDraw(ctx, info.current);
      ctx.restore();
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
        draw();
      }
    }
  );
  useEffect(() => {
    if (deps) {
      return startAnimations(deps, draw);
    }
    return;
  }, [deps, draw]);

  return <canvas style={{ width: "100%", height: "100vh" }} ref={ref} />;
};

export const useOnDrawNative = (cb: OnDraw, deps: DependencyList = []) =>
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useCallback(cb, deps);
