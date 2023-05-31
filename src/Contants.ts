import type {
  StrokeCapEnumValues,
  MallocObj,
  InputColor as CKInputColor,
  StrokeJoinEnumValues,
  PaintStyleEnumValues,
  BlendModeEnumValues,
  TileModeEnumValues,
  FontWeightEnumValues,
  FontWidthEnumValues,
  FontSlantEnumValues,
  FontEdgingEnumValues,
  FontHintingEnumValues,
  PointModeEnumValues,
  AlphaTypeEnumValues,
  ColorTypeEnumValues,
  FilterModeEnumValues,
  MipmapModeEnumValues,
  ImageFormatEnumValues,
  PathOpEnumValues,
  FillTypeEnumValues,
  Path1DEffectStyleEnumValues,
  BlurStyleEnumValues,
  VertexModeEnumValues,
  ClipOpEnumValues,
  ColorSpaceEnumValues,
  ColorSpace,
} from "canvaskit-wasm";

import { HostObject } from "./HostObject";

export type InputColor = Exclude<CKInputColor, MallocObj>;

export const mapKeys = <T extends object>(obj: T) =>
  Object.keys(obj) as (keyof T)[];

const makeEnum = <T>(values: Record<Exclude<keyof T, "values">, number>): T => {
  const vals = Object.values(values).filter(
    (v) => typeof v !== "number"
  ) as (keyof T)[];
  return Object.assign(
    {
      values: vals,
    },
    ...mapKeys(values)
      .slice(vals.length)
      .map((k) => ({ [k]: { value: values[k] } }))
  );
};

export enum StrokeCapEnum {
  Butt,
  Round,
  Square,
}
export const StrokeCap = makeEnum<StrokeCapEnumValues>(StrokeCapEnum);

export enum StrokeJoinEnum {
  Miter,
  Round,
  Bevel,
}
export const StrokeJoin = makeEnum<StrokeJoinEnumValues>(StrokeJoinEnum);

export enum PaintStyleEnum {
  Fill,
  Stroke,
}
export const PaintStyle = makeEnum<PaintStyleEnumValues>(PaintStyleEnum);

export enum BlendModeEnum {
  Clear,
  Src,
  Dst,
  SrcOver,
  DstOver,
  SrcIn,
  DstIn,
  SrcOut,
  DstOut,
  SrcATop,
  DstATop,
  Xor,
  Plus,
  Modulate,
  Screen,
  Overlay,
  Darken,
  Lighten,
  ColorDodge,
  ColorBurn,
  HardLight,
  SoftLight,
  Difference,
  Exclusion,
  Multiply,
  Hue,
  Saturation,
  Color,
  Luminosity,
}
export const BlendMode = makeEnum<BlendModeEnumValues>(BlendModeEnum);

export enum TileModeEnum {
  Clamp,
  Repeat,
  Mirror,
  Decal,
}
export const TileMode = makeEnum<TileModeEnumValues>(TileModeEnum);

export enum FontWeightEnum {
  Invisible = 0,
  Thin = 100,
  ExtraLight = 200,
  Light = 300,
  Normal = 400,
  Medium = 500,
  SemiBold = 600,
  Bold = 700,
  ExtraBold = 800,
  Black = 900,
  ExtraBlack = 1000,
}
export const FontWeight = makeEnum<FontWeightEnumValues>(FontWeightEnum);

export enum FontWidthEnum {
  UltraCondensed = 1,
  ExtraCondensed = 2,
  Condensed = 3,
  SemiCondensed = 4,
  Normal = 5,
  SemiExpanded = 6,
  Expanded = 7,
  ExtraExpanded = 8,
  UltraExpanded = 9,
}
export const FontWidth = makeEnum<FontWidthEnumValues>(FontWidthEnum);

export enum FontSlantEnum {
  Upright,
  Italic,
  Oblique,
}
export const FontSlant = makeEnum<FontSlantEnumValues>(FontSlantEnum);

export enum FontEdgingEnum {
  Alias,
  AntiAlias,
  SubpixelAntiAlias,
}
export const FontEdging = makeEnum<FontEdgingEnumValues>(FontEdgingEnum);

export enum FontHintingEnum {
  None,
  Slight,
  Normal,
  Full,
}
export const FontHinting = makeEnum<FontHintingEnumValues>(FontHintingEnum);

export enum PointModeEnum {
  Points,
  Lines,
  Polygon,
}
export const PointMode = makeEnum<PointModeEnumValues>(PointModeEnum);

export class ColorSpaceJS extends HostObject<ColorSpace> implements ColorSpace {
  constructor(public readonly value: "srgb" | "display-p3" | "adobe-rgb") {
    super();
  }

  getNativeValue() {
    if (this.value === "adobe-rgb") {
      console.warn(
        "adobe_rgb is not supported on the web, falling back to srgb"
      );
      return "srgb";
    } else {
      return this.value;
    }
  }
}

export class ColorSpaceEnumJS implements ColorSpaceEnumValues {
  SRGB = new ColorSpaceJS("srgb");
  DISPLAY_P3 = new ColorSpaceJS("display-p3");
  ADOBE_RGB = new ColorSpaceJS("adobe-rgb");
  Equals(a: ColorSpaceJS, b: ColorSpaceJS): boolean {
    return a.value === b.value;
  }
}

export enum AlphaTypeEnum {
  Unknown,
  Opaque,
  Premul,
  Unpremul,
}
export const AlphaType = makeEnum<AlphaTypeEnumValues>(AlphaTypeEnum);

export enum ColorTypeEnum {
  Unknown,
  Alpha_8,
  RGB_565,
  ARGB_4444,
  RGBA_8888,
  RGB_888x,
  BGRA_8888,
  RGBA_1010102,
  BGRA_1010102,
  RGB_101010x,
  BGR_101010x,
  Gray_8,
  RGBA_F16Norm,
  RGBA_F16,
  RGBA_F32,
  R8G8_unorm,
  A16_float,
  R16G16_float,
  A16_unorm,
  R16G16_unorm,
  R16G16B16A16_unorm,
  SRGBA_8888,
}
export const ColorType = makeEnum<ColorTypeEnumValues>(ColorTypeEnum);

export enum FilterModeEnum {
  Nearest,
  Linear,
}
export const FilterMode = makeEnum<FilterModeEnumValues>(FilterModeEnum);

export enum MipmapModeEnum {
  None,
  Nearest,
  Linear,
}
export const MipmapMode = makeEnum<MipmapModeEnumValues>(MipmapModeEnum);

export enum ImageFormatEnum {
  JPEG = 3,
  PNG = 4,
  WEBP = 6,
}
export const ImageFormat = makeEnum<ImageFormatEnumValues>(ImageFormatEnum);

export enum PathOpEnum {
  Difference,
  Intersect,
  Union,
  XOR,
  ReverseDifference,
}

export const PathOp = makeEnum<PathOpEnumValues>(PathOpEnum);

export enum FillTypeEnum {
  Winding,
  EvenOdd,
  InverseWinding,
  InverseEvenOdd,
}
export const FillType = makeEnum<FillTypeEnumValues>(FillTypeEnum);

export enum PathVerb {
  Move,
  Line,
  Quad,
  Conic,
  Cubic,
  Close,
}

export enum Path1DEffectStyleEnum {
  Translate,
  Rotate,
  Morph,
}
export const Path1DEffectStyle = makeEnum<Path1DEffectStyleEnumValues>(
  Path1DEffectStyleEnum
);

export enum BlurStyleEnum {
  Normal,
  Solid,
  Outer,
  Inner,
}
export const BlurStyle = makeEnum<BlurStyleEnumValues>(BlurStyleEnum);

export enum VertexModeEnum {
  Triangles,
  TrianglesStrip,
  TriangleFan,
}
export const VertexMode = makeEnum<VertexModeEnumValues>(VertexModeEnum);

export enum ClipOpEnum {
  Difference,
  Intersect,
}
export const ClipOp = makeEnum<ClipOpEnumValues>(ClipOpEnum);
