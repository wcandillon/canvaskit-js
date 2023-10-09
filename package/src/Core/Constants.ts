import type {
  ColorSpace as CKColorSpace,
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
  TextAlignEnumValues,
  TextBaselineEnumValues,
  TextDirectionEnumValues,
  TextHeightBehaviorEnumValues,
  DecorationStyleEnumValues,
  AffinityEnumValues,
  ColorChannelEnumValues,
  PlaceholderAlignmentEnumValues,
  RectHeightStyleEnumValues,
  RectWidthStyleEnumValues,
} from "canvaskit-wasm";

import { HostObject } from "../HostObject";

export type InputColor = Exclude<CKInputColor, MallocObj>;

export const mapKeys = <T extends object>(obj: T) =>
  Object.keys(obj) as (keyof T)[];

const makeEnum = <T>(values: Record<Exclude<keyof T, "values">, number>): T => {
  const valueKeys = mapKeys(values)
    .filter((name) => typeof values[name] === "number")
    .map((name) => ({
      name,
      value: values[name],
    }));
  const result = Object.assign(
    {
      values: Object.assign(
        {},
        ...valueKeys.map(({ value }) => ({ [value]: { value } }))
      ),
    },
    ...valueKeys.map(({ name, value }) => ({ [name]: { value } }))
  );
  return result;
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

export class ColorSpaceJS
  extends HostObject<"ColorSpace">
  implements CKColorSpace
{
  __type__ = "ColorSpace" as const;

  constructor(public readonly value: "srgb" | "display-p3" | "adobe-rgb") {
    super("ColorSpace");
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

export const ColorSpace = new ColorSpaceEnumJS();

export enum AlphaTypeEnum {
  Opaque = 1,
  Premul = 2,
  Unpremul = 3,
}
export const AlphaType = makeEnum<AlphaTypeEnumValues>(AlphaTypeEnum);

export enum ColorTypeEnum {
  //Unknown = 0,
  Alpha_8 = 1,
  RGB_565 = 2,
  //ARGB_4444 = 3,
  RGBA_8888 = 4,
  //RGB_888x = 5,
  BGRA_8888 = 6,
  RGBA_1010102 = 7,
  //BGRA_1010102 = 8,
  RGB_101010x = 9,
  //BGR_101010x = 10,
  Gray_8 = 12,
  RGBA_F16 = 14,
  RGBA_F32 = 15,
  //R8G8_unorm = 16,
  //A16_float = 16,
  //R16G16_float = 17,
  //A16_unorm = 18,
  //R16G16_unorm = 19,
  //R16G16B16A16_unorm = 20,
  //SRGBA_8888 = 21,
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

export enum TextAlignEnum {
  Left,
  Right,
  Center,
  Justify,
  Start,
  End,
}

export const TextAlign = makeEnum<TextAlignEnumValues>(TextAlignEnum);

export enum TextBaselineEnum {
  Alphabetic,
  Ideographic,
}

export const TextBaseline = makeEnum<TextBaselineEnumValues>(TextBaselineEnum);

export enum TextDirectionEnum {
  RTL,
  LTR,
}

export const TextDirection =
  makeEnum<TextDirectionEnumValues>(TextDirectionEnum);

export enum TextHeightBehaviorEnum {
  All,
  DisableFirstAscent,
  DisableLastDescent,
  DisableAll,
}

export const TextHeightBehavior = makeEnum<TextHeightBehaviorEnumValues>(
  TextHeightBehaviorEnum
);

export enum DecorationStyleEnum {
  Solid,
  Double,
  Dotted,
  Dashed,
  Wavy,
}

export const DecorationStyle =
  makeEnum<DecorationStyleEnumValues>(DecorationStyleEnum);

export enum AffinityEnum {
  Upstream,
  Downstream,
}

export const Affinity = makeEnum<AffinityEnumValues>(AffinityEnum);

export enum ColorChannelEnum {
  Red,
  Green,
  Blue,
  Alpha,
}

export const ColorChannel = makeEnum<ColorChannelEnumValues>(ColorChannelEnum);

export enum PlaceholderAlignmentEnum {
  Baseline,
  AboveBaseline,
  BelowBaseline,
  Top,
  Bottom,
  Middle,
}

export const PlaceholderAlignment = makeEnum<PlaceholderAlignmentEnumValues>(
  PlaceholderAlignmentEnum
);

export enum RectHeightStyleEnum {
  Tight,
  Max,
  IncludeLineSpacingMiddle,
  IncludeLineSpacingTop,
  IncludeLineSpacingBottom,
  Strut,
}

export const RectHeightStyle =
  makeEnum<RectHeightStyleEnumValues>(RectHeightStyleEnum);

export enum RectWidthStyleEnum {
  Tight,
  Max,
}

export const RectWidthStyle =
  makeEnum<RectWidthStyleEnumValues>(RectWidthStyleEnum);
