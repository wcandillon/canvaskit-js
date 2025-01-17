import { ColorFactory, type Color } from "./Data";

export enum BlendMode {
  Clear, //!< r = 0
  Src, //!< r = s
  Dst, //!< r = d
  SrcOver, //!< r = s + (1-sa)*d
  DstOver, //!< r = d + (1-da)*s
  SrcIn, //!< r = s * da
  DstIn, //!< r = d * sa
  SrcOut, //!< r = s * (1-da)
  DstOut, //!< r = d * (1-sa)
  SrcATop, //!< r = s*da + d*(1-sa)
  DstATop, //!< r = d*sa + s*(1-da)
  Xor, //!< r = s*(1-da) + d*(1-sa)
  Plus, //!< r = min(s + d, 1)
  Modulate, //!< r = s*d
  Screen, //!< r = s + d - s*d

  Overlay, //!< multiply or screen, depending on destination
  Darken, //!< rc = s + d - max(s*da, d*sa), ra = kSrcOver
  Lighten, //!< rc = s + d - min(s*da, d*sa), ra = kSrcOver
  ColorDodge, //!< brighten destination to reflect source
  ColorBurn, //!< darken destination to reflect source
  HardLight, //!< multiply or screen, depending on source
  SoftLight, //!< lighten or darken, depending on source
  Difference, //!< rc = s + d - 2*(min(s*da, d*sa)), ra = kSrcOver
  Exclusion, //!< rc = s + d - two(s*d), ra = kSrcOver
  Multiply, //!< r = s*(1-da) + d*(1-sa) + s*d

  Hue, //!< hue of source with saturation and luminosity of destination
  Saturation, //!< saturation of source with hue and luminosity of
  //!< destination
  Color, //!< hue and saturation of source with luminosity of destination
  Luminosity, //!< luminosity of source with hue and saturation of
}

export class Paint {
  color: Color | null = null;
  alpha = 1;
  blendMode = BlendMode.SrcOver;

  constructor() {}

  setColor(color: Float32Array | string) {
    this.color = color instanceof Float32Array ? color : ColorFactory(color);
  }

  setAlpha(alpha: number) {
    this.alpha = alpha;
    if (this.color) {
      this.color[3] = alpha;
    }
  }
}
