import type { Point } from "canvaskit-wasm";
import { svgPathProperties } from "svg-path-properties";

import { cross, dot, minus, vec } from "../../Vector";
import { PathVerb } from "../../Core";

import type { PathComponent } from "./PathComponent";
import { linearSolve } from "./LinearPathComponent";

const kDefaultCurveTolerance = 0.1;

export class QuadraticPathComponent implements PathComponent {
  props: ReturnType<typeof svgPathProperties>;

  constructor(readonly p1: Point, readonly cp: Point, readonly p2: Point) {
    this.props = new svgPathProperties(
      `M${p1[0]} ${p1[1]} Q${cp[0]} ${cp[1]} ${p2[0]} ${p2[1]}`
    );
  }

  polyline(scaleFactor = 1) {
    const points: Point[] = [this.p1];
    const tolerance = kDefaultCurveTolerance / scaleFactor;
    const sqrtTolerance = Math.sqrt(tolerance);

    const d01 = minus(this.cp, this.p1);
    const d12 = minus(this.p2, this.cp);
    const dd = minus(d01, d12);
    const crossV = cross(minus(this.p2, this.p1), dd);
    const x0 = (dot(d01, dd) * 1) / crossV;
    const x2 = (dot(d12, dd) * 1) / crossV;
    const scale = Math.abs(crossV / (Math.hypot(dd[0], dd[1]) * (x2 - x0)));

    const a0 = approximateParabolaIntegral(x0);
    const a2 = approximateParabolaIntegral(x2);
    let val = 0.0;
    if (Number.isFinite(scale)) {
      const da = Math.abs(a2 - a0);
      const sqrtScale = Math.sqrt(scale);
      if ((x0 < 0 && x2 < 0) || (x0 >= 0 && x2 >= 0)) {
        val = da * sqrtScale;
      } else {
        const xmin = sqrtTolerance / sqrtScale;
        val = (sqrtTolerance * da) / approximateParabolaIntegral(xmin);
      }
    }
    const u0 = approximateParabolaIntegral(a0);
    const u2 = approximateParabolaIntegral(a2);
    const uScale = 1 / (u2 - u0);

    const lineCount = Math.max(1, Math.ceil((0.5 * val) / sqrtTolerance));
    const step = 1 / lineCount;
    for (let i = 1; i < lineCount; i += 1) {
      const u = i * step;
      const a = a0 + (a2 - a0) * u;
      const t = (approximateParabolaIntegral(a) - u0) * uScale;
      points.push(this.solve(t));
    }
    points.push(this.p2);

    return points;
  }

  solve(t: number) {
    return vec(
      quadraticSolve(t, this.p1[0], this.cp[0], this.p2[0]),
      quadraticSolve(t, this.p1[1], this.cp[1], this.p2[1])
    );
  }

  solveDerivative(t: number) {
    return vec(
      quadraticSolveDerivative(t, this.p1[0], this.cp[0], this.p2[0]),
      quadraticSolveDerivative(t, this.p1[1], this.cp[1], this.p2[1])
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
    const length = this.polyline().reduce((acc, p, i, arr) => {
      if (i === 0) {
        return acc;
      }
      return acc + Math.hypot(arr[i - 1][0] - p[0], arr[i - 1][1] - p[1]);
    }, 0);
    return length;
  }

  toSVGString() {
    return `Q${this.cp[0]} ${this.cp[1]} ${this.p2[0]} ${this.p2[1]}`;
  }

  toCmd() {
    return [PathVerb.Quad, this.cp[0], this.cp[1], this.p2[0], this.p2[1]];
  }

  getPointAtLength(length: number) {
    const t = length / this.length();
    return this.solve(t);
  }

  getTangentAtLength(length: number) {
    const t = length / this.length();
    return this.solveDerivative(t);
  }
}

/// https://raphlinus.github.io/graphics/curves/2019/12/23/flatten-quadbez.html
const approximateParabolaIntegral = (x: number) => {
  const d = 0.67;
  return x / (1.0 - d + Math.sqrt(Math.sqrt(Math.pow(d, 4) + 0.25 * x * x)));
};

const quadraticSolve = (t: number, p0: number, p1: number, p2: number) =>
  (1 - t) * (1 - t) * p0 + //
  2 * (1 - t) * t * p1 + //
  t * t * p2;

const quadraticSolveDerivative = (
  t: number,
  p0: number,
  p1: number,
  p2: number
) =>
  2 * (1 - t) * (p1 - p0) + //
  2 * t * (p2 - p1);
