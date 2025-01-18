export interface ImageFilter {
  apply(
    commandEncoder: GPUCommandEncoder,
    input: GPUTexture,
    textureA: GPUTexture,
    textureB: GPUTexture
  ): GPUTexture;
}
