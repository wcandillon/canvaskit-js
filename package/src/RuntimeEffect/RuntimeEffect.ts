import type {
  InputMatrix,
  MallocObj,
  RuntimeEffect,
  Shader,
  SkSLUniform,
} from "canvaskit-wasm";

import { HostObject } from "../HostObject";
import type { ShaderJS } from "../Shader";
import { RuntimeEffectShader } from "../Shader/RuntimeEffectShader";
import { normalizeArray } from "../Core";

type ShaderIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
const textureMap = {};
export interface RuntimeEffectContext {
  gl: WebGL2RenderingContext;
  program: WebGLProgram;
  children: {
    shader: ShaderJS;
    location: WebGLUniformLocation;
    index: ShaderIndex;
  }[];
}

interface UniformProcessingState {
  uniformIndex: number;
  shaderIndex: ShaderIndex;
}

export class RuntimeEffectJS
  extends HostObject<RuntimeEffect>
  implements RuntimeEffect
{
  private uniformMap: number[] = [];

  constructor(private readonly ctx: RuntimeEffectContext) {
    super();
    const { gl, program } = this.ctx;
    const uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < uniformCount; i++) {
      const uniformInfo = gl.getActiveUniform(program, i);
      if (uniformInfo && uniformInfo.type !== gl.SAMPLER_2D) {
        this.uniformMap.push(i);
      }
    }
  }

  makeShader(
    uniforms: MallocObj | Float32Array | number[],
    localMatrix?: InputMatrix
  ): Shader {
    return this.makeShaderWithChildren(uniforms, undefined, localMatrix);
  }

  makeShaderWithChildren(
    inputUniforms: MallocObj | Float32Array | number[],
    children?: ShaderJS[],
    localMatrix?: InputMatrix
  ): Shader {
    const { gl, program } = this.ctx;
    const uniforms = normalizeArray(inputUniforms);
    const state: UniformProcessingState = { uniformIndex: 0, shaderIndex: 0 };
    const uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < uniformCount; i++) {
      const uniformInfo = gl.getActiveUniform(program, i)!;
      if (uniformInfo.type === gl.FLOAT) {
        processUniform(
          this.ctx,
          state,
          uniforms,
          uniformInfo,
          1,
          gl.uniform1fv.bind(gl)
        );
      } else if (uniformInfo.type === gl.FLOAT_VEC2) {
        processUniform(
          this.ctx,
          state,
          uniforms,
          uniformInfo,
          2,
          gl.uniform2fv.bind(gl)
        );
      } else if (uniformInfo.type === gl.FLOAT_VEC3) {
        processUniform(
          this.ctx,
          state,
          uniforms,
          uniformInfo,
          3,
          gl.uniform3fv.bind(gl)
        );
      } else if (uniformInfo.type === gl.FLOAT_VEC4) {
        processUniform(
          this.ctx,
          state,
          uniforms,
          uniformInfo,
          4,
          gl.uniform4fv.bind(gl)
        );
      } else if (uniformInfo.type === gl.FLOAT_MAT2) {
        processUniform(
          this.ctx,
          state,
          uniforms,
          uniformInfo,
          4,
          (loc, subarr) => gl.uniformMatrix2fv(loc, false, subarr)
        );
      } else if (uniformInfo.type === gl.FLOAT_MAT3) {
        processUniform(
          this.ctx,
          state,
          uniforms,
          uniformInfo,
          9,
          (loc, subarr) => gl.uniformMatrix3fv(loc, false, subarr)
        );
      } else if (uniformInfo.type === gl.FLOAT_MAT4) {
        processUniform(
          this.ctx,
          state,
          uniforms,
          uniformInfo,
          16,
          (loc, subarr) => gl.uniformMatrix4fv(loc, false, subarr)
        );
      } else if (uniformInfo.type === gl.SAMPLER_2D) {
        const { name } = uniformInfo;
        const location = gl.getUniformLocation(program, name);
        if (!location) {
          throw new Error("Could not find uniform location for " + name);
        }
        const child = (children ?? [])[state.shaderIndex];
        if (!child) {
          throw new Error("No shader provided for " + name);
        }
        let texture;
        if (textureMap[name]) {
          console.log("Found texture in map");
          // if the texture already exists, use it
          texture = textureMap[name];

          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        } else {
          console.log("Create texture");
          texture = gl.createTexture();
          if (!texture) {
            throw new Error("Could not create texture for " + name);
          }
          // store the texture in the map for later use
          textureMap[name] = texture;
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        }

        // Set the parameters so we can render any size image
        gl.activeTexture(gl[`TEXTURE${state.shaderIndex}`]);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        this.ctx.children.push({
          shader: child,
          location,
          index: state.shaderIndex,
        });
        state.shaderIndex++;
      }
    }

    // If a local matrix is provided, set it as a uniform
    if (localMatrix) {
      console.warn("localMatrix not implemented yet");
      //throw new Error("localMatrix not implemented yet");
    }

    return new RuntimeEffectShader(this.ctx);
  }
  getUniform(index: number): SkSLUniform {
    const { gl, program } = this.ctx;
    // TODO: should exclude texture uniforms.
    const i = this.uniformMap.indexOf(index);
    const uniformInfo = gl.getActiveUniform(program, i);
    if (!uniformInfo) {
      throw new Error(`No uniform at index ${i}`);
    }

    let rows = 1;
    let columns = 1;
    let isInteger = false;

    switch (uniformInfo.type) {
      case gl.FLOAT:
        break;
      case gl.FLOAT_VEC2:
        rows = 2;
        break;
      case gl.FLOAT_VEC3:
        rows = 3;
        break;
      case gl.FLOAT_VEC4:
        rows = 4;
        break;
      case gl.FLOAT_MAT2:
        rows = 2;
        columns = 2;
        break;
      case gl.FLOAT_MAT3:
        rows = 3;
        columns = 3;
        break;
      case gl.FLOAT_MAT4:
        rows = 4;
        columns = 4;
        break;
      case gl.INT:
        isInteger = true;
        break;
      case gl.INT_VEC2:
        isInteger = true;
        rows = 2;
        break;
      case gl.INT_VEC3:
        isInteger = true;
        rows = 3;
        break;
      case gl.INT_VEC4:
        isInteger = true;
        rows = 4;
        break;
      default:
        throw new Error("Unsupported uniform type: " + uniformInfo.type);
    }
    const uniform: SkSLUniform = {
      columns,
      rows,
      slot: i,
      isInteger,
    };

    return uniform;
  }
  getUniformCount(): number {
    const { gl, program } = this.ctx;
    let count = 0;
    const uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);

    for (let i = 0; i < uniformCount; i++) {
      const uniformInfo = gl.getActiveUniform(program, i);
      if (uniformInfo && uniformInfo.type !== gl.SAMPLER_2D) {
        count++;
      }
    }
    return count;
  }
  getUniformFloatCount(): number {
    const { gl, program } = this.ctx;
    let floatCount = 0;
    const uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);

    for (let i = 0; i < uniformCount; i++) {
      const uniformInfo = gl.getActiveUniform(program, i);
      if (uniformInfo && uniformInfo.type === gl.FLOAT) {
        floatCount += uniformInfo.size;
      }
    }
    return floatCount;
  }
  getUniformName(index: number): string {
    const { gl, program } = this.ctx;
    const uniformInfo = gl.getActiveUniform(program, index);
    if (!uniformInfo) {
      throw new Error(`No uniform at index ${index}`);
    }
    return uniformInfo.name;
  }
}

const processUniform = (
  ctx: RuntimeEffectContext,
  state: UniformProcessingState,
  uniforms: Float32Array,
  uniformInfo: WebGLActiveInfo,
  size: number,
  setter: (loc: WebGLUniformLocation | null, subarr: Float32Array) => void
) => {
  const { gl, program } = ctx;
  const { name } = uniformInfo;
  const location = gl.getUniformLocation(program, name);
  if (!location) {
    console.error("Could not find uniform location for " + name);
  }
  setter(
    gl.getUniformLocation(program, name),
    uniforms.subarray(
      state.uniformIndex,
      state.uniformIndex + size * uniformInfo.size
    )
  );
  state.uniformIndex += size;
};
