import { BlurStyleEnum } from "../Core";
import { SourceGraphic, makeBlur, makeComposite, makeMerge } from "../SVG";

import { MaskFilterJS } from "./MaskFilter";

export class BlurMaskFilter extends MaskFilterJS {
  constructor(readonly style: BlurStyleEnum, readonly sigma: number) {
    super();
    const blur = makeBlur(sigma, sigma);
    this._filters.push(blur);
    if (this.style === BlurStyleEnum.Solid) {
      this._filters.push(makeMerge([blur, SourceGraphic]));
    } else if (this.style === BlurStyleEnum.Outer) {
      this._filters.push(makeComposite(blur, SourceGraphic, "out"));
    } else if (this.style === BlurStyleEnum.Inner) {
      this._filters.push(makeComposite(blur, SourceGraphic, "in"));
    }
  }
}
