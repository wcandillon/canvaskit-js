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
import type { SVGContext } from "../SVG";

import { getBlendMode } from "./BlendMode";

interface PaintContext {
  ctx: CanvasRenderingContext2D;
  svgCtx: SVGContext;
}

export class PaintJS extends HostObject<Paint> implements Paint {
  private style = PaintStyle.Fill;
  private color = new Float32Array([0, 0, 0, 1]);
  private strokeWidth = 1;
  private strokeMiter = 10;
  private shader: ShaderJS | null = null;
  private colorFilter: ColorFilterJS | null = null;
  private imageFilter: ImageFilterJS | null = null;
  private maskFilter: MaskFilterJS | null = null;
  private strokeJoin = StrokeJoin.Bevel;
  private strokeCap = StrokeCap.Square;
  private blendMode = BlendMode.SrcOver;

  apply(
    paintCtx: PaintContext,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    draw: (ctx: CanvasRenderingContext2D) => any,
    path?: boolean
  ) {
    const { ctx, svgCtx } = paintCtx;
    ctx.save();
    let style: CanvasPattern | string;
    if (this.shader) {
      const texture = this.shader.paint(
        createOffscreenTexture(ctx.canvas.width, ctx.canvas.height)
      );
      style = ctx.createPattern(texture, "no-repeat")!;
    } else {
      style = nativeColor(this.color);
    }
    if (this.style === PaintStyle.Fill) {
      ctx.fillStyle = style;
    } else {
      ctx.strokeStyle = style;
    }
    ctx.miterLimit = this.strokeMiter;
    ctx.lineWidth = this.strokeWidth;
    ctx.lineCap = lineCap(this.strokeCap);
    ctx.lineJoin = lineJoin(this.strokeJoin);
    if (this.maskFilter || this.imageFilter || this.colorFilter) {
      const filter: string[] = [];
      if (this.maskFilter) {
        const { id, filters } = this.maskFilter;
        const url = svgCtx.create(id, filters);
        filter.push(url);
      }
      if (this.imageFilter) {
        const { id, filters } = this.imageFilter;
        const url = svgCtx.create(id, filters);
        filter.push(url);
      }
      if (this.colorFilter) {
        const { id, filters } = this.colorFilter;
        const url = svgCtx.create(id, filters);
        filter.push(url);
      }
      ctx.filter = filter.join(" ");
    }

    ctx.globalCompositeOperation = getBlendMode(this.blendMode);
    if (!path) {
      ctx.beginPath();
      draw(ctx);
      ctx.closePath();
      if (this.style === PaintStyle.Fill) {
        ctx.fill();
      } else {
        ctx.stroke();
      }
    } else {
      const p = draw(ctx);
      if (this.style === PaintStyle.Fill) {
        ctx.fill(p);
      } else {
        ctx.stroke(p);
      }
    }
    ctx.restore();
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
    this.colorFilter = filter;
  }
  setColorInt(_color: number, _colorSpace?: ColorSpace | undefined): void {
    throw new Error("Method not implemented.");
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
