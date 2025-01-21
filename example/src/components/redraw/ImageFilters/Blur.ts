import { FillTexture, FillVertex } from "../Drawings/Fill";
import { Drawable } from "../Recorder";
import { Resources } from "../Resources";

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
  inputTexture: GPUTexture;
}

export class BlurImageFilter extends Drawable {
  private tileDim = 128;
  private size = 2;
  private iterations = 2;

  private inputTexture: GPUTexture | null = null;
  private blurParamsBuffer: GPUBuffer | null = null;
  private renderPipeline: GPURenderPipeline | null = null;
  private blurPipeline: GPUComputePipeline | null = null;
  private showResultBindGroup: GPUBindGroup | null = null;
  private computeConstants: GPUBindGroup | null = null;
  private computeBindGroup0: GPUBindGroup | null = null;
  private computeBindGroup1: GPUBindGroup | null = null;
  private computeBindGroup2: GPUBindGroup | null = null;

  constructor(device: GPUDevice, props: BlurProps) {
    super(device);
    this.setInputTexture(props.inputTexture);
    this.setSize(props.size);
    this.setIterations(props.iterations);
  }

  setSize(size: number) {
    if (!this.blurParamsBuffer) {
      throw new Error("Blur Image filter blurParamsBuffer not initialized");
    }
    this.size = size;
    this.device.queue.writeBuffer(
      this.blurParamsBuffer,
      0,
      new Uint32Array([this.size, this.getBlockDim()])
    );
  }

  setIterations(iterations: number) {
    this.iterations = iterations;
  }

  setInputTexture(texture: GPUTexture) {
    if (this.inputTexture === texture) {
      return;
    }
    this.inputTexture = texture;
    const srcWidth = texture.width;
    const srcHeight = texture.height;
    const computeShader = this.resources.createModule(
      "blur-image-filter-shader",
      BlurShader
    );

    this.blurPipeline = this.resources.createComputePipeline(
      "blur-image-filter-compute-pipeline",
      computeShader
    );
    const fillVertex = this.resources.createModule("fill-vertex", FillVertex);
    const fillFragment = this.resources.createModule(
      "fill-texture",
      FillTexture
    );
    this.renderPipeline = this.resources.createPipeline(
      "fill-texture",
      fillVertex,
      fillFragment
    );

    const sampler = this.device.createSampler({
      magFilter: "linear",
      minFilter: "linear",
    });

    const textures = [0, 1].map((index) => {
      return this.resources.createTexture(
        `ping-pong-storage-texture-${srcWidth}-${srcHeight}-${index}`,
        {
          size: {
            width: srcWidth,
            height: srcHeight,
          },
          format: "rgba8unorm",
          usage:
            GPUTextureUsage.COPY_DST |
            GPUTextureUsage.STORAGE_BINDING |
            GPUTextureUsage.TEXTURE_BINDING,
        }
      );
    });

    const buffer0 = this.resources.createBuffer(
      "image-filter-buffer-0",
      Uint32Array.of(0),
      GPUBufferUsage.UNIFORM
    );
    const buffer1 = this.resources.createBuffer(
      "image-filter-buffer-1",
      Uint32Array.of(1),
      GPUBufferUsage.UNIFORM
    );

    this.blurParamsBuffer = this.device.createBuffer({
      size: 8,
      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.UNIFORM,
    });
    const layout0 = this.blurPipeline.getBindGroupLayout(0);
    layout0.label = "Compute Constants";
    this.computeConstants = this.device.createBindGroup({
      layout: layout0,
      entries: [
        {
          binding: 0,
          resource: sampler,
        },
        {
          binding: 1,
          resource: {
            buffer: this.blurParamsBuffer,
          },
        },
      ],
    });
    const layout1 = this.blurPipeline.getBindGroupLayout(1);
    layout1.label = "Compute Bind Group";
    this.computeBindGroup0 = this.device.createBindGroup({
      layout: layout1,
      entries: [
        {
          binding: 1,
          resource: texture.createView(),
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

    this.computeBindGroup1 = this.device.createBindGroup({
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

    this.computeBindGroup2 = this.device.createBindGroup({
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
    this.showResultBindGroup = this.device.createBindGroup({
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
  }

  getBlockDim() {
    return this.tileDim - (this.size - 1);
  }

  compute(commandEncoder: GPUCommandEncoder) {
    if (
      !this.device ||
      !this.blurPipeline ||
      !this.renderPipeline ||
      !this.inputTexture
    ) {
      throw new Error("Blur Image filter not initialized");
    }
    const batch = [4, 4];
    const srcWidth = this.inputTexture.width;
    const srcHeight = this.inputTexture.height;

    const computePass = commandEncoder.beginComputePass();
    computePass.setPipeline(this.blurPipeline);
    computePass.setBindGroup(0, this.computeConstants);

    computePass.setBindGroup(1, this.computeBindGroup0);
    computePass.dispatchWorkgroups(
      Math.ceil(srcWidth / this.getBlockDim()),
      Math.ceil(srcHeight / batch[1])
    );

    computePass.setBindGroup(1, this.computeBindGroup1);
    computePass.dispatchWorkgroups(
      Math.ceil(srcHeight / this.getBlockDim()),
      Math.ceil(srcWidth / batch[1])
    );

    for (let i = 0; i < this.iterations - 1; ++i) {
      computePass.setBindGroup(1, this.computeBindGroup2);
      computePass.dispatchWorkgroups(
        Math.ceil(srcWidth / this.getBlockDim()),
        Math.ceil(srcHeight / batch[1])
      );

      computePass.setBindGroup(1, this.computeBindGroup1);
      computePass.dispatchWorkgroups(
        Math.ceil(srcHeight / this.getBlockDim()),
        Math.ceil(srcWidth / batch[1])
      );
    }

    computePass.end();
  }

  draw(passEncoder: GPURenderPassEncoder) {
    if (!this.renderPipeline) {
      throw new Error("Blur Image filter not initialized");
    }
    passEncoder.setPipeline(this.renderPipeline);
    passEncoder.setBindGroup(0, this.showResultBindGroup);
    passEncoder.draw(3);
  }
}
