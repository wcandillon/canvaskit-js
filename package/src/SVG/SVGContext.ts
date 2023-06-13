import { ns } from "./SVGFilter";

export class SVGContext {
  private root: SVGSVGElement = document.createElementNS(ns, "svg");
  private defs: SVGDefsElement = document.createElementNS(ns, "defs");

  constructor(id: string) {
    this.root.id = id;
    this.root.style.width = "0";
    this.root.style.height = "0";
    //this.root.setAttribute("style", "display: none;");
    this.defs = document.createElementNS(ns, "defs");
    this.root.appendChild(this.defs);
    document.body.appendChild(this.root);
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

  discardCacheIfNeeded() {
    if (this.defs.childElementCount > 100) {
      this.disposeFilters();
    }
  }

  disposeFilters() {
    this.root.removeChild(this.defs);
    this.defs = document.createElementNS(ns, "defs");
    this.root.appendChild(this.defs);
  }

  create(id: string, filters: SVGElement[]) {
    const url = `url(#${id})`;
    // If the filter already exists, we don't need to create it again
    if (document.getElementById(id)) {
      return url;
    }
    const filter = document.createElementNS(ns, "filter");
    filter.setAttribute("id", id);
    // This step doesn't seem to be necessary
    // Now we create the CurrentGraphic filter input for composition
    // filter.append(
    //   makeColorMatrix(
    //     {
    //       type: "matrix",
    //       values: IndentityColorMatrix,
    //     },
    //     SourceGraphic
    //   )
    // );
    for (const fe of filters) {
      filter.appendChild(fe);
    }
    this.defs.appendChild(filter);
    return url;
  }
}
