import type { EmbindEnumEntity } from "canvaskit-wasm";

import { getBlendMode } from "../Paint/BlendMode";
import { createOffscreenTexture } from "../Core/Platform";

import { ShaderJS } from "./Shader";

export class BlendShader extends ShaderJS {
  constructor(
    private readonly blendMode: EmbindEnumEntity,
    private readonly child1: ShaderJS,
    private readonly child2: ShaderJS
  ) {
    super();
  }

  paint(texture: OffscreenCanvasRenderingContext2D) {
    const { width, height } = texture.canvas;
    const t0 = createOffscreenTexture(width, height);
    const t1 = this.child1.paint(t0);
    texture.globalCompositeOperation = getBlendMode(this.blendMode);
    texture.drawImage(t1, 0, 0);
    t1.close();
    const t2 = this.child2.paint(t0);
    texture.drawImage(t2, 0, 0);
    t2.close();
    return texture.canvas.transferToImageBitmap();
  }
}
