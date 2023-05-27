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
import parseSVG from "parse-svg-path";
import absSVG from "abs-svg-path";
import serializeSVG from "serialize-svg-path";
import { svgPathProperties as SvgPathProperties } from "svg-path-properties";

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

  getPath2D() {
    return new Path2D(serializeSVG(this.path));
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

  addPath(newPath: PathLite, _matrix: Matrix3x3): Path | null {
    this.path.push(...newPath.path);
    return this;
  }

  addPoly(_points: InputFlattenedPointArray, _close: boolean): Path {
    throw new Error("Method not implemented.");
  }
  addRect(_rect: InputRect, _isCCW?: boolean | undefined): Path {
    throw new Error("Method not implemented.");
  }
  addRRect(_rrect: InputRRect, isCCW?: boolean): Path {
    const { radii, ...rrect } = rrectToXYWH(_rrect);
    const [rx, ry] = radii;
    const corners = [
      { x: rrect.x + rx, y: rrect.y },
      { x: rrect.x + rrect.width - rx, y: rrect.y },
      { x: rrect.x + rrect.width, y: rrect.y + ry },
      { x: rrect.x + rrect.width, y: rrect.y + rrect.height - ry },
      { x: rrect.x + rrect.width - rx, y: rrect.y + rrect.height },
      { x: rrect.x + rx, y: rrect.y + rrect.height },
      { x: rrect.x, y: rrect.y + rrect.height - ry },
      { x: rrect.x, y: rrect.y + ry },
    ];

    if (isCCW) {
      corners.reverse();
    }
    this.moveTo(corners[0].x, corners[0].y);
    corners.forEach((corner, index) => {
      if (index === 0) {
        return;
      }
      if (index % 2 === 0) {
        this.lineTo(corner.x, corner.y);
      } else {
        this.nativeArc(rx, ry, 0, 0, isCCW ? 0 : 1, corner.x, corner.y);
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
    x: number,
    y: number,
    r: number,
    startAngle: number,
    endAngle: number,
    _isCCW?: boolean
  ): Path {
    return this.addArc(
      Float32Array.of(x - r, y - r, x + r, y + r),
      startAngle,
      endAngle - startAngle
    );
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
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    r: number
  ): Path {
    this.moveTo(x1, y1);
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
    return new PathLite(this.path.slice());
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
    cpx1: number,
    cpy1: number,
    cpx2: number,
    cpy2: number,
    x: number,
    y: number
  ): Path {
    return this.cubicTo(
      cpx1 + this.lastPoint[0],
      cpy1 + this.lastPoint[1],
      cpx2 + this.lastPoint[0],
      cpy2 + this.lastPoint[1],
      x + this.lastPoint[0],
      y + this.lastPoint[1]
    );
  }
  reset(): void {
    this.path = [];
    this.lastPoint = [0, 0];
  }
  rewind(): void {
    this.reset();
  }
  rLineTo(x: number, y: number): Path {
    return this.lineTo(this.lastPoint[0] + x, this.lastPoint[1] + y);
  }
  rMoveTo(x: number, y: number): Path {
    return this.moveTo(this.lastPoint[0] + x, this.lastPoint[1] + y);
  }
  rQuadTo(x1: number, y1: number, x2: number, y2: number): Path {
    return this.quadTo(
      this.lastPoint[0] + x1,
      this.lastPoint[1] + y1,
      this.lastPoint[0] + x2,
      this.lastPoint[1] + y2
    );
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
  trim(startT: number, stopT: number, isComplement: boolean): Path | null {
    const properties = new SvgPathProperties(this.toSVGString());
    const newPath = new PathLite();
    const length = properties.getTotalLength();
    let t = 0;
    properties.getParts().forEach((part) => {
      if (t >= startT && t <= stopT && !isComplement) {
        newPath.lineTo(part.end.x, part.end.y);
      }
      t += part.length / length;
    });
    return this.swap(newPath);
  }

  private swap(newPath: PathLite): Path | null {
    this.path = newPath.path;
    this.lastPoint = newPath.lastPoint;
    return newPath;
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
