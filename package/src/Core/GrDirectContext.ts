import type { GrDirectContext } from "canvaskit-wasm";

import { HostObject } from "../HostObject";

export class GrDirectContextJS
  extends HostObject<GrDirectContext>
  implements GrDirectContext
{
  private limit = 5 * 2048 * 2048 * 4;
  private cache: Map<ImageBitmap, true> = new Map();

  constructor() {
    super();
  }

  getResourceCacheLimitBytes() {
    return this.limit;
  }

  getResourceCacheUsageBytes() {
    return Array.from(this.cache.entries()).reduce(
      (acc, [bitmap]) => acc + bitmap.width * bitmap.height * 4,
      0
    );
  }

  releaseResourcesAndAbandonContext() {
    this.cache.clear();
  }

  setResourceCacheLimitBytes(limit: number) {
    this.limit = limit;
  }
}
