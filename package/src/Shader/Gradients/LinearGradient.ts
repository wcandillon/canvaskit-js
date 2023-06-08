import type { InputFlexibleColorArray, InputPoint } from "canvaskit-wasm";

import { project2d } from "../../Matrix3";

import { Gradient } from "./Gradient";

export class LinearGradient extends Gradient {
  private readonly start: DOMPoint;
  private readonly end: DOMPoint;

  constructor(
    start: InputPoint,
    end: InputPoint,
    colors: InputFlexibleColorArray,
    pos: number[] | null
  ) {
    super(colors, pos);
    this.start = new DOMPoint(...start);
    this.end = new DOMPoint(...end);
  }

  paint(ctx: OffscreenCanvasRenderingContext2D, matrix: DOMMatrix) {
    const start = project2d(this.start, matrix);
    const end = project2d(this.end, matrix);
    const grd = ctx.createLinearGradient(start.x, start.y, end.x, end.y);
    this.colors.forEach((color, i) => {
      grd.addColorStop(this.pos[i], color);
    });
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    return ctx.canvas.transferToImageBitmap();
  }
}
