import type { Point } from "canvaskit-wasm";

export const vec = (x = 0, y = 0): Point => Float32Array.of(x, y);

export const dist = (p1: Point, p2: Point) =>
  Math.hypot(p2[0] - p1[0], p2[1] - p1[1]);

export const equals = (p1: Point, p2: Point): boolean =>
  p1[0] === p2[0] && p1[1] === p2[1];

export const plus = (p1: Point, p2: Point): Point =>
  vec(p1[0] + p2[0], p1[1] + p2[1]);

export const minus = (p1: Point, p2: Point): Point =>
  vec(p1[0] - p2[0], p1[1] - p2[1]);

export const multiply = (p1: Point, p2: Point): Point =>
  vec(p1[0] * p2[0], p1[1] * p2[1]);

export const divide = (p1: Point, p2: Point): Point =>
  vec(p1[0] / p2[0], p1[1] / p2[1]);

export const multiplyScalar = (p: Point, scale: number): Point =>
  vec(p[0] * scale, p[1] * scale);

export const divideScalar = (p: Point, d: number): Point =>
  vec(p[0] / d, p[1] / d);

export const negate = (p: Point): Point => vec(-p[0], -p[1]);

export const dot = (p1: Point, p2: Point): number =>
  p1[0] * p2[0] + p1[1] * p2[1];

export const cross = (p1: Point, p2: Point): number =>
  p1[0] * p2[1] - p1[1] * p2[0];

export const magnitude = (p: Point): number =>
  Math.sqrt(p[0] * p[0] + p[1] * p[1]);

export const normalize = (p: Point): Point => {
  const m = magnitude(p);
  return vec(p[0] / m, p[1] / m);
};

export const angleTo = (p1: Point, p2: Point) =>
  Math.atan2(p2[1] - p1[1], p2[0] - p1[0]);
