import type { InputFlexibleColorArray, InputPoint } from "canvaskit-wasm";

import { project2d } from "../../Matrix3";

import { Gradient } from "./Gradient";

export class LinearGradient extends Gradient {
  private start: DOMPoint;
  private end: DOMPoint;

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

  paint(ctx: OffscreenCanvasRenderingContext2D) {
    const m3 = ctx.getTransform();
    const start = project2d(this.start, m3);
    const end = project2d(this.end, m3);
    ctx.save();
    ctx.setTransform();
    const grd = ctx.createLinearGradient(start.x, start.y, end.x, end.y);
    this.colors.forEach((color, i) => {
      grd.addColorStop(this.pos[i], color);
    });
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.restore();
    return ctx.canvas.transferToImageBitmap();
  }
}
