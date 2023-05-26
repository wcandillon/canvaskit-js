import type {
  StrokeCapEnumValues,
  MallocObj,
  InputColor as CKInputColor,
  StrokeJoinEnumValues,
  PaintStyleEnumValues,
  BlendModeEnumValues,
} from "canvaskit-wasm";

export type InputColor = Exclude<CKInputColor, MallocObj>;

export const mapKeys = <T extends object>(obj: T) =>
  Object.keys(obj) as (keyof T)[];

const makeEnum = <T>(values: Record<Exclude<keyof T, "values">, number>): T => {
  const vals = Object.values(values).filter((v) => typeof v !== "number");
  return Object.assign(
    {
      values: vals,
    },
    ...mapKeys(values)
      .slice(vals.length)
      .map((k) => ({ [k]: { value: values[k] } }))
  );
};

export const StrokeCap = makeEnum<StrokeCapEnumValues>({
  Butt: 0,
  Round: 1,
  Square: 2,
});

export const StrokeJoin = makeEnum<StrokeJoinEnumValues>({
  Miter: 0,
  Round: 1,
  Bevel: 2,
});

export enum PaintStyleEnum {
  Fill,
  Stroke,
}

export const PaintStyle = makeEnum<PaintStyleEnumValues>(PaintStyleEnum);

export const BlendMode = makeEnum<BlendModeEnumValues>({
  Clear: 0, //!< r = 0
  Src: 1, //!< r = s
  Dst: 2, //!< r = d
  SrcOver: 3, //!< r = s + (1-sa)*d
  DstOver: 4, //!< r = d + (1-da)*s
  SrcIn: 5, //!< r = s * da
  DstIn: 6, //!< r = d * sa
  SrcOut: 7, //!< r = s * (1-da)
  DstOut: 8, //!< r = d * (1-sa)
  SrcATop: 9, //!< r = s*da + d*(1-sa)
  DstATop: 10, //!< r = d*sa + s*(1-da)
  Xor: 11, //!< r = s*(1-da) + d*(1-sa)
  Plus: 12, //!< r = min(s + d, 1)
  Modulate: 13, //!< r = s*d
  Screen: 14, //!< r = s + d - s*d

  Overlay: 15, //!< multiply or screen, depending on destination
  Darken: 16, //!< rc = s + d - max(s*da, d*sa), ra = kSrcOver
  Lighten: 17, //!< rc = s + d - min(s*da, d*sa), ra = kSrcOver
  ColorDodge: 18, //!< brighten destination to reflect source
  ColorBurn: 19, //!< darken destination to reflect source
  HardLight: 20, //!< multiply or screen, depending on source
  SoftLight: 21, //!< lighten or darken, depending on source
  Difference: 22, //!< rc = s + d - 2*(min(s*da, d*sa)), ra = kSrcOver
  Exclusion: 23, //!< rc = s + d - two(s*d), ra = kSrcOver
  Multiply: 24, //!< r = s*(1-da) + d*(1-sa) + s*d

  Hue: 25, //!< hue of source with saturation and luminosity of destination
  Saturation: 26, //!< saturation of source with hue and luminosity of
  //!< destination
  Color: 27, //!< hue and saturation of source with luminosity of destination
  Luminosity: 28, //!< luminosity of source with hue and saturation of});
});
