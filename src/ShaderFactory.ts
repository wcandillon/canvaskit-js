import type {
  ShaderFactory as CKShaderFactory,
  ColorSpace,
  EmbindEnumEntity,
  InputColor,
  InputFlexibleColorArray,
  InputMatrix,
  InputPoint,
  Shader,
} from "canvaskit-wasm";

import { NativeColor } from "./Values";
import { ColorShader } from "./Shader";

export const ShaderFactory: CKShaderFactory = {
  MakeBlend: function (
    _mode: EmbindEnumEntity,
    _one: Shader,
    _two: Shader
  ): Shader {
    throw new Error("Function not implemented.");
  },
  MakeColor: function (color: InputColor, _space: ColorSpace): Shader {
    return new ColorShader(NativeColor(color));
  },
  MakeFractalNoise: function (
    _baseFreqX: number,
    _baseFreqY: number,
    _octaves: number,
    _seed: number,
    _tileW: number,
    _tileH: number
  ): Shader {
    throw new Error("Function not implemented.");
  },
  MakeLinearGradient: function (
    _start: InputPoint,
    _end: InputPoint,
    _colors: InputFlexibleColorArray,
    _pos: number[] | null,
    _mode: EmbindEnumEntity,
    _localMatrix?: InputMatrix | undefined,
    _flags?: number | undefined,
    _colorSpace?: ColorSpace | undefined
  ): Shader {
    throw new Error("Function not implemented.");
  },
  MakeRadialGradient: function (
    _center: InputPoint,
    _radius: number,
    _colors: InputFlexibleColorArray,
    _pos: number[] | null,
    _mode: EmbindEnumEntity,
    _localMatrix?: InputMatrix | undefined,
    _flags?: number | undefined,
    _colorSpace?: ColorSpace | undefined
  ): Shader {
    throw new Error("Function not implemented.");
  },
  MakeSweepGradient: function (
    _cx: number,
    _cy: number,
    _colors: InputFlexibleColorArray,
    _pos: number[] | null,
    _mode: EmbindEnumEntity,
    _localMatrix?: InputMatrix | null | undefined,
    _flags?: number | undefined,
    _startAngle?: number | undefined,
    _endAngle?: number | undefined,
    _colorSpace?: ColorSpace | undefined
  ): Shader {
    throw new Error("Function not implemented.");
  },
  MakeTurbulence: function (
    _baseFreqX: number,
    _baseFreqY: number,
    _octaves: number,
    _seed: number,
    _tileW: number,
    _tileH: number
  ): Shader {
    throw new Error("Function not implemented.");
  },
  MakeTwoPointConicalGradient: function (
    _start: InputPoint,
    _startRadius: number,
    _end: InputPoint,
    _endRadius: number,
    _colors: InputFlexibleColorArray,
    _pos: number[] | null,
    _mode: EmbindEnumEntity,
    _localMatrix?: InputMatrix | undefined,
    _flags?: number | undefined,
    _colorSpace?: ColorSpace | undefined
  ): Shader {
    throw new Error("Function not implemented.");
  },
};
