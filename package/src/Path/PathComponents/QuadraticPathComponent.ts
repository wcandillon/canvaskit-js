import type { Point } from "canvaskit-wasm";

import { cross, dot, minus, vec } from "../../Vector";
import { PathVerb } from "../../Core";

import type { PathComponent } from "./PathComponent";
import { Polyline, linearSolve } from "./Polyline";
import { Flatennable } from "./Flattenable";

const defaultCurveTolerance = 0.1;

export class QuadraticPathComponent
  extends Flatennable
  implements PathComponent
{
  constructor(readonly p1: Point, readonly cp: Point, readonly p2: Point) {
    super();
  }

  createPolyline() {
    const { points, tValues } = this.fillPointsForPolyline();
    return new Polyline(points, tValues);
  }

  getPolyline() {
    return this.polyline.points;
  }

  fillPointsForPolyline(scaleFactor = 1) {
    const points: Point[] = [];
    const tValues: number[] = [];
    points.push(this.p1);
    tValues.push(0);
    const tolerance = defaultCurveTolerance / scaleFactor;
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
      tValues.push(t);
    }
    points.push(this.p2);
    tValues.push(1);
    return { points, tValues };
  }

  solve(t: number) {
    return vec(
      quadraticSolve(t, this.p1[0], this.cp[0], this.p2[0]),
      quadraticSolve(t, this.p1[1], this.cp[1], this.p2[1])
    );
  }

  segment(l0: number, l1: number) {
    const t0 = this.polyline.getTAtLength(l0);
    const t1 = this.polyline.getTAtLength(l1);
    return this.subsegment(t0, t1);
  }

  subsegment(t0: number, t1: number) {
    const { p1: p0, cp: p1, p2 } = this;

    const q0 = linearSolve(t0, p0, p1); // point on the line p0-p1 at t0
    const q1 = linearSolve(t0, p1, p2); // point on the line p1-p2 at t0
    const r0 = linearSolve(t0, q0, q1); // point on the line q0-q1 at t0 (this is on the curve at t0)

    const q2 = linearSolve(t1, p0, p1); // point on the line p0-p1 at t1
    const q3 = linearSolve(t1, p1, p2); // point on the line p1-p2 at t1
    const r1 = linearSolve(t1, q2, q3); // point on the line q2-q3 at t1 (this is on the curve at t1)

    const newCp = this.solve((t0 + t1) / 2); // new control point is the midpoint on the original curve

    // Return a new QuadraticPathComponent that represents the subsegment of the curve between t0 and t1
    return new QuadraticPathComponent(
      r0,
      linearSolve((t1 - t0) / (1 - t0), q0, q1),
      r1
    );
  }

  // private solveDerivative(t: number) {
  //   return vec(
  //     quadratiSolvecDerivative(t, this.p1[0], this.cp[0], this.p2[0]),
  //     quadratiSolvecDerivative(t, this.p1[1], this.cp[1], this.p2[1])
  //   );
  // }

  toSVGString() {
    return `Q${this.cp[0]} ${this.cp[1]} ${this.p2[0]} ${this.p2[1]}`;
  }

  toCmd() {
    return [PathVerb.Quad, this.cp[0], this.cp[1], this.p2[0], this.p2[1]];
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

// const quadratiSolvecDerivative = (
//   t: number,
//   p0: number,
//   p1: number,
//   p2: number
// ) =>
//   2 * (1 - t) * (p1 - p0) + //
//   2 * t * (p2 - p1);
