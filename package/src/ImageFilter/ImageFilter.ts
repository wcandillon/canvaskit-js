import type { ImageFilter } from "canvaskit-wasm";

import { IndexedHostObject } from "../HostObject";
import type { SVGFilter } from "../SVG";

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
