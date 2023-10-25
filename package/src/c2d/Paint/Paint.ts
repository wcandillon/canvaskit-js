import type { RenderingContext } from "../Constants";
import { ImageFilter } from "../ImageFilter";
import type { Shader } from "../Shader";
import type { Drawable } from "../Drawable";
import type { SVGContext, SVGFilter } from "../SVG";

export class Paint {
  private stroke = false;
  private color = "black";
  private alpha = 1;
  private blendMode: GlobalCompositeOperation = "source-over";

  private lineWidth = 1;
  private lineCap: CanvasLineCap = "butt";
  private lineJoin: CanvasLineJoin = "miter";
  private miterLimit = 10;

  private shader: Shader | null = null;
  private imageFilter: ImageFilter | null = null;

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

  setAlpha(alpha: number) {
    this.alpha = alpha;
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

  addImageFilter(...imageFilters: SVGFilter[]) {
    if (!this.imageFilter) {
      this.imageFilter = new ImageFilter();
    }
    for (const imageFilter of imageFilters) {
      this.imageFilter.addFilter(imageFilter);
    }
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
    ctx.save();
    ctx.setTransform(ctm);
    ctx.globalAlpha = this.alpha;
    if (this.stroke) {
      ctx.strokeStyle = this.color;
    } else {
      ctx.fillStyle = this.color;
    }
    ctx.lineWidth = this.lineWidth * Math.sqrt(ctm.m11 * ctm.m22);
    ctx.lineCap = this.lineCap;
    ctx.lineJoin = this.lineJoin;
    ctx.miterLimit = this.miterLimit;
    ctx.globalCompositeOperation = this.blendMode;

    if (this.imageFilter) {
      const { id, filters } = this.imageFilter;
      const url = svgCtx.create(id, filters);
      ctx.filter = url;
    }

    if (this.shader) {
      // TODO: remove ctm here
      const img = this.shader.render(
        ctx.canvas.width,
        ctx.canvas.height,
        new DOMMatrix()
      );
      const pattern = ctx.createPattern(img, "no-repeat")!;
      // This call doesn't need to be done if we don't implement the ctm ourselves
      //pattern.setTransform(ctm.inverse());
      if (this.stroke) {
        ctx.strokeStyle = pattern;
      } else {
        ctx.fillStyle = pattern;
      }
    }
    drawable.draw(ctx, this.stroke);
    ctx.restore();
  }
}
