import type { InputFlexibleColorArray, InputPoint } from "canvaskit-wasm";

import { project2d } from "../../Matrix3";

import { Gradient } from "./Gradient";

export class SweepGradient extends Gradient {
  private readonly c: DOMPoint;

  constructor(
    c: InputPoint,
    private readonly startAngle: number,
    colors: InputFlexibleColorArray,
    pos: number[] | null
  ) {
    super(colors, pos);
    this.c = new DOMPoint(...c);
  }

  paint(ctx: OffscreenCanvasRenderingContext2D, matrix: DOMMatrix) {
    const c = project2d(this.c, matrix);
    const grd = ctx.createConicGradient(this.startAngle, c.x, c.y);
    this.colors.forEach((color, i) => {
      grd.addColorStop(this.pos[i], color);
    });
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    return ctx.canvas.transferToImageBitmap();
  }
}
