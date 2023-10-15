import type { TightBounds } from "./Bounds";

export enum PathComponentType {
  Linear,
  Quadratic,
  Cubic,
}

export interface PathComponent extends TightBounds {
  p1: DOMPoint;
  p2: DOMPoint;
  type: PathComponentType;

  toCmd(): number[];
  toSVGString(): string;

  segment(start: number, stop: number): PathComponent;

  tAtLength(length: number): number;

  length(): number;

  solve(t: number): DOMPoint;
  solveDerivative(t: number): DOMPoint;
}
