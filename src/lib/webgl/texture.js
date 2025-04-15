export class TextureLoader {
  constructor(gl) {
    this.gl = gl;
    this.textures = new Map();
  }

  load(url, name) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.crossOrigin = 'anonymous';
      
      image.onload = () => {
        const texture = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
        
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
        
        this.gl.texImage2D(
          this.gl.TEXTURE_2D,
          0,
          this.gl.RGBA,
          this.gl.RGBA,
          this.gl.UNSIGNED_BYTE,
          image
        );
        
        this.textures.set(name, texture);
        resolve(texture);
      };
      
      image.onerror = () => {
        reject(new Error(`Failed to load texture: ${url}`));
      };
      
      image.src = url;
    });
  }

  get(name) {
    return this.textures.get(name);
  }

  bind(name, unit = 0) {
    const texture = this.textures.get(name);
    if (!texture) {
      throw new Error(`Texture '${name}' not found`);
    }
    
    this.gl.activeTexture(this.gl.TEXTURE0 + unit);
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
  }
} 