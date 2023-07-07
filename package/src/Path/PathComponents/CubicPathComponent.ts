/* eslint-disable @typescript-eslint/no-shadow */
import type { Point } from "canvaskit-wasm";

import { PathVerb } from "../../Core";
import { minus, multiplyScalar, plus, vec } from "../../Vector";

import type { PathComponent } from "./PathComponent";
import type { Polyline } from "./Polyline";
import { QuadraticPathComponent } from "./QuadraticPathComponent";
import { Flatennable } from "./Flattenable";
import { PolylineContour } from "./PolylineContour";

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
    const quads = this.toQuadraticPathComponents(0.4);
    const polylines: Polyline[] = [];

    for (const quad of quads) {
      const polyline = quad.createPolyline(0.4);
      polylines.push(polyline);
    }

    if (polylines.length === 1) {
      return polylines[0];
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new PolylineContour(polylines) as any;
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
      const seg = this.subsegment(t0, t1);
      p1x2 = seg.cp1.map((_, i) => 3.0 * seg.cp1[i] - seg.p1[i]);
      p2x2 = seg.cp2.map((_, i) => 3.0 * seg.cp2[i] - seg.p2[i]);
      const middle = p1x2.map((_, i) => (p1x2[i] + p2x2[i]) / 4.0);
      quads.push(new QuadraticPathComponent(seg.p1, middle, seg.p2));
    }
    return quads;
  }

  segment(l0: number, l1: number) {
    const t0 = l0 / this.length();
    const t1 = l1 / this.length();
    return this.subsegment(t0, t1);
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
