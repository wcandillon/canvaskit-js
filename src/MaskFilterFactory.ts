import type {
  MaskFilterFactory as CKMaskFilterFactory,
  EmbindEnumEntity,
  MaskFilter,
} from "canvaskit-wasm";

import { HostObject } from "./HostObject";

export abstract class MaskFilterLite
  extends HostObject<MaskFilter>
  implements MaskFilter
{
  abstract toFilter(): string;
}

export class BlurMaskFilterLite extends MaskFilterLite {
  constructor(_style: number, private readonly sigma: number) {
    super();
  }

  toFilter(): string {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");

    const filter = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "filter"
    );
    filter.id = "myFilter";

    // Adding some filter effect (like feGaussianBlur)
    const blur = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "feGaussianBlur"
    );
    blur.setAttribute("in", "SourceGraphic");
    blur.setAttribute("stdDeviation", `${this.sigma}`);

    filter.appendChild(blur);
    defs.appendChild(filter);
    svg.appendChild(defs);
    document.body.appendChild(svg);
    return `url(#${filter.id})`;
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
