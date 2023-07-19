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

export class DrawableDRRect implements Drawable {
  constructor(private readonly outer: Path2D, private readonly inner: Path2D) {}
  draw(ctx: CanvasRenderingContext2D, stroke?: boolean | undefined): void {
    // Save the current state of the context
    ctx.save();

    // Clip to the outer rounded rect
    ctx.clip(this.outer);

    // Use composite operation to cut out the inner rectangle from the outer one
    ctx.globalCompositeOperation = "destination-out";
    ctx.fill(this.inner);

    // Restore the context to its original state
    ctx.restore();

    // Apply paint properties and draw the shape
    if (stroke) {
      ctx.stroke(this.outer);
    } else {
      ctx.fill(this.outer);
    }
  }
}
