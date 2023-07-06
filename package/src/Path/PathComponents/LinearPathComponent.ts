import type { Point } from "canvaskit-wasm";

import { PathVerb } from "../../Core";
import { vec } from "../../Vector";

import type { PathComponent } from "./PathComponent";
import { linearSolve } from "./Polyline";

export class LinearPathComponent implements PathComponent {
  constructor(readonly p1: Point, readonly p2: Point) {}

  segment(start: number, stop: number): PathComponent {
    const length = this.length();
    return new LinearPathComponent(
      this.pointAtLength(start * length),
      this.pointAtLength(stop * length)
    );
  }

  toCmd() {
    return [PathVerb.Line, this.p2[0], this.p2[1]];
  }

  toSVGString() {
    return `L${this.p2[0]} ${this.p2[1]}`;
  }

  pointAtLength(length: number) {
    const t = length / this.length();
    return linearSolve(t, this.p1, this.p2);
  }

  tangentAtLength(_: number) {
    return this.solveDerivative(_);
  }

  length() {
    return Math.hypot(this.p2[0] - this.p1[0], this.p2[1] - this.p1[1]);
  }

  solve(t: number) {
    return linearSolve(t, this.p1, this.p2);
  }

  solveDerivative(_: number) {
    const dx = this.p2[0] - this.p1[0];
    const dy = this.p2[1] - this.p1[1];
    const magnitude = Math.hypot(dx, dy);
    return vec(dx / magnitude, dy / magnitude);
  }
}
