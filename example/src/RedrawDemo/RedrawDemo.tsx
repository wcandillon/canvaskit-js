import { useEffect, useRef } from "react";
import { mat4 } from "wgpu-matrix";

import { mix, useLoop, useOnFrame } from "../components";
import type { Surface } from "../components/redraw";
import { RedrawInstance } from "../components/redraw";
import { CircleShader } from "../components/redraw/Drawings";
import { BlendMode } from "../components/redraw/Paint";
import {
  FillColor,
  FillShader,
  FillTexture,
} from "../components/redraw/Drawings/Fill";
import { BlurImageFilter } from "../components/redraw/ImageFilters/Blur";

const pd = window.devicePixelRatio;
const width = 1080 * pd;
const height = 720 * pd;

export const RedrawDemo = () => {
  const progress = useLoop();
  const ref = useRef<HTMLCanvasElement>(null);
  const Redraw = useRef<RedrawInstance>();
  const surface = useRef<Surface>();
  const offscreen = useRef<Surface>();
  const blur = useRef<BlurImageFilter>();
  useEffect(() => {
    (async () => {
      const adapter = await navigator.gpu.requestAdapter();
      if (!adapter) {
        throw new Error("WebGPU not supported");
      }
      const device = await adapter.requestDevice();
      Redraw.current = new RedrawInstance(device);
      surface.current = Redraw.current.Surface.MakeFromCanvas(ref.current!);
      offscreen.current = Redraw.current.Surface.MakeOffscreen(width, height);
      blur.current = new BlurImageFilter(device, {
        iterations: 4,
        size: mix(progress.value, 50, 100),
        inputTexture: offscreen.current.getCurrentTexture(),
      });
    })();
  });
  useOnFrame(() => {
    if (surface.current && Redraw.current && offscreen.current) {
      let recorder = offscreen.current.getRecorder();
      let paint = {
        useColor: 1,
        style: 0,
        color: Float32Array.of(0, 0, 0, 1),
        strokeWidth: 0,
      };
      const matrix = mat4.identity();
      recorder.draw(
        "fill",
        FillShader,
        BlendMode.SrcOver,
        paint,
        matrix,
        {},
        [],
        6
      );
      paint = {
        useColor: 1,
        style: 0,
        color: Float32Array.of(0, 0, 0, 1),
        strokeWidth: 0,
      };
      recorder.fill(
        "fillColor",
        FillColor,
        BlendMode.SrcOver,
        { color: [0.3, 0.6, 1, 1] },
        []
      );
      recorder.draw(
        "circle",
        CircleShader,
        BlendMode.SrcOver,
        paint,
        matrix,
        {
          radius: 200, //mix(progress.value, 50, height / 2),
          center: [width / 2, height / 2],
        },
        [],
        6
      );
      offscreen.current.flush();
      recorder = surface.current.getRecorder();
      // recorder.fill("fillTexture", FillTexture, BlendMode.SrcOver, null, [
      //   offscreen.current.getCurrentTexture(),
      // ]);
      blur.current!.setSize(mix(progress.value, 4, 34));
      recorder.execute(blur.current!);
      recorder.fill("fillTexture", FillTexture, BlendMode.SrcOver, null, [
        offscreen.current.getCurrentTexture(),
      ]);
      surface.current.flush();
    }
  }, [progress]);
  return (
    <div
      style={{
        width: width / pd,
        height: height / pd,
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
