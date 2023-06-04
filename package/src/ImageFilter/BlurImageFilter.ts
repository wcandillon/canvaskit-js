import { ImageFilterJS } from "./ImageFilter";
import { BlurFilter } from "./SVG";

export class BlurImageFilter extends ImageFilterJS {
  constructor(readonly sigma: number, input: ImageFilterJS | null = null) {
    super();
    const blur = new BlurFilter(sigma);
    this.filters.push(blur);
    if (input) {
      this.filters.push(...input.getFilters());
    }
  }
}
