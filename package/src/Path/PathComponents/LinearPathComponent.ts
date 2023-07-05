import type { Point } from "canvaskit-wasm";

import { PathVerb } from "../../Core";
import { vec } from "../../Vector";

import type { PathComponent } from "./PathComponent";

export class LinearPathComponent implements PathComponent {
  constructor(readonly p1: Point, readonly p2: Point) {}

  getSegment(start: number, stop: number): PathComponent {
    const length = this.length();
    return new LinearPathComponent(
      this.getPointAtLength(start * length),
      this.getPointAtLength(stop * length)
    );
  }

  toCmd() {
    return [PathVerb.Line, this.p2[0], this.p2[1]];
  }

  toSVGString() {
    return `L${this.p2[0]} ${this.p2[1]}`;
  }

  getPointAtLength(length: number) {
    const t = length / this.length();
    return linearSolve2(t, this.p1, this.p2);
  }

  getTangentAtLength(_: number) {
    const dx = this.p2[0] - this.p1[0];
    const dy = this.p2[1] - this.p1[1];
    const magnitude = Math.hypot(dx, dy);
    return vec(dx / magnitude, dy / magnitude);
  }

  length() {
    return Math.hypot(this.p2[0] - this.p1[0], this.p2[1] - this.p1[1]);
  }
}

export const linearSolve2 = (t: number, p0: Point, p1: Point) =>
  vec((1 - t) * p0[0] + t * p1[0], (1 - t) * p0[1] + t * p1[1]);
