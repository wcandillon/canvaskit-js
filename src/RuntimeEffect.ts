import type {
  RuntimeEffectFactory as CKRuntimeEffectFactory,
  InputMatrix,
  MallocObj,
  RuntimeEffect,
  Shader,
  SkSLUniform,
  TracedShader,
} from "canvaskit-wasm";

import { HostObject } from "./HostObject";
import { createContext } from "./Shaders";
import { normalizeArray } from "./Values";
import type { ShaderLite } from "./Shader";
import { RuntimeEffectShader } from "./Shader";

type TextureName =
  | "TEXTURE0"
  | "TEXTURE1"
  | "TEXTURE2"
  | "TEXTURE3"
  | "TEXTURE4"
  | "TEXTURE5"
  | "TEXTURE6"
  | "TEXTURE7"
  | "TEXTURE8"
  | "TEXTURE9"
  | "TEXTURE10";

export interface RTContext {
  gl: WebGL2RenderingContext;
  canvas: OffscreenCanvas;
  program: WebGLProgram;
}

interface UniformProcessingState {
  uniformIndex: number;
  shaderIndex: number;
}

const processUniform = (
  ctx: RTContext,
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

class RuntimeEffectLite
  extends HostObject<RuntimeEffect>
  implements RuntimeEffect
{
  constructor(private readonly ctx: RTContext) {
    super();
  }

  makeShader(
    uniforms: MallocObj | Float32Array | number[],
    localMatrix?: InputMatrix
  ): Shader {
    return this.makeShaderWithChildren(uniforms, undefined, localMatrix);
  }

  makeShaderWithChildren(
    inputUniforms: MallocObj | Float32Array | number[],
    children?: ShaderLite[],
    localMatrix?: InputMatrix
  ): Shader {
    const { gl, program } = this.ctx;
    const uniforms = normalizeArray(inputUniforms);
    const state = { uniformIndex: 0, shaderIndex: 0 };
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
        const child = (children ?? [])[state.shaderIndex];
        if (!child) {
          throw new Error("No shader provided for " + name);
        }
        const texture = gl.createTexture();
        gl.activeTexture(gl[`TEXTURE${state.shaderIndex}` as TextureName]);
        gl.bindTexture(gl.TEXTURE_2D, texture);

        // Set the parameters so we can render any size image
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

        // Upload the image into the texture
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          // TODO: remove hardcoding
          child.getTexture(256, 256)
        );
        // Use the texture
        gl.uniform1i(location, state.shaderIndex);
        state.shaderIndex++;
      }
      // Add more cases if your shader uses more types of uniforms
    }

    // If a local matrix is provided, set it as a uniform
    if (localMatrix) {
      throw new Error("localMatrix not implemented yet");
    }

    return new RuntimeEffectShader(this.ctx);
  }
  getUniform(index: number): SkSLUniform {
    const { gl, program } = this.ctx;
    const uniformInfo = gl.getActiveUniform(program, index);
    if (!uniformInfo) {
      throw new Error(`No uniform at index ${index}`);
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
      slot: index,
      isInteger,
    };

    return uniform;
  }
  getUniformCount(): number {
    const { gl, program } = this.ctx;
    return gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
  }
  getUniformFloatCount(): number {
    const { gl, program } = this.ctx;
    let floatCount = 0;
    const uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);

    for (let i = 0; i < uniformCount; i++) {
      const uniformInfo = gl.getActiveUniform(program, i);
      if (uniformInfo && uniformInfo.type === gl.FLOAT) {
        floatCount++;
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

export const RuntimeEffectFactory: CKRuntimeEffectFactory = {
  Make(
    sksl: string,
    callback?: ((err: string) => void) | undefined
  ): RuntimeEffect | null {
    const ctx = createContext(sksl, callback);
    if (ctx === null) {
      return null;
    }
    return new RuntimeEffectLite(ctx);
  },
  MakeTraced(
    _shader: Shader,
    _traceCoordX: number,
    _traceCoordY: number
  ): TracedShader {
    throw new Error("Method not implemented.");
  },
};
