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

  createTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = this.ctx.canvas.width;
    canvas.height = this.ctx.canvas.height;
    canvas.setAttribute("style", "display: none;");
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Could not create 2d context");
    }
    return ctx;
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
