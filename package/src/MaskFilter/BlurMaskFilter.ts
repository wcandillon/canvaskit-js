import { SourceGraphic, makeBlur, makeComposite, makeMerge } from "../c2d";
import { BlurStyleEnum } from "../Core";

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
/*
if (respectCTM) {
  // Extract the scaling factors from the current transformation matrix
  let { a, d } = context.currentTransform;

  // Calculate the new sigma, as average of the scaling factors
  sigma *= (Math.abs(a) + Math.abs(d)) / 2;
}
*/
