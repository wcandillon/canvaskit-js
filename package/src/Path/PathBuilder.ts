import type { Point } from "canvaskit-wasm";

import type { Radii, XYWH } from "../Core";
import { multiply, multiplyScalar, plus, vec } from "../Vector";
import { ARC_APPROXIMATION_MAGIC, PI_OVER_2, TAU } from "../math";

import { Path } from "./Path";

export class PathBuilder {
  private readonly path = new Path();
  private current: Point = vec(0, 0);
  private subpathStart: Point | null = null;

  getPath() {
    return this.path;
  }

  addRoundedRect(rect: XYWH, radii: Radii) {
    if (
      radii.topLeft[0] === 0 &&
      radii.topRight[0] === 0 &&
      radii.bottomRight[0] === 0 &&
      radii.bottomLeft[0] === 0
    ) {
      return this.addRect(rect);
    }

    this.current = vec(rect.x + radii.topLeft[0], rect.y);

    this.moveTo(vec(rect.x + radii.topLeft[0], rect.y));

    // Top line.
    this.path.addLinearComponent(
      vec(rect.x + radii.topLeft[0], rect.y),
      vec(rect.x + rect.width - radii.topRight[0], rect.y)
    );

    // Top right arc.
    this.addRoundedRectTopRight(rect, radii);

    // Right line.
    this.path.addLinearComponent(
      vec(rect.x + rect.width, rect.y + radii.topRight[1]),
      vec(rect.x + rect.width, rect.y + rect.height - radii.bottomRight[1])
    );

    // Bottom right arc.
    this.addRoundedRectBottomRight(rect, radii);

    // Bottom line.
    this.path.addLinearComponent(
      vec(rect.x + rect.width - radii.bottomRight[0], rect.y + rect.height),
      vec(rect.x + radii.bottomLeft[0], rect.y + rect.height)
    );

    // Bottom left arc.
    this.addRoundedRectBottomLeft(rect, radii);

    // Left line.
    this.path.addLinearComponent(
      vec(rect.x, rect.y + rect.height - radii.bottomLeft[1]),
      vec(rect.x, rect.y + radii.topLeft[1])
    );

    // Top left arc.
    this.addRoundedRectTopLeft(rect, radii);

    this.close();

    return this;
  }

  private addRoundedRectTopLeft(rect: XYWH, radii: Radii) {
    const magicTopLeft = multiplyScalar(radii.topLeft, ARC_APPROXIMATION_MAGIC);
    this.path.addCubicComponent(
      vec(rect.x, rect.y + radii.topLeft[1]),
      vec(rect.x, rect.y + radii.topLeft[1] - magicTopLeft[1]),
      vec(rect.x + radii.topLeft[0] - magicTopLeft[0], rect.y),
      vec(rect.x + radii.topLeft[0], rect.y)
    );
    return this;
  }

  private addRoundedRectTopRight(rect: XYWH, radii: Radii) {
    const magicTopRight = multiplyScalar(
      radii.topRight,
      ARC_APPROXIMATION_MAGIC
    );
    this.path.addCubicComponent(
      vec(rect.x + rect.width - radii.topRight[0], rect.y),
      vec(rect.x + rect.width - radii.topRight[0] + magicTopRight[0], rect.y),
      vec(rect.x + rect.width, rect.y + radii.topRight[1] - magicTopRight[1]),
      vec(rect.x + rect.width, rect.y + radii.topRight[1])
    );
    return this;
  }

  private addRoundedRectBottomRight(rect: XYWH, radii: Radii) {
    const magicBottomRight = multiplyScalar(
      radii.bottomRight,
      ARC_APPROXIMATION_MAGIC
    );
    this.path.addCubicComponent(
      vec(rect.x + rect.width, rect.y + rect.height - radii.bottomRight[1]),
      vec(
        rect.x + rect.width,
        rect.y + rect.height - radii.bottomRight[1] + magicBottomRight[1]
      ),
      vec(
        rect.x + rect.width - radii.bottomRight[0] + magicBottomRight[0],
        rect.y + rect.height
      ),
      vec(rect.x + rect.width - radii.bottomRight[0], rect.y + rect.height)
    );
    return this;
  }

  private addRoundedRectBottomLeft(rect: XYWH, radii: Radii) {
    const magicBottomLeft = multiplyScalar(
      radii.bottomLeft,
      ARC_APPROXIMATION_MAGIC
    );
    this.path.addCubicComponent(
      vec(rect.x + radii.bottomLeft[0], rect.y + rect.height),
      vec(
        rect.x + radii.bottomLeft[0] - magicBottomLeft[0],
        rect.y + rect.height
      ),
      vec(
        rect.x,
        rect.y + rect.height - radii.bottomLeft[1] + magicBottomLeft[1]
      ),
      vec(rect.x, rect.y + rect.height - radii.bottomLeft[1])
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
    const center = vec(bounds.x + radius[0], bounds.y + radius[1]);
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
        p2Unit = vec(-p1Unit[1], p1Unit[0]);
      }

      const arcCpLengths = multiplyScalar(
        radius,
        (quadrantAngle / PI_OVER_2) * ARC_APPROXIMATION_MAGIC
      );

      const p1 = plus(center, multiply(p1Unit, radius));
      const p2 = plus(center, multiply(p2Unit, radius));
      const cp1 = plus(p1, multiply(vec(-p1Unit[1], p1Unit[0]), arcCpLengths));
      const cp2 = plus(p2, multiply(vec(p2Unit[1], -p2Unit[0]), arcCpLengths));

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
    const c = vec(container.x + r[0], container.y + r[1]);
    const m = vec(
      ARC_APPROXIMATION_MAGIC * r[0],
      ARC_APPROXIMATION_MAGIC * r[1]
    );

    this.moveTo(vec(c[0], c[1] - r[1]));

    // Top right arc.
    this.path.addCubicComponent(
      vec(c[0], c[1] - r[1]), // p1
      vec(c[0] + m[0], c[1] - r[1]), // cp1
      vec(c[0] + r[0], c[1] - m[1]), // cp2
      vec(c[0] + r[0], c[1]) // p2
    );

    // Bottom right arc.
    this.path.addCubicComponent(
      vec(c[0] + r[0], c[1]), // p1
      vec(c[0] + r[0], c[1] + m[1]), // cp1
      vec(c[0] + m[0], c[1] + r[1]), // cp2
      vec(c[0], c[1] + r[1]) // p2
    );

    // Bottom left arc.
    this.path.addCubicComponent(
      vec(c[0], c[1] + r[1]), // p1
      vec(c[0] - m[0], c[1] + r[1]), // cp1
      vec(c[0] - r[0], c[1] + m[1]), // cp2
      vec(c[0] - r[0], c[1]) // p2
    );

    // Top left arc.
    this.path.addCubicComponent(
      vec(c[0] - r[0], c[1]), // p1
      vec(c[0] - r[0], c[1] - m[1]), // cp1
      vec(c[0] - m[0], c[1] - r[1]), // cp2
      vec(c[0], c[1] - r[1]) // p2
    );

    this.close();

    return this;
  }

  cubicCurveTo(
    controlPoint1: Point,
    controlPoint2: Point,
    point: Point,
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

  quadraticCurveTo(controlPoint: Point, point: Point, relative = false) {
    point = relative ? plus(this.current, point) : point;
    controlPoint = relative ? plus(this.current, controlPoint) : controlPoint;
    this.path.addQuadraticComponent(this.current, controlPoint, point);
    this.current = point;
    return this;
  }

  moveTo(p: Point, relative = false) {
    this.current = relative ? plus(this.current, p) : p;
    this.subpathStart = this.current;
    this.path.addContourComponent(this.current);
    return this;
  }

  lineTo(p: Point, relative = false) {
    const point = relative ? plus(this.current, p) : p;
    this.path.addLinearComponent(this.current, point);
    this.current = point;
    return this;
  }

  close() {
    if (this.subpathStart) {
      this.lineTo(this.subpathStart);
      this.path.setContourClosed(true);
      this.path.addContourComponent(this.current);
    }
    return this;
  }

  getLastPoint() {
    return this.current;
  }
}
