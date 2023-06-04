import { ImageFilterJS } from "./ImageFilter";
import { BlurFilter } from "./SVG";

export class BlurImageFilter extends ImageFilterJS {
  constructor(readonly sigma: number) {
    super();
    const blur = new BlurFilter(sigma);
    this.filters.push(blur);
    this.create();
  }
}
