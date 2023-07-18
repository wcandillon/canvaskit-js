import { createTexture } from "../Core";
import type { ImageFilterJS } from "../ImageFilter";
import { PaintJS } from "../Paint";
import type { SVGContext } from "../SVG";

interface PaintCtx {
  ctx: CanvasRenderingContext2D;
  svgCtx: SVGContext;
}

interface Context {
  ctx: CanvasRenderingContext2D | null;
  ctm: DOMMatrix;
  clip: Path2D | null;
  imageFilter?: ImageFilterJS;
  layer?: PaintCtx;
}

export class DrawingContext {
  private stack: Context[] = [];

  constructor(ctx: CanvasRenderingContext2D | null = null) {
    this.stack.push({
      ctx: ctx,
      ctm: new DOMMatrix(),
      clip: null,
    });
  }

  get ctx() {
    return this.current.ctx;
  }

  get current() {
    return this.stack[this.stack.length - 1];
  }

  saveCount() {
    return this.stack.length;
  }

  save() {
    const { ctx, ctm, clip } = this.current;
    if (ctx !== null) {
      ctx.save();
    }
    this.stack.push({
      ctx: ctx,
      ctm,
      clip,
    });
    return this.stack.length;
  }

  saveLayer(
    paintCtx: PaintCtx,
    paint?: PaintJS,
    imageFilter?: ImageFilterJS | null
  ) {
    const saveCount = this.save();
    const { ctx, clip, ctm } = this.current;
    if (ctx !== null) {
      const { canvas } = ctx;
      const { width, height } = canvas;
      const layer = createTexture(width, height);
      if (paint) {
        paint.apply(paintCtx, () => {
          layer.drawImage(canvas, 0, 0, width, height);
        });
      } else {
        layer.drawImage(canvas, 0, 0);
      }
      layer.setTransform(ctx.getTransform());
      if (clip) {
        layer.clip(clip);
      }
      this.stack.push({
        ctx: layer,
        ctm,
        imageFilter: imageFilter ?? undefined,
        clip,
        layer: paintCtx,
      });
    }
    return saveCount;
  }

  restore() {
    const { ctx, layer, imageFilter } = this.current;
    if (ctx) {
      if (layer) {
        if (imageFilter) {
          const paint = new PaintJS();
          paint.setImageFilter(imageFilter);
          paint.apply(layer, () => {
            ctx.resetTransform();
            ctx.drawImage(
              ctx.canvas,
              0,
              0,
              ctx.canvas.width,
              ctx.canvas.height
            );
          });
        } else {
          ctx.save();
          ctx.resetTransform();
          ctx.drawImage(ctx.canvas, 0, 0, ctx.canvas.width, ctx.canvas.height);
          ctx.restore();
        }
      }
      ctx.restore();
    }
    this.stack.pop();
  }

  transform(transform: DOMMatrix2DInit) {
    const { ctx } = this.current;
    this.current.ctm = this.current.ctm.multiply(transform);
    if (ctx) {
      ctx.setTransform(this.current.ctm);
    }
  }

  clip(clip: Path2D) {
    const { ctx } = this.current;
    if (ctx) {
      ctx.clip(clip);
    }
    this.current.clip = clip;
  }
}
