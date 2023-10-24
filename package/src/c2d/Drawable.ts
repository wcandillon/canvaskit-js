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

export class DrawableText implements Drawable {
  constructor(
    private readonly text: string,
    private readonly x: number,
    private readonly y: number,
    private readonly font: string | null
  ) {}

  draw(ctx: RenderingContext, _ctm: DOMMatrix, stroke?: boolean) {
    if (this.font) {
      ctx.font = this.font;
    }
    if (stroke) {
      ctx.strokeText(this.text, this.x, this.y);
    } else {
      ctx.fillText(this.text, this.x, this.y);
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

// export class DrawableGlyphs implements Drawable {
//   constructor(
//     private readonly glyphs: number[],
//     private readonly positions: Float32Array,
//     private readonly x: number,
//     private readonly y: number,
//     private readonly font: FontJS
//   ) {}

//   private getDrawableGlyphs() {
//     return this.glyphs.map((glyph, index) => {
//       return {
//         text: this.font.getStringForGlyph(glyph),
//         x: this.x + this.positions[index * 2],
//         y: this.y + this.positions[index * 2 + 1],
//       };
//     });
//   }

//   draw(ctx: CanvasRenderingContext2D, stroke?: boolean) {
//     if (this.font) {
//       ctx.font = this.font.fontStyle();
//     }
//     this.getDrawableGlyphs().forEach(({ text, x, y }) => {
//       if (stroke) {
//         ctx.strokeText(text, x, y);
//       } else {
//         ctx.fillText(text, x, y);
//       }
//     });
//   }
// }

export class DrawableDRRect implements Drawable {
  constructor(private readonly outer: Path2D, private readonly inner: Path2D) {}
  draw(ctx: CanvasRenderingContext2D, _ctm: DOMMatrix, stroke?: boolean): void {
    // TODO: implement ctm
    // Combine the outer and inner paths
    const combinedPath = new Path2D();
    combinedPath.addPath(this.outer);
    combinedPath.addPath(this.inner);

    // Draw the combined path using the "evenodd" fill rule
    if (stroke) {
      ctx.stroke(combinedPath); // This will stroke both paths, adjust if needed
    } else {
      ctx.fill(combinedPath, "evenodd"); // This will fill only the outer minus inner
    }
  }
}
