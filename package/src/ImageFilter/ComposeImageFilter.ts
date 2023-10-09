import type { NativeFilter } from "./ImageFilter";
import { ImageFilterJS } from "./ImageFilter";

export class ComposeImageFilter extends ImageFilterJS {
  constructor(
    outer: NativeFilter<string> | null,
    inner: NativeFilter<string> | null
  ) {
    super();
    if (inner) {
      // The input here is SourceGraphic but it should be result
      this._filters.push(...inner.filters);
    }
    if (outer) {
      this._filters.push(...outer.filters);
    }
  }
}
