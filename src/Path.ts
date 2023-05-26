import type {
  EmbindEnumEntity,
  InputCommands,
  InputFlattenedPointArray,
  VerbList,
  WeightList,
  Path,
  InputRRect,
  InputRect,
  StrokeOpts,
} from "canvaskit-wasm";

/// <reference path="typings.d.ts" />
import parseSVG from "parse-svg-path";
import absSVG from "abs-svg-path";
import serializeSVG from "serialize-svg-path";

import { PathVerb as CKPathVerb } from "./Contants";
import { HostObject } from "./HostObject";
import type { Matrix3x3 } from "./Matrix3";
import { Matrix3, transformPoint } from "./Matrix3";
import { inputCmds, rrectToXYWH } from "./Values";

enum PathVerb {
  Move = "M",
  Line = "L",
  Cubic = "C",
  Quad = "Q",
  Close = "Z",
  Arc = "A",
}

type PathCommand = [string, ...number[]];

const unflattenCmds = (cmds: number[]): PathCommand[] => {
  const result: PathCommand[] = [];
  let i = 0;
  while (i < cmds.length) {
    const cmd = cmds[i++];
    if (cmd === CKPathVerb.Move) {
      result.push([PathVerb.Move, cmds[i++], cmds[i++]]);
    } else if (cmd === CKPathVerb.Line) {
      result.push([PathVerb.Line, cmds[i++], cmds[i++]]);
    } else if (cmd === CKPathVerb.Cubic) {
      result.push([
        PathVerb.Cubic,
        cmds[i++],
        cmds[i++],
        cmds[i++],
        cmds[i++],
        cmds[i++],
        cmds[i++],
      ]);
    } else if (cmd === CKPathVerb.Quad) {
      result.push([PathVerb.Quad, cmds[i++], cmds[i++], cmds[i++], cmds[i++]]);
    } else if (cmd === CKPathVerb.Close) {
      i++;
      result.push([PathVerb.Close]);
    }
  }
  return result;
};

export class PathLite extends HostObject<Path> implements Path {
  private path: PathCommand[] = [];
  private lastPoint: [number, number] = [0, 0];

  constructor(cmds?: PathCommand[]) {
    super();
    if (cmds) {
      this.path = cmds;
      this.lastPoint = cmds[cmds.length - 1].slice(-2) as [number, number];
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.path.forEach(([cmd, ...points]) => {
      if (cmd === PathVerb.Move) {
        ctx.moveTo(points[0], points[1]);
      } else if (cmd === PathVerb.Line) {
        ctx.lineTo(points[0], points[1]);
      } else if (cmd === PathVerb.Cubic) {
        ctx.bezierCurveTo(
          points[0],
          points[1],
          points[2],
          points[3],
          points[4],
          points[5]
        );
      } else if (cmd === PathVerb.Quad) {
        ctx.quadraticCurveTo(points[0], points[1], points[2], points[3]);
      } else if (cmd === PathVerb.Arc) {
        ctx.arc(
          points[0],
          points[1],
          points[2],
          points[3],
          points[4],
          !!points[5]
        );
      }
    });
  }

  getNativePath() {
    return this.path;
  }

  addArc(_bounds: InputRect, _startAngle: number, _sweepAngle: number): Path {
    throw new Error("Method not implemented.");
  }

  addCircle(x: number, y: number, r: number, isCCW?: boolean): Path {
    if (r >= 0) {
      this.addOval(Float32Array.of(x - r, y - r, x + r, y + r), isCCW);
    }
    return this;
  }

  addOval(
    _oval: InputRect,
    _isCCW?: boolean | undefined,
    _startIndex?: number | undefined
  ): Path {
    throw new Error("Method not implemented.");
  }

  addPath(_newPath: PathLite, _matrix: Matrix3x3): Path | null {
    throw new Error("Method not implemented.");
  }

  addPoly(_points: InputFlattenedPointArray, _close: boolean): Path {
    throw new Error("Method not implemented.");
  }
  addRect(_rect: InputRect, _isCCW?: boolean | undefined): Path {
    throw new Error("Method not implemented.");
  }
  addRRect(_rrect: InputRRect, isCCW?: boolean): Path {
    const rrect = rrectToXYWH(_rrect);
    const corners = [
      { x: rrect.x + rrect.rx, y: rrect.y },
      { x: rrect.x + rrect.width - rrect.rx, y: rrect.y },
      { x: rrect.x + rrect.width, y: rrect.y + rrect.ry },
      { x: rrect.x + rrect.width, y: rrect.y + rrect.height - rrect.ry },
      { x: rrect.x + rrect.width - rrect.rx, y: rrect.y + rrect.height },
      { x: rrect.x + rrect.rx, y: rrect.y + rrect.height },
      { x: rrect.x, y: rrect.y + rrect.height - rrect.ry },
      { x: rrect.x, y: rrect.y + rrect.ry },
    ];

    if (isCCW) {
      corners.reverse();
    }

    this.ensureMove();
    corners.forEach((corner, index) => {
      if (index % 2 === 0) {
        this.lineTo(corner.x, corner.y);
      } else {
        this.nativeArc(
          rrect.rx,
          rrect.ry,
          0,
          0,
          isCCW ? 0 : 1,
          corner.x,
          corner.y
        );
      }
    });

    this.close();

    return this;
  }
  addVerbsPointsWeights(
    _verbs: VerbList,
    _points: InputFlattenedPointArray,
    _weights?: WeightList | undefined
  ): Path {
    throw new Error("Method not implemented.");
  }
  arc(
    _x: number,
    _y: number,
    _radius: number,
    _startAngle: number,
    _endAngle: number,
    _isCCW?: boolean | undefined
  ): Path {
    throw new Error("Method not implemented.");
  }
  arcToOval(
    _oval: InputRect,
    _startAngle: number,
    _endAngle: number,
    _forceMoveTo: boolean
  ): Path {
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
  ): Path {
    throw new Error("Method not implemented.");
  }

  private ensureMove() {
    if (
      this.path.length > 0 &&
      this.path[this.path.length - 1][0] !== PathVerb.Move
    ) {
      this.moveTo(this.lastPoint[0], this.lastPoint[1]);
    }
  }

  arcToTangent(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    r: number
  ): Path {
    this.ensureMove();
    if (r === 0) {
      return this.lineTo(x1, y1);
    }
    // Compute middle point between (x1, y1) and (x2, y2)
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;

    // Compute angle between (x1, y1) and (x2, y2)
    const angle = Math.atan2(y2 - y1, x2 - x1);

    // Compute rotation
    const xRotation = angle * (180 / Math.PI);

    // Compute flags
    const largeArcFlag = 0; // Choose 0 or 1 depending on your specific case
    const sweepFlag = 1; // Choose 0 or 1 depending on your specific case

    return this.nativeArc(r, r, xRotation, largeArcFlag, sweepFlag, mx, my);
  }
  // A rx ry x-axis-rotation large-arc-flag sweep-flag x y

  private nativeArc(
    rx: number,
    ry: number,
    xRotation: number,
    largeArcFlag: number,
    sweepFlat: number,
    x: number,
    y: number
  ) {
    this.path.push([
      PathVerb.Arc,
      rx,
      ry,
      xRotation,
      largeArcFlag,
      sweepFlat,
      x,
      y,
    ]);
    this.lastPoint = [x, y];
    return this;
  }

  close(): Path {
    this.path.push([PathVerb.Close]);
    return this;
  }
  computeTightBounds(_outputArray?: Float32Array | undefined): Float32Array {
    throw new Error("Method not implemented.");
  }
  conicTo(
    _x1: number,
    _y1: number,
    _x2: number,
    _y2: number,
    _w: number
  ): Path {
    throw new Error("Method not implemented.");
  }
  contains(_x: number, _y: number): boolean {
    throw new Error("Method not implemented.");
  }
  copy(): Path {
    throw new Error("Method not implemented.");
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
    y: number
  ): Path {
    this.path.push([PathVerb.Cubic, cpx1, cpy1, cpx2, cpy2, x, y]);
    this.lastPoint = [x, y];
    return this;
  }
  dash(_on: number, _off: number, _phase: number): boolean {
    throw new Error("Method not implemented.");
  }
  equals(_other: Path): boolean {
    throw new Error("Method not implemented.");
  }
  getBounds(_outputArray?: Float32Array | undefined): Float32Array {
    throw new Error("Method not implemented.");
  }
  getFillType(): EmbindEnumEntity {
    throw new Error("Method not implemented.");
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
  lineTo(x: number, y: number): Path {
    this.path.push([PathVerb.Line, x, y]);
    this.lastPoint = [x, y];
    return this;
  }
  makeAsWinding(): Path | null {
    throw new Error("Method not implemented.");
  }
  moveTo(x: number, y: number): Path {
    this.path.push([PathVerb.Move, x, y]);
    this.lastPoint = [x, y];
    return this;
  }
  offset(dx: number, dy: number): Path {
    const m = Matrix3.translated(dx, dy);
    this.transform(m);
    return this;
  }
  op(_other: Path, _op: EmbindEnumEntity): boolean {
    throw new Error("Method not implemented.");
  }
  quadTo(x1: number, y1: number, x2: number, y2: number): Path {
    this.path.push([PathVerb.Quad, x1, y1, x2, y2]);
    this.lastPoint = [x2, y2];
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
  ): Path {
    throw new Error("Method not implemented.");
  }
  rConicTo(
    _dx1: number,
    _dy1: number,
    _dx2: number,
    _dy2: number,
    _w: number
  ): Path {
    throw new Error("Method not implemented.");
  }
  rCubicTo(
    _cpx1: number,
    _cpy1: number,
    _cpx2: number,
    _cpy2: number,
    _x: number,
    _y: number
  ): Path {
    throw new Error("Method not implemented.");
  }
  reset(): void {
    throw new Error("Method not implemented.");
  }
  rewind(): void {
    throw new Error("Method not implemented.");
  }
  rLineTo(_x: number, _y: number): Path {
    throw new Error("Method not implemented.");
  }
  rMoveTo(_x: number, _y: number): Path {
    throw new Error("Method not implemented.");
  }
  rQuadTo(_x1: number, _y1: number, _x2: number, _y2: number): Path {
    throw new Error("Method not implemented.");
  }
  setFillType(_fill: EmbindEnumEntity): void {
    throw new Error("Method not implemented.");
  }
  setIsVolatile(_volatile: boolean): void {
    throw new Error("Method not implemented.");
  }
  simplify(): boolean {
    throw new Error("Method not implemented.");
  }
  stroke(_opts?: StrokeOpts | undefined): Path | null {
    throw new Error("Method not implemented.");
  }
  toCmds(): Float32Array {
    const cmds: number[][] = [];
    this.path.forEach(([verb, ...cmd]) => {
      if (verb === PathVerb.Move) {
        cmds.push([CKPathVerb.Move, cmd[0], cmd[1]]);
      } else if (verb === PathVerb.Line) {
        cmds.push([CKPathVerb.Line, cmd[0], cmd[1]]);
      } else if (verb === PathVerb.Cubic) {
        cmds.push([
          CKPathVerb.Cubic,
          cmd[0],
          cmd[1],
          cmd[2],
          cmd[3],
          cmd[4],
          cmd[5],
        ]);
      } else if (verb === PathVerb.Quad) {
        cmds.push([CKPathVerb.Cubic, cmd[0], cmd[1], cmd[2], cmd[3]]);
      } else if (verb === PathVerb.Close) {
        cmds.push([CKPathVerb.Close]);
      }
    });
    return new Float32Array(cmds.flat());
  }
  toSVGString(): string {
    return serializeSVG(this.path);
  }
  transform(m: Matrix3x3): Path {
    this.path = this.path.map((cmd) => {
      return [cmd[0], ...transformPoint(m, [cmd[1], cmd[2], 1])];
    });
    return this;
  }
  trim(_startT: number, _stopT: number, _isComplement: boolean): Path | null {
    throw new Error("Method not implemented.");
  }

  static CanInterpolate(_path1: Path, _path2: Path): boolean {
    throw new Error("Function not implemented.");
  }
  static MakeFromCmds(cmds: InputCommands): Path | null {
    return new PathLite(unflattenCmds(inputCmds(cmds)));
  }
  static MakeFromOp(
    _one: Path,
    _two: Path,
    _op: EmbindEnumEntity
  ): Path | null {
    throw new Error("Function not implemented.");
  }
  static MakeFromPathInterpolation(
    _start: Path,
    _end: Path,
    _weight: number
  ): Path | null {
    throw new Error("Function not implemented.");
  }
  static MakeFromSVGString(d: string): Path | null {
    const cmds = absSVG(parseSVG(d));
    return new PathLite(cmds);
  }
  static MakeFromVerbsPointsWeights(
    _verbs: VerbList,
    _points: InputFlattenedPointArray,
    _weights?: WeightList | undefined
  ): Path {
    throw new Error("Function not implemented.");
  }
}
