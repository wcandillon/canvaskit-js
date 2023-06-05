const ns = "http://www.w3.org/2000/svg";

type SourceGraphic = "SourceGraphic";
export const SourceGraphic = "SourceGraphic";
export type SVGFilter = SVGElement;
export type SVGInputFilter = SVGFilter | SourceGraphic;

export const getFilterId = (filter: SVGInputFilter) => {
  if (filter === SourceGraphic) {
    return "SourceGraphic";
  }
  const id = filter.getAttribute("result");
  if (!id) {
    throw new Error("SVGFilter: id is null");
  }
  return id;
};

export const makeBlur = (
  stdDeviation: number,
  inFilter: SVGInputFilter = SourceGraphic,
  id = "result"
) => {
  const filter = document.createElementNS(ns, "feGaussianBlur");
  filter.setAttribute("in", getFilterId(inFilter));
  filter.setAttribute("stdDeviation", stdDeviation.toString());
  filter.setAttribute("result", id);
  return filter;
};
export type TurbulenceType = "fractalNoise" | "turbulence";

export const makeTurbulence = (
  baseFrequencyX: number,
  baseFrequencyY: number,
  numOctaves: number,
  seed: number,
  type: TurbulenceType,
  id = "result"
) => {
  const filter = document.createElementNS(ns, "feTurbulence");
  filter.setAttribute(
    "baseFrequency",
    [baseFrequencyX.toString(), baseFrequencyY.toString()].join(" ")
  );
  filter.setAttribute("seed", seed.toString());
  filter.setAttribute("numOctaves", numOctaves.toString());
  filter.setAttribute("type", type);
  filter.setAttribute("result", id);
  return filter;
};

type CompositeOperator = "over" | "in" | "out" | "atop" | "xor" | "arithmetic";

export const makeComposite = (
  inFilter: SVGInputFilter,
  in2Filter: SVGInputFilter,
  operator: CompositeOperator,
  id = "result"
) => {
  const filter = document.createElementNS(ns, "feComposite");
  filter.setAttribute("in", getFilterId(inFilter));
  filter.setAttribute("in2", getFilterId(in2Filter));
  filter.setAttribute("operator", operator);
  filter.setAttribute("result", id);
  return filter;
};

export const makeMerge = (inFilters: SVGInputFilter[], id = "result") => {
  const filter = document.createElementNS(ns, "feMerge");
  inFilters.forEach((filterElement) => {
    const mergeNode = document.createElementNS(ns, "feMergeNode");
    mergeNode.setAttribute("in", getFilterId(filterElement));
    filter.appendChild(mergeNode);
  });
  filter.setAttribute("result", id);
  return filter;
};

type BlendMode = "normal" | "multiply" | "screen" | "darken" | "lighten";

export const makeBlend = (
  inFilter: SVGInputFilter,
  in2Filter: SVGInputFilter,
  mode: BlendMode,
  id = "result"
) => {
  const filter = document.createElementNS(ns, "feBlend");
  filter.setAttribute("in", getFilterId(inFilter));
  filter.setAttribute("in2", getFilterId(in2Filter));
  filter.setAttribute("mode", mode);
  filter.setAttribute("result", id);
  return filter;
};

type ColorMatrixValues =
  | { type: "matrix"; values: Float32Array }
  | { type: "saturate" | "hueRotate"; values: number }
  | { type: "luminanceToAlpha"; values?: never };

export const makeColorMatrix = (input: ColorMatrixValues, id = "result") => {
  const filter = document.createElementNS(ns, "feColorMatrix");
  filter.setAttribute("in", "SourceGraphic");
  filter.setAttribute("type", input.type);
  if (input.type !== "luminanceToAlpha") {
    filter.setAttribute(
      "values",
      Array.isArray(input.values)
        ? input.values.join(" ")
        : input.values.toString()
    );
  }
  filter.setAttribute("result", id);
  return filter;
};
