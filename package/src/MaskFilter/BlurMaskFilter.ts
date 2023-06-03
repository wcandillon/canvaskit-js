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
    super(new BlurFilter(sigma, SourceGraphic));
    if (this.style === BlurStyleEnum.Solid) {
      this.filter = new MergeFilter([this.filter, SourceGraphic]);
    } else if (this.style === BlurStyleEnum.Outer) {
      this.filter = new CompositeFilter(this.filter, SourceGraphic, "out");
    } else {
      this.filter = new CompositeFilter(this.filter, SourceGraphic, "in");
    }
  }

  getFilter() {
    return this.filter;
  }
}
