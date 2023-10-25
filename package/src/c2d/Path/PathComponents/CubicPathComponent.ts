import { dist, minus, multiplyScalar, normalize, plus } from "../Vector";
import { saturate } from "../../Math";

import { PathComponentType, type PathComponent } from "./PathComponent";
import { Polyline, linearSolve } from "./Polyline";
import { QuadraticPathComponent } from "./QuadraticPathComponent";
import { Flatennable } from "./Flattenable";
import { PathVerb } from "./PathVerb";

export class CubicPathComponent extends Flatennable implements PathComponent {
  type = PathComponentType.Cubic;

  constructor(
    readonly p1: DOMPoint,
    readonly cp1: DOMPoint,
    readonly cp2: DOMPoint,
    readonly p2: DOMPoint
  ) {
    super();
  }

  // alternative implementation https://gist.github.com/wcandillon/c6df05d80e036d19ad25456555912b62
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

    const p1x2 = new DOMPoint(
      3.0 * this.cp1.x - this.p1.x,
      3.0 * this.cp1.y - this.p1.y
    );
    const p2x2 = new DOMPoint(
      3.0 * this.cp2.x - this.p2.x,
      3.0 * this.cp2.y - this.p2.y
    );

    const p = new DOMPoint(p2x2.x - p1x2.x, p2x2.y - p1x2.y);
    const err = p.x * p.x + p.y * p.y;

    const quadCount = Math.max(
      1,
      Math.ceil(Math.pow(err / maxHypot2, 1 / 6.0))
    );

    for (let i = 0; i < quadCount; i++) {
      const t0 = i / quadCount;
      const t1 = (i + 1) / quadCount;
      const seg = this.subsegment(t0, t1);

      const segP1x2 = new DOMPoint(
        3.0 * seg.cp1.x - seg.p1.x,
        3.0 * seg.cp1.y - seg.p1.y
      );
      const segP2x2 = new DOMPoint(
        3.0 * seg.cp2.x - seg.p2.x,
        3.0 * seg.cp2.y - seg.p2.y
      );

      const middle = new DOMPoint(
        (segP1x2.x + segP2x2.x) / 4.0,
        (segP1x2.y + segP2x2.y) / 4.0
      );

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
    return `C${this.cp1.x} ${this.cp1.y} ${this.cp2.x} ${this.cp2.y} ${this.p2.x} ${this.p2.y}`;
  }

  toCmd() {
    return [
      PathVerb.Cubic,
      this.cp1.x,
      this.cp1.y,
      this.cp2.x,
      this.cp2.y,
      this.p2.x,
      this.p2.y,
    ];
  }

  solve(t: number) {
    return new DOMPoint(
      cubicSolve(t, this.p1.x, this.cp1.x, this.cp2.x, this.p2.x),
      cubicSolve(t, this.p1.y, this.cp1.y, this.cp2.y, this.p2.y)
    );
  }

  solveDerivative(t: number) {
    return normalize(
      new DOMPoint(
        cubicSolveDerivative(t, this.p1.x, this.cp1.x, this.cp2.x, this.p2.x),
        cubicSolveDerivative(t, this.p1.y, this.cp1.y, this.cp2.y, this.p2.y)
      )
    );
  }

  computeTightBounds() {
    return this.polyline.computeTightBounds();
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
