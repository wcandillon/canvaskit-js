import type { Point } from "canvaskit-wasm";

import {
  cross,
  dot,
  equals,
  minus,
  normalize,
  vec,
  multiplyScalar,
  plus,
} from "../Vector";
import { PathVerb } from "../Core";

const defaultCurveTolerance = 1;

const linearSolve = (t: number, p0: number, p1: number) => {
  return p0 + t * (p1 - p0);
};

const quadraticSolve = (t: number, p0: number, p1: number, p2: number) => {
  return (
    (1 - t) * (1 - t) * p0 + //
    2 * (1 - t) * t * p1 + //
    t * t * p2
  );
};

const approximateParabolaIntegral = (x: number) => {
  const d = 0.67;
  return x / (1.0 - d + Math.sqrt(Math.sqrt(Math.pow(d, 4) + 0.25 * x * x)));
};

const cubicSolve = (
  t: number,
  p0: number,
  p1: number,
  p2: number,
  p3: number
): number => {
  return (
    (1 - t) * (1 - t) * (1 - t) * p0 +
    3 * (1 - t) * (1 - t) * t * p1 +
    3 * (1 - t) * t * t * p2 +
    t * t * t * p3
  );
};

interface PathComponent<T extends PathComponent<T>> {
  toCmd(): number[];
  equals(component: T): boolean;
  solve(t: number): Point;
  createPolyline(scaleFactor?: number): Point[];
}

export class LinearPathComponent implements PathComponent<LinearPathComponent> {
  constructor(readonly p1: Point, readonly p2: Point) {}

  toCmd() {
    return [PathVerb.Line, this.p2[0], this.p2[1]];
  }

  solve(t: number): Point {
    return vec(
      linearSolve(t, this.p1[0], this.p2[1]),
      linearSolve(t, this.p1[0], this.p2[1])
    );
  }

  createPolyline() {
    return [this.p2];
  }

  extrema() {
    return [this.p1, this.p2];
  }

  getStartDirection() {
    if (equals(this.p1, this.p2)) {
      return null;
    }
    return normalize(minus(this.p1, this.p2));
  }

  getEndDirection() {
    if (equals(this.p1, this.p2)) {
      return null;
    }
    return normalize(minus(this.p2, this.p1));
  }

  equals(p: LinearPathComponent): boolean {
    return equals(this.p1, p.p1) && equals(this.p2, p.p2);
  }
}

export class QuadraticPathComponent
  implements PathComponent<QuadraticPathComponent>
{
  constructor(readonly p1: Point, readonly cp: Point, readonly p2: Point) {}

  toCmd() {
    return [PathVerb.Quad, this.cp[0], this.cp[1], this.p2[0], this.p2[1]];
  }

  solve(t: number): Point {
    return vec(
      quadraticSolve(t, this.p1[0], this.cp[0], this.p2[1]),
      quadraticSolve(t, this.p1[0], this.cp[1], this.p2[1])
    );
  }

  createPolyline(scaleFactor = 1) {
    const points: Point[] = [];
    const tolerance = defaultCurveTolerance / scaleFactor;
    const sqrtTolerance = Math.sqrt(tolerance);
    const d01 = minus(this.cp, this.p1);
    const d12 = minus(this.p2, this.cp);
    const dd = minus(d01, d12);
    const c = cross(minus(this.p2, this.p1), dd);
    const x0 = (dot(d01, dd) * 1) / c;
    const x2 = (dot(d12, dd) * 1) / c;
    const scale = Math.abs(c / (Math.hypot(dd[0], dd[1]) * (x2 - x0)));
    const a0 = approximateParabolaIntegral(x0);
    const a2 = approximateParabolaIntegral(x2);
    let val = 0;
    if (scale !== Infinity) {
      const da = Math.abs(a2 - a0);
      const sqrtScale = Math.sqrt(scale);
      if ((x0 < 0 && x2 < 0) || (x0 >= 0 && x2 >= 0)) {
        val = da * sqrtScale;
      } else {
        // cusp case
        const xmin = sqrtTolerance / sqrtScale;
        val = (sqrtTolerance * da) / approximateParabolaIntegral(xmin);
      }
    }
    const u0 = approximateParabolaIntegral(a0);
    const u2 = approximateParabolaIntegral(a2);
    const uscale = 1 / (u2 - u0);

    const lineCount = Math.max(1, Math.ceil((0.5 * val) / sqrtTolerance));
    const step = 1 / lineCount;
    for (let i = 1; i < lineCount; i += 1) {
      const u = i * step;
      const a = a0 + (a2 - a0) * u;
      const t = (approximateParabolaIntegral(a) - u0) * uscale;
      points.push(this.solve(t));
    }
    points.push(this.p2);
    return points;
  }

  equals(p: QuadraticPathComponent) {
    return (
      equals(this.p1, p.p1) && equals(this.cp, p.cp) && equals(this.p2, p.p2)
    );
  }
}

export class CubicPathComponent implements PathComponent<CubicPathComponent> {
  constructor(
    readonly p1: Point,
    readonly cp1: Point,
    readonly cp2: Point,
    readonly p2: Point
  ) {}

  createPolyline(scaleFactor = 1) {
    const quads = this.toQuadratics(0.1);
    const points: Point[] = [];
    for (const quad of quads) {
      points.push(...quad.createPolyline(scaleFactor));
    }
    return points;
  }

  private lower() {
    return new QuadraticPathComponent(
      multiplyScalar(minus(this.cp1, this.p1), 3.0),
      multiplyScalar(minus(this.cp2, this.cp1), 3.0),
      multiplyScalar(minus(this.cp2, this.cp2), 3.0)
    );
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

  private toQuadratics(accuracy: number): QuadraticPathComponent[] {
    const quads: QuadraticPathComponent[] = [];
    // This magic number is the square of 36 / sqrt(3).
    // See: http://caffeineowl.com/graphics/2d/vectorial/cubic2quad01.html
    const maxHypot2 = 432.0 * accuracy * accuracy;
    const p1x2 = multiplyScalar(minus(this.cp1, this.p1), 3.0);
    const p2x2 = multiplyScalar(minus(this.cp2, this.p2), 3.0);
    const p = minus(p2x2, p1x2);
    const err = dot(p, p);
    const quadCount = Math.max(
      1,
      Math.ceil(Math.pow(err / maxHypot2, 1 / 6.0))
    );

    for (let i = 0; i < quadCount; i++) {
      const t0 = i / quadCount;
      const t1 = (i + 1) / quadCount;
      const seg = this.subsegment(t0, t1);
      const p1x22 = multiplyScalar(minus(seg.cp1, seg.p1), 3.0);
      const p2x22 = multiplyScalar(minus(seg.cp2, seg.p2), 3.0);
      quads.push(
        new QuadraticPathComponent(
          seg.p1,
          multiplyScalar(plus(p1x22, p2x22), 1 / 4.0),
          seg.p2
        )
      );
    }
    return quads;
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

  equals(p: CubicPathComponent): boolean {
    return (
      equals(this.p1, p.p1) &&
      equals(this.cp1, p.cp1) &&
      equals(this.cp2, p.cp2) &&
      equals(this.p2, p.p2)
    );
  }

  solve(t: number) {
    return vec(
      cubicSolve(t, this.p1[0], this.cp1[0], this.cp2[0], this.p2[0]),
      cubicSolve(t, this.p1[1], this.cp1[1], this.cp2[1], this.p2[1])
    );
  }
}

export class ContourComponent {
  constructor(public destination: Point, public isClosed = false) {}

  equals(p: ContourComponent) {
    return (
      equals(this.destination, p.destination) && p.isClosed === this.isClosed
    );
  }

  toCmd(shouldClose: boolean, shouldMove: boolean) {
    const cmd: number[] = [];
    if (shouldClose) {
      cmd.push(PathVerb.Close);
    }
    if (shouldMove) {
      cmd.push(...[PathVerb.Move, this.destination[0], this.destination[1]]);
    }
    return cmd;
  }
}
