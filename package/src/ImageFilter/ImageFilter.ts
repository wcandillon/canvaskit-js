import type { ImageFilter } from "canvaskit-wasm";

import { HostObject } from "../HostObject";

import type { SVGFilter } from "./SVG";
import { svgCtx } from "./SVG";

export abstract class NativeFilter<
  T extends HostObject<T>
> extends HostObject<T> {
  private static count = 0;

  protected filters: SVGFilter[] = [];
  private id: string;

  constructor() {
    super();
    this.id = `filter-${NativeFilter.count}`;
    NativeFilter.count++;
  }

  create() {
    svgCtx.create(this.id, this.filters);
  }

  dispose() {
    svgCtx.disposeFilter(this.id);
  }

  getFilter(): string {
    return `url(#${this.id})`;
  }
}

export abstract class ImageFilterJS
  extends NativeFilter<ImageFilter>
  implements ImageFilter {}
