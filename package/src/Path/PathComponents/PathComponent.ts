import type { Point } from "canvaskit-wasm";

export interface PathProperties {
  pointAtLength(length: number): Point;
  tangentAtLength(length: number): Point;
  length(): number;
}

export interface PathComponent extends PathProperties {
  p1: Point;
  p2: Point;
  toCmd(): number[];
  toSVGString(): string;
  segment(start: number, stop: number): PathComponent;
}
