import type { BaseSVGFilter } from "./SVGFilter";

const ns = "http://www.w3.org/2000/svg";

export class SVGContext {
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

  create(id: string, fe: BaseSVGFilter) {
    const filter = document.createElementNS(ns, "filter");
    filter.setAttribute("id", id);
    this.defs.appendChild(filter);

    filter.appendChild(fe.getFilter());

    return `url(#${id})`;
  }
}
