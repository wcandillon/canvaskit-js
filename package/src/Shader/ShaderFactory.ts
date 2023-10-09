import type {
  BlendMode,
  ShaderFactory as CKShaderFactory,
  ColorSpace,
  EmbindEnumEntity,
  InputColor,
  InputFlexibleColorArray,
  InputMatrix,
  InputPoint,
  Shader,
} from "canvaskit-wasm";

import { nativeColor } from "../Core";

import { ColorShader } from "./ColorShader";
import { BlendShader } from "./BlendShader";
import type { ShaderJS } from "./Shader";
import {
  LinearGradient,
  SweepGradient,
  TwoPointConicalGradient,
} from "./Gradients";

export const ShaderFactory: CKShaderFactory = {
  MakeBlend: function (mode: BlendMode, one: ShaderJS, two: ShaderJS): Shader {
    return new BlendShader(mode, one, two);
  },
  MakeColor: function (color: InputColor, _space: ColorSpace): Shader {
    return new ColorShader(nativeColor(color));
  },
  MakeFractalNoise: function (
    _baseFreqX: number,
    _baseFreqY: number,
    _octaves: number,
    _seed: number,
    _tileW: number,
    _tileH: number
  ): Shader {
    throw new Error("Not implemented");
  },
  MakeLinearGradient: function (
    start: InputPoint,
    end: InputPoint,
    colors: InputFlexibleColorArray,
    pos: number[] | null,
    _mode: EmbindEnumEntity,
    _localMatrix?: InputMatrix | undefined,
    _flags?: number | undefined,
    _colorSpace?: ColorSpace | undefined
  ): Shader {
    return new LinearGradient(start, end, colors, pos);
  },
  MakeRadialGradient: function (
    center: InputPoint,
    radius: number,
    colors: InputFlexibleColorArray,
    pos: number[] | null,
    _mode: EmbindEnumEntity,
    _localMatrix?: InputMatrix | undefined,
    _flags?: number | undefined,
    _colorSpace?: ColorSpace | undefined
  ): Shader {
    return new TwoPointConicalGradient(center, 0, center, radius, colors, pos);
  },
  MakeSweepGradient: function (
    cx: number,
    cy: number,
    colors: InputFlexibleColorArray,
    pos: number[] | null,
    _mode: EmbindEnumEntity,
    _localMatrix?: InputMatrix | null | undefined,
    _flags?: number | undefined,
    startAngle?: number | undefined,
    _endAngle?: number | undefined,
    _colorSpace?: ColorSpace | undefined
  ): Shader {
    return new SweepGradient(
      Float32Array.of(cx, cy),
      startAngle ?? 0,
      colors,
      pos
    );
  },
  MakeTurbulence: function (
    _baseFreqX: number,
    _baseFreqY: number,
    _octaves: number,
    _seed: number,
    _tileW: number,
    _tileH: number
  ): Shader {
    throw new Error("Not implemented");
  },
  MakeTwoPointConicalGradient: function (
    start: InputPoint,
    startRadius: number,
    end: InputPoint,
    endRadius: number,
    colors: InputFlexibleColorArray,
    pos: number[] | null,
    _mode: EmbindEnumEntity,
    _localMatrix?: InputMatrix | undefined,
    _flags?: number | undefined,
    _colorSpace?: ColorSpace | undefined
  ): Shader {
    return new TwoPointConicalGradient(
      start,
      startRadius,
      end,
      endRadius,
      colors,
      pos
    );
  },
};
