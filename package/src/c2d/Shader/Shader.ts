import type { ShaderContext } from "./ShaderContext";

export interface Shader {
  render(width: number, height: number, ctm: DOMMatrix): OffscreenCanvas;
}

interface Uniforms {
  [name: string]: number[];
}

export class Shader implements Shader {
  constructor(
    private readonly ctx: ShaderContext,
    uniforms: { [name: string]: number[] },
    private readonly children: Shader[]
  ) {
    const { gl, program } = ctx;
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
      if (uniformInfo.type === gl.FLOAT) {
        assertUniformSize(uniforms, name, 1);
        gl.uniform1fv(location, uniforms[name]);
      }
    }
  }

  render(width: number, height: number, ctm: DOMMatrix): OffscreenCanvas {
    const { gl, program, textures } = this.ctx;
    gl.canvas.width = width;
    gl.canvas.height = height;
    // Set the CTM
    const matrixLocation = gl.getUniformLocation(program, "u_matrix");
    if (matrixLocation) {
      gl.uniformMatrix4fv(
        matrixLocation,
        false,
        ctm.inverse().toFloat32Array()
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
        gl.activeTexture(gl.TEXTURE0 + texIndex);
        gl.bindTexture(gl.TEXTURE_2D, textures[texIndex]);
        gl.uniform1i(location, texIndex);
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          this.children[texIndex].render(width, height, ctm)
        );
        texIndex++;
      }
    }
    gl.viewport(0, 0, width, height);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    return gl.canvas as OffscreenCanvas;
  }
}

const assertUniformSize = (uniforms: Uniforms, name: string, count: number) => {
  if (uniforms[name].length !== count) {
    throw new Error(
      `Uniform ${name} should have ${count} elements, but has ${uniforms[name].length}`
    );
  }
};
