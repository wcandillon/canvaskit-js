import type { Shader } from "canvaskit-wasm";

import { HostObject } from "./HostObject";

export abstract class ShaderLite extends HostObject<Shader> implements Shader {
  abstract toGradient(ctx: CanvasRenderingContext2D): CanvasGradient;
}
