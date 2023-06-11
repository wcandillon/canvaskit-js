import type { RuntimeEffectContext } from "../RuntimeEffect";

import { ShaderJS } from "./Shader";

export class RuntimeEffectShader extends ShaderJS {
  constructor(private readonly ctx: RuntimeEffectContext) {
    super();
  }

  paint(ctx: OffscreenCanvasRenderingContext2D) {
    if (this.texture === null) {
      this.texture = this.paintTexture(ctx);
    }
    return this.texture;
  }

  paintTexture(ctx: OffscreenCanvasRenderingContext2D) {
    const { gl } = this.ctx;
    const { width, height } = ctx.canvas;
    const canvas = gl.canvas as OffscreenCanvas;
    gl.canvas.width = width;
    gl.canvas.height = height;
    this.ctx.children.forEach(({ shader, index, texture }) => {
      gl.activeTexture(gl.TEXTURE0 + index);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      // Upload the image into the texture
      const child = shader.paint(ctx);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        child
      );
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.generateMipmap(gl.TEXTURE_2D);
    });
    gl.viewport(0, 0, width, height);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    const bitmap = canvas.transferToImageBitmap();
    return bitmap;
  }
}
