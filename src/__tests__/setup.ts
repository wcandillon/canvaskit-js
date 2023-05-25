/* eslint-disable no-var */
import type { CanvasKit as CanvasKitType } from "canvaskit-wasm";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import CanvasKitInit from "canvaskit-wasm/bin/full/canvaskit";

import { CanvasKitLite as CanvasKitLiteStatic } from "../CanvasKitLite";

declare global {
  var CanvasKit: CanvasKitType;
  var CanvasKitLite: CanvasKitType;
}

beforeAll(async () => {
  if (global.CanvasKit !== undefined) {
    return;
  }
  const CanvasKit = await CanvasKitInit({});
  // The CanvasKit API is stored on the global object and used
  // to create the JsiSKApi in the Skia.web.ts file.
  global.CanvasKit = CanvasKit;
  global.CanvasKitLite = new CanvasKitLiteStatic();
});

export const testCanvasKitMethod = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fn: (...args: any[]) => any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...args: any[]
) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  expect(CanvasKitLite[fn.name](...args)).toEqual(CanvasKit[fn.name](...args));
};
