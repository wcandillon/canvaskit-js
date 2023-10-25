/* eslint-disable no-bitwise */
/* eslint-disable camelcase */
import type { Color, InputRect } from "canvaskit-wasm";

import { Matrix3, Matrix4 } from "./Matrix";
import {
  color,
  color4f,
  colorAsInt,
  getColorComponents,
  multiplyByAlpha,
} from "./Color";
import { ltrbRect, ltrbiRect, rrectXY, xywhRect, xywhiRect } from "./Rect";
import {
  Affinity,
  AlphaType,
  BlendMode,
  BlurStyle,
  ClipOp,
  ColorChannel,
  ColorSpace,
  ColorType,
  DecorationStyle,
  FillType,
  FilterMode,
  FontEdging,
  FontHinting,
  FontSlant,
  FontWeight,
  FontWidth,
  ImageFormat,
  MipmapMode,
  PaintStyle,
  Path1DEffectStyle,
  PathOp,
  PathVerb,
  PlaceholderAlignment,
  PointMode,
  RectHeightStyle,
  RectWidthStyle,
  StrokeCap,
  StrokeJoin,
  TextAlign,
  TextBaseline,
  TextDirection,
  TextHeightBehavior,
  TileMode,
  VertexMode,
} from "./Constants";
import { VectorHelpers } from "./Vector";

// This should contains all functions and variables that don't depend on the Web APIs
export abstract class CoreCanvasKit {
  Color(r: number, g: number, b: number, a = 1): Float32Array {
    return color(r, g, b, a);
  }

  Color4f(
    r: number,
    g: number,
    b: number,
    a?: number | undefined
  ): Float32Array {
    return color4f(r, g, b, a);
  }

  ColorAsInt(r: number, g: number, b: number, a = 1): number {
    return colorAsInt(r, g, b, a);
  }

  getColorComponents(cl: Color): number[] {
    return getColorComponents(cl);
  }

  multiplyByAlpha(c: Float32Array, alpha: number): Float32Array {
    return multiplyByAlpha(c, alpha);
  }

  LTRBRect(
    left: number,
    top: number,
    right: number,
    bottom: number
  ): Float32Array {
    return ltrbRect(left, top, right, bottom);
  }
  XYWHRect(x: number, y: number, width: number, height: number): Float32Array {
    return xywhRect(x, y, width, height);
  }
  LTRBiRect(
    left: number,
    top: number,
    right: number,
    bottom: number
  ): Int32Array {
    return ltrbiRect(left, top, right, bottom);
  }
  XYWHiRect(x: number, y: number, width: number, height: number): Int32Array {
    return xywhiRect(x, y, width, height);
  }
  RRectXY(input: InputRect, rx: number, ry: number): Float32Array {
    return rrectXY(input, rx, ry);
  }

  Vector = VectorHelpers;
  ImageFormat = ImageFormat;
  MipmapMode = MipmapMode;
  PaintStyle = PaintStyle;
  Path1DEffect = Path1DEffectStyle;
  PathOp = PathOp;
  PointMode = PointMode;
  ColorSpace = ColorSpace;
  StrokeCap = StrokeCap;
  StrokeJoin = StrokeJoin;
  TileMode = TileMode;
  VertexMode = VertexMode;
  FontSlant = FontSlant;
  FontWeight = FontWeight;
  FontWidth = FontWidth;
  ColorType = ColorType;
  FillType = FillType;
  FilterMode = FilterMode;
  FontEdging = FontEdging;
  FontHinting = FontHinting;
  AlphaType = AlphaType;
  BlendMode = BlendMode;
  BlurStyle = BlurStyle;
  ClipOp = ClipOp;
  Matrix = Matrix3;
  M44 = Matrix4;
  Affinity = Affinity;
  TRANSPARENT = Float32Array.of(0, 0, 0, 0);
  BLACK = Float32Array.of(0, 0, 0, 1);
  WHITE = Float32Array.of(1, 1, 1, 1);
  RED = Float32Array.of(1, 0, 0, 1);
  GREEN = Float32Array.of(0, 1, 0, 1);
  BLUE = Float32Array.of(0, 0, 1, 1);
  YELLOW = Float32Array.of(1, 1, 0, 1);
  CYAN = Float32Array.of(0, 1, 1, 1);
  MAGENTA = Float32Array.of(1, 0, 1, 1);
  MOVE_VERB = PathVerb.Move;
  LINE_VERB = PathVerb.Line;
  QUAD_VERB = PathVerb.Quad;
  CONIC_VERB = PathVerb.Conic;
  CUBIC_VERB = PathVerb.Cubic;
  CLOSE_VERB = PathVerb.Close;

  GlyphRunFlags = {
    IsWhiteSpace: 1,
  };

  TextAlign = TextAlign;
  TextBaseline = TextBaseline;
  TextDirection = TextDirection;
  TextHeightBehavior = TextHeightBehavior;

  PlaceholderAlignment = PlaceholderAlignment;
  RectHeightStyle = RectHeightStyle;
  RectWidthStyle = RectWidthStyle;
  ColorChannel = ColorChannel;

  LineThroughDecoration = 4;

  NoDecoration = 0;
  UnderlineDecoration = 1;
  OverlineDecoration = 2;

  ShadowTransparentOccluder = 1;
  ShadowGeometricOnly = 2;
  ShadowDirectionalLight = 4;

  DecorationStyle = DecorationStyle;

  gpu = true;
  polyfill = true;
  managed_skottie = false;
  rt_effect = true;
  skottie = false;

  SaveLayerInitWithPrevious = 1 << 2;
  SaveLayerF16ColorType = 1 << 4;
}
