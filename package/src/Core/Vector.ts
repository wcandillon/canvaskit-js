import type {
  VectorN,
  VectorHelpers as CKVectorHelpers,
  Vector3,
  InputPoint,
} from "canvaskit-wasm";

export const nativePoint = (pt: InputPoint) => new DOMPoint(...pt);

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
