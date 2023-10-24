import type {
  InputMatrix,
  MallocObj,
  RuntimeEffect,
  SkSLUniform,
} from "canvaskit-wasm";

import { HostObject } from "../HostObject";
import { ShaderJS } from "../Shader";
import { normalizeArray } from "../Core";
import { Shader, type ShaderContext } from "../c2d";

export class RuntimeEffectJS
  extends HostObject<"RuntimeEffect">
  implements RuntimeEffect
{
  private uniformMap: number[] = [];

  constructor(private readonly ctx: ShaderContext) {
    super("RuntimeEffect");
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
  ) {
    return this.makeShaderWithChildren(uniforms, undefined, localMatrix);
  }

  makeShaderWithChildren(
    inputUniforms: MallocObj | Float32Array | number[],
    input?: ShaderJS[],
    localMatrix?: InputMatrix
  ) {
    const children = input ? input : [];
    const uniforms = Array.from(normalizeArray(inputUniforms));
    const mappedUniforms = createUniformMap(
      this.ctx.gl,
      this.ctx.program,
      uniforms
    );
    console.log("namedUniforms: " + JSON.stringify(mappedUniforms, null, 2));
    if (localMatrix) {
      // TODO: to implement
      //console.warn("localMatrix not implemented yet");
    }
    return new ShaderJS(
      new Shader(
        this.ctx,
        mappedUniforms,
        children.map((c) => c.getShader())
      )
    );
  }
  getUniform(index: number): SkSLUniform {
    const { gl, program } = this.ctx;
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
  getUniformCount() {
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
  getUniformFloatCount() {
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

  getUniformName(index: number) {
    const { gl, program } = this.ctx;
    const uniformInfo = gl.getActiveUniform(program, index);
    if (!uniformInfo) {
      throw new Error(`No uniform at index ${index}`);
    }
    return uniformInfo.name;
  }
}

const getUniformNames = (gl: WebGLRenderingContext, program: WebGLProgram) => {
  const uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
  const uniformNames: string[] = [];
  for (let i = 0; i < uniformCount; i++) {
    const uniformInfo = gl.getActiveUniform(program, i);
    if (uniformInfo) {
      uniformNames.push(uniformInfo.name);
    }
  }
  return uniformNames;
};

const createUniformMap = (
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  values: number[]
) => {
  const uniformMap: Record<string, number[]> = {};
  let index = 0;
  const uniformNames = getUniformNames(gl, program);
  uniformNames.forEach((name) => {
    const uniformLocation = gl.getUniformLocation(program, name);
    if (!uniformLocation) {
      console.error(`Uniform ${name} not found in shader program.`);
      return;
    }

    const uniformInfo = gl.getActiveUniform(
      program,
      uniformLocation as unknown as number
    );
    if (!uniformInfo) {
      console.error(`Unable to get information for uniform ${name}.`);
      return;
    }

    const size = getUniformSize(gl, uniformInfo.type);
    if (size === 0) {
      console.error(`Unsupported uniform type for ${name}.`);
      return;
    }

    uniformMap[name] = values.slice(index, index + size);
    index += size;
  });

  return uniformMap;
};

const getUniformSize = (gl: WebGLRenderingContext, type: number) => {
  switch (type) {
    case gl.FLOAT:
    case gl.INT:
    case gl.SAMPLER_2D:
    case gl.SAMPLER_CUBE:
      return 1;
    case gl.FLOAT_VEC2:
    case gl.INT_VEC2:
      return 2;
    case gl.FLOAT_VEC3:
    case gl.INT_VEC3:
      return 3;
    case gl.FLOAT_VEC4:
    case gl.INT_VEC4:
    case gl.FLOAT_MAT2:
      return 4;
    case gl.FLOAT_MAT3:
      return 9;
    case gl.FLOAT_MAT4:
      return 16;
    default:
      return 0; // Unsupported type
  }
};
