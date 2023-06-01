import type { GrDirectContext } from "canvaskit-wasm";

import { HostObject } from "../HostObject";

export class GrDirectContextJS
  extends HostObject<GrDirectContext>
  implements GrDirectContext
{
  private limit = 0;
  private cache: CanvasRenderingContext2D[] = [];

  constructor(public readonly ctx: CanvasRenderingContext2D) {
    super();
  }

  getResourceCacheLimitBytes(): number {
    return this.limit;
  }

  getResourceCacheUsageBytes(): number {
    return this.cache.reduce(
      (acc, ctx) => acc + ctx.canvas.width * ctx.canvas.height * 4,
      0
    );
  }

  releaseResourcesAndAbandonContext(): void {
    this.cache = [];
  }

  setResourceCacheLimitBytes(limit: number): void {
    this.limit = limit;
  }
}
