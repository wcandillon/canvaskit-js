/* eslint-disable @typescript-eslint/no-shadow */
import type { Point } from "canvaskit-wasm";
import { svgPathProperties } from "svg-path-properties";

import { PathVerb } from "../../Core";
import { minus, multiplyScalar, plus, vec } from "../../Vector";

import type { PathComponent } from "./PathComponent";
import { linearSolve } from "./LinearPathComponent";
import { QuadraticPathComponent } from "./QuadraticPathComponent";

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
    const totalLength = this.polyline().reduce(
      (acc, p, i, arr) =>
        i === 0
          ? 0
          : acc + Math.hypot(p[0] - arr[i - 1][0], p[1] - arr[i - 1][1]),
      0
    );
    return totalLength; //this.props.getTotalLength();
  }

  private toQuadraticPathComponents(
    accuracy: number
  ): QuadraticPathComponent[] {
    const quads: QuadraticPathComponent[] = [];

    const maxHypot2 = 432.0 * accuracy * accuracy;
    let p1x2 = this.cp1.map((_, i) => 3.0 * this.cp1[i] - this.p1[i]);
    let p2x2 = this.cp2.map((_, i) => 3.0 * this.cp2[i] - this.p2[i]);
    const p = p2x2.map((_, i) => p2x2[i] - p1x2[i]);
    const err = p.reduce((a, b) => a + b * b, 0);
    const quadCount = Math.max(
      1,
      Math.ceil(Math.pow(err / maxHypot2, 1 / 6.0))
    );

    for (let i = 0; i < quadCount; i++) {
      const t0 = i / quadCount;
      const t1 = (i + 1) / quadCount;
      const seg = this.subsegment(t0, t1); // Assuming this.subsegment is defined
      p1x2 = seg.cp1.map((_, i) => 3.0 * seg.cp1[i] - seg.p1[i]);
      p2x2 = seg.cp2.map((_, i) => 3.0 * seg.cp2[i] - seg.p2[i]);
      const middle = p1x2.map((_, i) => (p1x2[i] + p2x2[i]) / 4.0);
      quads.push(new QuadraticPathComponent(seg.p1, middle, seg.p2));
    }
    return quads;
  }

  private subsegment(t0: number, t1: number) {
    const p0 = this.solve(t0);
    const p3 = this.solve(t1);
    const d = this.lower();
    const scale = (t1 - t0) * (1.0 / 3.0);
    const p1 = plus(p0, multiplyScalar(d.solve(t0), scale));
    const p2 = minus(p3, multiplyScalar(d.solve(t1), scale));
    return new CubicPathComponent(p0, p1, p2, p3);
  }

  private lower() {
    return new QuadraticPathComponent(
      multiplyScalar(minus(this.cp1, this.p1), 3),
      multiplyScalar(minus(this.cp2, this.cp1), 3),
      multiplyScalar(minus(this.p2, this.cp2), 3)
    );
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

  polyline(): Point[] {
    const quads = this.toQuadraticPathComponents(0.4);
    const points: Point[] = [this.p1];
    for (const quad of quads) {
      points.push(...quad.fillPointsForPolyline(0.4));
    }
    return points;
  }

  solve(t: number): Point {
    return vec(
      cubicSolve(t, this.p1[0], this.cp1[0], this.cp2[0], this.p2[0]),
      cubicSolve(t, this.p1[1], this.cp1[1], this.cp2[1], this.p2[1])
    );
  }

  solveDerivative(_t: number): Float32Array {
    throw new Error("Method not implemented.");
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

const cubicSolve = (
  t: number,
  p0: number,
  p1: number,
  p2: number,
  p3: number
) =>
  (1 - t) * (1 - t) * (1 - t) * p0 +
  3 * (1 - t) * (1 - t) * t * p1 +
  3 * (1 - t) * t * t * p2 +
  t * t * t * p3;
