import type { Point } from "canvaskit-wasm";

import { vec } from "../../Vector";
import { PathVerb } from "../../Core";

import type { PathComponent } from "./PathComponent";
import { linearSolve2 } from "./LinearPathComponent";

export class QuadraticPathComponent implements PathComponent {
  constructor(readonly p1: Point, readonly cp: Point, readonly p2: Point) {}

  getSegment(t0: number, t1: number) {
    // First cut at t0
    const p01 = linearSolve2(t0, this.p1, this.cp);
    const p12 = linearSolve2(t0, this.cp, this.p2);
    const p02 = linearSolve2(t0, p01, p12);

    // Scale t1 to the new curve (from 0 to t0)
    const t1Scaled = (t1 - t0) / (1 - t0);

    // Second cut at t1Scaled
    const p01_ = linearSolve2(t1Scaled, p01, p12);
    const p12_ = linearSolve2(t1Scaled, p12, this.p2);
    const p02_ = linearSolve2(t1Scaled, p01_, p12_);

    // The segment is from p02 to p02_
    return new QuadraticPathComponent(p02, p01_, p02_);
  }

  length() {
    return getQuadraticArcLength(this.p1, this.cp, this.p2);
  }

  toSVGString() {
    return `Q${this.cp[0]} ${this.cp[1]} ${this.p2[0]} ${this.p2[1]}`;
  }

  toCmd() {
    return [PathVerb.Quad, this.cp[0], this.cp[1], this.p2[0], this.p2[1]];
  }

  getPointAtLength(length: number): Point {
    const t = length / this.length();
    const xs = [this.p1[0], this.cp[0], this.p2[0]];
    const ys = [this.p1[1], this.cp[1], this.p2[1]];
    const x =
      (1 - t) * (1 - t) * (1 - t) * xs[0] +
      3 * (1 - t) * (1 - t) * t * xs[1] +
      3 * (1 - t) * t * t * xs[2] +
      t * t * t * xs[3];
    const y =
      (1 - t) * (1 - t) * (1 - t) * ys[0] +
      3 * (1 - t) * (1 - t) * t * ys[1] +
      3 * (1 - t) * t * t * ys[2] +
      t * t * t * ys[3];
    return vec(x, y);
  }

  getTangentAtLength(length: number): Point {
    const t = length / this.length();
    const dx =
      2 * ((1 - t) * (this.cp[0] - this.p1[0]) + t * (this.p2[0] - this.cp[0]));
    const dy =
      2 * ((1 - t) * (this.cp[1] - this.p1[1]) + t * (this.p2[1] - this.cp[1]));

    const magnitude = Math.hypot(dx, dy);
    return vec(dx / magnitude, dy / magnitude);
  }
}

//export const getQuadraticArcLength = (p1: Point, cp: Point, p2: Point) => {
const getQuadraticArcLength = (p1: Point, cp: Point, p2: Point) => {
  const xs = [p1[0], cp[0], p2[0]];
  const ys = [p1[1], cp[1], p2[1]];
  const ax = xs[0] - 2 * xs[1] + xs[2];
  const ay = ys[0] - 2 * ys[1] + ys[2];
  const bx = 2 * xs[1] - 2 * xs[0];
  const by = 2 * ys[1] - 2 * ys[0];

  const A = 4 * (ax * ax + ay * ay);
  const B = 4 * (ax * bx + ay * by);
  const C = bx * bx + by * by;

  if (A === 0) {
    return Math.sqrt(Math.pow(xs[2] - xs[0], 2) + Math.pow(ys[2] - ys[0], 2));
  }
  const b = B / (2 * A);
  const c = C / A;
  const u = 1 + b;
  const k = c - b * b;

  const uuk = u * u + k > 0 ? Math.sqrt(u * u + k) : 0;
  const bbk = b * b + k > 0 ? Math.sqrt(b * b + k) : 0;
  const term =
    b + Math.sqrt(b * b + k) !== 0 && (u + uuk) / (b + bbk) !== 0
      ? k * Math.log(Math.abs((u + uuk) / (b + bbk)))
      : 0;

  return (Math.sqrt(A) / 2) * (u * uuk - b * bbk + term);
};
