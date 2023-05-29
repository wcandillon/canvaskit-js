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

export const createContext = (
  shaderCode: string,
  error?: ((err: string) => void) | undefined
) => {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const gl = canvas.getContext("webgl2");
  if (!gl) {
    if (error) {
      error(
        "Failed to get WebGL2 context. Your browser or machine may not support it."
      );
    }
    return null;
  }

  const vertexShader = gl.createShader(gl.VERTEX_SHADER)!;
  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)!;

  gl.shaderSource(vertexShader, vertexShaderCode);
  gl.compileShader(vertexShader);

  gl.shaderSource(fragmentShader, shaderCode);
  gl.compileShader(fragmentShader);

  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    if (error) {
      const info = gl.getShaderInfoLog(fragmentShader);
      error("Could not compile fragment shader. \n\n" + info);
    }
    return null;
  }

  const program = gl.createProgram()!;
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    if (error) {
      const info = gl.getShaderInfoLog(fragmentShader);
      error("Could not link WebGL program. \n\n" + info);
    }
    return null;
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
