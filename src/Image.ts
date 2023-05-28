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

export class ImageLite extends HostObject<Image> implements Image {
  constructor(private readonly data: ImageData) {
    super();
  }

  getNativeImage() {
    const image = new window.Image();
    const blob = new Blob([this.data.data]);
    const imageUrl = URL.createObjectURL(blob);
    image.src = imageUrl;
    image.width = 3648;
    image.height = 4560;
    return image;
  }

  encodeToBytes(fmt?: EncodedImageFormat, quality?: number): Uint8Array | null {
    // Create a new canvas.
    const canvas = document.createElement("canvas");
    canvas.width = this.data.width;
    canvas.height = this.data.height;
    const ctx = canvas.getContext("2d")!;
    // Put the ImageData onto the new canvas.
    ctx.putImageData(this.data, 0, 0);
    // Get a data URL.
    let mime = "image/png";
    if (fmt?.value === ImageFormatEnum.JPEG) {
      mime = "image/jpeg";
    } else if (fmt?.value === ImageFormatEnum.WEBP) {
      mime = "image/webp";
    }
    const dataUrl = canvas.toDataURL(mime, quality);
    return dataURLToByteArray(dataUrl);
  }

  getColorSpace(): ColorSpace {
    throw new Error("Method not implemented.");
  }
  getImageInfo(): PartialImageInfo {
    return {
      alphaType: { value: 2 },
      colorType: { value: 2 },
      height: this.data.height,
      width: this.data.width,
    };
  }
  height(): number {
    return this.data.height;
  }
  makeCopyWithDefaultMipmaps(): Image {
    return new ImageLite(this.data);
  }
  makeShaderCubic(
    _tx: EmbindEnumEntity,
    _ty: EmbindEnumEntity,
    _B: number,
    _C: number,
    _localMatrix?: InputMatrix | undefined
  ): Shader {
    throw new Error("Method not implemented.");
  }
  makeShaderOptions(
    _tx: EmbindEnumEntity,
    _ty: EmbindEnumEntity,
    _fm: EmbindEnumEntity,
    _mm: EmbindEnumEntity,
    _localMatrix?: InputMatrix | undefined
  ): Shader {
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
  width(): number {
    return this.data.width;
  }
}
