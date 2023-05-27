import type { ImageFilter } from "canvaskit-wasm";

import { HostObject } from "./HostObject";

// const createSvgFilter = (name: string): string => {
//   // Create the SVG element
//   const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
//   svg.setAttribute("width", "0");
//   svg.setAttribute("height", "0");
//   svg.style.position = "absolute";

//   // Create the filter element and append it to the SVG
//   const filter = document.createElementNS(
//     "http://www.w3.org/2000/svg",
//     "filter"
//   );
//   filter.id = "myFilter";

//   // Adding some filter effect (like feGaussianBlur)
//   const blur = document.createElementNS(
//     "http://www.w3.org/2000/svg",
//     "feGaussianBlur"
//   );
//   blur.setAttribute("in", "SourceGraphic");
//   blur.setAttribute("stdDeviation", "5");

//   filter.appendChild(blur);
//   svg.appendChild(filter);

//   // Append SVG to the body
//   document.body.appendChild(svg);
//   return `url(#${name})`;
// };

export abstract class ImageFilterLite
  extends HostObject<ImageFilter>
  implements ImageFilter
{
  abstract toFilter(): string;
}

export class BlurImageFilter extends ImageFilterLite {
  constructor(
    private readonly sigmaX: number,
    private readonly sigmaY: number,
    private readonly mode: number,
    private readonly input: ImageFilter | null
  ) {
    super();
    console.log(({ sigmaX, sigmaY, mode, input } = this));
  }

  toFilter(): string {
    return `blur(${this.sigmaX}px)`;
  }
}
