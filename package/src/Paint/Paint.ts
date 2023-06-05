import type {
  ColorSpace,
  EmbindEnumEntity,
  Paint,
  PathEffect,
} from "canvaskit-wasm";

import type { InputColor } from "../Core";
import {
  BlendMode,
  StrokeCap,
  PaintStyle,
  StrokeJoin,
  nativeColor,
} from "../Core";
import type { ShaderJS } from "../Shader";
import type { ImageFilterJS } from "../ImageFilter";
import { HostObject } from "../HostObject";
import type { MaskFilterJS } from "../MaskFilter/MaskFilter";
import { createOffscreenTexture } from "../Core/Platform";
import type { ColorFilterJS } from "../ColorFilter/ColorFilter";

import { getBlendMode } from "./BlendMode";
import { SVGPaintFilter } from "./SVGPaintFilter";

export class PaintJS extends HostObject<Paint> implements Paint {
  private style = PaintStyle.Fill;
  private color = new Float32Array([0, 0, 0, 1]);
  private strokeWidth = 1;
  private strokeMiter = 10;
  private shader: ShaderJS | null = null;
  private colorFilter: SVGPaintFilter | null = null;
  private imageFilter: SVGPaintFilter | null = null;
  private maskFilter: SVGPaintFilter | null = null;
  private strokeJoin = StrokeJoin.Bevel;
  private strokeCap = StrokeCap.Square;
  private blendMode = BlendMode.SrcOver;

  apply(
    context: CanvasRenderingContext2D,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    draw: (ctx: CanvasRenderingContext2D) => any,
    path?: boolean
  ) {
    context.save();
    let style: CanvasPattern | string;
    if (this.shader) {
      const texture = this.shader.paint(
        createOffscreenTexture(context.canvas.width, context.canvas.height)
      );
      style = context.createPattern(texture, "no-repeat")!;
    } else {
      style = nativeColor(this.color);
    }
    if (this.style === PaintStyle.Fill) {
      context.fillStyle = style;
    } else {
      context.strokeStyle = style;
    }
    context.miterLimit = this.strokeMiter;
    context.lineWidth = this.strokeWidth;
    context.lineCap = lineCap(this.strokeCap);
    context.lineJoin = lineJoin(this.strokeJoin);
    if (this.maskFilter || this.imageFilter || this.colorFilter) {
      let filter = "";
      filter += this.imageFilter ? this.imageFilter.getFilter() : "";
      filter += this.maskFilter ? this.maskFilter.getFilter() : "";
      filter += this.colorFilter ? this.colorFilter.getFilter() : "";
      context.filter = filter;
    }

    context.globalCompositeOperation = getBlendMode(this.blendMode);
    if (!path) {
      context.beginPath();
      draw(context);
      context.closePath();
      if (this.style === PaintStyle.Fill) {
        context.fill();
      } else {
        context.stroke();
      }
    } else {
      const p = draw(context);
      if (this.style === PaintStyle.Fill) {
        context.fill(p);
      } else {
        context.stroke(p);
      }
    }
    context.restore();
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
    paint.setColor(color);
    paint.setStrokeWidth(strokeWidth);
    paint.setStrokeMiter(strokeMiter);
    paint.setStrokeJoin(strokeJoin);
    paint.setStrokeCap(strokeCap);
    paint.setBlendMode(blendMode);
    if (shader) {
      paint.setShader(shader);
    }
    if (imageFilter) {
      paint.imageFilter = imageFilter.copy();
    }
    if (colorFilter) {
      paint.colorFilter = colorFilter.copy();
    }
    if (maskFilter) {
      paint.maskFilter = maskFilter.copy();
    }
    return paint;
  }
  getColor(): Float32Array {
    return this.color;
  }
  getStrokeCap(): EmbindEnumEntity {
    return this.strokeCap;
  }
  getStrokeJoin(): EmbindEnumEntity {
    return this.strokeJoin;
  }
  getStrokeMiter(): number {
    return this.strokeMiter;
  }
  getStrokeWidth(): number {
    return this.strokeWidth;
  }
  setAlphaf(alpha: number): void {
    this.color[3] = alpha;
  }
  setAntiAlias(_aa: boolean): void {}
  setBlendMode(mode: EmbindEnumEntity): void {
    this.blendMode = mode;
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
    if (this.colorFilter) {
      this.colorFilter.dispose();
    }
    this.colorFilter = filter ? SVGPaintFilter.MakeFromFilter(filter) : null;
  }
  setColorInt(_color: number, _colorSpace?: ColorSpace | undefined): void {
    throw new Error("Method not implemented.");
  }
  setDither(_shouldDither: boolean): void {
    throw new Error("Method not implemented.");
  }
  setImageFilter(filter: ImageFilterJS | null): void {
    if (this.imageFilter) {
      this.imageFilter.dispose();
    }
    this.imageFilter = filter ? SVGPaintFilter.MakeFromFilter(filter) : null;
  }
  setMaskFilter(filter: MaskFilterJS | null): void {
    if (this.maskFilter) {
      this.maskFilter.dispose();
    }
    this.maskFilter = filter ? SVGPaintFilter.MakeFromFilter(filter) : null;
  }
  setPathEffect(_effect: PathEffect | null): void {
    throw new Error("Method not implemented.");
  }
  setShader(shader: ShaderJS | null): void {
    this.shader = shader;
  }
  setStrokeCap(cap: EmbindEnumEntity): void {
    this.strokeCap = cap;
  }
  setStrokeJoin(join: EmbindEnumEntity): void {
    this.strokeJoin = join;
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

const lineCap = (cap: EmbindEnumEntity) => {
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

const lineJoin = (join: EmbindEnumEntity) => {
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
