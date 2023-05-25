import { CanvasKitLite } from "../CanvasKitLite";

import { testCanvasKitMethod } from "./setup";

const CanvasKit = new CanvasKitLite();

describe("Colors", () => {
  testCanvasKitMethod(CanvasKit.Color, 255, 127, 63, 0.5);
  testCanvasKitMethod(CanvasKit.Color4f, 0.3, 0.6, 0.9, 0.5);
  testCanvasKitMethod(CanvasKit.ColorAsInt, 255, 127, 63, 0.5);

  const color = CanvasKit.Color(255, 127, 63, 0.5);
  testCanvasKitMethod(CanvasKit.getColorComponents, color);
  testCanvasKitMethod(CanvasKit.multiplyByAlpha, color, 0.5);
});

describe("Rects", () => {
  testCanvasKitMethod(CanvasKit.LTRBRect, 10, 20, 30, 40);
  testCanvasKitMethod(CanvasKit.XYWHRect, 10, 20, 30, 40);
  testCanvasKitMethod(CanvasKit.LTRBiRect, 10, 20, 30, 40);
  testCanvasKitMethod(CanvasKit.XYWHiRect, 10, 20, 30, 40);

  const rect = CanvasKit.LTRBRect(10, 20, 30, 40);
  testCanvasKitMethod(CanvasKit.RRectXY, rect, 5, 5);
});
