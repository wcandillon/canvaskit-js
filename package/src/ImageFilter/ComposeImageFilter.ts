import { ImageFilterJS } from "./ImageFilter";

export class ComposeImageFilter extends ImageFilterJS {
  constructor(outer: ImageFilterJS | null, inner: ImageFilterJS | null) {
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
