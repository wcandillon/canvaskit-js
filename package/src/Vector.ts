import type {
  VectorHelpers as CKVectorHelpers,
  Point,
  Vector3,
  VectorN,
} from "canvaskit-wasm";

export const vec = (x = 0, y = 0): Point => Float32Array.of(x, y);

// TODO: merge with VectorHelpers
export const dist = (p1: Point, p2: Point) =>
  Math.hypot(p2[0] - p1[0], p2[1] - p1[1]);

export const equals = (p1: Point, p2: Point): boolean =>
  p1[0] === p2[0] && p1[1] === p2[1];

export const plus = (p1: Point, p2: Point): Point =>
  vec(p1[0] + p2[0], p1[1] + p2[1]);

export const minus = (p1: Point, p2: Point): Point =>
  vec(p1[0] - p2[0], p1[1] - p2[1]);

export const multiply = (p1: Point, p2: Point): Point =>
  vec(p1[0] * p2[0], p1[1] * p2[1]);

export const divide = (p1: Point, p2: Point): Point =>
  vec(p1[0] / p2[0], p1[1] / p2[1]);

export const multiplyScalar = (p: Point, scale: number): Point =>
  vec(p[0] * scale, p[1] * scale);

export const divideScalar = (p: Point, d: number): Point =>
  vec(p[0] / d, p[1] / d);

export const negate = (p: Point): Point => vec(-p[0], -p[1]);

export const dot = (p1: Point, p2: Point): number =>
  p1[0] * p2[0] + p1[1] * p2[1];

export const cross = (p1: Point, p2: Point): number =>
  p1[0] * p2[1] - p1[1] * p2[0];

export const magnitude = (p: Point): number =>
  Math.sqrt(p[0] * p[0] + p[1] * p[1]);

export const normalize = (p: Point): Point => {
  const m = magnitude(p);
  return vec(p[0] / m, p[1] / m);
};

export const angleTo = (p1: Point, p2: Point) =>
  Math.atan2(p2[1] - p1[1], p2[0] - p1[0]);

export const VectorHelpers: CKVectorHelpers = {
  add: function (a: VectorN, b: VectorN): VectorN {
    return a.map(function (v, i) {
      return v + b[i];
    });
  },
  cross: function (a: Vector3, b: Vector3): Vector3 {
    return [
      a[1] * b[2] - a[2] * b[1],
      a[2] * b[0] - a[0] * b[2],
      a[0] * b[1] - a[1] * b[0],
    ];
  },
  dist: function (a: VectorN, b: VectorN): number {
    return this.length(this.sub(a, b));
  },
  dot: function (a: VectorN, b: VectorN): number {
    return a
      .map(function (v, i) {
        return v * b[i];
      })
      .reduce(function (acc, cur) {
        return acc + cur;
      });
  },
  length: function (v: VectorN): number {
    return Math.sqrt(this.lengthSquared(v));
  },
  lengthSquared: function (v: VectorN) {
    return this.dot(v, v);
  },
  mulScalar: (v: VectorN, s: number) => v.map((i) => i * s),
  normalize: function (v: VectorN) {
    return this.mulScalar(v, 1 / this.length(v));
  },
  sub: (a: VectorN, b: VectorN) => a.map((v, i) => v - b[i]),
};
