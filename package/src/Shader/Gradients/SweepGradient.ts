import type { InputFlexibleColorArray, InputPoint } from "canvaskit-wasm";

import { project2d } from "../../Matrix3";

import { Gradient } from "./Gradient";

export class SweepGradient extends Gradient {
  private c: DOMPoint;

  constructor(
    c: InputPoint,
    private readonly startAngle: number,
    colors: InputFlexibleColorArray,
    pos: number[] | null
  ) {
    super(colors, pos);
    this.c = new DOMPoint(...c);
  }

  paint(ctx: OffscreenCanvasRenderingContext2D) {
    const m3 = ctx.getTransform();
    const c = project2d(this.c, m3);
    const grd = ctx.createConicGradient(this.startAngle, c.x, c.y);
    ctx.save();
    ctx.setTransform();
    this.colors.forEach((color, i) => {
      grd.addColorStop(this.pos[i], color);
    });
    ctx.fillStyle = grd;
    const origin = this.origin(ctx);
    ctx.fillRect(origin.x, origin.y, ctx.canvas.width, ctx.canvas.height);
    ctx.restore();
    return ctx.canvas.transferToImageBitmap();
  }
}
