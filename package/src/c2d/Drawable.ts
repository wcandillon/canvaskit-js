import type { RenderingContext } from "./Constants";
import { projectPoint } from "./Path";

export interface Drawable {
  draw(ctx: RenderingContext, stroke?: boolean): void;
}

export class DrawablePath implements Drawable {
  constructor(
    private readonly path: Path2D,
    private readonly fillType: CanvasFillRule = "nonzero"
  ) {}

  draw(ctx: RenderingContext, stroke?: boolean) {
    if (stroke) {
      ctx.stroke(this.path);
    } else {
      ctx.fill(this.path, this.fillType);
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

  draw(ctx: RenderingContext, stroke?: boolean) {
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
  private topLeft: DOMPoint;
  private topRight: DOMPoint;
  private bottomRight: DOMPoint;
  private bottomLeft: DOMPoint;

  constructor(width: number, height: number) {
    this.topLeft = new DOMPoint(0, 0);
    this.topRight = new DOMPoint(width, 0);
    this.bottomRight = new DOMPoint(width, height);
    this.bottomLeft = new DOMPoint(0, height);
  }

  draw(ctx: RenderingContext, _stroke?: boolean) {
    const path = new Path2D();
    const ctm = ctx.getTransform().inverse();
    const topLeft = projectPoint(ctm, this.topLeft);
    const topRight = projectPoint(ctm, this.topRight);
    const bottomRight = projectPoint(ctm, this.bottomRight);
    const bottomLeft = projectPoint(ctm, this.bottomLeft);
    path.moveTo(topLeft.x, topLeft.y);
    path.lineTo(topRight.x, topRight.y);
    path.lineTo(bottomRight.x, bottomRight.y);
    path.lineTo(bottomLeft.x, bottomLeft.y);
    path.closePath();
    ctx.fill(path);
  }
}

export class DrawableImage implements Drawable {
  constructor(
    private readonly image: CanvasImageSource,
    private readonly x: number = 0,
    private readonly y: number = 0
  ) {}

  draw(ctx: RenderingContext) {
    ctx.drawImage(this.image, this.x, this.y);
  }
}

export class DrawableImageRect implements Drawable {
  constructor(
    private readonly image: CanvasImageSource,
    private x1: number,
    private y1: number,
    private width1: number,
    private height1: number,
    private x2: number,
    private y2: number,
    private width2: number,
    private height2: number
  ) {}

  draw(ctx: RenderingContext) {
    ctx.drawImage(
      this.image,
      this.x1,
      this.y1,
      this.width1,
      this.height1,
      this.x2,
      this.y2,
      this.width2,
      this.height2
    );
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
  draw(ctx: CanvasRenderingContext2D, stroke?: boolean): void {
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
