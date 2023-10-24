import type { InputMatrix } from "canvaskit-wasm";

import { CustomShader } from "../c2d";

import { ShaderJS } from "./Shader";

export class ImageShader extends ShaderJS {
  constructor(image: HTMLCanvasElement, _localMatrix?: InputMatrix) {
    super(
      new CustomShader((ctx: OffscreenCanvasRenderingContext2D) => {
        ctx.drawImage(image, 0, 0);
      })
    );
  }
}
