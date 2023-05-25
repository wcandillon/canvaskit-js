import type {
  ColorSpace,
  EmbindEnumEntity,
  Image,
  ImageInfo,
  InputMatrix,
  MallocObj,
  PartialImageInfo,
  Shader,
} from "canvaskit-wasm";

import { HostObject } from "./HostObject";

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
  constructor(private readonly data: string) {
    super();
  }

  encodeToBytes(
    _fmt?: EmbindEnumEntity | undefined,
    _quality?: number | undefined
  ): Uint8Array | null {
    return dataURLToByteArray(this.data);
  }

  getColorSpace(): ColorSpace {
    throw new Error("Method not implemented.");
  }
  getImageInfo(): PartialImageInfo {
    throw new Error("Method not implemented.");
  }
  height(): number {
    throw new Error("Method not implemented.");
  }
  makeCopyWithDefaultMipmaps(): Image {
    throw new Error("Method not implemented.");
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
    throw new Error("Method not implemented.");
  }
}
