import { CanvasKitLite } from "../CanvasKitLite";

import { testCanvasKitMethod } from "./setup";

test("Colors", () => {
  const SkiaLite = new CanvasKitLite();
  testCanvasKitMethod(SkiaLite.Color4f, 0.3, 0.6, 0.9, 0.5);
});
