import type { InputFlexibleColorArray, InputPoint } from "canvaskit-wasm";

import { project2d } from "../../Matrix3";

import { Gradient } from "./Gradient";

export class TwoPointConicalGradient extends Gradient {
  private c1: DOMPoint;
  private c2: DOMPoint;

  constructor(
    c1: InputPoint,
    private readonly r1: number,
    c2: InputPoint,
    private readonly r2: number,
    colors: InputFlexibleColorArray,
    pos: number[] | null
  ) {
    super(colors, pos);
    this.c1 = new DOMPoint(...c1);
    this.c2 = new DOMPoint(...c2);
  }

  paint(ctx: OffscreenCanvasRenderingContext2D) {
    const { r1, r2 } = this;
    const m3 = ctx.getTransform();
    const c1 = project2d(this.c1, m3);
    const c2 = project2d(this.c2, m3);
    const grd = ctx.createRadialGradient(c1.x, c1.y, r1, c2.x, c2.y, r2);
    ctx.save();
    ctx.setTransform();
    this.colors.forEach((color, i) => {
      grd.addColorStop(this.pos[i], color);
    });
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.restore();
    return ctx.canvas.transferToImageBitmap();
  }
}
