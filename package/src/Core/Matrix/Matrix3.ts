import type {
  AngleInRadians,
  InputMatrix,
  Matrix3x3Helpers,
} from "canvaskit-wasm";

import { normalizeArray } from "../Values";

export type Matrix3x3 = number[];

const toDOMMatrix3x2 = (m3: Float32Array) => {
  const m = new DOMMatrix();
  m.a = m3[0];
  m.b = m3[3];
  m.c = m3[1];
  m.d = m3[4];
  m.e = m3[2];
  m.f = m3[5];
  return m;
};

const toDOMMatrix3 = (m3: Float32Array) => {
  const m = new DOMMatrix();
  m.m11 = m3[0];
  m.m21 = m3[1];
  m.m41 = m3[2];
  m.m12 = m3[3];
  m.m22 = m3[4];
  m.m42 = m3[5];
  m.m14 = m3[6];
  m.m24 = m3[7];
  m.m44 = m3[8];
  return m;
};

const toDOMMatrix4 = (m3: Float32Array) => {
  const m = new DOMMatrix();
  m.m11 = m3[0];
  m.m21 = m3[1];
  m.m31 = m3[2];
  m.m41 = m3[3];

  m.m12 = m3[4];
  m.m22 = m3[5];
  m.m32 = m3[6];
  m.m42 = m3[7];

  m.m13 = m3[8];
  m.m23 = m3[9];
  m.m33 = m3[10];
  m.m43 = m3[11];

  m.m14 = m3[12];
  m.m24 = m3[13];
  m.m34 = m3[14];
  m.m44 = m3[15];
  return m;
};

export const nativeMatrix = (matrix: InputMatrix) => {
  if (matrix instanceof DOMMatrix) {
    return matrix;
  }
  const m3 = normalizeArray(matrix);
  if (m3.length === 6) {
    return toDOMMatrix3x2(m3);
  } else if (m3.length === 9) {
    return toDOMMatrix3(m3);
  } else if (m3.length === 16) {
    return toDOMMatrix4(m3);
  }
  throw new Error("Invalid matrix");
};

export const transformPoint = (matrix: Matrix3x3, ...point: number[]) => {
  const x = matrix[0] * point[0] + matrix[1] * point[1] + matrix[2] * 1;
  const y = matrix[3] * point[0] + matrix[4] * point[1] + matrix[5] * 1;
  const w = matrix[6] * point[0] + matrix[7] * point[1] + matrix[8] * 1;
  return new DOMPoint(x / w, y / w);
};

export const Matrix3: Matrix3x3Helpers = {
  identity(): Matrix3x3 {
    return [1, 0, 0, 0, 1, 0, 0, 0, 1];
  },

  invert(m: Matrix3x3): Matrix3x3 | null {
    const [a, b, c, d, e, f, g, h, i] = m;
    const det = a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g);
    if (det === 0) {
      return null;
    }
    return [
      (e * i - f * h) / det,
      (c * h - b * i) / det,
      (b * f - c * e) / det,
      (f * g - d * i) / det,
      (a * i - c * g) / det,
      (c * d - a * f) / det,
      (d * h - e * g) / det,
      (b * g - a * h) / det,
      (a * e - b * d) / det,
    ];
  },

  mapPoints(m: Matrix3x3, points: number[]): number[] {
    const [a, b, c, d, e, f] = m;
    for (let j = 0; j < points.length; j += 2) {
      const x = points[j],
        y = points[j + 1];
      points[j] = a * x + b * y + c;
      points[j + 1] = d * x + e * y + f;
    }
    return points;
  },

  multiply(...matrices: Array<Matrix3x3>): Matrix3x3 {
    let result = this.identity();
    for (const m of matrices) {
      const temp = this.identity();
      for (let i = 0; i < 3; ++i) {
        for (let j = 0; j < 3; ++j) {
          temp[i * 3 + j] = 0;
          for (let k = 0; k < 3; ++k) {
            temp[i * 3 + j] += result[i * 3 + k] * m[k * 3 + j];
          }
        }
      }
      result = temp;
    }
    return result;
  },

  rotated(radians: AngleInRadians, px = 0, py = 0): Matrix3x3 {
    const c = Math.cos(radians);
    const s = Math.sin(radians);
    return [c, -s, px * (1 - c) + py * s, s, c, py * (1 - c) - px * s, 0, 0, 1];
  },

  scaled(sx: number, sy: number, px = 0, py = 0): Matrix3x3 {
    return [sx, 0, px * (1 - sx), 0, sy, py * (1 - sy), 0, 0, 1];
  },

  skewed(kx: number, ky: number, px = 0, py = 0): Matrix3x3 {
    return [1, kx, -px * kx, ky, 1, -py * ky, 0, 0, 1];
  },

  translated(dx: number, dy: number): Matrix3x3 {
    return [1, 0, dx, 0, 1, dy, 0, 0, 1];
  },
};
