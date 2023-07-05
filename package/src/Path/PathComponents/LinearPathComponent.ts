import type { Point } from "canvaskit-wasm";
import { svgPathProperties } from "svg-path-properties";

import { PathVerb } from "../../Core";
import { vec } from "../../Vector";

import type { PathComponent } from "./PathComponent";

export class LinearPathComponent implements PathComponent {
  constructor(readonly p1: Point, readonly p2: Point) {}

  getSegment(start: number, stop: number): PathComponent {
    return new LinearPathComponent(
      linearSolve2(start, this.p1, this.p2),
      linearSolve2(stop, this.p1, this.p2)
    );
  }

  toCmd() {
    return [PathVerb.Line, this.p2[0], this.p2[1]];
  }

  toSVGString() {
    return `L${this.p2[0]} ${this.p2[1]}`;
  }

  getPointAtLength(length: number) {
    const props = new svgPathProperties(
      `M ${this.p1[0]} ${this.p1[1]} L ${this.p2[0]} ${this.p2[1]}`
    );
    const { x, y } = props.getPointAtLength(length);
    return vec(x, y);
  }

  getTangentAtLength(_: number) {
    const props = new svgPathProperties(
      `M ${this.p1[0]} ${this.p1[1]} L ${this.p2[0]} ${this.p2[1]}`
    );
    const { x, y } = props.getTangentAtLength(_);
    return vec(x, y);
  }

  length() {
    const props = new svgPathProperties(
      `M ${this.p1[0]} ${this.p1[1]} L ${this.p2[0]} ${this.p2[1]}`
    );
    return props.getTotalLength();
  }
}

export const linearSolve = (t: number, p0: number, p1: number) => {
  return (1 - t) * p0 + t * p1;
};

export const linearSolve2 = (t: number, p0: Point, p1: Point) => {
  return vec(linearSolve(t, p0[0], p1[0]), linearSolve(t, p0[1], p1[1]));
};
