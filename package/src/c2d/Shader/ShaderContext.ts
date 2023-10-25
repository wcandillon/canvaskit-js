export interface RuntimeEffectChild {
  texture: WebGLTexture;
  location: WebGLUniformLocation;
}

export type Textures = { [name: string]: RuntimeEffectChild };

const vertexShaderCode = `
attribute vec2 a_position;

uniform vec2 u_resolution;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const handleError = (
  err: string,
  error: ((err: string) => void) | undefined
) => {
  if (error) {
    error(err);
  } else {
    console.error(err);
  }
  return null;
};

export class WebGLContext {
  private _gl: WebGL2RenderingContext | null = null;
  private _program: WebGLProgram | null = null;
  private _textures: Textures | null = null;

  constructor(
    shaderCode: string,
    shaderToy?: boolean,
    _error?: ((err: string) => void) | undefined
  ) {
    const canvas = new OffscreenCanvas(0, 0);
    const gl = canvas.getContext("webgl2");
    const error = _error ?? console.error.bind(console);
    if (!gl) {
      handleError(
        "Failed to get WebGL2 context. Your browser or machine may not support it.",
        error
      );
      return;
    }

    const vertexShader = gl.createShader(gl.VERTEX_SHADER)!;
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)!;

    gl.shaderSource(vertexShader, vertexShaderCode);
    gl.compileShader(vertexShader);

    gl.shaderSource(
      fragmentShader,
      `precision mediump float;
  
  uniform mat4 u_matrix;
  uniform vec2 u_resolution;
  
  ${shaderCode}
  
  void main() {
    vec4 canvasSpace = gl_FragCoord;
    ${!shaderToy ? "canvasSpace.y = u_resolution.y - canvasSpace.y" : ""};
    vec4 transformedCoord = u_matrix * canvasSpace;
    vec3 transformedCoord3d = transformedCoord.xyz / transformedCoord.w;
    mainImage(gl_FragColor, transformedCoord3d.xy);
  }`
    );
    gl.compileShader(fragmentShader);

    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
      const info = gl.getShaderInfoLog(fragmentShader);
      const msg = "Could not compile fragment shader. \n" + info;
      handleError(msg, error);
      return;
    }

    const program = gl.createProgram()!;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const info = gl.getProgramInfoLog(program);
      const msg = "Could not link WebGL program. \n" + info;
      handleError(msg, error);
      return;
    }

    gl.useProgram(program);
    const textures: Textures = {};

    const numUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < numUniforms; i++) {
      const uniformInfo = gl.getActiveUniform(program, i)!;
      const location = gl.getUniformLocation(program, uniformInfo.name);
      if (!location) {
        throw new Error("Could not get uniform location");
      }
      if (uniformInfo && uniformInfo.type === gl.SAMPLER_2D) {
        const texture = gl.createTexture()!;
        gl.activeTexture(gl.TEXTURE0 + i);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        textures[uniformInfo.name] = { texture, location };
      }
    }

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0,
      ]),
      gl.STATIC_DRAW
    );

    const positionLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    this._gl = gl;
    this._program = program;
    this._textures = textures;
  }

  private ensureContextIsInitialized() {
    if (!this._gl || !this._program || !this._textures) {
      throw new Error("GLSLContext not initialized.");
    }
  }

  get gl() {
    this.ensureContextIsInitialized();
    return this._gl!;
  }

  get program() {
    this.ensureContextIsInitialized();
    return this._program!;
  }

  get textures() {
    this.ensureContextIsInitialized();
    return this._textures!;
  }
}
