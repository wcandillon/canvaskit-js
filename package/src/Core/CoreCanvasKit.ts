import type { Color, InputRect } from "canvaskit-wasm";

import { Matrix3 } from "../Matrix3";

import {
  color,
  color4f,
  colorAsInt,
  getColorComponents,
  multiplyByAlpha,
} from "./Color";
import { ltrbRect, ltrbiRect, rrectXY, xywhRect, xywhiRect } from "./Rect";
import {
  AlphaType,
  BlendMode,
  BlurStyle,
  ClipOp,
  ColorSpace,
  ColorType,
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
  PointMode,
  StrokeCap,
  StrokeJoin,
  TileMode,
  VertexMode,
} from "./Contants";

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
  TRANSPARENT = new Float32Array([0, 0, 0, 0]);
  BLACK = new Float32Array([0, 0, 0, 1]);
  WHITE = new Float32Array([1, 1, 1, 1]);
  RED = new Float32Array([1, 0, 0, 1]);
  GREEN = new Float32Array([0, 1, 0, 1]);
  BLUE = new Float32Array([0, 0, 1, 1]);
  YELLOW = new Float32Array([1, 1, 0, 1]);
  CYAN = new Float32Array([0, 1, 1, 1]);
  MAGENTA = new Float32Array([1, 0, 1, 1]);
  MOVE_VERB = PathVerb.Move;
  LINE_VERB = PathVerb.Line;
  QUAD_VERB = PathVerb.Quad;
  CONIC_VERB = PathVerb.Conic;
  CUBIC_VERB = PathVerb.Cubic;
  CLOSE_VERB = PathVerb.Close;
}