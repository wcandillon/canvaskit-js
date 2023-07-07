import type { Point } from "canvaskit-wasm";

import { PathVerb } from "../../Core";
import { dist } from "../../Vector";

import type { PathComponent } from "./PathComponent";
import { linearSolve, linearSolveDerivative } from "./Polyline";

export class LinearPathComponent implements PathComponent {
  constructor(readonly p1: Point, readonly p2: Point) {}

  segment(start: number, stop: number): PathComponent {
    return new LinearPathComponent(
      this.pointAtLength(start),
      this.pointAtLength(stop)
    );
  }

  solve(t: number): Float32Array {
    return linearSolve(t, this.p1, this.p2);
  }

  solveDerivative(): Float32Array {
    return linearSolveDerivative(this.p1, this.p2);
  }

  tAtLength(length: number) {
    return length / this.length();
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
    return this.solveDerivative();
  }

  length() {
    return dist(this.p1, this.p2);
  }
}
