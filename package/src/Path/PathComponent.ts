import type { Point } from "canvaskit-wasm";

import { equals, vec } from "../Vector";
import { PathVerb } from "../Core";

import {
  getQuadraticArcLength,
  quadraticSolve,
} from "./Geometry/QuadraticBezier";
import { cubicSolve, getCubicArcLength } from "./Geometry/CubicBezier";
import { linearSolve, linearSolve2 } from "./Geometry/Linear";

export interface PathComponent {
  p1: Point;
  toCmd(): number[];
  toSVGString(): string;
  getSegment(start: number, stop: number): PathComponent;
  equals(component: this): boolean;
  getPointAtLength(t: number): Point;
  length(t?: number): number;
}

export class LinearPathComponent implements PathComponent {
  constructor(readonly p1: Point, readonly p2: Point) {}

  getSegment(start: number, stop: number): PathComponent {
    const length = this.length();
    return new LinearPathComponent(
      this.getPointAtLength(start / length),
      this.getPointAtLength(stop / length)
    );
  }

  toCmd() {
    return [PathVerb.Line, this.p2[0], this.p2[1]];
  }

  toSVGString() {
    return `L${this.p2[0]} ${this.p2[1]}`;
  }

  getPointAtLength(t: number): Point {
    return vec(
      linearSolve(t, this.p1[0], this.p2[1]),
      linearSolve(t, this.p1[0], this.p2[1])
    );
  }

  length(t = 1) {
    return t * Math.hypot(this.p2[0] - this.p1[0], this.p2[1] - this.p1[1]);
  }

  equals(p: LinearPathComponent): boolean {
    return equals(this.p1, p.p1) && equals(this.p2, p.p2);
  }
}

export class QuadraticPathComponent implements PathComponent {
  constructor(readonly p1: Point, readonly cp: Point, readonly p2: Point) {}

  getSegment(start: number, stop: number): PathComponent {
    const t0 = start / this.length();
    const t1 = stop / this.length();

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

  getPointAtLength(t: number): Point {
    return vec(
      quadraticSolve(t, this.p1[0], this.cp[0], this.p2[1]),
      quadraticSolve(t, this.p1[0], this.cp[1], this.p2[1])
    );
  }

  equals(p: QuadraticPathComponent) {
    return (
      equals(this.p1, p.p1) && equals(this.cp, p.cp) && equals(this.p2, p.p2)
    );
  }
}

export class CubicPathComponent implements PathComponent {
  constructor(
    readonly p1: Point,
    readonly cp1: Point,
    readonly cp2: Point,
    readonly p2: Point
  ) {}

  length(t = 1) {
    return getCubicArcLength(this.p1, this.cp1, this.cp2, this.p2, t);
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

  equals(p: CubicPathComponent): boolean {
    return (
      equals(this.p1, p.p1) &&
      equals(this.cp1, p.cp1) &&
      equals(this.cp2, p.cp2) &&
      equals(this.p2, p.p2)
    );
  }

  getPointAtLength(t: number) {
    return vec(
      cubicSolve(t, this.p1[0], this.cp1[0], this.cp2[0], this.p2[0]),
      cubicSolve(t, this.p1[1], this.cp1[1], this.cp2[1], this.p2[1])
    );
  }

  getSegment(start: number, stop: number): PathComponent {
    const t0 = start / this.length();
    const t1 = stop / this.length();

    // First cut at t0
    const p01 = linearSolve2(t0, this.p1, this.cp1);
    const p12 = linearSolve2(t0, this.cp1, this.cp2);
    const p23 = linearSolve2(t0, this.cp2, this.p2);
    const p02 = linearSolve2(t0, p01, p12);
    const p13 = linearSolve2(t0, p12, p23);
    const p03 = linearSolve2(t0, p02, p13);

    // Scale t1 to the new curve (from 0 to t0)
    const t1Scaled = (t1 - t0) / (1 - t0);

    // Second cut at t1Scaled
    const p01_ = linearSolve2(t1Scaled, p01, p12);
    const p12_ = linearSolve2(t1Scaled, p12, p23);
    const p23_ = linearSolve2(t1Scaled, p13, this.p2);
    const p02_ = linearSolve2(t1Scaled, p01_, p12_);
    const p13_ = linearSolve2(t1Scaled, p12_, p23_);
    const p03_ = linearSolve2(t1Scaled, p02_, p13_);

    // The segment is from p03 to p03_
    return new CubicPathComponent(p03, p01_, p02_, p03_);
  }
}
