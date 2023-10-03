import type { Point } from "canvaskit-wasm";

import type { TightBounds } from "./Bounds";

export interface PathComponent extends TightBounds {
  p1: Point;
  p2: Point;

  toCmd(): number[];
  toSVGString(): string;

  segment(start: number, stop: number): PathComponent;

  tAtLength(length: number): number;

  length(): number;

  solve(t: number): Point;
  solveDerivative(t: number): Point;
}
