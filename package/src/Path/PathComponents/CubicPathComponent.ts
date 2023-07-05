import type { Point } from "canvaskit-wasm";
import { svgPathProperties } from "svg-path-properties";

import { PathVerb } from "../../Core";
import { vec } from "../../Vector";

import type { PathComponent } from "./PathComponent";
import { linearSolve } from "./LinearPathComponent";

export class CubicPathComponent implements PathComponent {
  props: ReturnType<typeof svgPathProperties>;

  constructor(
    readonly p1: Point,
    readonly cp1: Point,
    readonly cp2: Point,
    readonly p2: Point
  ) {
    this.props = new svgPathProperties(
      `M${p1[0]} ${p1[1]} C${cp1[0]} ${cp1[1]} ${cp2[0]} ${cp2[1]} ${p2[0]} ${p2[1]}`
    );
  }

  length() {
    return this.props.getTotalLength();
  }

  toSVGString() {
    return `C${this.cp1[0]} ${this.cp1[1]} ${this.cp2[0]} ${this.cp2[1]} ${this.p2[0]} ${this.p2[1]}`;
  }

  toCmd() {
    return [
      PathVerb.Cubic,
      this.cp1[0],
      this.cp1[1],
      this.cp2[0],
      this.cp2[1],
      this.p2[0],
      this.p2[1],
    ];
  }
  getPointAtLength(length: number) {
    const { x, y } = this.props.getPointAtLength(length);
    return vec(x, y);
  }

  getTangentAtLength(length: number) {
    const { x, y } = this.props.getTangentAtLength(length);
    return vec(x, y);
  }

  getSegment(t0: number, t1: number) {
    // First cut at t0
    const p01 = linearSolve(t0, this.p1, this.cp1);
    const p12 = linearSolve(t0, this.cp1, this.cp2);
    const p23 = linearSolve(t0, this.cp2, this.p2);
    const p02 = linearSolve(t0, p01, p12);
    const p13 = linearSolve(t0, p12, p23);
    const p03 = linearSolve(t0, p02, p13);

    // Scale t1 to the new curve (from 0 to t0)
    const t1Scaled = (t1 - t0) / (1 - t0);

    // Second cut at t1Scaled
    const p01_ = linearSolve(t1Scaled, p01, p12);
    const p12_ = linearSolve(t1Scaled, p12, p23);
    const p23_ = linearSolve(t1Scaled, p13, this.p2);
    const p02_ = linearSolve(t1Scaled, p01_, p12_);
    const p13_ = linearSolve(t1Scaled, p12_, p23_);
    const p03_ = linearSolve(t1Scaled, p02_, p13_);

    // The segment is from p03 to p03_
    return new CubicPathComponent(p03, p01_, p02_, p03_);
  }
}
