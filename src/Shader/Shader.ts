import type { Shader } from "canvaskit-wasm";

import { HostObject } from "../HostObject";

export abstract class ShaderJS extends HostObject<Shader> implements Shader {
  constructor() {
    super();
  }

  // Paint may return the same texture that was passed in, or a new one.
  abstract paint(texture: OffscreenCanvasRenderingContext2D): ImageBitmap;
}
