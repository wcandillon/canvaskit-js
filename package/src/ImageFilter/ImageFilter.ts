import type { ImageFilter } from "canvaskit-wasm";

import { HostObject } from "../HostObject";
import type { SVGFilter } from "../SVG";

export abstract class NativeFilter<
  T extends HostObject<T>
> extends HostObject<T> {
  protected filters: SVGFilter[] = [];

  constructor() {
    super();
  }

  getFilters() {
    return this.filters;
  }
}

export abstract class ImageFilterJS
  extends NativeFilter<ImageFilter>
  implements ImageFilter {}
