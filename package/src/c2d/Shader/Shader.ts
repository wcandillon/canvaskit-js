import type { WebGLContext } from "./ShaderContext";

interface RuntimeEffectChild {
  texture: WebGLTexture;
  location: WebGLUniformLocation;
}

export type RuntimeEffectChildren = RuntimeEffectChild[];
// TODO: rename to shader
export interface Shader {
  render(width: number, height: number): OffscreenCanvas;
}

export class WebGLShader implements Shader {
  constructor(
    private readonly ctx: WebGLContext,
    uniforms: { [name: string]: number[] },
    private readonly children: Shader[],
    private readonly localMatrix?: DOMMatrix
  ) {
    const { gl, program } = ctx;
    const uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < uniformCount; i++) {
      const uniformInfo = gl.getActiveUniform(program, i);
      if (!uniformInfo) {
        throw new Error("Could not get uniform info");
      }
      const { name } = uniformInfo;
      if (name === "u_matrix" || name === "u_resolution") {
        continue;
      }
      const location = gl.getUniformLocation(program, name);
      if (!location) {
        throw new Error("Could not get uniform location");
      }
      if (uniformInfo.type === gl.FLOAT) {
        processUniform(
          this.ctx,
          uniforms[name],
          uniformInfo,
          gl.uniform1fv.bind(gl)
        );
      } else if (uniformInfo.type === gl.FLOAT_VEC2) {
        processUniform(
          this.ctx,
          uniforms[name],
          uniformInfo,
          gl.uniform2fv.bind(gl)
        );
      } else if (uniformInfo.type === gl.FLOAT_VEC3) {
        processUniform(
          this.ctx,
          uniforms[name],
          uniformInfo,
          gl.uniform3fv.bind(gl)
        );
      } else if (uniformInfo.type === gl.FLOAT_VEC4) {
        processUniform(
          this.ctx,
          uniforms[name],
          uniformInfo,
          gl.uniform4fv.bind(gl)
        );
      } else if (uniformInfo.type === gl.FLOAT_MAT2) {
        processUniform(this.ctx, uniforms[name], uniformInfo, (loc, subarr) =>
          gl.uniformMatrix2fv(loc, false, subarr)
        );
      } else if (uniformInfo.type === gl.FLOAT_MAT3) {
        processUniform(this.ctx, uniforms[name], uniformInfo, (loc, subarr) =>
          gl.uniformMatrix3fv(loc, false, subarr)
        );
      } else if (uniformInfo.type === gl.FLOAT_MAT4) {
        processUniform(this.ctx, uniforms[name], uniformInfo, (loc, subarr) =>
          gl.uniformMatrix4fv(loc, false, subarr)
        );
      }
    }
  }

  render(width: number, height: number): OffscreenCanvas {
    const localMatrix = this.localMatrix ?? new DOMMatrix();
    const { gl, program, textures } = this.ctx;
    gl.canvas.width = width;
    gl.canvas.height = height;
    // Set the CTM
    const matrixLocation = gl.getUniformLocation(program, "u_matrix");
    if (matrixLocation) {
      gl.uniformMatrix4fv(
        matrixLocation,
        false,
        localMatrix.inverse().toFloat32Array()
      );
    }
    // Set the resolution
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    if (resolutionLocation) {
      gl.uniform2f(resolutionLocation, width, height);
    }
    let texIndex = 0;
    const uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < uniformCount; i++) {
      const uniformInfo = gl.getActiveUniform(program, i);
      if (!uniformInfo) {
        throw new Error("Could not get uniform info");
      }
      const { name } = uniformInfo;
      const location = gl.getUniformLocation(program, name);
      if (!location) {
        throw new Error("Could not get uniform location");
      }
      if (uniformInfo.type === gl.SAMPLER_2D) {
        if (!this.children[texIndex]) {
          throw new Error(`No texture for uniform ${name}`);
        }
        gl.activeTexture(gl.TEXTURE0 + texIndex);
        gl.bindTexture(gl.TEXTURE_2D, textures[name].texture);
        gl.uniform1i(location, texIndex);
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          this.children[texIndex].render(width, height)
        );
        texIndex++;
      }
    }
    gl.viewport(0, 0, width, height);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    return gl.canvas as OffscreenCanvas;
  }
}

const processUniform = (
  ctx: WebGLContext,
  values: number[],
  uniformInfo: WebGLActiveInfo,
  setter: (loc: WebGLUniformLocation | null, values: number[]) => void
) => {
  const { gl, program } = ctx;
  const { name } = uniformInfo;
  const location = gl.getUniformLocation(program, name);
  if (!location) {
    console.error("Could not find uniform location for " + name);
  }
  setter(gl.getUniformLocation(program, name), values);
};
