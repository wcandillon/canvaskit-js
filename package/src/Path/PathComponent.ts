import type { Point } from "canvaskit-wasm";

import { equals, minus, normalize, vec } from "../Vector";
import { PathVerb } from "../Core";

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
  toSVGString(): string;
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

  toSVGString() {
    return `L${this.p2[0]} ${this.p2[1]}`;
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

  equals(p: QuadraticPathComponent) {
    return (
      equals(this.p1, p.p1) && equals(this.cp, p.cp) && equals(this.p2, p.p2)
    );
  }

  toSVGString() {
    return `Q${this.cp[0]} ${this.cp[1]}, ${this.p2[0]} ${this.p2[1]}`;
  }
}

export class CubicPathComponent implements PathComponent<CubicPathComponent> {
  constructor(
    readonly p1: Point,
    readonly cp1: Point,
    readonly cp2: Point,
    readonly p2: Point
  ) {}

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

  toSVGString() {
    return `C${this.cp1[0]} ${this.cp1[1]}, ${this.cp2[0]} ${this.cp2[1]}, ${this.p2[0]} ${this.p2[1]}`;
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

  toSVGString(shouldClose: boolean, shouldMove: boolean) {
    let cmd = "";
    if (shouldClose) {
      cmd += "Z";
    }
    if (shouldMove) {
      cmd += `${cmd.length > 0 ? " " : ""}M${this.destination[0]} ${
        this.destination[1]
      }`;
    }
    return cmd;
  }
}
