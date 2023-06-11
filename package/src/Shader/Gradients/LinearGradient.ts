import type { InputFlexibleColorArray, InputPoint } from "canvaskit-wasm";

import { Gradient } from "./Gradient";

export class LinearGradient extends Gradient {
  constructor(
    private readonly start: InputPoint,
    private readonly end: InputPoint,
    colors: InputFlexibleColorArray,
    pos: number[] | null
  ) {
    super(colors, pos);
  }

  paint(ctx: OffscreenCanvasRenderingContext2D) {
    const { start, end } = this;
    const grd = ctx.createLinearGradient(start[0], start[1], end[0], end[1]);
    this.colors.forEach((color, i) => {
      grd.addColorStop(this.pos[i], color);
    });
    ctx.fillStyle = grd;
    this.fill(ctx);
    return ctx.canvas.transferToImageBitmap();
  }
}
