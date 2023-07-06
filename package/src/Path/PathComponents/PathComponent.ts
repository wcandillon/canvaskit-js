import type { Point } from "canvaskit-wasm";

export interface PathProperties {
  getPointAtLength(length: number): Point;
  getTangentAtLength(length: number): Point;
  length(): number;
}

export interface PathComponent extends PathProperties {
  p1: Point;
  p2: Point;
  toCmd(): number[];
  toSVGString(): string;
  getSegment(start: number, stop: number): PathComponent;
  solve(t: number): Point;
  solveDerivative(t: number): Point;
}
