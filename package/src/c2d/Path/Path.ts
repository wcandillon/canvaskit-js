export class Path {
  contours: Contour[] = [];

  moveTo(p1: DOMPoint) {}

  addLinear(p1: DOMPoint) {
    return this;
  }

  addQuadratic(c1: DOMPoint, p1: DOMPoint) {
    return this;
  }

  addCubic(c1: DOMPoint, c2: DOMPoint, p1: DOMPoint) {
    return this;
  }

  getPath2D(ctm: DOMMatrix) {
    return new Path2D();
  }

  close() {
    return this;
  }
}
