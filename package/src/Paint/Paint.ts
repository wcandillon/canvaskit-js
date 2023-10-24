/* eslint-disable no-bitwise */
import type {
  ColorSpace,
  EmbindEnumEntity,
  Paint,
  PathEffect,
} from "canvaskit-wasm";

import { Paint as NativePaint } from "../c2d";
import type { InputColor } from "../Core";
import { StrokeJoin, StrokeCap, PaintStyle } from "../Core";
import type { ShaderJS } from "../Shader";
import type { ImageFilterJS } from "../ImageFilter";
import { HostObject } from "../HostObject";
import type { MaskFilterJS } from "../MaskFilter/MaskFilter";
import type { ColorFilterJS } from "../ColorFilter/ColorFilter";

import { nativeBlendMode } from "./BlendMode";

export class PaintJS extends HostObject<"Paint"> implements Paint {
  private style = PaintStyle.Fill;
  private color = Float32Array.of(0, 0, 0, 1);
  private strokeWidth: number | null = null;
  private strokeMiter: number | null = null;
  private shader: ShaderJS | null = null;
  private colorFilter: ColorFilterJS | null = null;
  private imageFilter: ImageFilterJS | null = null;
  private maskFilter: MaskFilterJS | null = null;
  private strokeJoin: Miter | null = null;
  private strokeCap: Cap | null = null;
  private blendMode: GlobalCompositeOperation | null = null;

  private paint = new NativePaint();

  constructor() {
    super("Paint");
  }

  getPaint() {
    return this.paint;
  }

  copy(): Paint {
    const {
      style,
      color,
      strokeWidth,
      strokeMiter,
      strokeJoin,
      strokeCap,
      blendMode,
      shader,
      imageFilter,
      colorFilter,
      maskFilter,
    } = this;
    const paint = new PaintJS();
    paint.setStyle(style);
    if (color !== null) {
      paint.color = color;
    }
    paint.strokeWidth = strokeWidth;
    paint.strokeMiter = strokeMiter;
    paint.strokeJoin = strokeJoin;
    paint.strokeCap = strokeCap;
    paint.blendMode = blendMode;
    if (shader) {
      paint.setShader(shader);
    }
    if (imageFilter) {
      paint.imageFilter = imageFilter;
    }
    if (colorFilter) {
      paint.colorFilter = colorFilter;
    }
    if (maskFilter) {
      paint.maskFilter = maskFilter;
    }
    return paint;
  }
  getColor() {
    return this.color;
  }
  getStrokeCap(): EmbindEnumEntity {
    return lineCap(this.strokeCap ?? "butt");
  }
  getStrokeJoin(): EmbindEnumEntity {
    return lineJoin(this.strokeJoin ?? "miter");
  }
  getStrokeMiter() {
    return this.strokeMiter ?? 10;
  }
  getStrokeWidth() {
    return this.strokeWidth ?? 1;
  }
  setAlphaf(alpha: number) {
    this.color[3] = alpha;
  }
  setAntiAlias(_aa: boolean): void {}
  setBlendMode(mode: EmbindEnumEntity): void {
    this.blendMode = nativeBlendMode(mode);
  }
  setColor(color: InputColor, _colorSpace?: ColorSpace | undefined): void {
    if (color instanceof Float32Array) {
      this.color = color;
    } else {
      this.color = Float32Array.from(color);
    }
  }
  setColorComponents(
    r: number,
    g: number,
    b: number,
    a: number,
    _colorSpace?: ColorSpace | undefined
  ): void {
    this.color = new Float32Array([r, g, b, a]);
  }
  setColorFilter(filter: ColorFilterJS | null): void {
    this.colorFilter = filter;
  }
  setColorInt(colorInt: number, _colorSpace?: ColorSpace | undefined) {
    // Extract the color components
    let alpha = (colorInt >>> 24) & 255;
    let red = (colorInt >> 16) & 255;
    let green = (colorInt >> 8) & 255;
    let blue = colorInt & 255;

    // Normalize the color components to [0, 1]
    alpha /= 255;
    red /= 255;
    green /= 255;
    blue /= 255;
    this.setColor(Float32Array.of(red, green, blue, alpha));
  }
  setDither(_shouldDither: boolean): void {
    throw new Error("Method not implemented.");
  }
  setImageFilter(filter: ImageFilterJS | null): void {
    this.imageFilter = filter;
  }
  setMaskFilter(filter: MaskFilterJS | null): void {
    this.maskFilter = filter;
  }
  setPathEffect(_effect: PathEffect | null): void {
    throw new Error("Method not implemented.");
  }
  setShader(shader: ShaderJS | null): void {
    this.shader = shader;
  }
  setStrokeCap(cap: EmbindEnumEntity): void {
    this.strokeCap = nativeLineCap(cap);
  }
  setStrokeJoin(join: EmbindEnumEntity): void {
    this.strokeJoin = nativeLineJoin(join);
  }
  setStrokeMiter(limit: number): void {
    this.strokeMiter = limit;
  }
  setStrokeWidth(width: number): void {
    this.strokeWidth = width;
  }
  setStyle(style: EmbindEnumEntity): void {
    this.style = style;
  }
}

const lineCap = (cap: Cap) => {
  switch (cap) {
    case "butt":
      return StrokeCap.Butt;
    case "round":
      return StrokeCap.Round;
    case "square":
      return StrokeCap.Square;
    default:
      throw new Error(`Unknown line cap: ${cap}`);
  }
};

const nativeLineCap = (cap: EmbindEnumEntity) => {
  switch (cap.value) {
    case 0:
      return "butt";
    case 1:
      return "round";
    case 2:
      return "square";
    default:
      throw new Error(`Unknown line cap: ${cap.value}`);
  }
};

const lineJoin = (join: string) => {
  switch (join) {
    case "miter":
      return StrokeJoin.Miter;
    case "round":
      return StrokeJoin.Round;
    case "bevel":
      return StrokeJoin.Bevel;
    default:
      throw new Error(`Unknown line cap: ${join}`);
  }
};

const nativeLineJoin = (join: EmbindEnumEntity) => {
  switch (join.value) {
    case 0:
      return "miter";
    case 1:
      return "round";
    case 2:
      return "bevel";
    default:
      throw new Error(`Unknown line cap: ${join.value}`);
  }
};

type Miter = "miter" | "round" | "bevel";
type Cap = "butt" | "round" | "square";

// const resetCanvasContext = (ctx: CanvasRenderingContext2D) => {
//   ctx.globalAlpha = 1;
//   ctx.globalCompositeOperation = "source-over";
//   ctx.imageSmoothingEnabled = true;
//   ctx.imageSmoothingQuality = "low";
//   ctx.fillStyle = "#000000";
//   ctx.strokeStyle = "#000000";
//   ctx.lineWidth = 1;
//   ctx.lineCap = "butt";
//   ctx.lineJoin = "miter";
//   ctx.miterLimit = 10;
//   ctx.shadowBlur = 0;
//   ctx.shadowColor = "rgba(0, 0, 0, 0)";
//   ctx.shadowOffsetX = 0;
//   ctx.shadowOffsetY = 0;
//   ctx.setTransform(1, 0, 0, 1, 0, 0);
//   ctx.filter = "none";
//   ctx.font = "10px sans-serif";
//   ctx.textAlign = "start";
//   ctx.textBaseline = "alphabetic";
//   ctx.direction = "inherit";
// };
