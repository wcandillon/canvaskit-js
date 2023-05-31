import { BlurStyleEnum } from "../Contants";
import { SVGFilter } from "../SVG";

import { MaskFilterJS } from "./MaskFilter";

export class BlurMaskFilter extends MaskFilterJS {
  private static count = 0;
  private readonly id: string;

  constructor(
    private readonly style: BlurStyleEnum,
    private readonly sigma: number
  ) {
    super();
    BlurMaskFilter.count++;
    this.id = `blur-mask-filter-${BlurMaskFilter.count}`;
  }

  getFilter(): string {
    const filter = new SVGFilter(this.id);
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
    return filter.create();
  }
}
