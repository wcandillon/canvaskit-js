import type { SVGFilter } from "./SVGFilter";

const ns = "http://www.w3.org/2000/svg";

class SVGContext {
  private static _instance: SVGContext | null = null;

  private root: SVGSVGElement = document.createElementNS(ns, "svg");
  private defs: SVGDefsElement = document.createElementNS(ns, "defs");

  constructor() {
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

  create(id: string, filters: SVGFilter[]) {
    const filter = document.createElementNS(ns, "filter");
    filter.setAttribute("id", id);
    for (const fe of filters) {
      filter.appendChild(fe.getFilter());
    }
    this.root.appendChild(filter);
  }
}

export const svgCtx = SVGContext.getInstance();
