import type {
  ColorSpace as CKColorSpace,
  Image,
  EmulatedCanvas2D,
  CanvasKit as ICanvasKit,
  AnimatedImage,
  ColorIntArray,
  ContourMeasureIterConstructor,
  DefaultConstructor,
  EmbindEnumEntity,
  GrDirectContext,
  ImageInfo,
  InputFlattenedPointArray,
  InputMatrix,
  InputVector3,
  MallocObj,
  ManagedSkottieAnimation,
  Paint,
  ParagraphStyleConstructor,
  PartialImageInfo,
  Path,
  PathConstructorAndFactory,
  PictureRecorder,
  SkPicture,
  SkottieAnimation,
  SoundMap,
  Surface,
  TextStyleConstructor,
  TextureSource,
  TonalColorsInput,
  TonalColorsOutput,
  TypedArrayConstructor,
  Vertices,
  WebGLOptions,
  WebGPUCanvasContext,
  WebGPUCanvasOptions,
  FontConstructor,
} from "canvaskit-wasm";

import type { ColorSpaceJS } from "./Core";
import {
  GrDirectContextJS,
  CoreCanvasKit,
  ImageFormatEnum,
  MallocObjJS,
} from "./Core";
import { SurfaceJS } from "./Surface";
import { PaintJS } from "./Paint";
import { ShaderFactory } from "./Shader";
import { PathJS } from "./Path";
import { ImageFilterFactory } from "./ImageFilter";
import { MaskFilterFactory } from "./MaskFilter";
import { EmulatedCanvas2DJS } from "./EmulatedCanvas2D";
import { ImageJS } from "./Image";
import { RuntimeEffectFactory } from "./RuntimeEffect";
import {
  createOffscreenTexture,
  createTexture,
  resolveContext,
} from "./Core/Platform";
import { ColorFilterFactory } from "./ColorFilter/ColorFilterFactory";
import { ContourMeasureIterJS } from "./Path/ContourMeasure";
import {
  FontCollectionFactory,
  FontJS,
  FontMgrFactory,
  TypefaceFactory,
  TypefaceFontProviderFactory,
  ParagraphStyle,
  ParagraphBuilderFactory,
  TextStyle,
} from "./Text";
import { PictureRecorderJS } from "./Picture";
import { normalizeArray } from "./Core/Values";
import { TextBlobFactory } from "./TextBlob";
import { PathEffectFactory } from "./PathEffect";
import { ColorMatrixHelpers } from "./ColorFilter";

let ctxId = 1;

export class CanvasKitJS extends CoreCanvasKit implements ICanvasKit {
  private static instance: ICanvasKit | null = null;

  private contextes: Record<number, CanvasRenderingContext2D> = {};
  private _colorCtx: OffscreenCanvasRenderingContext2D | null = null;

  private constructor() {
    super();
  }

  get colorCtx(): OffscreenCanvasRenderingContext2D {
    if (this._colorCtx === null) {
      this._colorCtx = createOffscreenTexture(1, 1, {
        willReadFrequently: true,
      });
    }
    return this._colorCtx;
  }

  static getInstance() {
    if (this.instance === null) {
      this.instance = new CanvasKitJS();
    }
    return this.instance;
  }

  parseColorString(
    colorStr: string,
    _colorMap?: Record<string, Float32Array> | undefined
  ): Float32Array {
    this.colorCtx.fillStyle = colorStr;
    this.colorCtx.fillRect(0, 0, 1, 1);
    const [r, g, b, a] = this.colorCtx.getImageData(0, 0, 1, 1).data;
    return Float32Array.of(r / 255, g / 255, b / 255, a / 255);
  }

  computeTonalColors(colors: TonalColorsInput): TonalColorsOutput {
    const ambient = normalizeArray(colors.ambient);
    const spot = normalizeArray(colors.spot);
    return {
      ambient,
      spot,
    };
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
  Malloc(TypedArray: TypedArrayConstructor, len: number): MallocObj {
    return new MallocObjJS(new TypedArray(len));
  }
  MallocGlyphIDs(len: number): MallocObj {
    return new MallocObjJS(new Uint16Array(len));
  }
  Free(_m: MallocObj): void {}
  MakeCanvasSurface(canvas: string | HTMLCanvasElement): Surface | null {
    const ctx = resolveContext(canvas);
    if (!ctx) {
      return null;
    }
    return new SurfaceJS(ctx);
  }
  MakeRasterDirectSurface(
    _ii: ImageInfo,
    _pixels: MallocObj,
    _bytesPerRow: number
  ): Surface | null {
    throw new Error("Method not implemented.");
  }
  MakeSWCanvasSurface(canvas: string | HTMLCanvasElement): Surface | null {
    return this.MakeCanvasSurface(canvas);
  }
  MakeWebGLCanvasSurface(
    canvas: string | HTMLCanvasElement,
    colorSpace?: ColorSpaceJS | undefined,
    _opts?: WebGLOptions | undefined
  ): Surface | null {
    const ctx = resolveContext(canvas, {
      colorSpace: colorSpace?.getNativeValue(),
    });
    if (!ctx) {
      return null;
    }
    return new SurfaceJS(ctx);
  }
  MakeSurface(width: number, height: number): Surface | null {
    const ctx = createTexture(width, height);
    return new SurfaceJS(ctx);
  }
  GetWebGLContext(
    canvas: HTMLCanvasElement,
    _opts?: WebGLOptions | undefined
  ): number {
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Unable to get 2d context from canvas");
    }
    const id = ctxId++;
    this.contextes[id] = ctx;
    return id;
  }
  MakeGrContext(ctx: number): GrDirectContext | null {
    return new GrDirectContextJS(this.contextes[ctx]);
  }
  MakeWebGLContext(ctx: number): GrDirectContext | null {
    return new GrDirectContextJS(this.contextes[ctx]);
  }
  MakeOnScreenGLSurface(
    _ctx: GrDirectContext,
    _width: number,
    _height: number,
    _colorSpace: CKColorSpace,
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
    _colorSpace: CKColorSpace
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
    _colorSpace: CKColorSpace,
    _width?: number | undefined,
    _height?: number | undefined
  ): Surface | null {
    throw new Error("Method not implemented.");
  }
  MakeRenderTarget(
    grCtx: GrDirectContextJS,
    ...args: [number, number] | [ImageInfo]
  ): Surface | null {
    if (typeof args[0] === "number" && typeof args[1] === "number") {
      grCtx.ctx.canvas.width = args[0];
      grCtx.ctx.canvas.height = args[1];
    } else if (typeof args[0] === "object") {
      grCtx.ctx.canvas.width = args[0].width;
      grCtx.ctx.canvas.height = args[0].height;
    }
    return new SurfaceJS(grCtx.ctx);
  }
  MakeLazyImageFromTextureSource(
    _src: TextureSource,
    _info?: ImageInfo | PartialImageInfo | undefined,
    _srcIsPremul?: boolean | undefined
  ): Image {
    throw new Error("Method not implemented.");
  }
  deleteContext(ctx: number): void {
    delete this.contextes[ctx];
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
  MakeCanvas(width: number, height: number): EmulatedCanvas2D {
    const texture = createTexture(width, height);
    return new EmulatedCanvas2DJS(texture.canvas);
  }
  MakeImage(
    { width, height, colorSpace }: ImageInfo,
    data: number[] | Uint8Array | Uint8ClampedArray,
    _bytesPerRow: number
  ): Image | null {
    const imageData = new ImageData(
      data instanceof Uint8ClampedArray ? data : new Uint8ClampedArray(data),
      width,
      height,
      {
        colorSpace: colorSpace
          ? (colorSpace as ColorSpaceJS).getNativeValue()
          : "srgb",
      }
    );
    return new ImageJS(imageData);
  }
  MakeImageFromEncoded(_bytes: Uint8Array | ArrayBuffer): Image | null {
    throw new Error(
      `MakeImageFromEncoded in CanvasKit is synchronous and not supported on Web.
      Use MakeImageFromEncodedAsync instead.
      `
    );
  }
  MakeImageFromCanvasImageSource(src: CanvasImageSource): Image {
    return new ImageJS(src);
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
    throw new Error("Skottie is not available");
  }
  MakeManagedAnimation(
    _json: string,
    _assets?: Record<string, ArrayBuffer> | undefined,
    _filterPrefix?: string | undefined,
    _soundMap?: SoundMap | undefined
  ): ManagedSkottieAnimation {
    throw new Error("Skottie is not available");
  }
  ParagraphStyle = ParagraphStyle as unknown as ParagraphStyleConstructor;
  ContourMeasureIter =
    ContourMeasureIterJS as unknown as ContourMeasureIterConstructor;
  Font = FontJS as FontConstructor;
  Paint: DefaultConstructor<Paint> = PaintJS;
  Path = PathJS as unknown as PathConstructorAndFactory;
  PictureRecorder =
    PictureRecorderJS as unknown as DefaultConstructor<PictureRecorder>;
  TextStyle = TextStyle as unknown as TextStyleConstructor;
  ParagraphBuilder = ParagraphBuilderFactory;
  ColorFilter = ColorFilterFactory;
  FontCollection = FontCollectionFactory;
  FontMgr = FontMgrFactory;
  ImageFilter = ImageFilterFactory;
  MaskFilter = MaskFilterFactory;
  RuntimeEffect = RuntimeEffectFactory;
  Shader = ShaderFactory;
  Typeface = TypefaceFactory;
  TypefaceFontProvider = TypefaceFontProviderFactory;

  PathEffect = PathEffectFactory;
  ImageData = ImageData;
  ColorMatrix = ColorMatrixHelpers;
  TextBlob = TextBlobFactory;

  // The methods below are specific to canvaskit-js
  MakeImageFromURIAsync(url: string) {
    const img = new window.Image();
    img.src = url;
    return new Promise((resolve, reject) => {
      img.onload = () => {
        img.width = img.naturalWidth;
        img.height = img.naturalHeight;
        const result = new ImageJS(img);
        if (!result) {
          reject();
        }
        resolve(result);
      };
    });
  }
  MakeImageFromEncodedAsync(
    bytes: Uint8Array | ArrayBuffer,
    imageFormat: ImageFormatEnum
  ) {
    let type = "image/png";
    if (imageFormat === ImageFormatEnum.JPEG) {
      type = "image/jpeg";
    } else if (imageFormat === ImageFormatEnum.WEBP) {
      type = "image/webp";
    }
    const blob = new Blob([bytes], { type });
    const url = URL.createObjectURL(blob);
    return this.MakeImageFromURIAsync(url);
  }
}
