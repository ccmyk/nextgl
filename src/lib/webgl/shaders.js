// lib/webgl/shaders.js
export class ShaderManager {
  constructor(gl) {
    this.gl = gl;
    this.programs = new Map();
  }

  createProgram(vertexSource, fragmentSource, name) {
    const vertexShader = this.createShader(this.gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fragmentSource);
    
    const program = this.gl.createProgram();
    this.gl.attachShader(program, vertexShader);
    this.gl.attachShader(program, fragmentShader);
    this.gl.linkProgram(program);

    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      throw new Error(`Unable to link shader program: ${this.gl.getProgramInfoLog(program)}`);
    }

    // Get uniform locations
    const uniforms = {};
    const numUniforms = this.gl.getProgramParameter(program, this.gl.ACTIVE_UNIFORMS);
    
    for (let i = 0; i < numUniforms; i++) {
      const uniformInfo = this.gl.getActiveUniform(program, i);
      const location = this.gl.getUniformLocation(program, uniformInfo.name);
      
      // Create a proxy to handle uniform updates
      uniforms[uniformInfo.name] = {
        location,
        value: null,
        set value(newValue) {
          this.value = newValue;
          this.gl.uniform1f(location, newValue);
        },
        get value() {
          return this._value;
        }
      };
    }

    // Add uniforms to program
    program.uniforms = uniforms;
    
    this.programs.set(name, program);
    return program;
  }

  createShader(type, source) {
    const shader = this.gl.createShader(type);
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      throw new Error(`Shader compile error: ${this.gl.getShaderInfoLog(shader)}`);
    }

    return shader;
  }

  useProgram(name) {
    const program = this.programs.get(name);
    if (!program) {
      throw new Error(`Shader program '${name}' not found`);
    }
    
    this.gl.useProgram(program);
    return program;
  }

  getUniformLocation(program, name) {
    return this.gl.getUniformLocation(program, name);
  }

  getAttribLocation(program, name) {
    return this.gl.getAttribLocation(program, name);
  }

  deleteProgram(name) {
    const program = this.programs.get(name);
    if (program) {
      this.gl.deleteProgram(program);
      this.programs.delete(name);
    }
  }

  cleanup() {
    this.programs.forEach((program) => {
      this.gl.deleteProgram(program);
    });
    this.programs.clear();
  }
}