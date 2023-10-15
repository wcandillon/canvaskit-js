import type { RenderingContext } from "../Constants";

export interface Shader {
  applyToContext(ctx: RenderingContext, ctm: DOMMatrix): void;
}
