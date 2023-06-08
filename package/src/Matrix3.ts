/* eslint-disable prefer-destructuring */
import type {
  AngleInRadians,
  InputMatrix,
  Matrix3x3Helpers,
} from "canvaskit-wasm";

export type Matrix3x3 = number[];

export const project2d = (point: DOMPoint, matrix: DOMMatrix) => {
  const vector = new DOMPoint(point.x, point.y);
  const projected = vector.matrixTransform(matrix);
  return projected;
};

export const normalizeMatrix = (matrix: InputMatrix): Matrix3x3 => {
  if (Array.isArray(matrix)) {
    return matrix;
  } else if (matrix instanceof Float32Array) {
    return Array.from(matrix);
  } else if (matrix instanceof DOMMatrix) {
    return [
      matrix.m11,
      matrix.m12,
      matrix.m13,
      matrix.m21,
      matrix.m22,
      matrix.m23,
      matrix.m41,
      matrix.m42,
      matrix.m44,
    ];
  } else {
    return Array.from(matrix.toTypedArray());
  }
};

export const convert3x3ToDOMMatrix = (arr: number[]) => {
  const matrix = new DOMMatrix();

  matrix.m11 = arr[0];
  matrix.m12 = arr[1];
  matrix.m13 = arr[2];
  matrix.m21 = arr[3];
  matrix.m22 = arr[4];
  matrix.m23 = arr[5];
  matrix.m41 = arr[6];
  matrix.m42 = arr[7];
  matrix.m44 = arr[8];

  // Since this is a conversion back to a 4x4 matrix, we'll need to set the remaining elements
  // Assuming it's an affine transformation matrix, we can set m14, m24, m34 to 0, m33 to 1
  matrix.m14 = 0;
  matrix.m24 = 0;
  matrix.m34 = 0;
  matrix.m33 = 1;

  // m31, m32 and m43 should also be set as per requirement, defaulting them to 0
  matrix.m31 = 0;
  matrix.m32 = 0;
  matrix.m43 = 0;

  return matrix;
};

export const convertDOMMatrixTo3x3 = (matrix: DOMMatrix) => {
  return [
    matrix.m11,
    matrix.m12,
    matrix.m13,
    matrix.m21,
    matrix.m22,
    matrix.m23,
    matrix.m41,
    matrix.m42,
    matrix.m44,
  ];
};

export const transformPoint = (
  matrix: Matrix3x3,
  point: number[]
): number[] => {
  const x = matrix[0] * point[0] + matrix[1] * point[1] + matrix[2] * point[2];
  const y = matrix[3] * point[0] + matrix[4] * point[1] + matrix[5] * point[2];
  const w = matrix[6] * point[0] + matrix[7] * point[1] + matrix[8] * point[2];
  return [x / w, y / w];
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
