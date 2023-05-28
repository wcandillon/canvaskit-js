import type { GrDirectContext } from "canvaskit-wasm";

import { HostObject } from "./HostObject";

export class GrDirectContextLite
  extends HostObject<GrDirectContext>
  implements GrDirectContext
{
  constructor(public readonly ctx: CanvasRenderingContext2D) {
    super();
  }

  getResourceCacheLimitBytes(): number {
    throw new Error("Method not implemented.");
  }
  getResourceCacheUsageBytes(): number {
    throw new Error("Method not implemented.");
  }
  releaseResourcesAndAbandonContext(): void {
    throw new Error("Method not implemented.");
  }
  setResourceCacheLimitBytes(_bytes: number): void {
    throw new Error("Method not implemented.");
  }
}
