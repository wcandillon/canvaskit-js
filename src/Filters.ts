const ns = "http://www.w3.org/2000/svg";

export const noise = (
  baseFreqX: number,
  baseFreqY: number,
  octaves: number,
  seed: number,
  _tileW: number,
  _tileH: number,
  result = "result"
) => {
  // Create the feTurbulence element
  const feTurbulence = document.createElementNS(ns, "feTurbulence");
  feTurbulence.setAttribute("baseFrequency", `${baseFreqX} ${baseFreqY}`);
  feTurbulence.setAttribute("numOctaves", `${octaves}`);
  feTurbulence.setAttribute("seed", `${seed}`);
  feTurbulence.setAttribute("type", "fractalNoise");
  feTurbulence.setAttribute("result", result);

  // Create the feTile element
  // const feTile = document.createElementNS(ns, "feTile");
  // feTile.setAttribute("in", result);
  // feTile.setAttribute("width", `${tileW}`);
  // feTile.setAttribute("height", `${tileH}`);
  // feTile.setAttribute("result", result);

  return feTurbulence;
};

export const blur = (sigma: number, result = "result") => {
  const feGaussianBlur = document.createElementNS(ns, "feGaussianBlur");
  feGaussianBlur.setAttribute("in", "SourceGraphic");
  feGaussianBlur.setAttribute("stdDeviation", `${sigma}`);
  feGaussianBlur.setAttribute("result", result);
  return feGaussianBlur;
};

type CompositeOperator = "over" | "in" | "out" | "atop" | "xor" | "arithmetic";

export const composite = (
  in1: string,
  in2: string,
  operator: CompositeOperator
) => {
  const feComposite = document.createElementNS(ns, "feComposite");
  feComposite.setAttribute("in", in1);
  feComposite.setAttribute("in2", in2);
  feComposite.setAttribute("operator", operator);
  return feComposite;
};

export const merge = (in1: string, in2: string) => {
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
  return feMerge;
};

export const addFilters = (id: string, ...filters: SVGElement[]) => {
  // Create the SVG element
  const svg = document.createElementNS(ns, "svg");

  // Create the defs element
  const defs = document.createElementNS(ns, "defs");

  // Create the filter
  const filter = document.createElementNS(ns, "filter");
  filter.setAttribute("id", id);

  filters.forEach((fe) => {
    filter.appendChild(fe);
  });

  // Append filter to defs
  defs.appendChild(filter);

  // Append defs to SVG
  svg.appendChild(defs);

  // Append SVG to body
  document.body.appendChild(svg);
};
