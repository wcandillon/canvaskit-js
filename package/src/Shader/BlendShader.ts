import type { EmbindEnumEntity } from "canvaskit-wasm";

import { CustomShader } from "../c2d";
import { nativeBlendMode } from "../Paint";

import { ShaderJS } from "./Shader";

export class BlendShader extends ShaderJS {
  constructor(blendMode: EmbindEnumEntity, child1: ShaderJS, child2: ShaderJS) {
    super(
      new CustomShader(
        (texture: OffscreenCanvasRenderingContext2D, ctm: DOMMatrix) => {
          const { width, height } = texture.canvas;
          // const t1 = child1.paint(t0);
          const t1 = child1.getShader().render(width, height, ctm);
          texture.globalCompositeOperation = nativeBlendMode(blendMode);
          texture.drawImage(t1, 0, 0);
          const t2 = child2.getShader().render(width, height, ctm);
          texture.drawImage(t2, 0, 0);
        }
      )
    );
  }
}
