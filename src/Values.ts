/* eslint-disable no-bitwise */
import type { Color, InputRect, MallocObj } from "canvaskit-wasm";

export const NativeColor = (color: Color) => {
  return `rgba(${[
    color[0] * 255,
    color[1] * 255,
    color[2] * 255,
    color[3],
  ].join(", ")})`;
};

export const uIntColorToCanvasKitColor = (c: number) => {
  return Float32Array.of(
    (c >> 16) & 0xff,
    (c >> 8) & 0xff,
    (c >> 0) & 0xff,
    ((c >> 24) & 0xff) / 255
  );
};

const isMalloc = (v: unknown): v is MallocObj => {
  return typeof v === "object" && v !== null && "toTypedArray" in v;
};

export const rectToXYWH = (r: InputRect) => {
  const rect = isMalloc(r) ? r.toTypedArray() : r;
  return { x: rect[0], y: rect[1], w: rect[2] - rect[0], h: rect[3] - rect[1] };
};
