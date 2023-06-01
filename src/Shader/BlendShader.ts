import type { EmbindEnumEntity } from "canvaskit-wasm";

import { getBlendMode } from "../Paint/BlendMode";

import { ShaderJS } from "./Shader";

export class BlendShader extends ShaderJS {
  constructor(
    private readonly blendMode: EmbindEnumEntity,
    private readonly child1: ShaderJS,
    private readonly child2: ShaderJS
  ) {
    super();
  }

  getTexture(width: number, height: number) {
    const canvas = new OffscreenCanvas(width, height);
    const t1 = this.child1.getTexture(width, height);
    const t2 = this.child2.getTexture(width, height);
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Failed to get 2d context");
    }
    ctx.globalCompositeOperation = getBlendMode(this.blendMode);
    ctx.drawImage(t1, 0, 0);
    ctx.drawImage(t2, 0, 0);
    return canvas;
  }
}
