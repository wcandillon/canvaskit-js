import type { RenderingContext } from "../Constants";
import type { ImageFilter } from "../ImageFilter";
import type { Shader } from "../Shader";
import type { Drawable } from "../Drawable";
import type { SVGContext } from "../SVG";

export class Paint {
  private stroke?: boolean;
  private color?: string;
  private alpha?: number;
  private blendMode?: GlobalCompositeOperation;

  private lineWidth = 1;
  private lineCap: CanvasLineCap = "butt";
  private lineJoin: CanvasLineJoin = "miter";
  private miterLimit = 10;

  private shader?: Shader;
  private imageFilter?: ImageFilter;

  constructor() {}

  copy() {
    const paint = new Paint();
    paint.stroke = this.stroke;
    paint.color = this.color;
    paint.alpha = this.alpha;
    paint.blendMode = this.blendMode;
    paint.lineWidth = this.lineWidth;
    paint.lineCap = this.lineCap;
    paint.lineJoin = this.lineJoin;
    paint.miterLimit = this.miterLimit;
    paint.shader = this.shader;
    paint.imageFilter = this.imageFilter;
    return paint;
  }

  setStrokeStyle(stroke: boolean) {
    this.stroke = stroke;
    return this;
  }

  setColor(color: string) {
    this.color = color;
    return this;
  }

  setStrokeWidth(strokeWidth: number) {
    this.lineWidth = strokeWidth;
    return this;
  }

  getStrokeWidth() {
    return this.lineWidth;
  }

  setStrokeMiter(strokeMiter: number) {
    this.miterLimit = strokeMiter;
    return this;
  }

  getStrokeMiter() {
    return this.miterLimit;
  }

  getStrokeCap() {
    return this.lineCap;
  }

  getStrokeJoin() {
    return this.lineJoin;
  }

  setStrokeCap(strokeCap: CanvasLineCap) {
    this.lineCap = strokeCap;
    return this;
  }

  setStrokeJoin(strokeJoin: CanvasLineJoin) {
    this.lineJoin = strokeJoin;
    return this;
  }

  setBlendMode(blendMode: GlobalCompositeOperation) {
    this.blendMode = blendMode;
    return this;
  }

  setImageFilter(imageFilter: ImageFilter) {
    this.imageFilter = imageFilter;
    return this;
  }

  setShader(shader: Shader) {
    this.shader = shader;
    return this;
  }

  applyToContext(
    ctx: RenderingContext,
    svgCtx: SVGContext,
    ctm: DOMMatrix,
    drawable: Drawable
  ) {
    const projected = true;
    if (this.color && !this.stroke) {
      ctx.fillStyle = this.color;
    }
    if (this.color && this.stroke) {
      ctx.strokeStyle = this.color;
    }
    if (this.lineWidth) {
      ctx.lineWidth =
        this.lineWidth * (projected ? Math.sqrt(ctm.m11 * ctm.m22) : 1);
    }
    if (this.lineCap) {
      ctx.lineCap = this.lineCap;
    }
    if (this.lineJoin) {
      ctx.lineJoin = this.lineJoin;
    }
    if (this.miterLimit) {
      ctx.miterLimit = this.miterLimit;
    }
    if (this.alpha) {
      ctx.globalAlpha = this.alpha;
    }
    if (this.blendMode) {
      ctx.globalCompositeOperation = this.blendMode;
    }
    if (this.shader) {
      this.shader.render(ctx.canvas.width, ctx.canvas.height, ctm);
    }
    if (this.imageFilter) {
      const { id, filters } = this.imageFilter;
      const url = svgCtx.create(id, filters);
      ctx.filter = url;
    }
    if (this.shader) {
      const img = this.shader.render(ctx.canvas.width, ctx.canvas.height, ctm);
      const pattern = ctx.createPattern(img, "no-repeat")!;
      if (!projected) {
        pattern.setTransform(ctm.inverse());
      }
      if (this.stroke) {
        ctx.strokeStyle = pattern;
      } else {
        ctx.fillStyle = pattern;
      }
    }
    drawable.draw(ctx, ctm, this.stroke);
  }
}
