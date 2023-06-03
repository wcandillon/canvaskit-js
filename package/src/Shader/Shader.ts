import type { Shader } from "canvaskit-wasm";

import { HostObject } from "../HostObject";

export abstract class ShaderJS extends HostObject<Shader> implements Shader {
  constructor() {
    super();
  }

  abstract paint(buffer: OffscreenCanvasRenderingContext2D): ImageBitmap;
}
