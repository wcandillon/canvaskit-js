export class Surface {
  constructor(
    private device: GPUDevice,
    private getCurrentTexture: () => GPUTexture
  ) {}
}
