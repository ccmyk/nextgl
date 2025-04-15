export class SceneManager {
  constructor(gl) {
    this.gl = gl;
    this.scenes = new Map();
    this.activeScene = null;
  }

  create(name) {
    const scene = {
      meshes: [],
      textures: [],
      programs: [],
      uniforms: {},
      update: () => {},
      render: () => {}
    };
    
    this.scenes.set(name, scene);
    return scene;
  }

  get(name) {
    return this.scenes.get(name);
  }

  setActive(name) {
    const scene = this.scenes.get(name);
    if (!scene) {
      throw new Error(`Scene '${name}' not found`);
    }
    
    this.activeScene = scene;
  }

  update(time) {
    if (this.activeScene) {
      this.activeScene.update(time);
    }
  }

  render() {
    if (this.activeScene) {
      this.activeScene.render();
    }
  }

  addMesh(sceneName, mesh) {
    const scene = this.scenes.get(sceneName);
    if (!scene) {
      throw new Error(`Scene '${sceneName}' not found`);
    }
    
    scene.meshes.push(mesh);
  }

  addTexture(sceneName, texture) {
    const scene = this.scenes.get(sceneName);
    if (!scene) {
      throw new Error(`Scene '${sceneName}' not found`);
    }
    
    scene.textures.push(texture);
  }

  addProgram(sceneName, program) {
    const scene = this.scenes.get(sceneName);
    if (!scene) {
      throw new Error(`Scene '${sceneName}' not found`);
    }
    
    scene.programs.push(program);
  }

  setUniform(sceneName, name, value) {
    const scene = this.scenes.get(sceneName);
    if (!scene) {
      throw new Error(`Scene '${sceneName}' not found`);
    }
    
    scene.uniforms[name] = value;
  }
} 