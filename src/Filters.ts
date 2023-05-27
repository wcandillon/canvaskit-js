const ns = "http://www.w3.org/2000/svg";

export const blur = (sigma: number, result = "result") => {
  const feGaussianBlur = document.createElementNS(ns, "feGaussianBlur");
  feGaussianBlur.setAttribute("in", "SourceGraphic");
  feGaussianBlur.setAttribute("stdDeviation", `${sigma}`);
  feGaussianBlur.setAttribute("result", result);
  return feGaussianBlur;
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
