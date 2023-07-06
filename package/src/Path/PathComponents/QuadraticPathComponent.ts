import type { Point } from "canvaskit-wasm";

import { cross, dot, minus, multiplyScalar, plus, vec } from "../../Vector";
import { PathVerb } from "../../Core";

import type { PathComponent } from "./PathComponent";
import { Polyline } from "./Polyline";
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
    return new Polyline(this.fillPointsForPolyline());
  }

  fillPointsForPolyline(points: Point[] = [], scaleFactor = 1) {
    points.push(this.p1);
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

  segment(t0: number, t1: number) {
    const p0 = this.solve(t0); // get the start point of the segment
    const p2 = this.solve(t1); // get the end point of the segment
    const scale = t1 - t0; // scale factor
    // calculate the control point for the new path segment
    const cp = plus(p0, multiplyScalar(this.solveDerivative(t0), scale));
    return new QuadraticPathComponent(p0, cp, p2);
  }

  private solveDerivative(t: number) {
    return vec(
      quadratiSolvecDerivative(t, this.p1[0], this.cp[0], this.p2[0]),
      quadratiSolvecDerivative(t, this.p1[1], this.cp[1], this.p2[1])
    );
  }

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

const quadratiSolvecDerivative = (
  t: number,
  p0: number,
  p1: number,
  p2: number
) =>
  2 * (1 - t) * (p1 - p0) + //
  2 * t * (p2 - p1);
