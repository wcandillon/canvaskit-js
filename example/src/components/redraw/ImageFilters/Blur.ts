/* eslint-disable prefer-destructuring */
import { FillTexture, FillVertex } from "../Drawings/Fill";
import { Drawable } from "../Recorder";
import type { Resources } from "../Resources";

const BlurShader = /* wgsl */ `struct Params {
    filterDim : i32,
    blockDim : u32,
  }
  
  @group(0) @binding(0) var samp : sampler;
  @group(0) @binding(1) var<uniform> params : Params;
  @group(1) @binding(1) var inputTex : texture_2d<f32>;
  @group(1) @binding(2) var outputTex : texture_storage_2d<rgba8unorm, write>;
  
  struct Flip {
    value : u32,
  }
  @group(1) @binding(3) var<uniform> flip : Flip;
  
  // This shader blurs the input texture in one direction, depending on whether
  // |flip.value| is 0 or 1.
  // It does so by running (128 / 4) threads per workgroup to load 128
  // texels into 4 rows of shared memory. Each thread loads a
  // 4 x 4 block of texels to take advantage of the texture sampling
  // hardware.
  // Then, each thread computes the blur result by averaging the adjacent texel values
  // in shared memory.
  // Because we're operating on a subset of the texture, we cannot compute all of the
  // results since not all of the neighbors are available in shared memory.
  // Specifically, with 128 x 128 tiles, we can only compute and write out
  // square blocks of size 128 - (filterSize - 1). We compute the number of blocks
  // needed in Javascript and dispatch that amount.
  
  var<workgroup> tile : array<array<vec3f, 128>, 4>;
  
  @compute @workgroup_size(32, 1, 1)
  fn main(
    @builtin(workgroup_id) WorkGroupID : vec3u,
    @builtin(local_invocation_id) LocalInvocationID : vec3u
  ) {
    let filterOffset = (params.filterDim - 1) / 2;
    let dims = vec2i(textureDimensions(inputTex, 0));
    let baseIndex = vec2i(WorkGroupID.xy * vec2(params.blockDim, 4) +
                              LocalInvocationID.xy * vec2(4, 1))
                    - vec2(filterOffset, 0);
  
    for (var r = 0; r < 4; r++) {
      for (var c = 0; c < 4; c++) {
        var loadIndex = baseIndex + vec2(c, r);
        if (flip.value != 0u) {
          loadIndex = loadIndex.yx;
        }
  
        tile[r][4 * LocalInvocationID.x + u32(c)] = textureSampleLevel(
          inputTex,
          samp,
          (vec2f(loadIndex) + vec2f(0.25, 0.25)) / vec2f(dims),
          0.0
        ).rgb;
      }
    }
  
    workgroupBarrier();
  
    for (var r = 0; r < 4; r++) {
      for (var c = 0; c < 4; c++) {
        var writeIndex = baseIndex + vec2(c, r);
        if (flip.value != 0) {
          writeIndex = writeIndex.yx;
        }
  
        let center = i32(4 * LocalInvocationID.x) + c;
        if (center >= filterOffset &&
            center < 128 - filterOffset &&
            all(writeIndex < dims)) {
          var acc = vec3(0.0, 0.0, 0.0);
          for (var f = 0; f < params.filterDim; f++) {
            var i = center + f - filterOffset;
            acc = acc + (1.0 / f32(params.filterDim)) * tile[r][i];
          }
          textureStore(outputTex, writeIndex, vec4(acc, 1.0));
        }
      }
    }
  }
`;

interface BlurProps {
  size: number;
  iterations: number;
  resolution: Float32Array;
}

export class BlurImageFilter extends Drawable {
  private tileDim = 128;
  private blockDim: number;

  private device: GPUDevice | null = null;
  private renderPipeline: GPURenderPipeline | null = null;
  private blurPipeline: GPUComputePipeline | null = null;
  private showResultBindGroup: GPUBindGroup | null = null;
  private computeConstants: GPUBindGroup | null = null;
  private computeBindGroup0: GPUBindGroup | null = null;
  private computeBindGroup1: GPUBindGroup | null = null;
  private computeBindGroup2: GPUBindGroup | null = null;

  constructor(private props: BlurProps, private input: GPUTexture) {
    super();
    this.blockDim = this.tileDim - (this.props.size - 1);
  }

  // TODO: cache pipeline in resources
  setup(device: GPUDevice, _resource: Resources) {
    this.device = device;
    const format = navigator.gpu.getPreferredCanvasFormat();
    const srcWidth = this.props.resolution[0];
    const srcHeight = this.props.resolution[1];
    this.blurPipeline = device.createComputePipeline({
      layout: "auto",
      compute: {
        module: device.createShaderModule({
          code: BlurShader,
        }),
      },
    });
    this.renderPipeline = device.createRenderPipeline({
      layout: "auto",
      vertex: {
        module: device.createShaderModule({
          code: FillVertex,
        }),
      },
      fragment: {
        module: device.createShaderModule({
          code: FillTexture,
        }),
        targets: [
          {
            format,
          },
        ],
      },
      primitive: {
        topology: "triangle-list",
      },
    });

    const sampler = device.createSampler({
      magFilter: "linear",
      minFilter: "linear",
    });

    const textures = [0, 1].map(() => {
      return device.createTexture({
        size: {
          width: srcWidth,
          height: srcHeight,
        },
        format: "rgba8unorm",
        usage:
          GPUTextureUsage.COPY_DST |
          GPUTextureUsage.STORAGE_BINDING |
          GPUTextureUsage.TEXTURE_BINDING,
      });
    });

    const buffer0 = (() => {
      const buffer = device.createBuffer({
        size: 4,
        mappedAtCreation: true,
        usage: GPUBufferUsage.UNIFORM,
      });
      new Uint32Array(buffer.getMappedRange())[0] = 0;
      buffer.unmap();
      return buffer;
    })();

    // A buffer with 1 in it. Binding this buffer is used to set `flip` to 1
    const buffer1 = (() => {
      const buffer = device.createBuffer({
        size: 4,
        mappedAtCreation: true,
        usage: GPUBufferUsage.UNIFORM,
      });
      new Uint32Array(buffer.getMappedRange())[0] = 1;
      buffer.unmap();
      return buffer;
    })();

    const blurParamsBuffer = device.createBuffer({
      size: 8,
      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.UNIFORM,
    });
    const layout0 = this.blurPipeline.getBindGroupLayout(0);
    layout0.label = "Compute Constants";
    this.computeConstants = device.createBindGroup({
      layout: layout0,
      entries: [
        {
          binding: 0,
          resource: sampler,
        },
        {
          binding: 1,
          resource: {
            buffer: blurParamsBuffer,
          },
        },
      ],
    });
    const layout1 = this.blurPipeline.getBindGroupLayout(1);
    layout1.label = "Compute Bind Group";
    this.computeBindGroup0 = device.createBindGroup({
      layout: layout1,
      entries: [
        {
          binding: 1,
          resource: this.input.createView(),
        },
        {
          binding: 2,
          resource: textures[0].createView(),
        },
        {
          binding: 3,
          resource: {
            buffer: buffer0,
          },
        },
      ],
    });

    this.computeBindGroup1 = device.createBindGroup({
      layout: layout1,
      entries: [
        {
          binding: 1,
          resource: textures[0].createView(),
        },
        {
          binding: 2,
          resource: textures[1].createView(),
        },
        {
          binding: 3,
          resource: {
            buffer: buffer1,
          },
        },
      ],
    });

    this.computeBindGroup2 = device.createBindGroup({
      layout: layout1,
      entries: [
        {
          binding: 1,
          resource: textures[1].createView(),
        },
        {
          binding: 2,
          resource: textures[0].createView(),
        },
        {
          binding: 3,
          resource: {
            buffer: buffer0,
          },
        },
      ],
    });
    const renderLayout = this.renderPipeline.getBindGroupLayout(0);
    renderLayout.label = "Render Layout";
    this.showResultBindGroup = device.createBindGroup({
      layout: renderLayout,
      entries: [
        {
          binding: 0,
          resource: sampler,
        },
        {
          binding: 1,
          resource: textures[1].createView(),
        },
      ],
    });
    device.queue.writeBuffer(
      blurParamsBuffer,
      0,
      new Uint32Array([this.props.size, this.blockDim])
    );
  }

  compute(commandEncoder: GPUCommandEncoder) {
    if (!this.device || !this.blurPipeline || !this.renderPipeline) {
      return;
    }
    const batch = [4, 4];
    const srcWidth = this.props.resolution[0];
    const srcHeight = this.props.resolution[1];

    const computePass = commandEncoder.beginComputePass();
    computePass.setPipeline(this.blurPipeline);
    computePass.setBindGroup(0, this.computeConstants);

    computePass.setBindGroup(1, this.computeBindGroup0);
    computePass.dispatchWorkgroups(
      Math.ceil(srcWidth / this.blockDim),
      Math.ceil(srcHeight / batch[1])
    );

    computePass.setBindGroup(1, this.computeBindGroup1);
    computePass.dispatchWorkgroups(
      Math.ceil(srcHeight / this.blockDim),
      Math.ceil(srcWidth / batch[1])
    );

    for (let i = 0; i < this.props.iterations - 1; ++i) {
      computePass.setBindGroup(1, this.computeBindGroup2);
      computePass.dispatchWorkgroups(
        Math.ceil(srcWidth / this.blockDim),
        Math.ceil(srcHeight / batch[1])
      );

      computePass.setBindGroup(1, this.computeBindGroup1);
      computePass.dispatchWorkgroups(
        Math.ceil(srcHeight / this.blockDim),
        Math.ceil(srcWidth / batch[1])
      );
    }

    computePass.end();
  }

  draw(passEncoder: GPURenderPassEncoder) {
    if (!this.renderPipeline) {
      return;
    }
    passEncoder.setPipeline(this.renderPipeline);
    passEncoder.setBindGroup(0, this.showResultBindGroup);
    passEncoder.draw(6);
  }
}
