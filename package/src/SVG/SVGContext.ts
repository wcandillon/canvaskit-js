import { SourceGraphic, makeColorMatrix } from "./SVGFilter";

const ns = "http://www.w3.org/2000/svg";
const indentityColorMatrix = Float32Array.of(
  1,
  0,
  0,
  0,
  0,
  0,
  1,
  0,
  0,
  0,
  0,
  0,
  1,
  0,
  0,
  0,
  0,
  0,
  1,
  0
);

class SVGContext {
  private static _instance: SVGContext | null = null;

  private root: SVGSVGElement = document.createElementNS(ns, "svg");
  private defs: SVGDefsElement = document.createElementNS(ns, "defs");

  private constructor() {
    this.root.setAttribute("style", "display: none;");
    this.defs = document.createElementNS(ns, "defs");
    this.root.appendChild(this.defs);
    document.body.appendChild(this.root);
  }

  static getInstance() {
    if (!this._instance) {
      this._instance = new SVGContext();
    }
    return this._instance;
  }

  dispose() {
    document.body.removeChild(this.root);
  }

  disposeFilter(id: string) {
    const filter = document.getElementById(id);
    if (filter) {
      this.defs.removeChild(filter);
    }
  }

  create(id: string, filters: SVGElement[]) {
    const filter = document.createElementNS(ns, "filter");
    filter.setAttribute("id", id);
    // Now we create the CurrentGraphic filter input for composition
    makeColorMatrix(
      {
        type: "matrix",
        values: indentityColorMatrix,
      },
      SourceGraphic
    );
    for (const fe of filters) {
      filter.appendChild(fe);
    }
    this.defs.appendChild(filter);
  }
}

export const svgCtx = SVGContext.getInstance();
