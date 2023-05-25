import type {
  Canvas,
  ColorIntArray,
  ColorSpace,
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

import { PaintLite } from "./Paint";
import type { InputColor } from "./Contants";
import { HostObject } from "./HostObject";

export class CanvasLite extends HostObject<Canvas> implements Canvas {
  constructor(private readonly ctx: CanvasRenderingContext2D) {
    super();
  }

  clear(color: InputColor): void {
    const paint = new PaintLite();
    paint.setColor(color);
    this.drawPaint(paint);
  }
  clipPath(_path: Path, _op: EmbindEnumEntity, _doAntiAlias: boolean): void {
    throw new Error("Method not implemented.");
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
  concat(_m: InputMatrix): void {
    throw new Error("Method not implemented.");
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
  drawCircle(cx: number, cy: number, radius: number, paint: PaintLite) {
    paint.apply(this.ctx, () => {
      this.ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
    });
  }
  drawColor(
    _color: InputColor,
    _blendMode?: EmbindEnumEntity | undefined
  ): void {
    throw new Error("Method not implemented.");
  }
  drawColorComponents(
    _r: number,
    _g: number,
    _b: number,
    _a: number,
    _blendMode?: EmbindEnumEntity | undefined
  ): void {
    throw new Error("Method not implemented.");
  }
  drawColorInt(
    _color: number,
    _blendMode?: EmbindEnumEntity | undefined
  ): void {
    throw new Error("Method not implemented.");
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
  drawImage(
    _img: Image,
    _left: number,
    _top: number,
    _paint?: Paint | null | undefined
  ): void {
    throw new Error("Method not implemented.");
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
    _img: Image,
    _src: InputRect,
    _dest: InputRect,
    _paint: Paint,
    _fastSample?: boolean | undefined
  ): void {
    throw new Error("Method not implemented.");
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
    _x0: number,
    _y0: number,
    _x1: number,
    _y1: number,
    _paint: Paint
  ): void {
    throw new Error("Method not implemented.");
  }
  drawOval(_oval: InputRect, _paint: Paint): void {
    throw new Error("Method not implemented.");
  }
  drawPaint(paint: PaintLite) {
    paint.apply(this.ctx, () => {
      this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    });
  }
  drawParagraph(_p: Paragraph, _x: number, _y: number): void {
    throw new Error("Method not implemented.");
  }
  drawPath(_path: Path, _paint: Paint): void {
    throw new Error("Method not implemented.");
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
  drawRect(_rect: InputRect, _paint: Paint): void {
    throw new Error("Method not implemented.");
  }
  drawRect4f(
    _left: number,
    _top: number,
    _right: number,
    _bottom: number,
    _paint: Paint
  ): void {
    throw new Error("Method not implemented.");
  }
  drawRRect(_rrect: InputRRect, _paint: Paint): void {
    throw new Error("Method not implemented.");
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
    throw new Error("Method not implemented.");
  }
  getTotalMatrix(): number[] {
    throw new Error("Method not implemented.");
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
    throw new Error("Method not implemented.");
  }
  restoreToCount(_saveCount: number): void {
    throw new Error("Method not implemented.");
  }
  rotate(_rot: number, _rx: number, _ry: number): void {
    throw new Error("Method not implemented.");
  }
  save(): number {
    throw new Error("Method not implemented.");
  }
  saveLayer(
    _paint?: Paint | undefined,
    _bounds?: InputRect | null | undefined,
    _backdrop?: ImageFilter | null | undefined,
    _flags?: number | undefined
  ): number {
    throw new Error("Method not implemented.");
  }
  scale(_sx: number, _sy: number): void {
    throw new Error("Method not implemented.");
  }
  skew(_sx: number, _sy: number): void {
    throw new Error("Method not implemented.");
  }
  translate(_dx: number, _dy: number): void {
    throw new Error("Method not implemented.");
  }
  writePixels(
    _pixels: number[] | Uint8Array,
    _srcWidth: number,
    _srcHeight: number,
    _destX: number,
    _destY: number,
    _alphaType?: EmbindEnumEntity | undefined,
    _colorType?: EmbindEnumEntity | undefined,
    _colorSpace?: ColorSpace | undefined
  ): boolean {
    throw new Error("Method not implemented.");
  }
}
