import type { Point } from "canvaskit-wasm";

import { vec } from "../Values";

type Vector = Point;
export interface PolarPoint {
  theta: number;
  radius: number;
}

export const canvas2Cartesian = (v: Vector, center: Vector) =>
  vec(v[0] - center[0], -1 * (v[1] - center[1]));

export const cartesian2Canvas = (v: Vector, center: Vector) =>
  vec(v[0] + center[0], -1 * v[1] + center[1]);

export const cartesian2Polar = (v: Vector) => ({
  theta: Math.atan2(v[1], v[0]),
  radius: Math.sqrt(v[0] ** 2 + v[1] ** 2),
});

export const polar2Cartesian = (p: PolarPoint) =>
  vec(p.radius * Math.cos(p.theta), p.radius * Math.sin(p.theta));

export const polar2Canvas = (p: PolarPoint, center: Vector) =>
  cartesian2Canvas(polar2Cartesian(p), center);

export const canvas2Polar = (v: Vector, center: Vector) =>
  cartesian2Polar(canvas2Cartesian(v, center));
