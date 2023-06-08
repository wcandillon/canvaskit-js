import type { InputFlexibleColorArray, InputPoint } from "canvaskit-wasm";

import { project2d } from "../../Matrix3";

import { Gradient } from "./Gradient";

export class TwoPointConicalGradient extends Gradient {
  private readonly c1: DOMPoint;
  private readonly c2: DOMPoint;
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

  paint(ctx: OffscreenCanvasRenderingContext2D, matrix: DOMMatrix) {
    const { r1, r2 } = this;
    const c1 = project2d(this.c1, matrix);
    const c2 = project2d(this.c2, matrix);
    const grd = ctx.createRadialGradient(c1.x, c1.y, r1, c2.x, c2.y, r2);
    this.colors.forEach((color, i) => {
      grd.addColorStop(this.pos[i], color);
    });
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    return ctx.canvas.transferToImageBitmap();
  }
}
