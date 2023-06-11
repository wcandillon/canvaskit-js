import type { InputFlexibleColorArray, InputPoint } from "canvaskit-wasm";

import { Gradient } from "./Gradient";

export class SweepGradient extends Gradient {
  constructor(
    private readonly c: InputPoint,
    private readonly startAngle: number,
    colors: InputFlexibleColorArray,
    pos: number[] | null
  ) {
    super(colors, pos);
  }

  paintTexture(ctx: OffscreenCanvasRenderingContext2D) {
    const grd = ctx.createConicGradient(this.startAngle, this.c[0], this.c[1]);
    this.colors.forEach((color, i) => {
      grd.addColorStop(this.pos[i], color);
    });
    ctx.fillStyle = grd;
    this.fill(ctx);
    return ctx.canvas.transferToImageBitmap();
  }
}
