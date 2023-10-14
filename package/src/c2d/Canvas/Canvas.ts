import type { RenderingContext } from "../Constants";
import { DrawablePath } from "../Drawable";
import type { ImageFilter } from "../ImageFilter";
import type { Paint } from "../Paint";
import type { Path } from "../Path";

interface CanvasContext {
  matrix: DOMMatrix;
  clip: Path | null;
  imageFilter: ImageFilter | null;
  renderingCtx: RenderingContext;
}

export class Canvas {
  private stack: CanvasContext[] = [];

  constructor(renderingCtx: RenderingContext) {
    this.stack.push({
      matrix: new DOMMatrix(),
      clip: null,
      imageFilter: null,
      renderingCtx,
    });
  }

  get ctx() {
    return this.stack[this.stack.length - 1];
  }

  save(imageFilter?: ImageFilter) {
    const isLayer = imageFilter !== undefined;
    this.stack.push({
      matrix: DOMMatrix.fromMatrix(this.ctx.matrix),
      clip: this.ctx.clip,
      imageFilter: imageFilter ?? null,
      renderingCtx: isLayer ? this.makeCanvas() : this.ctx.renderingCtx,
    });
  }

  concat(matrix: DOMMatrix) {
    this.ctx.matrix.multiplySelf(matrix);
  }

  clip(path: Path) {
    this.ctx.clip = path;
  }

  restore() {
    this.stack.pop();
  }

  draw(path: Path, paint: Paint) {
    paint.applyToContext(
      this.ctx.renderingCtx,
      this.ctx.matrix,
      new DrawablePath(path.getPath2D())
    );
  }

  private makeCanvas() {
    const canvas = new OffscreenCanvas(
      this.ctx.renderingCtx.canvas.width,
      this.ctx.renderingCtx.canvas.height
    );
    const ctx = canvas.getContext("2d")!;
    if (!ctx) {
      throw new Error("Failed to create canvas context");
    }
    return ctx;
  }
}

/*class Paint {}

class Path {}

class ImageFilter {}

class Canvas {
  save() {}
  saveLayer(filter: ImageFilter) {}
  concat(matrix: DOMMatrix) {}
  clip(path: Path) {}
  restore() {}
}
*/
