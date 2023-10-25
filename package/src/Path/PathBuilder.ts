import {
  ARC_APPROXIMATION_MAGIC,
  PI_OVER_2,
  TAU,
  multiply,
  multiplyScalar,
  plus,
  Path as NativePath,
  vec,
} from "../c2d";
import type { Radii, XYWH } from "../Core";

import { ConvertConicToQuads } from "./Conic";

export class PathBuilder {
  private current = new DOMPoint(0, 0);
  private subpathStart: DOMPoint | null = null;

  constructor(private readonly path = new NativePath()) {}

  getPath() {
    return this.path;
  }

  addPath(path: NativePath) {
    path.enumerateComponents(
      (linear) => this.path.addLinearComponent(linear.p1, linear.p2),
      (quad) => this.path.addQuadraticComponent(quad.p1, quad.cp, quad.p2),
      (cubic) =>
        this.path.addCubicComponent(cubic.p1, cubic.cp1, cubic.cp2, cubic.p2),
      (contour) => this.path.addContour(contour.closed)
    );
    return this;
  }

  conicTo(p1: DOMPoint, p2: DOMPoint, w: number) {
    const p0 = this.current;
    const quads = ConvertConicToQuads(p0, p1, p2, w);
    quads.forEach((quad) =>
      this.path.addQuadraticComponent(quad.p1, quad.cp, quad.p2)
    );
    return this;
  }

  addRoundedRect(rect: XYWH, radii: Radii) {
    if (
      radii.topLeft.x === 0 &&
      radii.topRight.x === 0 &&
      radii.bottomRight.x === 0 &&
      radii.bottomLeft.x === 0
    ) {
      return this.addRect(rect);
    }

    this.current = new DOMPoint(rect.x + radii.topLeft.x, rect.y);

    this.moveTo(new DOMPoint(rect.x + radii.topLeft.x, rect.y));

    // Top line.
    this.path.addLinearComponent(
      new DOMPoint(rect.x + radii.topLeft.x, rect.y),
      new DOMPoint(rect.x + rect.width - radii.topRight.x, rect.y)
    );

    // Top right arc.
    this.addRoundedRectTopRight(rect, radii);

    // Right line.
    this.path.addLinearComponent(
      new DOMPoint(rect.x + rect.width, rect.y + radii.topRight.y),
      new DOMPoint(
        rect.x + rect.width,
        rect.y + rect.height - radii.bottomRight.y
      )
    );

    // Bottom right arc.
    this.addRoundedRectBottomRight(rect, radii);

    // Bottom line.
    this.path.addLinearComponent(
      new DOMPoint(
        rect.x + rect.width - radii.bottomRight.x,
        rect.y + rect.height
      ),
      new DOMPoint(rect.x + radii.bottomLeft.x, rect.y + rect.height)
    );

    // Bottom left arc.
    this.addRoundedRectBottomLeft(rect, radii);

    // Left line.
    this.path.addLinearComponent(
      new DOMPoint(rect.x, rect.y + rect.height - radii.bottomLeft.y),
      new DOMPoint(rect.x, rect.y + radii.topLeft.y)
    );

    // Top left arc.
    this.addRoundedRectTopLeft(rect, radii);

    this.close();

    return this;
  }

  private addRoundedRectTopLeft(rect: XYWH, radii: Radii) {
    const magicTopLeft = multiplyScalar(
      new DOMPoint(radii.topLeft.x, radii.topLeft.y),
      ARC_APPROXIMATION_MAGIC
    );
    this.path.addCubicComponent(
      vec(rect.x, rect.y + radii.topLeft.y),
      vec(rect.x, rect.y + radii.topLeft.y - magicTopLeft.y),
      vec(rect.x + radii.topLeft.x - magicTopLeft.x, rect.y),
      vec(rect.x + radii.topLeft.x, rect.y)
    );
    return this;
  }

  private addRoundedRectTopRight(rect: XYWH, radii: Radii) {
    const magicTopRight = multiplyScalar(
      new DOMPoint(radii.topRight.x, radii.topRight.y),
      ARC_APPROXIMATION_MAGIC
    );
    this.path.addCubicComponent(
      new DOMPoint(rect.x + rect.width - radii.topRight.x, rect.y),
      new DOMPoint(
        rect.x + rect.width - radii.topRight.x + magicTopRight.x,
        rect.y
      ),
      new DOMPoint(
        rect.x + rect.width,
        rect.y + radii.topRight.y - magicTopRight.y
      ),
      new DOMPoint(rect.x + rect.width, rect.y + radii.topRight.y)
    );
    return this;
  }

  private addRoundedRectBottomRight(rect: XYWH, radii: Radii) {
    const magicBottomRight = multiplyScalar(
      new DOMPoint(radii.bottomRight.x, radii.bottomRight.y),
      ARC_APPROXIMATION_MAGIC
    );
    this.path.addCubicComponent(
      vec(rect.x + rect.width, rect.y + rect.height - radii.bottomRight.y),
      vec(
        rect.x + rect.width,
        rect.y + rect.height - radii.bottomRight.y + magicBottomRight.y
      ),
      vec(
        rect.x + rect.width - radii.bottomRight.x + magicBottomRight.x,
        rect.y + rect.height
      ),
      vec(rect.x + rect.width - radii.bottomRight.x, rect.y + rect.height)
    );
    return this;
  }

  private addRoundedRectBottomLeft(rect: XYWH, radii: Radii) {
    const magicBottomLeft = multiplyScalar(
      new DOMPoint(radii.bottomLeft.x, radii.bottomLeft.y),
      ARC_APPROXIMATION_MAGIC
    );
    this.path.addCubicComponent(
      vec(rect.x + radii.bottomLeft.x, rect.y + rect.height),
      vec(
        rect.x + radii.bottomLeft.x - magicBottomLeft.x,
        rect.y + rect.height
      ),
      vec(
        rect.x,
        rect.y + rect.height - radii.bottomLeft.y + magicBottomLeft.y
      ),
      vec(rect.x, rect.y + rect.height - radii.bottomLeft.y)
    );
    return this;
  }

  addRect(rect: XYWH) {
    this.current = vec(rect.x, rect.y);

    const tl = vec(rect.x, rect.y);
    const bl = vec(rect.x, rect.y + rect.height);
    const br = vec(rect.x + rect.width, rect.y + rect.height);
    const tr = vec(rect.x + rect.width, rect.y);

    this.moveTo(tl);
    this.path
      .addLinearComponent(tl, tr)
      .addLinearComponent(tr, br)
      .addLinearComponent(br, bl);
    this.close();

    return this;
  }

  addArc(bounds: XYWH, start: number, sweep: number, useCenter = false) {
    if (sweep < 0) {
      start += sweep;
      sweep *= -1;
    }
    sweep = Math.min(TAU, sweep);
    start = start % TAU;
    const radius = vec(bounds.width / 2, bounds.height / 2);
    const center = vec(bounds.x + radius.x, bounds.y + radius.y);
    let p1Unit = vec(Math.cos(start), Math.sin(start));

    const m = plus(center, multiply(p1Unit, radius));
    if (useCenter) {
      this.moveTo(center);
      this.lineTo(m);
    } else {
      this.moveTo(m);
    }

    while (sweep > 0) {
      let p2Unit;
      let quadrantAngle;
      if (sweep < PI_OVER_2) {
        quadrantAngle = sweep;
        p2Unit = vec(
          Math.cos(start + quadrantAngle),
          Math.sin(start + quadrantAngle)
        );
      } else {
        quadrantAngle = PI_OVER_2;
        p2Unit = vec(-p1Unit.y, p1Unit.x);
      }

      const arcCpLengths = multiplyScalar(
        radius,
        (quadrantAngle / PI_OVER_2) * ARC_APPROXIMATION_MAGIC
      );

      const p1 = plus(center, multiply(p1Unit, radius));
      const p2 = plus(center, multiply(p2Unit, radius));
      const cp1 = plus(p1, multiply(vec(-p1Unit.y, p1Unit.x), arcCpLengths));
      const cp2 = plus(p2, multiply(vec(p2Unit.y, -p2Unit.x), arcCpLengths));

      this.path.addCubicComponent(p1, cp1, cp2, p2);
      this.current = p2;

      start += quadrantAngle;
      sweep -= quadrantAngle;
      p1Unit = p2Unit;
    }

    if (useCenter) {
      this.close();
    }

    return this;
  }

  addOval(container: XYWH) {
    const r = vec(container.width * 0.5, container.height * 0.5);
    const c = vec(container.x + r.x, container.y + r.y);
    const m = vec(ARC_APPROXIMATION_MAGIC * r.x, ARC_APPROXIMATION_MAGIC * r.y);

    this.moveTo(vec(c.x, c.y - r.y));

    // Top right arc.
    this.path.addCubicComponent(
      vec(c.x, c.y - r.y), // p1
      vec(c.x + m.x, c.y - r.y), // cp1
      vec(c.x + r.x, c.y - m.y), // cp2
      vec(c.x + r.x, c.y) // p2
    );

    // Bottom right arc.
    this.path.addCubicComponent(
      vec(c.x + r.x, c.y), // p1
      vec(c.x + r.x, c.y + m.y), // cp1
      vec(c.x + m.x, c.y + r.y), // cp2
      vec(c.x, c.y + r.y) // p2
    );

    // Bottom left arc.
    this.path.addCubicComponent(
      vec(c.x, c.y + r.y), // p1
      vec(c.x - m.x, c.y + r.y), // cp1
      vec(c.x - r.x, c.y + m.y), // cp2
      vec(c.x - r.x, c.y) // p2
    );

    // Top left arc.
    this.path.addCubicComponent(
      vec(c.x - r.x, c.y), // p1
      vec(c.x - r.x, c.y - m.y), // cp1
      vec(c.x - m.x, c.y - r.y), // cp2
      vec(c.x, c.y - r.y) // p2
    );

    this.close();

    return this;
  }

  cubicCurveTo(
    controlPoint1: DOMPoint,
    controlPoint2: DOMPoint,
    point: DOMPoint,
    relative = false
  ) {
    controlPoint1 = relative
      ? plus(this.current, controlPoint1)
      : controlPoint1;
    controlPoint2 = relative
      ? plus(this.current, controlPoint2)
      : controlPoint2;
    point = relative ? plus(this.current, point) : point;
    this.path.addCubicComponent(
      this.current,
      controlPoint1,
      controlPoint2,
      point
    );
    this.current = point;
    return this;
  }

  quadraticCurveTo(controlPoint: DOMPoint, point: DOMPoint, relative = false) {
    point = relative ? plus(this.current, point) : point;
    controlPoint = relative ? plus(this.current, controlPoint) : controlPoint;
    this.path.addQuadraticComponent(this.current, controlPoint, point);
    this.current = point;
    return this;
  }

  moveTo(p: DOMPoint, relative = false) {
    this.current = relative ? plus(this.current, p) : p;
    this.subpathStart = this.current;
    this.path.addContour();
    return this;
  }

  lineTo(p: DOMPoint, relative = false) {
    const point = relative ? plus(this.current, p) : p;
    this.path.addLinearComponent(this.current, point);
    this.current = point;
    return this;
  }

  close() {
    if (this.subpathStart) {
      this.lineTo(this.subpathStart);
      this.path.closeContour();
      this.path.addContour();
    }
    return this;
  }

  getLastPoint() {
    return this.current;
  }
}
