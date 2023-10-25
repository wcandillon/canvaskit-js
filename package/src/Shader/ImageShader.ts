import type { InputMatrix } from "canvaskit-wasm";

import { nativeMatrix } from "../Core";
import { ImageShader as NativeImageShader } from "../c2d";

import { ShaderJS } from "./Shader";

export class ImageShader extends ShaderJS {
  constructor(image: HTMLCanvasElement, localMatrix?: InputMatrix) {
    super(
      new NativeImageShader(
        image,
        localMatrix ? nativeMatrix(localMatrix) : undefined
      )
    );
  }
}
