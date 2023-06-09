export interface Drawable {
  draw(ctx: CanvasRenderingContext2D, stroke?: boolean): void;
}

export class DrawablePath implements Drawable {
  constructor(private readonly path: Path2D) {}

  draw(ctx: CanvasRenderingContext2D, stroke?: boolean) {
    if (stroke) {
      ctx.stroke(this.path);
    } else {
      ctx.fill(this.path);
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

export class CustomDrawable implements Drawable {
  constructor(
    private readonly drawFn: (ctx: CanvasRenderingContext2D) => void
  ) {}

  draw(ctx: CanvasRenderingContext2D, stroke?: boolean) {
    ctx.beginPath();
    this.drawFn(ctx);
    if (stroke) {
      ctx.stroke();
    } else {
      ctx.fill();
    }
  }
}
