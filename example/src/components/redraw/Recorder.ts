import type { BlendMode } from "../redraw-old";
import type { Matrix } from "../redraw-old/Data";

import { GPUBlendModes } from "./Paint";
import { Resources } from "./Resources";

interface PaintProps {
  useColor: number;
  useStroke: number;
  strokeWidth: number;
  color: Float32Array;
}

interface Child {
  sampler: GPUSampler;
  texture: GPUTextureView;
}

export class Recorder {
  private resources: Resources;

  constructor(private device: GPUDevice, private resolution: Float32Array) {
    this.resources = Resources.getInstance(this.device);
  }

  draw(
    id: string,
    vert: string,
    frag: string,
    blendMode: BlendMode,
    paint: PaintProps,
    matrix: Matrix,
    uniforms: Record<string, unknown>,
    children: Child[],
    vertexCount: number
  ) {
    const vertexModule = this.resources.createVertexModule(id, vert);
    const fragmentModule = this.resources.createFragmentModule(id, frag);
    const pipelineKey = `${id}-${blendMode}`;
    const pipeline = this.resources.createPipeline(
      pipelineKey,
      vertexModule,
      fragmentModule,
      GPUBlendModes[blendMode]
    );
  }

  flush(view: GPUTextureView) {}
}
