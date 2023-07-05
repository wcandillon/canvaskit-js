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

  length(t = 1) {
    return getQuadraticArcLength(this.p1, this.cp, this.p2, t);
  }

  toSVGString() {
    return `Q${this.cp[0]} ${this.cp[1]} ${this.p2[0]} ${this.p2[1]}`;
  }

  toCmd() {
    return [PathVerb.Quad, this.cp[0], this.cp[1], this.p2[0], this.p2[1]];
  }

  getPosAt(t: number): Point {
    return vec(
      quadraticSolve(t, this.p1[0], this.cp[0], this.p2[0]),
      quadraticSolve(t, this.p1[1], this.cp[1], this.p2[1])
    );
  }

  getTanAt(t: number): Point {
    const dx =
      2 * ((1 - t) * (this.cp[0] - this.p1[0]) + t * (this.p2[0] - this.cp[0]));
    const dy =
      2 * ((1 - t) * (this.cp[1] - this.p1[1]) + t * (this.p2[1] - this.cp[1]));

    const magnitude = Math.hypot(dx, dy);
    return vec(dx / magnitude, dy / magnitude);
  }
}

const quadraticSolve = (t: number, p0: number, p1: number, p2: number) => {
  return (
    (1 - t) * (1 - t) * p0 + //
    2 * (1 - t) * t * p1 + //
    t * t * p2
  );
};

export const getQuadraticArcLength = (
  p1: Point,
  cp: Point,
  p2: Point,
  t: number
) => {
  if (t === undefined) {
    t = 1;
  }
  const ax = p1[0] - 2 * cp[0] + p2[0];
  const ay = p1[1] - 2 * cp[1] + p2[0];
  const bx = 2 * cp[0] - 2 * p1[0];
  const by = 2 * cp[1] - 2 * p1[1];

  const A = 4 * (ax * ax + ay * ay);
  const B = 4 * (ax * bx + ay * by);
  const C = bx * bx + by * by;

  if (A === 0) {
    return (
      t * Math.sqrt(Math.pow(p2[0] - p1[0], 2) + Math.pow(p2[1] - p1[1], 2))
    );
  }
  const b = B / (2 * A);
  const c = C / A;
  const u = t + b;
  const k = c - b * b;

  const uuk = u * u + k > 0 ? Math.sqrt(u * u + k) : 0;
  const bbk = b * b + k > 0 ? Math.sqrt(b * b + k) : 0;
  const term =
    b + Math.sqrt(b * b + k) !== 0 && (u + uuk) / (b + bbk) !== 0
      ? k * Math.log(Math.abs((u + uuk) / (b + bbk)))
      : 0;

  return (Math.sqrt(A) / 2) * (u * uuk - b * bbk + term);
};
