import type { GrDirectContext } from "canvaskit-wasm";

import { HostObject } from "../HostObject";

export class GrDirectContextJS
  extends HostObject<"GrDirectContext">
  implements GrDirectContext
{
  private limit = 5 * 3840 * 2160 * 4;
  private cache: Map<string, ImageBitmap> = new Map();

  constructor(public readonly ctx: CanvasRenderingContext2D) {
    super("GrDirectContext");
  }

  getResourceCacheLimitBytes() {
    return this.limit;
  }

  getResourceCacheUsageBytes() {
    return Array.from(this.cache.values()).reduce(
      (acc, bitmap) => acc + bitmap.width * bitmap.height * 4,
      0
    );
  }

  releaseResourcesAndAbandonContext() {
    this.cache.clear();
  }

  setResourceCacheLimitBytes(limit: number) {
    this.limit = limit;
  }

  get(id: string) {
    return this.cache.get(id);
  }

  set(id: string, bitmap: ImageBitmap) {
    this.cache.set(id, bitmap);
  }
}
