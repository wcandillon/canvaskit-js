import type {
  Camera,
  InputRect,
  Matrix4x4,
  Matrix4x4Helpers,
  Vector3,
} from "canvaskit-wasm";

export const Matrix4: Matrix4x4Helpers = {
  identity: function (): number[] {
    return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  },
  invert: function (_matrix: number[] | Float32Array): number[] | null {
    throw new Error("Function not implemented.");
  },
  lookat: function (
    _eyeVec: Vector3,
    _centerVec: Vector3,
    _upVec: Vector3
  ): number[] {
    throw new Error("Function not implemented.");
  },
  multiply: function (...matrices: Matrix4x4[]): number[] {
    let result = this.identity();
    for (const m of matrices) {
      const temp = this.identity();
      for (let i = 0; i < 4; ++i) {
        for (let j = 0; j < 4; ++j) {
          temp[i * 4 + j] = 0;
          for (let k = 0; k < 4; ++k) {
            temp[i * 4 + j] += result[i * 4 + k] * m[k * 4 + j];
          }
        }
      }
      result = temp;
    }
    return result;
  },
  mustInvert: function (_matrix: number[] | Float32Array): number[] {
    throw new Error("Function not implemented.");
  },
  perspective: function (
    _near: number,
    _far: number,
    _radians: number
  ): number[] {
    throw new Error("Function not implemented.");
  },
  rc: function (
    _matrix: number[] | Float32Array,
    _row: number,
    _col: number
  ): number {
    throw new Error("Function not implemented.");
  },
  rotated: function (_axisVec: Vector3, _radians: number): number[] {
    throw new Error("Function not implemented.");
  },
  rotatedUnitSinCos: function (
    axisVec: Vector3,
    sinAngle: number,
    cosAngle: number
  ): number[] {
    const x = axisVec[0];
    const y = axisVec[1];
    const z = axisVec[2];
    const c = cosAngle;
    const s = sinAngle;
    const t = 1 - c;
    return [
      t * x * x + c,
      t * x * y - s * z,
      t * x * z + s * y,
      0,
      t * x * y + s * z,
      t * y * y + c,
      t * y * z - s * x,
      0,
      t * x * z - s * y,
      t * y * z + s * x,
      t * z * z + c,
      0,
      0,
      0,
      0,
      1,
    ];
  },
  scaled: function (_vec: Vector3): number[] {
    throw new Error("Function not implemented.");
  },
  setupCamera: function (
    _area: InputRect,
    _zScale: number,
    _cam: Camera
  ): number[] {
    throw new Error("Function not implemented.");
  },
  translated: function (_vec: Vector3): number[] {
    throw new Error("Function not implemented.");
  },
  transpose: function (_matrix: number[] | Float32Array): number[] {
    throw new Error("Function not implemented.");
  },
};
