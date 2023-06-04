import type { InputIRect, InputRRect, InputRect } from "canvaskit-wasm";

import { normalizeArray } from "./Values";

export const ltrbRect = (
  left: number,
  top: number,
  right: number,
  bottom: number
) => new Float32Array([left, top, right, bottom]);

export const xywhRect = (x: number, y: number, width: number, height: number) =>
  ltrbRect(x, y, x + width, y + height);

export const ltrbiRect = (
  left: number,
  top: number,
  right: number,
  bottom: number
) => new Int32Array([left, top, right, bottom]);

export const xywhiRect = (
  x: number,
  y: number,
  width: number,
  height: number
) => ltrbiRect(x, y, x + width, y + height);

export const rrectXY = (input: InputRect, rx: number, ry: number) => {
  const rect = normalizeArray(input);
  return Float32Array.of(
    rect[0],
    rect[1],
    rect[2],
    rect[3],
    rx,
    ry,
    rx,
    ry,
    rx,
    ry,
    rx,
    ry
  );
};

export const rectToXYWH = (r: InputRect | InputIRect) => {
  const rect = normalizeArray(r);
  return {
    x: rect[0],
    y: rect[1],
    width: rect[2] - rect[0],
    height: rect[3] - rect[1],
  };
};

export const rrectToXYWH = (r: InputRRect) => {
  const rect = normalizeArray(r);
  return {
    x: rect[0],
    y: rect[1],
    width: rect[2] - rect[0],
    height: rect[3] - rect[1],
    radii: Array.from(rect.slice(4, 8)),
  };
};
