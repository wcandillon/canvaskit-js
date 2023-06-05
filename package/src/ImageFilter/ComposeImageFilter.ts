import { ImageFilterJS } from "./ImageFilter";

export class ComposeImageFilter extends ImageFilterJS {
  constructor(outer: ImageFilterJS | null, inner: ImageFilterJS | null) {
    super();
    if (outer) {
      this.filters.push(...outer.getFilters());
    }
    if (inner) {
      // The input here is SourceGraphic but it should be result
      this.filters.push(...inner.getFilters());
    }
  }
}
