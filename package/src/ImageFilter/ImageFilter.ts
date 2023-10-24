import type { ImageFilter } from "canvaskit-wasm";

import type { SVGFilter } from "../c2d";
import { IndexedHostObject } from "../HostObject";

export abstract class NativeFilter<
  T extends string
> extends IndexedHostObject<T> {
  protected _filters: SVGFilter[] = [];

  constructor(type: T) {
    super(type, "filter");
  }

  get filters() {
    return this._filters;
  }
}

export abstract class ImageFilterJS
  extends NativeFilter<"ImageFilter">
  implements ImageFilter
{
  constructor() {
    super("ImageFilter");
  }
}
