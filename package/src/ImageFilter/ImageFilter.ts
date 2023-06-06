import type { ImageFilter } from "canvaskit-wasm";

import type { HostObject } from "../HostObject";
import { IndexedHostObject } from "../HostObject";
import type { SVGFilter } from "../SVG";

export abstract class NativeFilter<
  T extends HostObject<T>
> extends IndexedHostObject<T> {
  protected _filters: SVGFilter[] = [];

  constructor() {
    super("filter");
  }

  get filters() {
    return this._filters;
  }
}

export abstract class ImageFilterJS
  extends NativeFilter<ImageFilter>
  implements ImageFilter {}
