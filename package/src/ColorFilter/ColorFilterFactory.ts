import type {
  ColorFilterFactory as CKColorFilterFactory,
  ColorFilter,
  ColorSpace,
  EmbindEnumEntity,
  InputColor,
  InputColorMatrix,
} from "canvaskit-wasm";

export const ColorFilterFactory: CKColorFilterFactory = {
  MakeBlend: function (
    _color: InputColor,
    _mode: EmbindEnumEntity,
    _colorSpace?: ColorSpace | undefined
  ): ColorFilter {
    throw new Error("Function not implemented.");
  },
  MakeCompose: function (
    _outer: ColorFilter,
    _inner: ColorFilter
  ): ColorFilter {
    throw new Error("Function not implemented.");
  },
  MakeLerp: function (
    _t: number,
    _dst: ColorFilter,
    _src: ColorFilter
  ): ColorFilter {
    throw new Error("Function not implemented.");
  },
  MakeLinearToSRGBGamma: function (): ColorFilter {
    throw new Error("Function not implemented.");
  },
  MakeMatrix: function (_cMatrix: InputColorMatrix): ColorFilter {
    throw new Error("Function not implemented.");
  },
  MakeSRGBToLinearGamma: function (): ColorFilter {
    throw new Error("Function not implemented.");
  },
  MakeLuma: function (): ColorFilter {
    throw new Error("Function not implemented.");
  },
};
