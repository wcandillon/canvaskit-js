import type { InputIRect, InputRRect, InputRect } from "canvaskit-wasm";

import { vec } from "../c2d";

import { normalizeArray } from "./Values";

export const ltrbRect = (
  left: number,
  top: number,
  right: number,
  bottom: number
) => Float32Array.of(left, top, right, bottom);

export const xywhRect = (x: number, y: number, width: number, height: number) =>
  ltrbRect(x, y, x + width, y + height);

export const ltrbiRect = (
  left: number,
  top: number,
  right: number,
  bottom: number
) => Int32Array.of(left, top, right, bottom);

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

export interface XYWH {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const rectToXYWH = (r: InputRect | InputIRect) => {
  const rect = normalizeArray(r);
  return {
    x: rect[0],
    y: rect[1],
    width: rect[2] - rect[0],
    height: rect[3] - rect[1],
  };
};

export interface Radii {
  topLeft: DOMPoint;
  topRight: DOMPoint;
  bottomRight: DOMPoint;
  bottomLeft: DOMPoint;
}

export const rrectToXYWH = (r: InputRRect) => {
  const rect = normalizeArray(r);
  return {
    x: rect[0],
    y: rect[1],
    width: rect[2] - rect[0],
    height: rect[3] - rect[1],
    radii: {
      topLeft: vec(rect[4], rect[5]),
      topRight: vec(rect[6], rect[7]),
      bottomRight: vec(rect[8], rect[9]),
      bottomLeft: vec(rect[10], rect[11]),
    },
  };
};

export const rrectToPath2D = (r: InputRRect) => {
  const rect = normalizeArray(r);
  const path = new Path2D();
  path.roundRect(rect[0], rect[1], rect[2] - rect[0], rect[3] - rect[1], [
    { x: rect[4], y: rect[5] },
    { x: rect[6], y: rect[7] },
    { x: rect[8], y: rect[9] },
    { x: rect[10], y: rect[11] },
  ]);
  return path;
};
