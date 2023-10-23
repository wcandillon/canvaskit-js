import { Contour } from "./Contour";
import {
  CubicPathComponent,
  LinearPathComponent,
  QuadraticPathComponent,
} from "./PathComponents";
import { PathVerb } from "./PathComponents/PathVerb";

export class Path {
  contours: Contour[] = [];
  private current = new DOMPoint(0, 0);
  private subpathStart: DOMPoint | null = null;

  get contour() {
    // SVG doesn't allow for contourless path but Skia adds moveTo(0, 0) automatically
    // see SVGParser.test.ts
    if (this.contours.length === 0) {
      this.addContour();
    }
    return this.contours[this.contours.length - 1];
  }

  private addContour(isClosed = false) {
    this.contours.push(new Contour(isClosed));
  }

  private closeContour() {
    this.contour.closed = true;
    return this;
  }

  moveTo(p: DOMPoint) {
    this.current = p;
    this.subpathStart = this.current;
    this.addContour();
    return this;
  }

  lineTo(p: DOMPoint) {
    this.contour.components.push(new LinearPathComponent(this.current, p));
    this.current = p;
    return this;
  }

  quadraticCurveTo(controlPoint: DOMPoint, point: DOMPoint) {
    this.contour.components.push(
      new QuadraticPathComponent(this.current, controlPoint, point)
    );
    this.current = point;
    return this;
  }

  bezierCurveTo(cp1: DOMPoint, cp2: DOMPoint, point: DOMPoint) {
    this.contour.components.push(
      new CubicPathComponent(this.current, cp1, cp2, point)
    );
    this.current = point;
    return this;
  }

  getPath2D(ctm: DOMMatrix) {
    const path = new Path2D();
    const cmds = this.toCmds();
    let i = 0;
    while (i < cmds.length) {
      const cmd = cmds[i++];
      if (cmd === PathVerb.Move) {
        const p = projectPoint(ctm, new DOMPoint(cmds[i++], cmds[i++]));
        path.moveTo(p.x, p.y);
      } else if (cmd === PathVerb.Line) {
        const p = projectPoint(ctm, new DOMPoint(cmds[i++], cmds[i++]));
        path.lineTo(p.x, p.y);
      } else if (cmd === PathVerb.Cubic) {
        const cp1 = projectPoint(ctm, new DOMPoint(cmds[i++], cmds[i++]));
        const cp2 = projectPoint(ctm, new DOMPoint(cmds[i++], cmds[i++]));
        const p = projectPoint(ctm, new DOMPoint(cmds[i++], cmds[i++]));
        path.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, p.x, p.y);
      } else if (cmd === PathVerb.Quad) {
        const cp = projectPoint(ctm, new DOMPoint(cmds[i++], cmds[i++]));
        const p = projectPoint(ctm, new DOMPoint(cmds[i++], cmds[i++]));
        path.quadraticCurveTo(cp.x, cp.y, p.x, p.y);
      } else if (cmd === PathVerb.Close) {
        path.closePath();
      }
    }
    return path;
  }

  close() {
    if (this.subpathStart) {
      this.lineTo(this.subpathStart);
      this.closeContour();
      this.addContour();
    }
    return this;
  }

  toCmds() {
    return this.contours.flatMap((c) => c.toCmds());
  }

  toSVGString() {
    return this.contours
      .map((c) => c.toSVGString())
      .join(" ")
      .trim();
  }
}

const projectPoint = (matrix: DOMMatrix, point: DOMPoint) => {
  const p = new DOMPoint(point.x, point.y, 0, 1).matrixTransform(matrix);
  return new DOMPoint(p.x / p.w, p.y / p.w);
};
