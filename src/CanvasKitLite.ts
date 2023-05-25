/* eslint-disable no-bitwise */
/* eslint-disable camelcase */
import type {
  AffinityEnumValues,
  AlphaTypeEnumValues,
  AnimatedImage,
  BlurStyleEnumValues,
  ClipOpEnumValues,
  ColorChannelEnumValues,
  ColorFilterFactory,
  ColorIntArray,
  ColorMatrixHelpers,
  ColorSpace,
  ColorSpaceEnumValues,
  ColorTypeEnumValues,
  ContourMeasureIterConstructor,
  DecorationStyleEnumValues,
  DefaultConstructor,
  EmbindEnumEntity,
  EmulatedCanvas2D,
  FillTypeEnumValues,
  FilterModeEnumValues,
  FontCollectionFactory,
  FontConstructor,
  FontEdgingEnumValues,
  FontHintingEnumValues,
  FontMgrFactory,
  FontSlantEnumValues,
  FontWeightEnumValues,
  FontWidthEnumValues,
  GlyphRunFlagValues,
  GrDirectContext,
  Image,
  ImageDataConstructor,
  ImageFilterFactory,
  ImageFormatEnumValues,
  ImageInfo,
  InputFlattenedPointArray,
  InputMatrix,
  InputRect,
  InputVector3,
  MallocObj,
  ManagedSkottieAnimation,
  MaskFilterFactory,
  Matrix3x3Helpers,
  Matrix4x4Helpers,
  MipmapModeEnumValues,
  Paint,
  ParagraphBuilderFactory,
  ParagraphStyleConstructor,
  PartialImageInfo,
  Path,
  Path1DEffectStyleEnumValues,
  PathConstructorAndFactory,
  PathEffectFactory,
  PathOpEnumValues,
  PictureRecorder,
  PlaceholderAlignmentEnumValues,
  PointModeEnumValues,
  RectHeightStyleEnumValues,
  RectWidthStyleEnumValues,
  RuntimeEffectFactory,
  ShaderFactory,
  SkPicture,
  SkottieAnimation,
  SoundMap,
  Surface,
  TextAlignEnumValues,
  TextBaselineEnumValues,
  TextBlobFactory,
  TextDirectionEnumValues,
  TextHeightBehaviorEnumValues,
  TextStyleConstructor,
  TextureSource,
  TileModeEnumValues,
  TonalColorsInput,
  TonalColorsOutput,
  TypedArrayConstructor,
  TypefaceFactory,
  TypefaceFontProviderFactory,
  VectorHelpers,
  VertexModeEnumValues,
  Vertices,
  WebGLOptions,
  WebGPUCanvasContext,
  WebGPUCanvasOptions,
  CanvasKit,
} from "canvaskit-wasm";

import { clampColorComp } from "./math";
import { BlendMode, PaintStyle, StrokeCap, StrokeJoin } from "./Contants";
import { SurfaceLite } from "./Surface";
import { PaintLite } from "./Paint";

export class CanvasKitLite implements CanvasKit {
  Color(r: number, g: number, b: number, a = 1): Float32Array {
    return new Float32Array([r / 255, g / 255, b / 255, a]);
  }
  Color4f(
    r: number,
    g: number,
    b: number,
    a?: number | undefined
  ): Float32Array {
    return Float32Array.of(r, g, b, a ?? 1);
  }
  ColorAsInt(r: number, g: number, b: number, a = 1): number {
    // default to opaque
    if (a === undefined) {
      a = 255;
    }
    // This is consistent with how Skia represents colors in C++, as an unsigned int.
    // This is also consistent with how Flutter represents colors:
    return (
      ((clampColorComp(a) << 24) |
        (clampColorComp(r) << 16) |
        (clampColorComp(g) << 8) |
        ((clampColorComp(b) << 0) & 0xfffffff)) >>>
      0
    ); // This makes the value an unsigned int.
  }
  getColorComponents(color: Float32Array): number[] {
    return [
      Math.floor(color[0] * 255),
      Math.floor(color[1] * 255),
      Math.floor(color[2] * 255),
      color[3],
    ];
  }
  parseColorString(
    _colorStr: string,
    _colorMap?: Record<string, Float32Array> | undefined
  ): Float32Array {
    throw new Error("Method not implemented.");
  }
  multiplyByAlpha(c: Float32Array, alpha: number): Float32Array {
    return this.Color4f(c[0], c[1], c[2], c[3] * alpha);
  }
  computeTonalColors(_colors: TonalColorsInput): TonalColorsOutput {
    throw new Error("Method not implemented.");
  }
  LTRBRect(
    left: number,
    top: number,
    right: number,
    bottom: number
  ): Float32Array {
    return new Float32Array([left, top, right, bottom]);
  }
  XYWHRect(x: number, y: number, width: number, height: number): Float32Array {
    return this.LTRBRect(x, y, x + width, y + height);
  }
  LTRBiRect(
    left: number,
    top: number,
    right: number,
    bottom: number
  ): Int32Array {
    return new Int32Array([left, top, right, bottom]);
  }
  XYWHiRect(x: number, y: number, width: number, height: number): Int32Array {
    return this.LTRBiRect(x, y, x + width, y + height);
  }
  RRectXY(
    rect: Exclude<InputRect, MallocObj>,
    rx: number,
    ry: number
  ): Float32Array {
    return Float32Array.of(
      rect[0],
      rect[1],
      rect[2],
      rect[3],
      rx,
      ry,
      rx,
      ry,
      rx,
      ry,
      rx,
      ry
    );
  }
  getShadowLocalBounds(
    _ctm: InputMatrix,
    _path: Path,
    _zPlaneParams: InputVector3,
    _lightPos: InputVector3,
    _lightRadius: number,
    _flags: number,
    _dstRect?: Float32Array | undefined
  ): Float32Array | null {
    throw new Error("Method not implemented.");
  }
  Malloc(_typedArray: TypedArrayConstructor, _len: number): MallocObj {
    throw new Error("Method not implemented.");
  }
  MallocGlyphIDs(_len: number): MallocObj {
    throw new Error("Method not implemented.");
  }
  Free(_m: MallocObj): void {
    throw new Error("Method not implemented.");
  }
  MakeCanvasSurface(canvas: string | HTMLCanvasElement): Surface | null {
    if (typeof canvas === "string") {
      throw new Error("Method not implemented");
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Unable to get 2d context from canvas");
    }
    return new SurfaceLite(ctx);
  }
  MakeRasterDirectSurface(
    _ii: ImageInfo,
    _pixels: MallocObj,
    _bytesPerRow: number
  ): Surface | null {
    throw new Error("Method not implemented.");
  }
  MakeSWCanvasSurface(_canvas: string | HTMLCanvasElement): Surface | null {
    throw new Error("Method not implemented.");
  }
  MakeWebGLCanvasSurface(
    _canvas: string | HTMLCanvasElement,
    _colorSpace?: ColorSpace | undefined,
    _opts?: WebGLOptions | undefined
  ): Surface | null {
    throw new Error("Method not implemented.");
  }
  MakeSurface(_width: number, _height: number): Surface | null {
    throw new Error("Method not implemented.");
  }
  GetWebGLContext(
    _canvas: HTMLCanvasElement,
    _opts?: WebGLOptions | undefined
  ): number {
    throw new Error("Method not implemented.");
  }
  MakeGrContext(_ctx: number): GrDirectContext | null {
    throw new Error("Method not implemented.");
  }
  MakeWebGLContext(_ctx: number): GrDirectContext | null {
    throw new Error("Method not implemented.");
  }
  MakeOnScreenGLSurface(
    _ctx: GrDirectContext,
    _width: number,
    _height: number,
    _colorSpace: ColorSpace,
    _sampleCount?: number | undefined,
    _stencil?: number | undefined
  ): Surface | null {
    throw new Error("Method not implemented.");
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  MakeGPUDeviceContext(_device: any): GrDirectContext | null {
    throw new Error("Method not implemented.");
  }
  MakeGPUTextureSurface(
    _ctx: GrDirectContext,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _texture: any,
    _width: number,
    _height: number,
    _colorSpace: ColorSpace
  ): Surface | null {
    throw new Error("Method not implemented.");
  }
  MakeGPUCanvasContext(
    _ctx: GrDirectContext,
    _canvas: HTMLCanvasElement,
    _opts?: WebGPUCanvasOptions | undefined
  ): WebGPUCanvasContext | null {
    throw new Error("Method not implemented.");
  }
  MakeGPUCanvasSurface(
    _canvasContext: WebGPUCanvasContext,
    _colorSpace: ColorSpace,
    _width?: number | undefined,
    _height?: number | undefined
  ): Surface | null {
    throw new Error("Method not implemented.");
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  MakeRenderTarget(..._args: any[]): Surface | null {
    throw new Error("Method not implemented.");
  }
  MakeLazyImageFromTextureSource(
    _src: TextureSource,
    _info?: ImageInfo | PartialImageInfo | undefined,
    _srcIsPremul?: boolean | undefined
  ): Image {
    throw new Error("Method not implemented.");
  }
  deleteContext(_ctx: number): void {
    throw new Error("Method not implemented.");
  }
  getDecodeCacheLimitBytes(): number {
    throw new Error("Method not implemented.");
  }
  getDecodeCacheUsedBytes(): number {
    throw new Error("Method not implemented.");
  }
  setDecodeCacheLimitBytes(_size: number): void {
    throw new Error("Method not implemented.");
  }
  MakeAnimatedImageFromEncoded(
    _bytes: Uint8Array | ArrayBuffer
  ): AnimatedImage | null {
    throw new Error("Method not implemented.");
  }
  MakeCanvas(_width: number, _height: number): EmulatedCanvas2D {
    throw new Error("Method not implemented.");
  }
  MakeImage(
    _info: ImageInfo,
    _bytes: number[] | Uint8Array | Uint8ClampedArray,
    _bytesPerRow: number
  ): Image | null {
    throw new Error("Method not implemented.");
  }
  MakeImageFromEncoded(_bytes: Uint8Array | ArrayBuffer): Image | null {
    throw new Error("Method not implemented.");
  }
  MakeImageFromCanvasImageSource(_src: CanvasImageSource): Image {
    throw new Error("Method not implemented.");
  }
  MakePicture(_bytes: Uint8Array | ArrayBuffer): SkPicture | null {
    throw new Error("Method not implemented.");
  }
  MakeVertices(
    _mode: EmbindEnumEntity,
    _positions: InputFlattenedPointArray,
    _textureCoordinates?: InputFlattenedPointArray | null | undefined,
    _colors?: Float32Array | ColorIntArray | null | undefined,
    _indices?: number[] | null | undefined,
    _isVolatile?: boolean | undefined
  ): Vertices {
    throw new Error("Method not implemented.");
  }
  MakeAnimation(_json: string): SkottieAnimation {
    throw new Error("Method not implemented.");
  }
  MakeManagedAnimation(
    _json: string,
    _assets?: Record<string, ArrayBuffer> | undefined,
    _filterPrefix?: string | undefined,
    _soundMap?: SoundMap | undefined
  ): ManagedSkottieAnimation {
    throw new Error("Method not implemented.");
  }
  ImageData!: ImageDataConstructor;
  ParagraphStyle!: ParagraphStyleConstructor;
  ContourMeasureIter!: ContourMeasureIterConstructor;
  Font!: FontConstructor;
  Paint: DefaultConstructor<Paint> = PaintLite;
  Path!: PathConstructorAndFactory;
  PictureRecorder!: DefaultConstructor<PictureRecorder>;
  TextStyle!: TextStyleConstructor;
  ParagraphBuilder!: ParagraphBuilderFactory;
  ColorFilter!: ColorFilterFactory;
  FontCollection!: FontCollectionFactory;
  FontMgr!: FontMgrFactory;
  ImageFilter!: ImageFilterFactory;
  MaskFilter!: MaskFilterFactory;
  PathEffect!: PathEffectFactory;
  RuntimeEffect!: RuntimeEffectFactory;
  Shader!: ShaderFactory;
  TextBlob!: TextBlobFactory;
  Typeface!: TypefaceFactory;
  TypefaceFontProvider!: TypefaceFontProviderFactory;
  ColorMatrix!: ColorMatrixHelpers;
  Matrix!: Matrix3x3Helpers;
  M44!: Matrix4x4Helpers;
  Vector!: VectorHelpers;
  AlphaType!: AlphaTypeEnumValues;
  BlendMode = BlendMode;
  BlurStyle!: BlurStyleEnumValues;
  ClipOp!: ClipOpEnumValues;
  ColorChannel!: ColorChannelEnumValues;
  ColorType!: ColorTypeEnumValues;
  FillType!: FillTypeEnumValues;
  FilterMode!: FilterModeEnumValues;
  FontEdging!: FontEdgingEnumValues;
  FontHinting!: FontHintingEnumValues;
  GlyphRunFlags!: GlyphRunFlagValues;
  ImageFormat!: ImageFormatEnumValues;
  MipmapMode!: MipmapModeEnumValues;
  PaintStyle = PaintStyle;
  Path1DEffect!: Path1DEffectStyleEnumValues;
  PathOp!: PathOpEnumValues;
  PointMode!: PointModeEnumValues;
  ColorSpace!: ColorSpaceEnumValues;
  StrokeCap = StrokeCap;
  StrokeJoin = StrokeJoin;
  TileMode!: TileModeEnumValues;
  VertexMode!: VertexModeEnumValues;
  TRANSPARENT = new Float32Array([0, 0, 0, 0]);
  BLACK = new Float32Array([0, 0, 0, 1]);
  WHITE = new Float32Array([1, 1, 1, 1]);
  RED = new Float32Array([1, 0, 0, 1]);
  GREEN = new Float32Array([0, 1, 0, 1]);
  BLUE = new Float32Array([0, 0, 1, 1]);
  YELLOW = new Float32Array([1, 1, 0, 1]);
  CYAN = new Float32Array([0, 1, 1, 1]);
  MAGENTA = new Float32Array([1, 0, 1, 1]);
  MOVE_VERB!: number;
  LINE_VERB!: number;
  QUAD_VERB!: number;
  CONIC_VERB!: number;
  CUBIC_VERB!: number;
  CLOSE_VERB!: number;
  SaveLayerInitWithPrevious!: number;
  SaveLayerF16ColorType!: number;
  ShadowTransparentOccluder!: number;
  ShadowGeometricOnly!: number;
  ShadowDirectionalLight!: number;
  gpu?: boolean | undefined;
  managed_skottie?: boolean | undefined = undefined;
  rt_effect?: boolean | undefined = undefined;
  skottie?: boolean | undefined;
  Affinity!: AffinityEnumValues;
  DecorationStyle!: DecorationStyleEnumValues;
  FontSlant!: FontSlantEnumValues;
  FontWeight!: FontWeightEnumValues;
  FontWidth!: FontWidthEnumValues;
  PlaceholderAlignment!: PlaceholderAlignmentEnumValues;
  RectHeightStyle!: RectHeightStyleEnumValues;
  RectWidthStyle!: RectWidthStyleEnumValues;
  TextAlign!: TextAlignEnumValues;
  TextBaseline!: TextBaselineEnumValues;
  TextDirection!: TextDirectionEnumValues;
  TextHeightBehavior!: TextHeightBehaviorEnumValues;
  NoDecoration!: number;
  UnderlineDecoration!: number;
  OverlineDecoration!: number;
  LineThroughDecoration!: number;
}
