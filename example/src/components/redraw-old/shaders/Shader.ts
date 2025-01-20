export interface Shader {
  apply(commandEncoder: GPUCommandEncoder, input: GPUTexture): void;
}
