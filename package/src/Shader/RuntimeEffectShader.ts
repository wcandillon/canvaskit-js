import type {
  RuntimeEffectChildren,
  RuntimeEffectContext,
} from "../RuntimeEffect";

import { ShaderJS } from "./Shader";

export class RuntimeEffectShader extends ShaderJS {
  constructor(
    private readonly ctx: RuntimeEffectContext,
    private readonly childrenCtx: RuntimeEffectChildren,
    children: ShaderJS[]
  ) {
    super(...children);
  }

  paint(ctx: OffscreenCanvasRenderingContext2D) {
    const { gl } = this.ctx;
    const { width, height } = ctx.canvas;
    const canvas = gl.canvas as OffscreenCanvas;

    gl.canvas.width = width;
    gl.canvas.height = height;
    this.childrenCtx.forEach(({ texture, location }, index) => {
      if (!this.children) {
        return;
      }
      const child = this.children[index].paint(ctx);
      gl.activeTexture(gl.TEXTURE0 + index);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.uniform1i(location, index);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        child
      );
    });
    gl.viewport(0, 0, width, height);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    return canvas.transferToImageBitmap();
  }
}
