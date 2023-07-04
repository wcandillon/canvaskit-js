import type { Point } from "canvaskit-wasm";

export interface PathComponent {
  p1: Point;
  toCmd(): number[];
  toSVGString(): string;
  getSegment(start: number, stop: number): PathComponent;
  getPointAtT(t: number): Point;
  length(t?: number): number;
}
