type Value = string | number;
type Values = Value[];

export const glsl = (source: TemplateStringsArray, ...values: Values) => {
  const processed = source.flatMap((s, i) => [s, values[i]]).filter(Boolean);
  return processed.join("");
};

const vertexShaderCode = `
attribute vec2 a_position;
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

export const createContext = (
  shaderCode: string,
  _error?: ((err: string) => void) | undefined
) => {
  const canvas = new OffscreenCanvas(0, 0);
  const gl = canvas.getContext("webgl2");
  const error = _error || console.error.bind(console);
  if (!gl) {
    return handleError(
      "Failed to get WebGL2 context. Your browser or machine may not support it.",
      error
    );
  }

  const vertexShader = gl.createShader(gl.VERTEX_SHADER)!;
  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)!;

  gl.shaderSource(vertexShader, vertexShaderCode);
  gl.compileShader(vertexShader);

  gl.shaderSource(fragmentShader, shaderCode);
  gl.compileShader(fragmentShader);

  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(fragmentShader);
    const msg = "Could not compile fragment shader. \n\n" + info;
    return handleError(msg, error);
  }

  const program = gl.createProgram()!;
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const info = gl.getShaderInfoLog(fragmentShader);
    const msg = "Could not link WebGL program. \n\n" + info;
    return handleError(msg, error);
  }

  gl.useProgram(program);

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

  return { gl, canvas, program };
};
