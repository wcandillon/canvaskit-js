import type { Point } from "canvaskit-wasm";

import type { Polyline } from "./Polyline";

export interface PathComponent {
  p1: Point;
  p2: Point;
  toCmd(): number[];
  toSVGString(): string;
  getSegment(start: number, stop: number): PathComponent;
  getPointAtLength(length: number): Point;
  getTangentAtLength(length: number): Point;
  length(): number;
  polyline: Polyline;
  solve(t: number): Point;
  solveDerivative(t: number): Point;
}
