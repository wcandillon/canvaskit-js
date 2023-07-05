import type { Point } from "canvaskit-wasm";

export interface PathComponent {
  p1: Point;
  p2: Point;
  toCmd(): number[];
  toSVGString(): string;
  getSegment(start: number, stop: number): PathComponent;
  getPosAt(t: number): Point;
  getTanAt(t: number): Point;
  length(t?: number): number;
}
