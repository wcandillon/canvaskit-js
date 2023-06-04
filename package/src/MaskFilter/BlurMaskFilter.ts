import { BlurStyleEnum } from "../Contants";
import {
  BlurFilter,
  CompositeFilter,
  MergeFilter,
  SourceGraphic,
} from "../ImageFilter/SVG";

import { MaskFilterJS } from "./MaskFilter";

export class BlurMaskFilter extends MaskFilterJS {
  constructor(readonly style: BlurStyleEnum, readonly sigma: number) {
    super();
    const blur = new BlurFilter(sigma, SourceGraphic);
    this.filters.push(blur);
    if (this.style === BlurStyleEnum.Solid) {
      this.filters.push(new MergeFilter([blur, SourceGraphic]));
    } else if (this.style === BlurStyleEnum.Outer) {
      this.filters.push(new CompositeFilter(blur, SourceGraphic, "out"));
    } else if (this.style === BlurStyleEnum.Inner) {
      this.filters.push(new CompositeFilter(blur, SourceGraphic, "in"));
    }
  }
}
