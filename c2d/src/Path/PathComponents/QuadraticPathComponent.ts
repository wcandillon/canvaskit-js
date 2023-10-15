import { cross, dot, minus, normalize } from "../Vector";

import { PathComponentType, type PathComponent } from "./PathComponent";
import type { PolylineItem } from "./Polyline";
import { Polyline, linearSolve } from "./Polyline";
import { Flatennable } from "./Flattenable";
import { PathVerb } from "./PathVerb";

const defaultCurveTolerance = 0.1;

export class QuadraticPathComponent
  extends Flatennable
  implements PathComponent
{
  type = PathComponentType.Quadratic;

  constructor(
    readonly p1: DOMPoint,
    readonly cp: DOMPoint,
    readonly p2: DOMPoint
  ) {
    super();
  }

  createPolyline() {
    return new Polyline(this.fillPolyline());
  }

  fillPolyline(scaleFactor = 1) {
    const points: PolylineItem[] = [{ t: 0, point: this.p1 }];
    const tolerance = defaultCurveTolerance / scaleFactor;
    const sqrtTolerance = Math.sqrt(tolerance);

    const d01 = minus(this.cp, this.p1);
    const d12 = minus(this.p2, this.cp);
    const dd = minus(d01, d12);
    const crossV = cross(minus(this.p2, this.p1), dd);
    const x0 = (dot(d01, dd) * 1) / crossV;
    const x2 = (dot(d12, dd) * 1) / crossV;
    const scale = Math.abs(crossV / (Math.hypot(dd.x, dd.y) * (x2 - x0)));

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
      points.push({ t, point: this.solve(t) });
    }
    points.push({ t: 1, point: this.p2 });
    return points;
  }

  private chop(t: number, side: "left" | "right") {
    const { p1: p0, cp: p1, p2 } = this;

    const p01 = linearSolve(t, p0, p1);
    const p12 = linearSolve(t, p1, p2);
    if (side === "left") {
      return new QuadraticPathComponent(p0, p01, linearSolve(t, p01, p12));
    } else {
      return new QuadraticPathComponent(linearSolve(t, p01, p12), p12, p2);
    }
  }

  segment(l0: number, l1: number) {
    const t0 = this.tAtLength(l1);
    const q1 = this.chop(t0, "left");
    const t1 = q1.tAtLength(l0);
    return q1.chop(t1, "right");
  }

  toSVGString() {
    return `Q${this.cp.x} ${this.cp.y} ${this.p2.x} ${this.p2.y}`;
  }

  toCmd() {
    return [PathVerb.Quad, this.cp.x, this.cp.y, this.p2.x, this.p2.y];
  }

  solve(t: number) {
    return new DOMPoint(
      quadraticSolve(t, this.p1.x, this.cp.x, this.p2.x),
      quadraticSolve(t, this.p1.y, this.cp.y, this.p2.y)
    );
  }

  solveDerivative(t: number) {
    return normalize(
      new DOMPoint(
        quadraticSolveDerivative(t, this.p1.x, this.cp.x, this.p2.x),
        quadraticSolveDerivative(t, this.p1.y, this.cp.y, this.p2.y)
      )
    );
  }

  computeTightBounds() {
    return this.polyline.computeTightBounds();
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
