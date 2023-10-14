import type { RenderingContext } from "../Constants";

export interface ImageFilter {
  applyToContext(ctx: RenderingContext, ctm: DOMMatrix): void;
}
