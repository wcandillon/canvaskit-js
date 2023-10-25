import { makeBlur } from "../c2d";

import { ImageFilterJS } from "./ImageFilter";

export class BlurImageFilter extends ImageFilterJS {
  constructor(
    readonly sigmaX: number,
    readonly sigmaY: number,
    readonly input: ImageFilterJS | null = null
  ) {
    super();
    const blur = makeBlur(sigmaX, sigmaY);
    this._filters.push(blur);
    if (input) {
      this._filters.push(...input.filters);
    }
  }
}
