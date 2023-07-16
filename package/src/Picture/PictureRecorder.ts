import type {
  Canvas,
  InputRect,
  PictureRecorder,
  SkPicture,
} from "canvaskit-wasm";

import { IndexedHostObject } from "../HostObject";
import { GrDirectContextJS, createTexture, rectToXYWH } from "../Core";
import { CanvasJS } from "../Canvas";
import { SVGContext } from "../SVG";

import { PictureJS } from "./Picture";

export class PictureRecorderJS
  extends IndexedHostObject<"PictureRecorder">
  implements PictureRecorder
{
  private canvas: CanvasJS | null = null;

  beginRecording(bounds: InputRect): Canvas {
    const rct = rectToXYWH(bounds);
    const ctx = createTexture(rct.width, rct.height);
    const svgCtx = new SVGContext(this.id);
    const grCtx = new GrDirectContextJS(ctx);
    this.canvas = new CanvasJS(ctx, svgCtx, grCtx);
    return this.canvas;
  }
  finishRecordingAsPicture(): SkPicture {
    return new PictureJS(this.canvas);
  }
}
