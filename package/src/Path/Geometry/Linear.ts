import type { Point } from "canvaskit-wasm";

import { vec } from "../../Vector";

export const linearSolve = (t: number, p0: number, p1: number) => {
  return (1 - t) * p0 + t * p1;
};

export const linearSolve2 = (t: number, p0: Point, p1: Point) => {
  return vec(linearSolve(t, p0[0], p1[0]), linearSolve(t, p0[1], p1[1]));
};
