import type { Point } from "canvaskit-wasm";

import { PathVerb } from "../../Core";
import { vec } from "../../Vector";

import type { PathComponent } from "./PathComponent";

export class LinearPathComponent implements PathComponent {
  constructor(readonly p1: Point, readonly p2: Point) {}

  getSegment(start: number, stop: number): PathComponent {
    return new LinearPathComponent(
      this.getPointAt(start),
      this.getPointAt(stop)
    );
  }

  toCmd() {
    return [PathVerb.Line, this.p2[0], this.p2[1]];
  }

  toSVGString() {
    return `L${this.p2[0]} ${this.p2[1]}`;
  }

  getPointAt(t: number): Point {
    return linearSolve2(t, this.p1, this.p2);
  }

  length(t = 1) {
    return t * Math.hypot(this.p2[0] - this.p1[0], this.p2[1] - this.p1[1]);
  }
}

export const linearSolve = (t: number, p0: number, p1: number) => {
  return (1 - t) * p0 + t * p1;
};

export const linearSolve2 = (t: number, p0: Point, p1: Point) => {
  return vec(linearSolve(t, p0[0], p1[0]), linearSolve(t, p0[1], p1[1]));
};
