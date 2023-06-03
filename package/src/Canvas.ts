/* eslint-disable prefer-destructuring */
import type {
  Canvas,
  ColorIntArray,
  CubicResampler,
  EmbindEnumEntity,
  FilterOptions,
  Font,
  Image,
  ImageFilter,
  ImageInfo,
  InputFlattenedPointArray,
  InputFlattenedRSXFormArray,
  InputFlattenedRectangleArray,
  InputGlyphIDArray,
  InputIRect,
  InputMatrix,
  InputRRect,
  InputRect,
  InputVector3,
  MallocObj,
  Paint,
  Paragraph,
  Path,
  SkPicture,
  Surface,
  TextBlob,
  Vertices,
} from "canvaskit-wasm";

import { PaintJS } from "./Paint";
import type { ColorSpaceJS, InputColor } from "./Contants";
import { HostObject } from "./HostObject";
import { IntAsColor, rectToXYWH, rrectToXYWH } from "./Values";
import { convertDOMMatrixTo3x3, normalizeMatrix } from "./Matrix3";
import { toRad } from "./math";
import type { PathJS } from "./Path";
import type { ImageJS } from "./Image";

export class CanvasJS extends HostObject<Canvas> implements Canvas {
  private defaultPaint = new PaintJS();
  private saveCount = 0;

  constructor(private readonly ctx: CanvasRenderingContext2D) {
    super();
  }

  clear(color: InputColor): void {
    const paint = new PaintJS();
    paint.setColor(color);
    this.drawPaint(paint);
  }
  clipPath(path: PathJS, _op: EmbindEnumEntity, _doAntiAlias: boolean): void {
    this.ctx.clip(path.getPath2D());
  }
  clipRect(
    _rect: InputRect,
    _op: EmbindEnumEntity,
    _doAntiAlias: boolean
  ): void {
    throw new Error("Method not implemented.");
  }
  clipRRect(
    _rrect: InputRRect,
    _op: EmbindEnumEntity,
    _doAntiAlias: boolean
  ): void {
    throw new Error("Method not implemented.");
  }
  concat(m: InputMatrix): void {
    const matrix = normalizeMatrix(m);
    const a = matrix[0]; // scale x
    const b = matrix[3]; // skew y
    const c = matrix[1]; // skew x
    const d = matrix[4]; // scale y
    const e = matrix[2]; // translate x
    const f = matrix[5]; // translate y
    this.ctx.transform(a, b, c, d, e, f);
  }
  drawArc(
    _oval: InputRect,
    _startAngle: number,
    _sweepAngle: number,
    _useCenter: boolean,
    _paint: Paint
  ): void {
    throw new Error("Method not implemented.");
  }
  drawAtlas(
    _atlas: Image,
    _srcRects: InputFlattenedRectangleArray,
    _dstXforms: InputFlattenedRSXFormArray,
    _paint: Paint,
    _blendMode?: EmbindEnumEntity | null | undefined,
    _colors?: ColorIntArray | null | undefined,
    _sampling?: CubicResampler | FilterOptions | undefined
  ): void {
    throw new Error("Method not implemented.");
  }
  drawCircle(cx: number, cy: number, radius: number, paint: PaintJS) {
    paint.apply(this.ctx, () => {
      this.ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
    });
  }
  drawColor(color: InputColor, blendMode?: EmbindEnumEntity | undefined): void {
    const paint = new PaintJS();
    paint.setColor(color);
    if (blendMode) {
      paint.setBlendMode(blendMode);
    }
    this.drawPaint(paint);
  }
  drawColorComponents(
    r: number,
    g: number,
    b: number,
    a: number,
    blendMode?: EmbindEnumEntity | undefined
  ): void {
    this.drawColor(Float32Array.of(r, g, b, a), blendMode);
  }
  drawColorInt(color: number, blendMode?: EmbindEnumEntity | undefined): void {
    this.drawColor(IntAsColor(color), blendMode);
  }
  drawDRRect(_outer: InputRRect, _inner: InputRRect, _paint: Paint): void {
    throw new Error("Method not implemented.");
  }
  drawGlyphs(
    _glyphs: InputGlyphIDArray,
    _positions: InputFlattenedPointArray,
    _x: number,
    _y: number,
    _font: Font,
    _paint: Paint
  ): void {
    throw new Error("Method not implemented.");
  }
  drawImage(img: ImageJS, left: number, top: number, paint?: PaintJS): void {
    (paint ?? this.defaultPaint).apply(this.ctx, () => {
      this.ctx.drawImage(img.getImage(), left, top);
    });
  }
  drawImageCubic(
    _img: Image,
    _left: number,
    _top: number,
    _B: number,
    _C: number,
    _paint?: Paint | null | undefined
  ): void {
    throw new Error("Method not implemented.");
  }
  drawImageOptions(
    _img: Image,
    _left: number,
    _top: number,
    _fm: EmbindEnumEntity,
    _mm: EmbindEnumEntity,
    _paint?: Paint | null | undefined
  ): void {
    throw new Error("Method not implemented.");
  }
  drawImageNine(
    _img: Image,
    _center: InputIRect,
    _dest: InputRect,
    _filter: EmbindEnumEntity,
    _paint?: Paint | null | undefined
  ): void {
    throw new Error("Method not implemented.");
  }
  drawImageRect(
    img: ImageJS,
    _src: InputRect,
    _dest: InputRect,
    paint: PaintJS,
    _fastSample?: boolean
  ): void {
    const src = rectToXYWH(_src);
    const dest = rectToXYWH(_dest);
    paint.apply(this.ctx, () => {
      this.ctx.drawImage(
        img.getImage(),
        src.x,
        src.y,
        src.width,
        src.height,
        dest.x,
        dest.y,
        dest.width,
        dest.height
      );
    });
  }
  drawImageRectCubic(
    _img: Image,
    _src: InputRect,
    _dest: InputRect,
    _B: number,
    _C: number,
    _paint?: Paint | null | undefined
  ): void {
    throw new Error("Method not implemented.");
  }
  drawImageRectOptions(
    _img: Image,
    _src: InputRect,
    _dest: InputRect,
    _fm: EmbindEnumEntity,
    _mm: EmbindEnumEntity,
    _paint?: Paint | null | undefined
  ): void {
    throw new Error("Method not implemented.");
  }
  drawLine(
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    paint: PaintJS
  ): void {
    paint.apply(this.ctx, () => {
      this.ctx.moveTo(x0, y0);
      this.ctx.lineTo(x1, y1);
    });
  }
  drawOval(_oval: InputRect, _paint: Paint): void {
    throw new Error("Method not implemented.");
  }
  drawPaint(paint: PaintJS) {
    this.drawRect([0, 0, this.ctx.canvas.width, this.ctx.canvas.height], paint);
  }
  drawParagraph(_p: Paragraph, _x: number, _y: number): void {
    throw new Error("Method not implemented.");
  }
  drawPath(path: PathJS, paint: PaintJS): void {
    paint.apply(
      this.ctx,
      () => {
        return path.getPath2D();
      },
      true
    );
  }
  drawPatch(
    _cubics: InputFlattenedPointArray,
    _colors?: ColorIntArray | Float32Array[] | null | undefined,
    _texs?: InputFlattenedPointArray | null | undefined,
    _mode?: EmbindEnumEntity | null | undefined,
    _paint?: Paint | undefined
  ): void {
    throw new Error("Method not implemented.");
  }
  drawPicture(_skp: SkPicture): void {
    throw new Error("Method not implemented.");
  }
  drawPoints(
    _mode: EmbindEnumEntity,
    _points: InputFlattenedPointArray,
    _paint: Paint
  ): void {
    throw new Error("Method not implemented.");
  }
  drawRect(rect: InputRect, paint: PaintJS): void {
    paint.apply(this.ctx, () => {
      const { x, y, width, height } = rectToXYWH(rect);
      this.ctx.rect(x, y, width, height);
    });
  }
  drawRect4f(
    left: number,
    top: number,
    right: number,
    bottom: number,
    paint: PaintJS
  ): void {
    const width = right - left;
    const height = bottom - top;
    paint.apply(this.ctx, () => {
      this.ctx.rect(left, top, width, height);
    });
  }
  drawRRect(rrect: InputRRect, paint: PaintJS): void {
    paint.apply(this.ctx, () => {
      const { x, y, width, height, radii } = rrectToXYWH(rrect);
      this.ctx.roundRect(x, y, width, height, radii);
    });
  }
  drawShadow(
    _path: Path,
    _zPlaneParams: InputVector3,
    _lightPos: InputVector3,
    _lightRadius: number,
    _ambientColor: InputColor,
    _spotColor: InputColor,
    _flags: number
  ): void {
    throw new Error("Method not implemented.");
  }
  drawText(
    _str: string,
    _x: number,
    _y: number,
    _paint: Paint,
    _font: Font
  ): void {
    throw new Error("Method not implemented.");
  }
  drawTextBlob(_blob: TextBlob, _x: number, _y: number, _paint: Paint): void {
    throw new Error("Method not implemented.");
  }
  drawVertices(_verts: Vertices, _mode: EmbindEnumEntity, _paint: Paint): void {
    throw new Error("Method not implemented.");
  }
  getDeviceClipBounds(_output?: Int32Array | undefined): Int32Array {
    throw new Error("Method not implemented.");
  }
  getLocalToDevice(): Float32Array {
    throw new Error("Method not implemented.");
  }
  getSaveCount(): number {
    return this.saveCount;
  }
  getTotalMatrix(): number[] {
    return convertDOMMatrixTo3x3(this.ctx.getTransform());
  }
  makeSurface(_info: ImageInfo): Surface | null {
    throw new Error("Method not implemented.");
  }
  readPixels(
    _srcX: number,
    _srcY: number,
    _imageInfo: ImageInfo,
    _dest?: MallocObj | undefined,
    _bytesPerRow?: number | undefined
  ): Float32Array | Uint8Array | null {
    throw new Error("Method not implemented.");
  }
  restore(): void {
    this.ctx.restore();
    this.saveCount--;
  }
  restoreToCount(saveCount: number): void {
    for (let i = 1; i <= saveCount; i++) {
      this.restore();
    }
  }
  rotate(rot: number, rx: number, ry: number): void {
    this.ctx.translate(rx, ry);
    this.ctx.rotate(toRad(rot));
    this.ctx.translate(-rx, -ry);
  }
  save(): number {
    this.ctx.save();
    this.saveCount++;
    return this.saveCount;
  }
  saveLayer(
    _paint?: Paint,
    _bounds?: InputRect | null,
    _backdrop?: ImageFilter | null,
    _flags?: number
  ): number {
    throw new Error("Method not implemented.");
  }
  scale(sx: number, sy: number): void {
    this.ctx.scale(sx, sy);
  }
  skew(sx: number, sy: number): void {
    const rSx = Math.tan(sx);
    const rSy = Math.tan(sy);
    this.ctx.transform(1, rSy, rSx, 1, 0, 0);
  }
  translate(x: number, y: number): void {
    this.ctx.translate(x, y);
  }
  writePixels(
    pixels: number[] | Uint8Array,
    width: number,
    height: number,
    destX: number,
    destY: number,
    _alphaType?: EmbindEnumEntity | undefined,
    _colorType?: EmbindEnumEntity | undefined,
    colorSpace?: ColorSpaceJS | undefined
  ): boolean {
    this.ctx.putImageData(
      {
        data: new Uint8ClampedArray(pixels),
        width,
        height,
        colorSpace: colorSpace ? colorSpace.getNativeValue() : "srgb",
      },
      destX,
      destY
    );
    return true;
  }
}
