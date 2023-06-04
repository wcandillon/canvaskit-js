import { ImageFilterJS } from "./ImageFilter";

export class ComposeImageFilter extends ImageFilterJS {
  constructor(outer: ImageFilterJS | null, inner: ImageFilterJS | null) {
    super();
    if (outer) {
      this.filters.push(...outer.getFilters());
    }
    if (inner) {
      this.filters.push(...inner.getFilters());
    }
  }
}
