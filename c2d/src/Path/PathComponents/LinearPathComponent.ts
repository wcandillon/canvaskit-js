import { dist } from "../Vector";

import { PathComponentType, type PathComponent } from "./PathComponent";
import { linearSolve, linearSolveDerivative } from "./Polyline";
import { PathVerb } from "./PathVerb";

export class LinearPathComponent implements PathComponent {
  type = PathComponentType.Linear;

  constructor(readonly p1: DOMPoint, readonly p2: DOMPoint) {}

  segment(start: number, stop: number): PathComponent {
    return new LinearPathComponent(
      this.solve(this.tAtLength(start)),
      this.solve(this.tAtLength(stop))
    );
  }

  computeTightBounds() {
    const minX = Math.min(this.p1.x, this.p2.x);
    const minY = Math.min(this.p1.y, this.p2.y);
    const maxX = Math.max(this.p1.x, this.p2.x);
    const maxY = Math.max(this.p1.y, this.p2.y);
    return Float32Array.of(minX, minY, maxX, maxY);
  }

  solve(t: number) {
    return linearSolve(t, this.p1, this.p2);
  }

  solveDerivative() {
    return linearSolveDerivative(this.p1, this.p2);
  }

  tAtLength(length: number) {
    return length / this.length();
  }

  toCmd() {
    return [PathVerb.Line, this.p2.x, this.p2.y];
  }

  toSVGString() {
    return `L${this.p2.x} ${this.p2.y}`;
  }

  length() {
    return dist(this.p1, this.p2);
  }
}
