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
    const path = this.path.getPath2D(ctm);
    if (stroke) {
      ctx.stroke(path);
    } else {
      ctx.fill(path, this.fillType);
    }
  }
}

export class DrawableImage implements Drawable {
  constructor(private readonly image: CanvasImageSource) {}

  // TOOD: implement ctm
  draw(ctx: RenderingContext, _ctm: DOMMatrix) {
    ctx.drawImage(this.image, 0, 0);
  }
}
