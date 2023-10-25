import type { Applier } from "./Contour";
import { Contour } from "./Contour";
import type { PathComponent } from "./PathComponents";
import {
  CubicPathComponent,
  LinearPathComponent,
  QuadraticPathComponent,
  computeTightBounds,
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

  enumerateComponents(
    linearApplier?: Applier<LinearPathComponent>,
    quadApplier?: Applier<QuadraticPathComponent>,
    cubicApplier?: Applier<CubicPathComponent>,
    contourApplier?: Applier<Contour>
  ) {
    this.contours.forEach((c, index) => {
      if (contourApplier) {
        contourApplier(c, index);
      }
      c.enumerateComponents(linearApplier, quadApplier, cubicApplier);
    });
  }

  addContour(isClosed = false) {
    this.contours.push(new Contour(isClosed));
  }

  closeContour() {
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

  addComponent(comp: PathComponent) {
    this.contour.components.push(comp);
    return this;
  }

  addLinearComponent(p1: DOMPoint, p2: DOMPoint) {
    this.contour.components.push(new LinearPathComponent(p1, p2));
    return this;
  }

  addQuadraticComponent(p1: DOMPoint, cp: DOMPoint, p2: DOMPoint) {
    this.contour.components.push(new QuadraticPathComponent(p1, cp, p2));
    return this;
  }

  addCubicComponent(p1: DOMPoint, cp1: DOMPoint, cp2: DOMPoint, p2: DOMPoint) {
    this.contour.components.push(new CubicPathComponent(p1, cp1, cp2, p2));
    return this;
  }

  getLastComponent() {
    return this.contour.getLastComponent();
  }

  length() {
    return this.contours.reduce((acc, c) => acc + c.length(), 0);
  }

  computeTightBounds(result: Float32Array) {
    const bounds = computeTightBounds(
      this.contours.filter((c) => c.components.length > 0)
    );
    result[0] = bounds[0];
    result[1] = bounds[1];
    result[2] = bounds[2];
    result[3] = bounds[3];
  }

  getPoints() {
    const points: DOMPoint[] = [];
    this.contours.forEach((contour) => {
      contour.enumerateComponents(
        (linear) => {
          points.push(linear.p1);
          points.push(linear.p2);
        },
        (quad) => {
          points.push(quad.p1);
          points.push(quad.p2);
          points.push(quad.cp);
        },
        (cubic) => {
          points.push(cubic.p1);
          points.push(cubic.p2);
          points.push(cubic.cp1);
          points.push(cubic.cp2);
        }
      );
    });
    return points;
  }

  getPath2D() {
    const path = new Path2D();
    const cmds = this.toCmds();
    let i = 0;
    while (i < cmds.length) {
      const cmd = cmds[i++];
      if (cmd === PathVerb.Move) {
        const p = new DOMPoint(cmds[i++], cmds[i++]);
        path.moveTo(p.x, p.y);
      } else if (cmd === PathVerb.Line) {
        const p = new DOMPoint(cmds[i++], cmds[i++]);
        path.lineTo(p.x, p.y);
      } else if (cmd === PathVerb.Cubic) {
        const cp1 = new DOMPoint(cmds[i++], cmds[i++]);
        const cp2 = new DOMPoint(cmds[i++], cmds[i++]);
        const p = new DOMPoint(cmds[i++], cmds[i++]);
        path.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, p.x, p.y);
      } else if (cmd === PathVerb.Quad) {
        const cp = new DOMPoint(cmds[i++], cmds[i++]);
        const p = new DOMPoint(cmds[i++], cmds[i++]);
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
