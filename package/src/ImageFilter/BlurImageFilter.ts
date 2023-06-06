import { makeBlur } from "../SVG";

import { ImageFilterJS } from "./ImageFilter";

export class BlurImageFilter extends ImageFilterJS {
  constructor(readonly sigma: number, input: ImageFilterJS | null = null) {
    super();
    const blur = makeBlur(sigma);
    this._filters.push(blur);
    if (input) {
      this._filters.push(...input.filters);
    }
  }
}
