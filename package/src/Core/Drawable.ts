import type { FontJS } from "../Text";

export interface Drawable {
  draw(ctx: CanvasRenderingContext2D, stroke?: boolean): void;
}

export class DrawablePath implements Drawable {
  constructor(
    private readonly path: Path2D,
    private readonly fillType: CanvasFillRule = "nonzero"
  ) {}

  draw(ctx: CanvasRenderingContext2D, stroke?: boolean) {
    if (stroke) {
      ctx.stroke(this.path);
    } else {
      ctx.fill(this.path, this.fillType);
    }
  }
}

export class DrawableRect implements Drawable {
  constructor(
    private readonly x: number,
    private readonly y: number,
    private readonly width: number,
    private readonly height: number
  ) {}

  draw(ctx: CanvasRenderingContext2D, stroke?: boolean) {
    const { x, y, width, height } = this;
    if (stroke) {
      ctx.strokeRect(x, y, width, height);
    } else {
      ctx.fillRect(x, y, width, height);
    }
  }
}

export class DrawableCircle implements Drawable {
  constructor(
    private readonly x: number,
    private readonly y: number,
    private readonly radius: number
  ) {}

  draw(ctx: CanvasRenderingContext2D, stroke?: boolean) {
    const { x, y, radius } = this;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    if (stroke) {
      ctx.stroke();
    } else {
      ctx.fill();
    }
  }
}

export class CustomDrawable implements Drawable {
  constructor(
    private readonly drawFn: (
      ctx: CanvasRenderingContext2D,
      stroke?: boolean
    ) => void
  ) {}

  draw(ctx: CanvasRenderingContext2D, stroke?: boolean) {
    this.drawFn(ctx, stroke);
  }
}

export class DrawableText implements Drawable {
  constructor(
    private readonly text: string,
    private readonly x: number,
    private readonly y: number,
    private readonly font: string | null
  ) {}

  draw(ctx: CanvasRenderingContext2D, stroke?: boolean) {
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

export class DrawableGlyphs implements Drawable {
  constructor(
    private readonly glyphs: number[],
    private readonly positions: Float32Array,
    private readonly x: number,
    private readonly y: number,
    private readonly font: FontJS
  ) {}

  private getDrawableGlyphs() {
    return this.glyphs.map((glyph, index) => {
      return {
        text: this.font.getStringForGlyph(glyph),
        x: this.x + this.positions[index * 2],
        y: this.y + this.positions[index * 2 + 1],
      };
    });
  }

  draw(ctx: CanvasRenderingContext2D, stroke?: boolean) {
    if (this.font) {
      ctx.font = this.font.fontStyle();
    }
    this.getDrawableGlyphs().forEach(({ text, x, y }) => {
      if (stroke) {
        ctx.strokeText(text, x, y);
      } else {
        ctx.fillText(text, x, y);
      }
    });
  }
}

export class DrawableDRRect implements Drawable {
  constructor(private readonly outer: Path2D, private readonly inner: Path2D) {}
  draw(ctx: CanvasRenderingContext2D, stroke?: boolean | undefined): void {
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
