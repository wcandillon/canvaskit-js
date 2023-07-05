import type { Point } from "canvaskit-wasm";
import { svgPathProperties } from "svg-path-properties";

import { vec } from "../../Vector";
import { PathVerb } from "../../Core";

import type { PathComponent } from "./PathComponent";
import { linearSolve } from "./LinearPathComponent";

export class QuadraticPathComponent implements PathComponent {
  props: ReturnType<typeof svgPathProperties>;

  constructor(readonly p1: Point, readonly cp: Point, readonly p2: Point) {
    this.props = new svgPathProperties(
      `M${p1[0]} ${p1[1]} Q${cp[0]} ${cp[1]} ${p2[0]} ${p2[1]}`
    );
  }

  getSegment(t0: number, t1: number) {
    // First cut at t0
    const p01 = linearSolve(t0, this.p1, this.cp);
    const p12 = linearSolve(t0, this.cp, this.p2);
    const p02 = linearSolve(t0, p01, p12);

    // Scale t1 to the new curve (from 0 to t0)
    const t1Scaled = (t1 - t0) / (1 - t0);

    // Second cut at t1Scaled
    const p01_ = linearSolve(t1Scaled, p01, p12);
    const p12_ = linearSolve(t1Scaled, p12, this.p2);
    const p02_ = linearSolve(t1Scaled, p01_, p12_);

    // The segment is from p02 to p02_
    return new QuadraticPathComponent(p02, p01_, p02_);
  }

  length() {
    return this.props.getTotalLength();
  }

  toSVGString() {
    return `Q${this.cp[0]} ${this.cp[1]} ${this.p2[0]} ${this.p2[1]}`;
  }

  toCmd() {
    return [PathVerb.Quad, this.cp[0], this.cp[1], this.p2[0], this.p2[1]];
  }

  getPointAtLength(length: number) {
    const { x, y } = this.props.getPointAtLength(length);
    return vec(x, y);
  }

  getTangentAtLength(length: number) {
    const { x, y } = this.props.getTangentAtLength(length);
    return vec(x, y);
  }
}
