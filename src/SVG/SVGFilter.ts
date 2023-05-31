const ns = "http://www.w3.org/2000/svg";

type CompositeOperator = "over" | "in" | "out" | "atop" | "xor" | "arithmetic";

export class SVGFilter {
  private filters: SVGElement[] = [];

  constructor(private id: string) {}

  addNoise(
    baseFreqX: number,
    baseFreqY: number,
    octaves: number,
    seed: number,
    _tileW: number,
    _tileH: number,
    type: "turbulence" | "fractalNoise" = "fractalNoise",
    result = "result"
  ) {
    const feTurbulence = document.createElementNS(ns, "feTurbulence");
    feTurbulence.setAttribute("baseFrequency", `${baseFreqX} ${baseFreqY}`);
    feTurbulence.setAttribute("numOctaves", `${octaves}`);
    feTurbulence.setAttribute("seed", `${seed}`);
    feTurbulence.setAttribute("type", type);
    feTurbulence.setAttribute("result", result);
    this.filters.push(feTurbulence);
    return this;
  }

  blur(sigma: number, result = "result") {
    const feGaussianBlur = document.createElementNS(ns, "feGaussianBlur");
    feGaussianBlur.setAttribute("in", "SourceGraphic");
    feGaussianBlur.setAttribute("stdDeviation", `${sigma}`);
    feGaussianBlur.setAttribute("result", result);
    this.filters.push(feGaussianBlur);
    return this;
  }

  composite(in1: string, in2: string, operator: CompositeOperator) {
    const feComposite = document.createElementNS(ns, "feComposite");
    feComposite.setAttribute("in", in1);
    feComposite.setAttribute("in2", in2);
    feComposite.setAttribute("operator", operator);
    this.filters.push(feComposite);
    return this;
  }

  merge(in1: string, in2: string) {
    // Create feMerge
    const feMerge = document.createElementNS(ns, "feMerge");
    // Create feMergeNode for blurred image
    const feMergeNodeBlur = document.createElementNS(ns, "feMergeNode");
    feMergeNodeBlur.setAttribute("in", in1);

    // Create feMergeNode for original image
    const feMergeNodeOriginal = document.createElementNS(ns, "feMergeNode");
    feMergeNodeOriginal.setAttribute("in", in2);

    // Append feMergeNode elements to feMerge
    feMerge.appendChild(feMergeNodeBlur);
    feMerge.appendChild(feMergeNodeOriginal);
    this.filters.push(feMerge);
    return this;
  }

  create() {
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("style", "display: none;");

    const defs = document.createElementNS(ns, "defs");

    const filter = document.createElementNS(ns, "filter");
    filter.setAttribute("id", this.id);

    this.filters.forEach((fe) => {
      filter.appendChild(fe);
    });

    defs.appendChild(filter);

    svg.appendChild(defs);

    document.body.appendChild(svg);
    return `url(#${this.id})`;
  }
}
