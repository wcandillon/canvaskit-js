import { testCanvasKitMethod } from "./setup";

describe("Colors", () => {
  testCanvasKitMethod("Color", 255, 127, 63, 0.5);
  testCanvasKitMethod("Color4f", 0.3, 0.6, 0.9, 0.5);
  testCanvasKitMethod("ColorAsInt", 255, 127, 63, 0.5);

  const color = Float32Array.of(255, 127, 63, 0.5);
  testCanvasKitMethod("getColorComponents", color);
  testCanvasKitMethod("multiplyByAlpha", color, 0.5);
});

describe("Rects", () => {
  testCanvasKitMethod("LTRBRect", 10, 20, 30, 40);
  testCanvasKitMethod("XYWHRect", 10, 20, 30, 40);
  testCanvasKitMethod("LTRBiRect", 10, 20, 30, 40);
  testCanvasKitMethod("XYWHiRect", 10, 20, 30, 40);

  const rect = Float32Array.of(10, 20, 30, 40);
  testCanvasKitMethod("RRectXY", rect, 5, 5);
});
