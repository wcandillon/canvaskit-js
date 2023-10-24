import { CustomShader } from "../c2d";

import { ShaderJS } from "./Shader";

export class ColorShader extends ShaderJS {
  constructor(private readonly color: string) {
    super(
      new CustomShader((ctx: OffscreenCanvasRenderingContext2D) => {
        ctx.fillStyle = this.color;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      })
    );
  }
}
