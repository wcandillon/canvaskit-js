import type {
  Path as SkPath,
  EmbindEnumEntity,
  InputCommands,
  InputFlattenedPointArray,
  VerbList,
  WeightList,
  InputRRect,
  InputRect,
  StrokeOpts,
} from "canvaskit-wasm";

import { HostObject } from "../HostObject";
import { type Matrix3x3, transformPoint } from "../Matrix";
import { toRad } from "../math/index";
import {
  FillType,
  FillTypeEnum,
  PathVerb,
  normalizeArray,
  rectToXYWH,
  rrectToXYWH,
} from "../Core";
import { vec } from "../Vector";

import { PathBuilder } from "./PathBuilder";
import { parseSVG } from "./SVG";
import { TrimPathEffect } from "./PathEffects";
import type { Path } from "./Path";

export const getBounds = (...rects: Float32Array[]): Float32Array => {
  return rects.reduce((acc, r) => {
    acc[0] = Math.min(acc[0], r[0]);
    acc[1] = Math.min(acc[1], r[1]);
    acc[2] = Math.max(acc[2], r[2]);
    acc[3] = Math.max(acc[3], r[3]);
    return acc;
  }, Float32Array.of(Infinity, Infinity, -Infinity, -Infinity));
};

export const getBoundsFromPoints = (...points: Float32Array[]) => {
  const xs = points.map((p) => p[0]);
  const ys = points.map((p) => p[1]);
  return Float32Array.of(
    Math.min(...xs),
    Math.min(...ys),
    Math.max(...xs),
    Math.max(...ys)
  );
};

export class PathJS extends HostObject<"Path"> implements SkPath {
  private path: PathBuilder;
  private fillType: CanvasFillRule = "nonzero";

  constructor(path?: PathBuilder) {
    super("Path");
    this.path = path ?? new PathBuilder();
  }

  private swap(path: Path) {
    this.path = new PathBuilder(path);
    return this;
  }

  getPath() {
    return this.path.getPath();
  }

  addArc(inputBounds: InputRect, startAngle: number, sweepAngle: number) {
    this.path.addArc(
      rectToXYWH(inputBounds),
      toRad(startAngle),
      toRad(sweepAngle),
      false
    );
    return this;
  }

  addCircle(x: number, y: number, r: number, isCCW?: boolean) {
    this.addOval([x - r, y - r, x + r, y + r], isCCW);
    return this;
  }

  addOval(oval: InputRect, _isCCW?: boolean, _startIndex?: number) {
    this.path.addOval(rectToXYWH(oval));
    return this;
  }

  addPath(newPath: PathJS, _matrix: Matrix3x3) {
    this.path.addPath(newPath.path.getPath());
    return this;
  }

  addPoly(input: InputFlattenedPointArray, close: boolean) {
    const points = normalizeArray(input);
    points.forEach((x, index) => {
      const y = points[index + 1];
      if (index === 0) {
        // TODO: only inject move if needed
        this.path.moveTo(vec(x, y));
      }
      if (index % 2 === 0) {
        this.path.lineTo(vec(x, y));
      }
    });
    if (close) {
      this.path.close();
    }
    return this;
  }
  addRect(input: InputRect, _isCCW?: boolean) {
    this.path.addRect(rectToXYWH(input));
    return this;
  }
  addRRect(input: InputRRect, _isCCW?: boolean) {
    const rrect = rrectToXYWH(input);
    this.path.addRoundedRect(rrect, rrect.radii);
    return this;
  }
  addVerbsPointsWeights(
    _verbs: VerbList,
    _points: InputFlattenedPointArray,
    _weights?: WeightList | undefined
  ): SkPath {
    throw new Error("Method not implemented.");
  }
  arc(
    _x: number,
    _y: number,
    _r: number,
    _startAngle: number,
    _endAngle: number,
    _isCCW?: boolean
  ): SkPath {
    throw new Error("Method not implemented.");
  }
  arcToOval(
    _oval: InputRect,
    _startAngle: number,
    _endAngle: number,
    _forceMoveTo: boolean
  ): SkPath {
    throw new Error("Method not implemented.");
  }
  arcToRotated(
    _rx: number,
    _ry: number,
    _xAxisRotate: number,
    _useSmallArc: boolean,
    _isCCW: boolean,
    _x: number,
    _y: number
  ): SkPath {
    throw new Error("Method not implemented.");
  }

  arcToTangent(
    _x1: number,
    _y1: number,
    _x2: number,
    _y2: number,
    _radius: number
  ): SkPath {
    throw new Error("Method not implemented.");
  }

  close() {
    this.path.close();
    return this;
  }

  computeTightBounds(_outputArray?: Float32Array | undefined): Float32Array {
    throw new Error("Method not implemented.");
  }
  conicTo(x1: number, y1: number, x2: number, y2: number, w: number) {
    this.path.conicTo(vec(x1, y1), vec(x2, y2), w);
    return this;
  }
  contains(x: number, y: number) {
    const offscreen = new OffscreenCanvas(1, 1);
    const ctx = offscreen.getContext("2d")!;
    const path = this.getPath2D();
    const result = ctx.isPointInPath(path, x, y);
    return result;
  }
  copy(): SkPath {
    return PathJS.MakeFromCmds(this.toCmds())!;
  }
  countPoints(): number {
    throw new Error("Method not implemented.");
  }
  cubicTo(
    cpx1: number,
    cpy1: number,
    cpx2: number,
    cpy2: number,
    x: number,
    y: number,
    relative = false
  ) {
    this.path.cubicCurveTo(
      vec(cpx1, cpy1),
      vec(cpx2, cpy2),
      vec(x, y),
      relative
    );
    return this;
  }
  dash(_on: number, _off: number, _phase: number): boolean {
    throw new Error("Method not implemented.");
  }
  equals(_other: SkPath): boolean {
    throw new Error("Method not implemented.");
  }
  getBounds(outputArray?: Float32Array | undefined): Float32Array {
    let bounds = outputArray ?? new Float32Array(4);
    bounds[0] = -Infinity;
    bounds[1] = -Infinity;
    bounds[2] = Infinity;
    bounds[3] = Infinity;
    this.path.getPath().enumerateComponents(
      ({ p1, p2 }) => (bounds = getBounds(bounds, getBoundsFromPoints(p1, p2))),
      ({ p1, p2, cp }) =>
        (bounds = getBounds(bounds, getBoundsFromPoints(p1, p2, cp))),
      ({ p1, p2, cp1, cp2 }) =>
        (bounds = getBounds(bounds, getBoundsFromPoints(p1, p2, cp1, cp2)))
    );
    return bounds;
  }

  getNativeFillType() {
    return this.fillType;
  }

  getFillType() {
    if (this.fillType === "evenodd") {
      return FillType.EvenOdd;
    }
    return FillType.Winding;
  }
  getPoint(
    _index: number,
    _outputArray?: Float32Array | undefined
  ): Float32Array {
    throw new Error("Method not implemented.");
  }
  isEmpty(): boolean {
    throw new Error("Method not implemented.");
  }
  isVolatile(): boolean {
    throw new Error("Method not implemented.");
  }
  lineTo(x: number, y: number, relative = false) {
    this.path.lineTo(vec(x, y), relative);
    return this;
  }
  makeAsWinding(): SkPath | null {
    throw new Error("Method not implemented.");
  }
  moveTo(x: number, y: number, relative = false) {
    this.path.moveTo(vec(x, y), relative);
    return this;
  }
  offset(_dx: number, _dy: number): SkPath {
    throw new Error("Method not implemented.");
  }
  op(_other: SkPath, _op: EmbindEnumEntity): boolean {
    throw new Error("Method not implemented.");
  }
  quadTo(x1: number, y1: number, x2: number, y2: number, relative = false) {
    this.path.quadraticCurveTo(vec(x1, y1), vec(x2, y2), relative);
    return this;
  }
  rArcTo(
    _rx: number,
    _ry: number,
    _xAxisRotate: number,
    _useSmallArc: boolean,
    _isCCW: boolean,
    _dx: number,
    _dy: number
  ): SkPath {
    throw new Error("Method not implemented.");
  }
  rConicTo(
    _dx1: number,
    _dy1: number,
    _dx2: number,
    _dy2: number,
    _w: number
  ): SkPath {
    throw new Error("Method not implemented.");
  }
  rCubicTo(
    cpx1: number,
    cpy1: number,
    cpx2: number,
    cpy2: number,
    x: number,
    y: number
  ) {
    this.cubicTo(cpx1, cpy1, cpx2, cpy2, x, y, true);
    return this;
  }
  reset() {
    this.path = new PathBuilder();
    this.fillType = "nonzero";
  }
  rewind() {
    this.reset();
  }
  rLineTo(x: number, y: number): SkPath {
    this.path.lineTo(vec(x, y), true);
    return this;
  }
  rMoveTo(x: number, y: number) {
    this.path.moveTo(vec(x, y), true);
    return this;
  }
  rQuadTo(x1: number, y1: number, x2: number, y2: number) {
    this.path.quadraticCurveTo(vec(x1, y1), vec(x2, y2), true);
    return this;
  }
  setFillType(fill: EmbindEnumEntity): void {
    if (fill.value === FillTypeEnum.EvenOdd) {
      this.fillType = "evenodd";
    } else {
      this.fillType = "nonzero";
    }
  }
  setIsVolatile(volatile: boolean) {
    console.log({ volatile });
  }
  simplify(): boolean {
    throw new Error("Method not implemented.");
  }
  stroke(_opts?: StrokeOpts | undefined): SkPath | null {
    throw new Error("Method not implemented.");
  }

  toCmds() {
    return Float32Array.of(...this.path.getPath().toCmds());
  }

  toSVGString() {
    return this.path.getPath().toSVGString();
  }

  transform(m3: Matrix3x3): SkPath {
    const path = new PathBuilder();
    const cmds = this.toCmds();
    let i = 0;
    while (i < cmds.length) {
      const cmd = cmds[i++];
      if (cmd === PathVerb.Move) {
        const to = transformPoint(m3, cmds[i++], cmds[i++]);
        path.moveTo(to);
      } else if (cmd === PathVerb.Line) {
        const to = transformPoint(m3, cmds[i++], cmds[i++]);
        path.lineTo(to);
      } else if (cmd === PathVerb.Cubic) {
        const cp1 = transformPoint(m3, cmds[i++], cmds[i++]);
        const cp2 = transformPoint(m3, cmds[i++], cmds[i++]);
        const to = transformPoint(m3, cmds[i++], cmds[i++]);
        path.cubicCurveTo(cp1, cp2, to);
      } else if (cmd === PathVerb.Quad) {
        const cp = transformPoint(m3, cmds[i++], cmds[i++]);
        const to = transformPoint(m3, cmds[i++], cmds[i++]);
        path.quadraticCurveTo(cp, to);
      } else if (cmd === PathVerb.Close) {
        i++;
        path.close();
      }
    }
    this.path = path;
    return this;
  }

  trim(startT: number, stopT: number, isComplement: boolean) {
    const pe = new TrimPathEffect(startT, stopT, isComplement);
    return this.swap(pe.filterPath(this.path.getPath()));
  }

  getPath2D() {
    const path = new Path2D();
    const cmds = this.toCmds();
    let i = 0;
    while (i < cmds.length) {
      const cmd = cmds[i++];
      if (cmd === PathVerb.Move) {
        path.moveTo(cmds[i++], cmds[i++]);
      } else if (cmd === PathVerb.Line) {
        path.lineTo(cmds[i++], cmds[i++]);
      } else if (cmd === PathVerb.Cubic) {
        path.bezierCurveTo(
          cmds[i++],
          cmds[i++],
          cmds[i++],
          cmds[i++],
          cmds[i++],
          cmds[i++]
        );
      } else if (cmd === PathVerb.Quad) {
        path.quadraticCurveTo(cmds[i++], cmds[i++], cmds[i++], cmds[i++]);
      } else if (cmd === PathVerb.Close) {
        i++;
        path.closePath();
      }
    }
    return path;
  }

  static CanInterpolate(_path1: SkPath, _path2: SkPath): boolean {
    throw new Error("Function not implemented.");
  }

  static MakeFromCmds(input: InputCommands): SkPath | null {
    const cmds = normalizeArray(input);
    const path = new PathBuilder();
    let i = 0;
    while (i < cmds.length) {
      const cmd = cmds[i++];
      if (cmd === PathVerb.Move) {
        path.moveTo(vec(cmds[i++], cmds[i++]));
      } else if (cmd === PathVerb.Line) {
        path.lineTo(vec(cmds[i++], cmds[i++]));
      } else if (cmd === PathVerb.Cubic) {
        path.cubicCurveTo(
          vec(cmds[i++], cmds[i++]),
          vec(cmds[i++], cmds[i++]),
          vec(cmds[i++], cmds[i++])
        );
      } else if (cmd === PathVerb.Quad) {
        path.quadraticCurveTo(
          vec(cmds[i++], cmds[i++]),
          vec(cmds[i++], cmds[i++])
        );
      } else if (cmd === PathVerb.Close) {
        i++;
        path.close();
      }
    }
    return new PathJS(path);
  }
  static MakeFromOp(
    _one: SkPath,
    _two: SkPath,
    _op: EmbindEnumEntity
  ): SkPath | null {
    throw new Error("Function not implemented.");
  }
  static MakeFromPathInterpolation(
    _start: SkPath,
    _end: SkPath,
    _weight: number
  ): SkPath | null {
    throw new Error("Function not implemented.");
  }
  static MakeFromSVGString(d: string) {
    try {
      return new PathJS(parseSVG(d));
    } catch (e) {
      return null;
    }
  }
  static MakeFromVerbsPointsWeights(
    _verbs: VerbList,
    _points: InputFlattenedPointArray,
    _weights?: WeightList | undefined
  ): SkPath {
    throw new Error("Function not implemented.");
  }
}
