export const ns = "http://www.w3.org/2000/svg";

type CurrentGraphic = "CurrentGraphic";
export const CurrentGraphic = "CurrentGraphic";
type SourceGraphic = "SourceGraphic";
export const SourceGraphic = "SourceGraphic";
export type SVGFilter = SVGElement;
export type SVGInputFilter = SVGFilter | CurrentGraphic | SourceGraphic;

export const filterId = (filter: SVGInputFilter) => {
  if (filter === CurrentGraphic || filter === SourceGraphic) {
    return filter;
  }
  const id = filter.getAttribute("result");
  if (!id) {
    throw new Error("SVGFilter: id is null");
  }
  return id;
};

export const makeBlur = (
  blurX: number,
  blurY: number,
  inFilter: SVGInputFilter = CurrentGraphic,
  result = "CurrentGraphic"
) => {
  const filter = document.createElementNS(ns, "feGaussianBlur");
  filter.setAttribute("in", filterId(inFilter));
  filter.setAttribute("stdDeviation", `${blurX} ${blurY}`);
  filter.setAttribute("result", result);
  return filter;
};
export type TurbulenceType = "fractalNoise" | "turbulence";

export const makeTurbulence = (
  baseFrequencyX: number,
  baseFrequencyY: number,
  numOctaves: number,
  seed: number,
  type: TurbulenceType,
  result = "CurrentGraphic"
) => {
  const filter = document.createElementNS(ns, "feTurbulence");
  filter.setAttribute(
    "baseFrequency",
    [baseFrequencyX.toString(), baseFrequencyY.toString()].join(" ")
  );
  filter.setAttribute("seed", seed.toString());
  filter.setAttribute("numOctaves", numOctaves.toString());
  filter.setAttribute("type", type);
  filter.setAttribute("result", result);
  return filter;
};

type CompositeOperator = "over" | "in" | "out" | "atop" | "xor" | "arithmetic";

export const makeComposite = (
  inFilter: SVGInputFilter,
  in2Filter: SVGInputFilter,
  operator: CompositeOperator,
  result = "CurrentGraphic"
) => {
  const filter = document.createElementNS(ns, "feComposite");
  filter.setAttribute("in", filterId(inFilter));
  filter.setAttribute("in2", filterId(in2Filter));
  filter.setAttribute("operator", operator);
  filter.setAttribute("result", result);
  return filter;
};

export const makeMerge = (
  inFilters: SVGInputFilter[],
  result = "CurrentGraphic"
) => {
  const filter = document.createElementNS(ns, "feMerge");
  inFilters.forEach((filterElement) => {
    const mergeNode = document.createElementNS(ns, "feMergeNode");
    mergeNode.setAttribute("in", filterId(filterElement));
    filter.appendChild(mergeNode);
  });
  filter.setAttribute("result", result);
  return filter;
};

type BlendMode = "normal" | "multiply" | "screen" | "darken" | "lighten";

export const makeBlend = (
  inFilter: SVGInputFilter,
  in2Filter: SVGInputFilter,
  mode: BlendMode,
  result = "CurrentGraphic"
) => {
  const filter = document.createElementNS(ns, "feBlend");
  filter.setAttribute("in", filterId(inFilter));
  filter.setAttribute("in2", filterId(in2Filter));
  filter.setAttribute("mode", mode);
  filter.setAttribute("result", result);
  return filter;
};

type ColorMatrixValues =
  | { type: "matrix"; values: Float32Array }
  | { type: "saturate" | "hueRotate"; values: number }
  | { type: "luminanceToAlpha"; values?: never };

export const makeColorMatrix = (
  value: ColorMatrixValues,
  input: SVGInputFilter = CurrentGraphic,
  result = "CurrentGraphic"
) => {
  const filter = document.createElementNS(ns, "feColorMatrix");
  filter.setAttribute("in", filterId(input));
  filter.setAttribute("type", value.type);
  if (value.type !== "luminanceToAlpha") {
    filter.setAttribute(
      "values",
      Array.isArray(value.values)
        ? value.values.join(" ")
        : value.values.toString()
    );
  }
  filter.setAttribute("result", result);
  return filter;
};
