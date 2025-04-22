'use client'

import { Program, Mesh, Geometry, Vec2 } from 'ogl'
import gsap from 'gsap'

export class Background {
  constructor({ gl, scene }) {
    this.gl = gl
    this.scene = scene
    
    // Same state management as legacy
    this.active = -1
    this.isready = 0

    // Same uniforms as legacy for noise effect
    this.uniforms = {
      uResolution: { value: new Vec2(1, 1) },
      uTime: { value: 0 },
      uStart0: { value: 0 },
      uStart1: { value: 0 },
      uStart2: { value: 1 },
      uStartX: { value: 0 },
      uStartY: { value: 0 },
      uMultiX: { value: -0.25 },
      uMultiY: { value: 0.45 }
    }

    this.createMesh()
    this.initTimeline()
  }

  createMesh() {
    // Same geometry as legacy for full-screen quad
    const geometry = new Geometry(this.gl, {
      position: { 
        size: 2, 
        data: new Float32Array([-1, -1, 3, -1, -1, 3]) 
      },
      uv: { 
        size: 2, 
        data: new Float32Array([0, 0, 2, 0, 0, 2]) 
      }
    })

    // Program with same settings as legacy
    const program = new Program(this.gl, {
      vertex: /* glsl */`
        attribute vec2 position;
        attribute vec2 uv;
        
        uniform vec2 uResolution;
        
        varying vec2 vUv;
        
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 0, 1);
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
      transparent: true,
      depthTest: false,
      depthWrite: false
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
        this.active = 1
      }
    })

    this.timeline
      .fromTo(this.uniforms.uStart0,
        { value: 0 },
        {
          value: 1,
          duration: 1.2,
          ease: 'power4.inOut'
        }
      )
      .fromTo(this.uniforms.uStart1,
        { value: 0 },
        {
          value: 1,
          duration: 2,
          ease: 'power2.inOut'
        },
        0
      )
  }

  start() {
    if (this.active === 1) return
    this.active = 1
    this.timeline.play()
  }

  stop() {
    if (this.active === 0) return
    this.active = 0
    if (this.timeline) {
      this.timeline.reverse()
    }
  }

  update(time) {
    if (!this.active) return

    this.uniforms.uTime.value = time

    // Same noise pattern animation as legacy
    const t = time * 0.001
    this.uniforms.uStartX.value = Math.sin(t * 0.1) * 0.1
    this.uniforms.uStartY.value = Math.cos(t * 0.15) * 0.1
  }

  resize(width, height) {
    if (!this.uniforms) return
    
    this.uniforms.uResolution.value.set(width, height)
    
    // Update mesh scale to maintain full coverage
    if (this.mesh) {
      const aspectRatio = width / height
      if (aspectRatio > 1) {
        this.mesh.scale.x = aspectRatio
        this.mesh.scale.y = 1
      } else {
        this.mesh.scale.x = 1
        this.mesh.scale.y = 1 / aspectRatio
      }
    }
  }

  destroy() {
    if (this.mesh) {
      this.scene.removeChild(this.mesh)
      this.mesh.geometry.dispose()
      this.mesh.program.dispose()
    }
  }
}

export default Background
