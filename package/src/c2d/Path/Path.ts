export class Path {
  getPath2D(ctm: DOMMatrix) {
    return new Path2D();
  }

  copy() {
    return new Path();
  }
}
