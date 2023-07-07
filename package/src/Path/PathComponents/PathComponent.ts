import type { Point } from "canvaskit-wasm";

export interface PathComponent {
  p1: Point;
  p2: Point;

  toCmd(): number[];
  toSVGString(): string;

  segment(start: number, stop: number): PathComponent;

  tAtLength(length: number): number;
  pointAtLength(length: number): Point;
  tangentAtLength(length: number): Point;

  length(): number;

  solve(t: number): Point;
  solveDerivative(t: number): Point;
}
