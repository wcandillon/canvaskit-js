import type { EmbindEnumEntity } from "canvaskit-wasm";

import { createOffscreenTexture } from "../Core/Platform";
import { nativeBlendMode } from "../Paint";
import type { GrDirectContextJS } from "../Core";

import { ShaderJS } from "./Shader";

export class BlendShader extends ShaderJS {
  constructor(
    private readonly blendMode: EmbindEnumEntity,
    child1: ShaderJS,
    child2: ShaderJS
  ) {
    super(child1, child2);
  }

  paint(texture: OffscreenCanvasRenderingContext2D, grCtx: GrDirectContextJS) {
    const { width, height } = texture.canvas;
    const [child1, child2] = this.children!;
    const t0 = createOffscreenTexture(width, height);
    const t1 = child1.paint(t0, grCtx);
    texture.globalCompositeOperation = nativeBlendMode(this.blendMode);
    texture.drawImage(t1, 0, 0);
    const t2 = child2.paint(t0, grCtx);
    texture.drawImage(t2, 0, 0);
    return texture.canvas.transferToImageBitmap();
  }
}
