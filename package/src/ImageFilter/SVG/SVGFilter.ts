const ns = "http://www.w3.org/2000/svg";

export interface SVGFilter<T extends SVGElement = SVGElement> {
  getFilter(): T;
  getId(): string;
}

export abstract class BaseSVGFilter<T extends SVGElement = SVGElement>
  implements SVGFilter<T>
{
  constructor(protected filter: T) {}

  getFilter(): T {
    return this.filter;
  }

  getId(): string {
    const id = this.filter.getAttribute("result");
    if (!id) {
      throw new Error("SVGFilter: id is null");
    }
    return id;
  }
}

export class SourceGraphicFilter implements SVGFilter {
  getFilter(): SVGElement {
    throw new Error("Cannot get filter from SourceGraphicFilter");
  }
  getId() {
    return "SourceGraphic";
  }
}

export const SourceGraphic = new SourceGraphicFilter();

export class BlurFilter extends BaseSVGFilter<SVGFEGaussianBlurElement> {
  constructor(stdDeviation: number, inFilter: SVGFilter, id = "result") {
    super(
      document.createElementNS("http://www.w3.org/2000/svg", "feGaussianBlur")
    );
    this.filter.setAttribute("in", inFilter.getId());
    this.filter.setAttribute("stdDeviation", stdDeviation.toString());
    this.filter.setAttribute("result", id);
  }
}
type StitchTiles = "noStitch" | "stitch";
type TurbulenceType = "fractalNoise" | "turbulence";

export class TurbulenceFilter extends BaseSVGFilter<SVGFETurbulenceElement> {
  constructor(
    baseFrequency: number,
    numOctaves: number,
    stitchTiles: StitchTiles,
    type: TurbulenceType,
    id = "result"
  ) {
    super(document.createElementNS(ns, "feTurbulence"));
    this.filter.setAttribute("baseFrequency", baseFrequency.toString());
    this.filter.setAttribute("numOctaves", numOctaves.toString());
    this.filter.setAttribute("stitchTiles", stitchTiles);
    this.filter.setAttribute("type", type);
    this.filter.setAttribute("result", id);
  }
}

type CompositeOperator = "over" | "in" | "out" | "atop" | "xor" | "arithmetic";

export class CompositeFilter extends BaseSVGFilter<SVGFECompositeElement> {
  constructor(
    inFilter: SVGFilter,
    in2Filter: SVGFilter,
    operator: CompositeOperator,
    id = "result"
  ) {
    super(document.createElementNS(ns, "feComposite"));
    this.filter.setAttribute("in", inFilter.getId());
    this.filter.setAttribute("in2", in2Filter.getId());
    this.filter.setAttribute("operator", operator);
    this.filter.setAttribute("result", id);
  }
}

export class MergeFilter extends BaseSVGFilter<SVGFEMergeElement> {
  constructor(inFilters: SVGFilter[], id = "result") {
    super(document.createElementNS(ns, "feMerge"));
    inFilters.forEach((filter) => {
      const mergeNode = document.createElementNS(ns, "feMergeNode");
      mergeNode.setAttribute("in", filter.getId());
      this.filter.appendChild(mergeNode);
    });
    this.filter.setAttribute("result", id);
  }
}

type BlendMode = "normal" | "multiply" | "screen" | "darken" | "lighten";
export class BlendFilter extends BaseSVGFilter<SVGFEBlendElement> {
  constructor(
    inFilter: BaseSVGFilter,
    in2Filter: BaseSVGFilter,
    mode: BlendMode,
    id = "result"
  ) {
    super(document.createElementNS(ns, "feBlend"));
    this.filter.setAttribute("in", inFilter.getId());
    this.filter.setAttribute("in2", in2Filter.getId());
    this.filter.setAttribute("mode", mode);
    this.filter.setAttribute("result", id);
  }
}
