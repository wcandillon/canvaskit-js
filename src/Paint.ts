import type {
  ColorFilter,
  ColorSpace,
  EmbindEnumEntity,
  Paint,
  PathEffect,
} from "canvaskit-wasm";

import type { InputColor } from "./Contants";
import { BlendMode, StrokeCap, PaintStyle, StrokeJoin } from "./Contants";
import type { ShaderJS } from "./Shader";
import type { ImageFilterLite } from "./ImageFilter";
import { HostObject } from "./HostObject";
import type { SkiaRenderingContext } from "./Values";
import { NativeColor } from "./Values";
import type { MaskFilterLite } from "./MaskFilterFactory";

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

const getBlendMode = (mode: EmbindEnumEntity) => {
  switch (mode.value) {
    case 2:
      return "copy";
    case 3:
      return "source-over";
    case 4:
      return "destination-over";
    case 5:
      return "source-in";
    case 6:
      return "destination-in";
    case 7:
      return "source-out";
    case 8:
      return "destination-out";
    case 9:
      return "source-atop";
    case 10:
      return "destination-atop";
    case 11:
      return "xor";
    case 14:
      return "screen";
    case 15:
      return "overlay";
    case 16:
      return "darken";
    case 17:
      return "lighten";
    case 18:
      return "color-dodge";
    case 19:
      return "color-burn";
    case 20:
      return "hard-light";
    case 21:
      return "soft-light";
    case 22:
      return "difference";
    case 23:
      return "exclusion";
    case 24:
      return "multiply";
    case 25:
      return "hue";
    case 26:
      return "saturation";
    case 27:
      return "color";
    case 28:
      return "luminosity";
    default:
      throw new Error(`Unknown blend mode: ${mode.value}`);
  }
};

export class PaintLite extends HostObject<Paint> implements Paint {
  private style = PaintStyle.Fill;
  private color = new Float32Array([0, 0, 0, 1]); // default to black color
  private strokeWidth = 1;
  private strokeMiter = 10;
  private shader: ShaderJS | null = null;
  private colorFilter: ColorFilter | null = null;
  private imageFilter: ImageFilterLite | null = null;
  private maskFilter: MaskFilterLite | null = null;
  private strokeJoin = StrokeJoin.Bevel;
  private strokeCap = StrokeCap.Square;
  private blendMode = BlendMode.SrcOver;

  apply(
    context: SkiaRenderingContext,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    draw: (ctx: SkiaRenderingContext) => any,
    path?: boolean
  ) {
    context.save();
    let style: CanvasPattern | string;
    if (this.shader) {
      const texture = this.shader.getTexture(
        context.canvas.width,
        context.canvas.height
      );
      style = context.createPattern(texture, "no-repeat")!;
    } else {
      style = NativeColor(this.color);
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
    if (this.maskFilter || this.imageFilter) {
      let filter = "";
      filter += this.imageFilter ? this.imageFilter.toFilter() : "";
      filter += this.maskFilter ? this.maskFilter.toFilter() : "";
      context.filter = filter;
    }

    context.globalCompositeOperation = getBlendMode(this.blendMode);
    if (this.colorFilter) {
      console.log(this.colorFilter);
    }
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
    const paint = new PaintLite();
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
      paint.setImageFilter(imageFilter);
    }
    if (colorFilter) {
      paint.setColorFilter(colorFilter);
    }
    if (maskFilter) {
      paint.setMaskFilter(maskFilter);
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
  setColorFilter(filter: ColorFilter | null): void {
    this.colorFilter = filter;
  }
  setColorInt(_color: number, _colorSpace?: ColorSpace | undefined): void {
    throw new Error("Method not implemented.");
  }
  setDither(_shouldDither: boolean): void {
    throw new Error("Method not implemented.");
  }
  setImageFilter(filter: ImageFilterLite | null): void {
    this.imageFilter = filter;
  }
  setMaskFilter(filter: MaskFilterLite | null): void {
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
