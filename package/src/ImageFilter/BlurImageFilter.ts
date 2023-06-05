import { makeBlur } from "../SVG";

import { ImageFilterJS } from "./ImageFilter";

export class BlurImageFilter extends ImageFilterJS {
  constructor(readonly sigma: number, input: ImageFilterJS | null = null) {
    super();
    const blur = makeBlur(sigma);
    this.filters.push(blur);
    if (input) {
      this.filters.push(...input.getFilters());
    }
  }
}
