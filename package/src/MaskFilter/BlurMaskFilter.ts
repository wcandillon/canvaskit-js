import { BlurStyleEnum } from "../Contants";
import { SVGFilter } from "../SVG";

import { MaskFilterJS } from "./MaskFilter";

export class BlurMaskFilter extends MaskFilterJS {
  private static count = 0;
  private filterURL: string;

  constructor(readonly style: BlurStyleEnum, readonly sigma: number) {
    super();
    BlurMaskFilter.count++;
    const id = `blur-mask-filter-${BlurMaskFilter.count}`;
    const filter = new SVGFilter(id);
    const blurName = "blurred";
    if (this.style === BlurStyleEnum.Solid) {
      filter.blur(this.sigma, blurName);
      filter.merge(blurName, "SourceGraphic");
    } else if (this.style === BlurStyleEnum.Normal) {
      filter.blur(this.sigma);
    } else if (this.style === BlurStyleEnum.Outer) {
      filter.blur(this.sigma, blurName);
      filter.composite(blurName, "SourceGraphic", "out");
    } else {
      filter.blur(this.sigma, blurName);
      filter.composite(blurName, "SourceGraphic", "in");
    }
    this.filterURL = filter.create();
  }

  getFilter(): string {
    return this.filterURL;
  }
}
