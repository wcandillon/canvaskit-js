import { ImageFilterJS } from "./ImageFilter";

export class BlurImageFilter extends ImageFilterJS {
  constructor(private readonly sigmaX: number) {
    super();
  }

  getFilter(): string {
    return `blur(${this.sigmaX}px)`;
  }
}
