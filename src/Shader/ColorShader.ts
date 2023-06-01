import { ShaderJS } from "./Shader";

export class ColorShader extends ShaderJS {
  private canvas = new OffscreenCanvas(0, 0);
  constructor(private readonly color: string) {
    super();
  }

  getTexture(width: number, height: number) {
    const { canvas } = this;
    canvas.width = width;
    canvas.height = height;
    const ctx2d = canvas.getContext("2d");
    if (!ctx2d) {
      throw new Error("Failed to get 2d context");
    }
    ctx2d.fillStyle = this.color;
    ctx2d.fillRect(0, 0, canvas.width, canvas.height);
    return canvas;
  }
}
