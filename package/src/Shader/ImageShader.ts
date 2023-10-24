import type { InputMatrix } from "canvaskit-wasm";

import { CustomShader } from "../c2d";
import { nativeMatrix } from "../Core";

import { ShaderJS } from "./Shader";

export class ImageShader extends ShaderJS {
  constructor(image: HTMLCanvasElement, localMatrix?: InputMatrix) {
    super(
      new CustomShader(
        (ctx: OffscreenCanvasRenderingContext2D) => {
          ctx.save();
          if (localMatrix) {
            ctx.setTransform(nativeMatrix(localMatrix));
          } else {
            ctx.resetTransform();
          }
          ctx.drawImage(image, 0, 0);
          ctx.restore();
        },
        localMatrix ? nativeMatrix(localMatrix) : undefined
      )
    );
  }
}
