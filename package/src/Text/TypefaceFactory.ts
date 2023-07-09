import type {
  TypefaceFactory as SkTypeFaceFactory,
  Typeface,
} from "canvaskit-wasm";

export class TypefaceFactory implements SkTypeFaceFactory {
  MakeFreeTypeFaceFromData(_fontData: ArrayBuffer): Typeface {
    return new TypeFaceJS("Hello");
  }
}
