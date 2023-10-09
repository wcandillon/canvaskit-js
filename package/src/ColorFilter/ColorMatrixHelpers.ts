import type { ColorMatrixHelpers as CKColorMatrixHelpers } from "canvaskit-wasm";

export const ColorMatrixHelpers: CKColorMatrixHelpers = {
  concat: function (_outer: Float32Array, _inner: Float32Array): Float32Array {
    throw new Error("Function not implemented.");
  },
  identity: function (): Float32Array {
    throw new Error("Function not implemented.");
  },
  postTranslate: function (
    _m: Float32Array,
    _dr: number,
    _dg: number,
    _db: number,
    _da: number
  ): Float32Array {
    throw new Error("Function not implemented.");
  },
  rotated: function (
    _axis: number,
    _sine: number,
    _cosine: number
  ): Float32Array {
    throw new Error("Function not implemented.");
  },
  scaled: function (
    _redScale: number,
    _greenScale: number,
    _blueScale: number,
    _alphaScale: number
  ): Float32Array {
    throw new Error("Function not implemented.");
  },
};
