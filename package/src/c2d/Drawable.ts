import type { RenderingContext } from "./Constants";
import type { Path } from "./Path";

export interface Drawable {
  draw(ctx: RenderingContext, ctm: DOMMatrix, stroke?: boolean): void;
}

export class DrawablePath implements Drawable {
  constructor(
    private readonly path: Path,
    private readonly fillType: CanvasFillRule = "nonzero"
  ) {}

  draw(ctx: RenderingContext, ctm: DOMMatrix, stroke?: boolean) {
    // TODO: it would be faster to have a version with undefined if ctm is identity
    const isProjected = true;
    const path = this.path.getPath2D(!isProjected ? new DOMMatrix() : ctm);
    if (!isProjected) {
      ctx.save();
      ctx.setTransform(ctm);
    }
    if (stroke) {
      ctx.stroke(path);
    } else {
      ctx.fill(path, this.fillType);
    }
    if (ctm.is2D) {
      ctx.restore();
    }
  }
}

export class DrawableFill implements Drawable {
  private readonly path = new Path2D();

  constructor(width: number, height: number) {
    this.path.rect(0, 0, width, height);
  }

  draw(ctx: RenderingContext, _ctm: DOMMatrix, _stroke?: boolean) {
    ctx.fill(this.path);
  }
}

export class DrawableImage implements Drawable {
  constructor(private readonly image: CanvasImageSource) {}

  // TOOD: implement ctm
  draw(ctx: RenderingContext, _ctm: DOMMatrix) {
    ctx.drawImage(this.image, 0, 0);
  }
}
