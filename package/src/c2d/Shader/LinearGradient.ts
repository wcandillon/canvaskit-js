//import type { Shader } from "./Shader";

// abstract class Gradient implements Shader {
//   protected texture = new OffscreenCanvas(0, 0);
//   protected gradient: CanvasGradient;
//   protected positions: number[];

//   constructor(protected colors: string[], positions: number[] | null) {
//     this.positions = positions
//       ? positions
//       : this.colors.map((_, i) => i / (this.colors.length - 1));
//     this.gradient = this.createGradient();
//   }

//   protected abstract createGradient(): CanvasGradient;

//   render(width: number, height: number, _ctm: DOMMatrix): OffscreenCanvas {
//     this.texture.width = width;
//     this.texture.height = height;
//     return this.texture;
//   }
// }

// export class LinearGradient extends Gradient {
//   constructor(
//     private start: DOMPoint,
//     private end: DOMPoint,
//     colors: string[],
//     positions: number[] | null
//   ) {
//     super(colors, positions);
//   }

//   protected createGradient() {
//     const ctx = this.texture.getContext("2d")!;
//     const gradient = ctx.createLinearGradient(
//       this.start.x,
//       this.start.y,
//       this.end.x,
//       this.end.y
//     );
//     this.colors.forEach((color, i) => {
//       this.gradient.addColorStop(this.positions[i], color);
//     });
//     return gradient;
//   }
// }
