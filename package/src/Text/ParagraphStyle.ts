import { FontStyle } from "canvaskit-wasm";
import type {
  ParagraphStyle as CKParagraphStyle,
  TextStyle as CKTextStyle,
  ParagraphStyle,
  StrutStyle,
  TextStyle,
} from "canvaskit-wasm";

import {
  FontSlant,
  FontWeight,
  FontWidth,
  TextAlign,
  TextDirection,
  TextHeightBehavior,
  DecorationStyle,
  TextBaseline,
} from "../Core/Contants";

export function TextStyle(style: CKTextStyle) {
  return style;
}

function FontStyle({ weight, width, slant }: FontStyle) {
  return {
    weight: weight ?? FontWeight.Normal,
    width: width ?? FontWidth.Normal,
    slant: slant ?? FontSlant.Upright,
  };
}

function StrutStyle(style: StrutStyle) {
  return style;
}

export function ParagraphStyle(style: CKParagraphStyle) {
  return style;
}

export const defaultParagraphStyle = (style: ParagraphStyle) => ({
  ...style,
  disableHinting: style.disableHinting ?? false,
  heightMultiplier: style.heightMultiplier ?? -1,
  maxLines: style.maxLines ?? 0,
  replaceTabCharacters: style.replaceTabCharacters ?? false,
  strutStyle: defaultStrutStyle(style.strutStyle ?? {}),
  textAlign: style.textAlign ?? TextAlign.Start,
  textDirection: style.textDirection ?? TextDirection.LTR,
  textHeightBehavior: style.textHeightBehavior ?? TextHeightBehavior.All,
  textStyle: defaultTextStyle(style.textStyle ?? {}),
});

export const defaultTextStyle = (style: TextStyle) => ({
  ...style,
  color: style.color ?? Float32Array.of(0, 0, 0, 1),
  decoration: style.decoration ?? 0,
  decorationColor: style.decorationColor,
  decorationThickness: style.decorationThickness ?? 0,
  decorationStyle: style.decorationStyle ?? DecorationStyle.Solid,
  fontFamilies: style.fontFamilies ?? [],
  fontFeatures: style.fontFeatures,
  fontSize: style.fontSize ?? 14,
  fontStyle: FontStyle(style.fontStyle ?? {}),
  textBaseline: style.textBaseline ?? TextBaseline.Alphabetic,
  wordSpacing: style.wordSpacing ?? 0,
});

export const defaultStrutStyle = (style: StrutStyle) => {
  return {
    ...style,
    strutEnabled: style.strutEnabled ?? false,
    fontFamilies: style.fontFamilies ?? [],
    fontStyle: FontStyle(style.fontStyle ?? {}),
    heightMultiplier: style.heightMultiplier ?? -1,
    halfLeading: style.halfLeading ?? false,
    leading: style.leading ?? 0,
    forceStrutHeight: style.forceStrutHeight ?? false,
  };
};

export type ParagraphStyleJS = ReturnType<typeof defaultParagraphStyle>;
export type TextStyleJS = ReturnType<typeof defaultTextStyle>;
