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
  constructor(
    stdDeviation: number,
    inFilter: SVGFilter = SourceGraphic,
    id = "result"
  ) {
    super(
      document.createElementNS("http://www.w3.org/2000/svg", "feGaussianBlur")
    );
    this.filter.setAttribute("in", inFilter.getId());
    this.filter.setAttribute("stdDeviation", stdDeviation.toString());
    this.filter.setAttribute("result", id);
  }
}

export type TurbulenceType = "fractalNoise" | "turbulence";

export class TurbulenceFilter extends BaseSVGFilter<SVGFETurbulenceElement> {
  constructor(
    baseFrequencyX: number,
    baseFrequencyY: number,
    numOctaves: number,
    seed: number,
    type: TurbulenceType,
    id = "result"
  ) {
    super(document.createElementNS(ns, "feTurbulence"));
    this.filter.setAttribute(
      "baseFrequency",
      [baseFrequencyX.toString(), baseFrequencyY.toString()].join(" ")
    );
    this.filter.setAttribute("seed", seed.toString());
    this.filter.setAttribute("numOctaves", numOctaves.toString());
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

type ColorMatrixValues =
  | { type: "matrix"; values: Float32Array }
  | { type: "saturate" | "hueRotate"; values: number }
  | { type: "luminanceToAlpha"; values?: never };

export class ColorMatrixFilter extends BaseSVGFilter<SVGFEColorMatrixElement> {
  constructor(input: ColorMatrixValues, id = "result") {
    super(document.createElementNS(ns, "feColorMatrix"));
    this.filter.setAttribute("in", "SourceGraphic");
    this.filter.setAttribute("type", input.type);
    if (input.type !== "luminanceToAlpha") {
      this.filter.setAttribute(
        "values",
        Array.isArray(input.values)
          ? input.values.join(" ")
          : input.values.toString()
      );
    }
    this.filter.setAttribute("result", id);
  }
}
