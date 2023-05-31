import { BlurStyleEnum } from "../Contants";
import { addFilters, blur, composite, merge } from "../Filters";

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
    const blurName = "blurred";
    const fblur = blur(this.sigma, blurName);
    const fmerge = merge(blurName, "SourceGraphic");
    if (this.style === BlurStyleEnum.Solid) {
      addFilters(this.id, fblur, fmerge);
    } else if (this.style === BlurStyleEnum.Normal) {
      addFilters(this.id, blur(this.sigma));
    } else if (this.style === BlurStyleEnum.Outer) {
      addFilters(this.id, fblur, composite(blurName, "SourceGraphic", "out"));
    } else {
      addFilters(this.id, fblur, composite(blurName, "SourceGraphic", "in"));
    }
    return `url(#${this.id})`;
  }
}
