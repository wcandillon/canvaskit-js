import type {
  Camera,
  InputRect,
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
  multiply: function (..._matrices: (number[] | Float32Array)[]): number[] {
    throw new Error("Function not implemented.");
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
  rotated: function (_axis: Vector3, _radians: number): number[] {
    throw new Error("Function not implemented.");
  },
  rotatedUnitSinCos: function (
    _axis: Vector3,
    _sinAngle: number,
    _cosAngle: number
  ): number[] {
    throw new Error("Function not implemented.");
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
