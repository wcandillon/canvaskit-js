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

import { HostObject } from "./HostObject";
import { rectToXYWH } from "./Values";
import { PathVerb } from "./Contants";
import { convert3x3ToDOMMatrix } from "./Matrix3";
import type { Matrix3x3 } from "./Matrix3";

const CommandCount = {
  [PathVerb.Move]: 3,
  [PathVerb.Line]: 3,
  [PathVerb.Quad]: 5,
  [PathVerb.Conic]: 6,
  [PathVerb.Cubic]: 7,
  [PathVerb.Close]: 1,
};

export class PathLite extends HostObject<Path> implements Path {
  private path = new Path2D();

  constructor() {
    super();
  }

  getNativePath() {
    return this.path;
  }

  addArc(bounds: InputRect, startAngle: number, sweepAngle: number): Path {
    const endAngle = startAngle + sweepAngle;
    const oval = rectToXYWH(bounds);
    this.path.arcTo(oval.x, oval.y, endAngle, oval.width, oval.height);
    return this;
  }

  addCircle(x: number, y: number, r: number, isCCW?: boolean): Path {
    if (isCCW) {
      this.path.arc(x, y, r, 0, 2 * Math.PI, true);
    } else {
      this.path.arc(x, y, r, 0, 2 * Math.PI, false);
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

  addPath(newPath: PathLite, matrix: Matrix3x3) {
    this.path.addPath(newPath.getNativePath(), convert3x3ToDOMMatrix(matrix));
    return this;
  }

  addPoly(_points: InputFlattenedPointArray, _close: boolean): Path {
    throw new Error("Method not implemented.");
  }
  addRect(_rect: InputRect, _isCCW?: boolean | undefined): Path {
    throw new Error("Method not implemented.");
  }
  addRRect(_rrect: InputRRect, _isCCW?: boolean | undefined): Path {
    throw new Error("Method not implemented.");
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
  arcToTangent(
    _x1: number,
    _y1: number,
    _x2: number,
    _y2: number,
    _radius: number
  ): Path {
    throw new Error("Method not implemented.");
  }
  close(): Path {
    throw new Error("Method not implemented.");
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
    _cpx1: number,
    _cpy1: number,
    _cpx2: number,
    _cpy2: number,
    _x: number,
    _y: number
  ): Path {
    throw new Error("Method not implemented.");
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
  lineTo(_x: number, _y: number): Path {
    throw new Error("Method not implemented.");
  }
  makeAsWinding(): Path | null {
    throw new Error("Method not implemented.");
  }
  moveTo(x: number, y: number): Path {
    this.path.moveTo(x, y);
    return this;
  }
  offset(_dx: number, _dy: number): Path {
    throw new Error("Method not implemented.");
  }
  op(_other: Path, _op: EmbindEnumEntity): boolean {
    throw new Error("Method not implemented.");
  }
  quadTo(_x1: number, _y1: number, _x2: number, _y2: number): Path {
    throw new Error("Method not implemented.");
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
    throw new Error("Method not implemented.");
  }
  toSVGString(): string {
    throw new Error("Method not implemented.");
  }
  transform(..._args: any[]): Path {
    throw new Error("Method not implemented.");
  }
  trim(_startT: number, _stopT: number, _isComplement: boolean): Path | null {
    throw new Error("Method not implemented.");
  }

  static CanInterpolate(_path1: Path, _path2: Path): boolean {
    throw new Error("Function not implemented.");
  }
  static MakeFromCmd(_cmds: InputCommands): Path | null {
    throw new Error("Function not implemented.");
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
  static MakeFromSVGString(_str: string): Path | null {
    throw new Error("Function not implemented.");
  }
  static MakeFromVerbsPointsWeights(
    _verbs: VerbList,
    _points: InputFlattenedPointArray,
    _weights?: WeightList | undefined
  ): Path {
    throw new Error("Function not implemented.");
  }
}
