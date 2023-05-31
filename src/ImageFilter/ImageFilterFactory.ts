import type {
  ImageFilterFactory as CKImageFilterFactory,
  ColorFilter,
  CubicResampler,
  EmbindEnumEntity,
  FilterOptions,
  Image,
  ImageFilter,
  InputMatrix,
  Shader,
} from "canvaskit-wasm";

import { BlurImageFilter } from "./BlurImageFilter";

export const ImageFilterFactory: CKImageFilterFactory = {
  MakeBlend: function (
    _blend: EmbindEnumEntity,
    _background: ImageFilter | null,
    _foreground: ImageFilter | null
  ): ImageFilter {
    throw new Error("Function not implemented.");
  },
  MakeBlur: function (
    sigmaX: number,
    _sigmaY: number,
    _mode: EmbindEnumEntity,
    _input: ImageFilter | null
  ): ImageFilter {
    return new BlurImageFilter(sigmaX);
  },
  MakeColorFilter: function (
    _cf: ColorFilter,
    _input: ImageFilter | null
  ): ImageFilter {
    throw new Error("Function not implemented.");
  },
  MakeCompose: function (
    _outer: ImageFilter | null,
    _inner: ImageFilter | null
  ): ImageFilter {
    throw new Error("Function not implemented.");
  },
  MakeDilate: function (
    _radiusX: number,
    _radiusY: number,
    _input: ImageFilter | null
  ): ImageFilter {
    throw new Error("Function not implemented.");
  },
  MakeDisplacementMap: function (
    _xChannel: EmbindEnumEntity,
    _yChannel: EmbindEnumEntity,
    _scale: number,
    _displacement: ImageFilter | null,
    _color: ImageFilter | null
  ): ImageFilter {
    throw new Error("Function not implemented.");
  },
  MakeDropShadow: function (
    _dx: number,
    _dy: number,
    _sigmaX: number,
    _sigmaY: number,
    _color: Float32Array,
    _input: ImageFilter | null
  ): ImageFilter {
    throw new Error("Function not implemented.");
  },
  MakeDropShadowOnly: function (
    _dx: number,
    _dy: number,
    _sigmaX: number,
    _sigmaY: number,
    _color: Float32Array,
    _input: ImageFilter | null
  ): ImageFilter {
    throw new Error("Function not implemented.");
  },
  MakeErode: function (
    _radiusX: number,
    _radiusY: number,
    _input: ImageFilter | null
  ): ImageFilter {
    throw new Error("Function not implemented.");
  },
  MakeImage: function (
    _img: Image,
    _sampling: CubicResampler | FilterOptions
  ): ImageFilter | null {
    throw new Error("Function not implemented.");
  },
  MakeMatrixTransform: function (
    _matr: InputMatrix,
    _sampling: CubicResampler | FilterOptions,
    _input: ImageFilter | null
  ): ImageFilter {
    throw new Error("Function not implemented.");
  },
  MakeOffset: function (
    _dx: number,
    _dy: number,
    _input: ImageFilter | null
  ): ImageFilter {
    throw new Error("Function not implemented.");
  },
  MakeShader: function (_shader: Shader): ImageFilter {
    throw new Error("Function not implemented.");
  },
};
