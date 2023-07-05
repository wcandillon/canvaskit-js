import type { Point } from "canvaskit-wasm";

export interface PathComponent {
  p1: Point;
  p2: Point;
  toCmd(): number[];
  toSVGString(): string;
  getSegment(start: number, stop: number): PathComponent;
  getPointAtLength(length: number): Point;
  getTangentAtLength(length: number): Point;
  length(): number;
}
