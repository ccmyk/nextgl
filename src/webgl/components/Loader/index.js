'use client'

import { Program, Mesh, Geometry } from 'ogl'
import gsap from 'gsap'

export class Loader {
  constructor({ gl, scene }) {
    this.gl = gl
    this.scene = scene
    
    // Same state management as legacy
    this.active = -1
    this.isready = 0

    // Same uniforms as legacy
    this.uniforms = {
      uResolution: { value: [0, 0] },
      uTime: { value: 0 },
      uStart0: { value: 0 },
      uStart1: { value: 0.1 },
      uStart2: { value: 1 },
      uStartX: { value: 0 },
      uStartY: { value: 0.1 },
      uMultiX: { value: -0.4 },
      uMultiY: { value: 0.45 }
    }

    this.createMesh()
    this.initTimeline()
  }

  createMesh() {
    // Create geometry - exact same as legacy
    const geometry = new Geometry(this.gl, {
      position: { 
        size: 3, 
        data: new Float32Array([-1, -1, 0, 1, -1, 0, -1, 1, 0, 1, 1, 0]) 
      },
      uv: { 
        size: 2, 
        data: new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]) 
      },
      index: { 
        data: new Uint16Array([0, 2, 1, 1, 2, 3]) 
      }
    })

    // Program with same uniforms/settings as legacy
    const program = new Program(this.gl, {
      vertex: /* glsl */`
        attribute vec3 position;
        attribute vec2 uv;
        
        varying vec2 vUv;
        
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragment: /* glsl */`
        precision highp float;
        
        uniform vec2 uResolution;
        uniform float uTime;
        uniform float uStart0;
        uniform float uStart1;
        uniform float uStart2;
        uniform float uStartX;
        uniform float uStartY;
        uniform float uMultiX;
        uniform float uMultiY;
        
        varying vec2 vUv;
        
        vec2 fade(vec2 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}
        vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
        
        float cnoise(vec2 P){
          vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
          vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
          Pi = mod(Pi, 289.0);
          vec4 ix = Pi.xzxz;
          vec4 iy = Pi.yyww;
          vec4 fx = Pf.xzxz;
          vec4 fy = Pf.yyww;
          vec4 i = permute(permute(ix) + iy);
          vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0;
          vec4 gy = abs(gx) - 0.5;
          vec4 tx = floor(gx + 0.5);
          gx = gx - tx;
          vec2 g00 = vec2(gx.x,gy.x);
          vec2 g10 = vec2(gx.y,gy.y);
          vec2 g01 = vec2(gx.z,gy.z);
          vec2 g11 = vec2(gx.w,gy.w);
          vec4 norm = 1.79284291400159 - 0.85373472095314 * 
            vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
          g00 *= norm.x;
          g01 *= norm.y;
          g10 *= norm.z;
          g11 *= norm.w;
          float n00 = dot(g00, vec2(fx.x, fy.x));
          float n10 = dot(g10, vec2(fx.y, fy.y));
          float n01 = dot(g01, vec2(fx.z, fy.z));
          float n11 = dot(g11, vec2(fx.w, fy.w));
          vec2 fade_xy = fade(Pf.xy);
          vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
          float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
          return 2.3 * n_xy;
        }
        
        void main() {
          float prog = 0.4;
          float time = uStart1;
          float time2 = uStart1 * 2.;
          
          float noise = cnoise(
            vec2(
              (vUv.x * (uMultiX)) + uStartX,
              (vUv.y * (uMultiY)) + uStartY
            )
          ) * 3.;
          
          gl_FragColor.rgb = vec3(0.);
          gl_FragColor.a = mix(1., (noise + prog), uStart0);
          gl_FragColor.a *= uStart2;
        }
      `,
      uniforms: this.uniforms,
      transparent: true
    })

    const mesh = new Mesh(this.gl, { geometry, program })

    this.program = program
    this.mesh = mesh

    if (this.scene) {
      this.scene.addChild(mesh)
    }
  }

  initTimeline() {
    // Exact same animation timeline as legacy
    this.timeline = gsap.timeline({
      paused: true,
      onComplete: () => {
        this.active = 0
      }
    })
    .fromTo(this.uniforms.uStart0,
      { value: 0 },
      {
        value: 1,
        duration: 0.6,
        ease: 'power2.inOut'
      },
      0
    )
    .fromTo(this.uniforms.uStartX,
      { value: 0 },
      {
        value: -0.1,
        duration: 2,
        ease: 'power2.inOut'
      },
      0
    )
    .fromTo(this.uniforms.uMultiX,
      { value: -0.4 },
      {
        value: 0.1,
        duration: 2,
        ease: 'power2.inOut'
      },
      0
    )
    .fromTo(this.uniforms.uStartY,
      { value: 0.1 },
      {
        value: 0.95,
        duration: 2,
        ease: 'power2.inOut'
      },
      0
    )
    .fromTo(this.uniforms.uMultiY,
      { value: 0.45 },
      {
        value: 0.3,
        duration: 2,
        ease: 'power2.inOut'
      },
      0
    )
    .fromTo(this.uniforms.uStart2,
      { value: 1 },
      {
        value: 0,
        duration: 1,
        ease: 'power2.inOut'
      },
      0.6
    )

    // Same timeScale as legacy
    this.timeline.timeScale(1.4)
  }

  start() {
    if (this.active === 1) return
    this.active = 1
    this.timeline.play()
  }

  stop() {
    if (this.active === 0) return
    if (this.timeline) {
      this.timeline.pause()
    }
    this.active = 0
  }

  update(time) {
    if (!this.active || this.active === 0) return
    this.uniforms.uTime.value = time
  }

  resize(width, height) {
    if (!this.uniforms) return
    this.uniforms.uResolution.value = [width, height]
  }

  destroy() {
    if (this.mesh) {
      this.scene.removeChild(this.mesh)
      this.mesh.geometry.dispose()
      this.mesh.program.dispose()
    }
  }
}

export default Loader
