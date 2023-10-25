import type { EmbindEnumEntity } from "canvaskit-wasm";

import { BlendShader as NativeBlendShader } from "../c2d";
import { nativeBlendMode } from "../Paint";

import { ShaderJS } from "./Shader";

export class BlendShader extends ShaderJS {
  constructor(blendMode: EmbindEnumEntity, child1: ShaderJS, child2: ShaderJS) {
    super(
      new NativeBlendShader(
        nativeBlendMode(blendMode),
        child1.getShader(),
        child2.getShader()
      )
    );
  }
}
