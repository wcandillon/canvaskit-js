/* eslint-disable camelcase */
import type {
  AffinityEnumValues,
  AlphaTypeEnumValues,
  AnimatedImage,
  BlendModeEnumValues,
  BlurStyleEnumValues,
  CanvasKit,
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
  PaintStyleEnumValues,
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
  StrokeCapEnumValues,
  StrokeJoinEnumValues,
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
} from "canvaskit-wasm";

export class CanvasKitLite implements CanvasKit {
  Color(
    _r: number,
    _g: number,
    _b: number,
    _a?: number | undefined
  ): Float32Array {
    throw new Error("Method not implemented.");
  }
  Color4f(
    r: number,
    g: number,
    b: number,
    a?: number | undefined
  ): Float32Array {
    return Float32Array.of(r, g, b, a ?? 1);
  }
  ColorAsInt(
    _r: number,
    _g: number,
    _b: number,
    _a?: number | undefined
  ): number {
    throw new Error("Method not implemented.");
  }
  getColorComponents(_c: Float32Array): number[] {
    throw new Error("Method not implemented.");
  }
  parseColorString(
    _color: string,
    _colorMap?: Record<string, Float32Array> | undefined
  ): Float32Array {
    throw new Error("Method not implemented.");
  }
  multiplyByAlpha(_c: Float32Array, _alpha: number): Float32Array {
    throw new Error("Method not implemented.");
  }
  computeTonalColors(_colors: TonalColorsInput): TonalColorsOutput {
    throw new Error("Method not implemented.");
  }
  LTRBRect(
    _left: number,
    _top: number,
    _right: number,
    _bottom: number
  ): Float32Array {
    throw new Error("Method not implemented.");
  }
  XYWHRect(
    _x: number,
    _y: number,
    _width: number,
    _height: number
  ): Float32Array {
    throw new Error("Method not implemented.");
  }
  LTRBiRect(
    _left: number,
    _top: number,
    _right: number,
    _bottom: number
  ): Int32Array {
    throw new Error("Method not implemented.");
  }
  XYWHiRect(
    _x: number,
    _y: number,
    _width: number,
    _height: number
  ): Int32Array {
    throw new Error("Method not implemented.");
  }
  RRectXY(_rect: InputRect, _rx: number, _ry: number): Float32Array {
    throw new Error("Method not implemented.");
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
  MakeCanvasSurface(_canvas: string | HTMLCanvasElement): Surface | null {
    throw new Error("Method not implemented.");
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
  Paint!: DefaultConstructor<Paint>;
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
  BlendMode!: BlendModeEnumValues;
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
  PaintStyle!: PaintStyleEnumValues;
  Path1DEffect!: Path1DEffectStyleEnumValues;
  PathOp!: PathOpEnumValues;
  PointMode!: PointModeEnumValues;
  ColorSpace!: ColorSpaceEnumValues;
  StrokeCap!: StrokeCapEnumValues;
  StrokeJoin!: StrokeJoinEnumValues;
  TileMode!: TileModeEnumValues;
  VertexMode!: VertexModeEnumValues;
  TRANSPARENT!: Float32Array;
  BLACK!: Float32Array;
  WHITE!: Float32Array;
  RED!: Float32Array;
  GREEN!: Float32Array;
  BLUE!: Float32Array;
  YELLOW!: Float32Array;
  CYAN!: Float32Array;
  MAGENTA!: Float32Array;
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
