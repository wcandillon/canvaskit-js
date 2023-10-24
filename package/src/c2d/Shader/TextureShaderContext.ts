import { ShaderContext } from "./ShaderContext";

export class TextureShaderContext extends ShaderContext {
  constructor() {
    super(`uniform sampler2D u_texture;

void mainImage(out vec4 fragColor, in vec2 fragCoord){
  fragColor = texture2D(u_texture, fragCoord / u_resolution);
}`);
  }
}
