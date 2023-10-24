import type { EmbindEnumEntity } from "canvaskit-wasm";

import { createOffscreenTexture } from "../Core/Platform";
import { CustomShader } from "../c2d";

import { ShaderJS } from "./Shader";

export class BlendShader extends ShaderJS {
  constructor(
    _blendMode: EmbindEnumEntity,
    _child1: ShaderJS,
    _child2: ShaderJS
  ) {
    super(
      new CustomShader((texture: OffscreenCanvasRenderingContext2D) => {
        const { width, height } = texture.canvas;
        const t0 = createOffscreenTexture(width, height);
        console.log(!t0);
        // const t1 = child1.paint(t0);
        // texture.globalCompositeOperation = nativeBlendMode(blendMode);
        // texture.drawImage(t1, 0, 0);
        // const t2 = child2.paint(t0);
        // texture.drawImage(t2, 0, 0);
      })
    );
  }
}
