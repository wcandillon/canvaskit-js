import type {
  ColorSpace,
  EmbindEnumEntity,
  EncodedImageFormat,
  Image,
  ImageInfo,
  InputMatrix,
  MallocObj,
  PartialImageInfo,
  Shader,
} from "canvaskit-wasm";

import { HostObject } from "./HostObject";
import { ImageFormatEnum } from "./Contants";
import { createTexture } from "./Core/Platform";
import { ImageShader } from "./Shader/ImageShader";

const dataURLToByteArray = (dataUrl: string) => {
  // split the data URL at the comma to separate the metadata from the data
  const split = dataUrl.split(",");
  if (split.length !== 2) {
    throw new Error("Invalid data URL.");
  }

  // decode the base64 data to a string
  const decoded = atob(split[1]);

  // convert the string to a byte array
  const byteArray = new Uint8Array(decoded.length);
  for (let i = 0; i < decoded.length; i++) {
    byteArray[i] = decoded.charCodeAt(i);
  }

  return byteArray;
};

export class ImageJS extends HostObject<Image> implements Image {
  private image: HTMLCanvasElement;

  constructor(source: CanvasImageSource | ImageData) {
    super();
    if (source instanceof HTMLCanvasElement) {
      this.image = source;
    } else {
      const width =
        typeof source.width === "number"
          ? source.width
          : source.width.animVal.value;
      const height =
        typeof source.height === "number"
          ? source.height
          : source.height.animVal.value;
      const ctx = createTexture(width, height);
      this.image = ctx.canvas;
      if (source instanceof ImageData) {
        ctx.putImageData(source, 0, 0);
      } else {
        ctx.drawImage(source, 0, 0);
      }
    }
  }

  getImage() {
    return this.image;
  }

  encodeToBytes(fmt?: EncodedImageFormat, quality?: number): Uint8Array | null {
    // Get a data URL.
    let mime = "image/png";
    if (fmt?.value === ImageFormatEnum.JPEG) {
      mime = "image/jpeg";
    } else if (fmt?.value === ImageFormatEnum.WEBP) {
      mime = "image/webp";
    }
    const dataUrl = this.image.toDataURL(mime, quality);
    return dataURLToByteArray(dataUrl);
  }

  getColorSpace(): ColorSpace {
    throw new Error("Method not implemented.");
  }
  getImageInfo(): PartialImageInfo {
    return {
      alphaType: { value: 2 },
      colorType: { value: 2 },
      height: this.image.height,
      width: this.image.width,
    };
  }
  height(): number {
    return this.image.height;
  }
  makeCopyWithDefaultMipmaps(): Image {
    return new ImageJS(this.image);
  }
  makeShaderCubic(
    _tx: EmbindEnumEntity,
    _ty: EmbindEnumEntity,
    _B: number,
    _C: number,
    _localMatrix?: InputMatrix | undefined
  ): Shader {
    return new ImageShader(this.image);
  }
  makeShaderOptions(
    _tx: EmbindEnumEntity,
    _ty: EmbindEnumEntity,
    _fm: EmbindEnumEntity,
    _mm: EmbindEnumEntity,
    _localMatrix?: InputMatrix | undefined
  ): Shader {
    return new ImageShader(this.image);
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
  width(): number {
    return this.image.width;
  }
}
