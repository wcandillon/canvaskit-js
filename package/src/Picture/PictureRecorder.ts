import type { InputRect, PictureRecorder, SkPicture } from "canvaskit-wasm";

import { IndexedHostObject } from "../HostObject";
import { normalizeArray } from "../Core";
import { CanvasRecorder } from "../Canvas/CanvasRecorder";

import { PictureJS } from "./Picture";

export class PictureRecorderJS
  extends IndexedHostObject<"PictureRecorder">
  implements PictureRecorder
{
  private canvas: CanvasRecorder | null = null;

  beginRecording(bounds: InputRect) {
    this.canvas = new CanvasRecorder(normalizeArray(bounds));
    return this.canvas;
  }
  finishRecordingAsPicture(): SkPicture {
    if (!this.canvas) {
      throw new Error(
        "CanvasRecorder not initialized. Call beginRecording first."
      );
    }
    return new PictureJS(this.canvas);
  }
}
