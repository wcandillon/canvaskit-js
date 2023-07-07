/* eslint-disable @typescript-eslint/no-shadow */
import type { Point } from "canvaskit-wasm";

import { PathVerb } from "../../Core";
import {
  dist,
  minus,
  multiplyScalar,
  normalize,
  plus,
  vec,
} from "../../Vector";
import { saturate } from "../../math";

import type { PathComponent } from "./PathComponent";
import { Polyline, linearSolve } from "./Polyline";
import { QuadraticPathComponent } from "./QuadraticPathComponent";
import { Flatennable } from "./Flattenable";

export class CubicPathComponent extends Flatennable implements PathComponent {
  constructor(
    readonly p1: Point,
    readonly cp1: Point,
    readonly cp2: Point,
    readonly p2: Point
  ) {
    super();
  }

  createPolyline() {
    const items = this.toQuadraticPathComponents(0.4).flatMap((quad) =>
      quad.fillPolyline()
    );
    const totalLength = items.reduce((acc, _, i) => {
      if (i === 0) {
        return 0;
      }
      return acc + dist(items[i - 1].point, items[i].point);
    }, 0);
    let offset = 0;
    for (let i = 0; i < items.length; i++) {
      if (i === 0) {
        items[0].t = 0;
        items[0].point = this.p1;
      } else if (i === items.length - 1) {
        items[i].t = 1;
        items[i].point = this.p2;
      } else {
        const prev = items[i - 1].point;
        const current = items[i].point;
        const nextOffset = saturate(offset + dist(prev, current) / totalLength);
        items[i].t = nextOffset;
        items[i].point = this.solve(items[i].t);
        offset = nextOffset;
      }
    }
    return new Polyline(items);
  }

  private toQuadraticPathComponents(accuracy: number) {
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
      const seg = this.subsegment(t0, t1);
      p1x2 = seg.cp1.map((_, i) => 3.0 * seg.cp1[i] - seg.p1[i]);
      p2x2 = seg.cp2.map((_, i) => 3.0 * seg.cp2[i] - seg.p2[i]);
      const middle = p1x2.map((_, i) => (p1x2[i] + p2x2[i]) / 4.0);
      quads.push(new QuadraticPathComponent(seg.p1, middle, seg.p2));
    }
    return quads;
  }

  private chop(t: number, side: "left" | "right") {
    const { p1: p0, cp1: p1, cp2: p2, p2: p3 } = this;

    const p01 = linearSolve(t, p0, p1);
    const p12 = linearSolve(t, p1, p2);
    const p23 = linearSolve(t, p2, p3);

    const p012 = linearSolve(t, p01, p12);
    const p123 = linearSolve(t, p12, p23);

    const p0123 = linearSolve(t, p012, p123);

    if (side === "left") {
      return new CubicPathComponent(p0, p01, p012, p0123);
    } else {
      return new CubicPathComponent(p0123, p123, p23, p3);
    }
  }

  segment(l0: number, l1: number) {
    const t0 = this.tAtLength(l1);
    const c1 = this.chop(t0, "left");
    const t1 = c1.tAtLength(l0);
    return c1.chop(t1, "right");
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

  solve(t: number) {
    return vec(
      cubicSolve(t, this.p1[0], this.cp1[0], this.cp2[0], this.p2[0]),
      cubicSolve(t, this.p1[1], this.cp1[1], this.cp2[1], this.p2[1])
    );
  }

  solveDerivative(t: number) {
    return normalize(
      vec(
        cubicSolveDerivative(
          t,
          this.p1[0],
          this.cp1[0],
          this.cp2[0],
          this.p2[0]
        ),
        cubicSolveDerivative(
          t,
          this.p1[1],
          this.cp1[1],
          this.cp2[1],
          this.p2[1]
        )
      )
    );
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

const cubicSolveDerivative = (
  t: number,
  p1: number,
  cp1: number,
  cp2: number,
  p2: number
) =>
  3 * (1 - t) * (1 - t) * (cp1 - p1) +
  6 * (1 - t) * t * (cp2 - cp1) +
  3 * t * t * (p2 - cp2);
