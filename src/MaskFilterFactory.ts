import type {
  MaskFilterFactory as CKMaskFilterFactory,
  EmbindEnumEntity,
  MaskFilter,
} from "canvaskit-wasm";

import { HostObject } from "./HostObject";
import { BlurStyleEnum } from "./Contants";
import { addFilters, blur, composite, merge } from "./Filters";

export abstract class MaskFilterLite
  extends HostObject<MaskFilter>
  implements MaskFilter
{
  abstract toFilter(): string;
}

export class BlurMaskFilterLite extends MaskFilterLite {
  private static count = 0;
  private readonly id: string;

  constructor(
    private readonly style: BlurStyleEnum,
    private readonly sigma: number
  ) {
    super();
    BlurMaskFilterLite.count++;
    this.id = `blur-mask-filter-${BlurMaskFilterLite.count}`;
  }

  toFilter(): string {
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

export const MaskFilterFactory: CKMaskFilterFactory = {
  MakeBlur: function (
    style: EmbindEnumEntity,
    sigma: number,
    _respectCTM: boolean
  ): MaskFilter {
    return new BlurMaskFilterLite(style.value, sigma);
  },
};
