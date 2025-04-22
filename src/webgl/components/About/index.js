'use client'

import { Program, Mesh, Post } from 'ogl'
import gsap from 'gsap'

export class About {
  constructor({ gl, scene, camera, element, bounds }) {
    this.name = 'About'
    this.gl = gl
    this.scene = scene
    this.camera = camera
    this.element = element
    this.bounds = bounds

    // Same state management as legacy
    this.active = -1
    this.isready = 0
    this.stopt = 0

    // Same scroll tracking as legacy
    this.ctr = {
      actual: 0,
      current: 0,
      limit: 0,
      start: 0,
      prog: 0,
      progt: 0,
      stop: 0
    }

    // Same mouse tracking as legacy
    this.norm = 0
    this.end = 0
    this.lerp = 0.6

    // MSDF Uniforms
    this.uniforms = {
      tMap: { value: null },
      uColor: { value: 0 }
    }

    // Post-processing uniforms for ripple effect
    this.postUniforms = {
      uTime: { value: 0.4 },
      uStart: { value: -1 },
      uMouseT: { value: 0.4 },
      uMouse: { value: -1 }
    }

    this.createMesh()
    this.createPost()
    this.initTimelines()
  }

  createMesh() {
    // MSDF program with same settings as legacy
    const program = new Program(this.gl, {
      vertex: /* glsl */`
        attribute vec3 position;
        attribute vec2 uv;
        
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        
        varying vec2 vUv;
        varying vec2 vUvR;
        
        void main() {
          vUv = uv;
          vUvR = position.xy;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragment: /* glsl */`
        precision highp float;
        
        uniform sampler2D tMap;
        uniform float uColor;
        
        varying vec2 vUv;
        varying vec2 vUvR;
        
        void main() {
          vec3 tex = texture2D(tMap, vUv).rgb;
          float signedDist = max(min(tex.r, tex.g), min(max(tex.r, tex.g), tex.b)) - 0.5;
          float d = fwidth(signedDist);
          float alpha = smoothstep(-d, d, signedDist);
          
          gl_FragColor.rgb = vec3(uColor);
          gl_FragColor.a = alpha;
        }
      `,
      uniforms: this.uniforms,
      transparent: true,
      cullFace: null,
      depthWrite: false
    })

    const mesh = new Mesh(this.gl, {
      geometry: this.createGeometry(),
      program
    })

    this.program = program
    this.mesh = mesh

    if (this.scene) {
      this.scene.addChild(mesh)
    }
  }

  createPost() {
    // Create post-processing pass with exact same effect as legacy
    this.post = new Post(this.gl)
    this.post.addPass({
      fragment: /* glsl */`
        precision highp float;
        
        uniform sampler2D tMap;
        uniform float uTime;
        uniform float uStart;
        uniform float uMouseT;
        uniform float uMouse;
        
        varying vec2 vUv;
        
        float ripple(float uv, float time, float prog, float multi) {
          float distance = length((uv * 3.0) + (time * 1.4));
          return tan(distance * (1.0)) * (multi * prog);
        }
        
        void main() {
          float timer = uStart;
          float centeredx = (vUv.x - 0.5) * 2.0;
          float centeredy = (vUv.y - 0.5) * 2.0;
          
          float rippleUV = (ripple(vUv.y, timer, 1.0 - abs(timer), -0.36) * (0.1 * (1.0 - abs(timer))));
          
          vec2 U = vec2(vUv.x, rippleUV + vUv.y);
          vec4 im = texture2D(tMap, U);
          
          if (rippleUV * -100.0 > centeredy + timer) {
            gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
          } else {
            gl_FragColor = vec4(im);
          }
        }
      `,
      uniforms: this.postUniforms
    })
  }

  initTimelines() {
    // Mouse animation with exact same timing as legacy
    this.animmouse = gsap.timeline({ paused: true })
      .fromTo(this.post.passes[0].program.uniforms.uMouse,
        { value: -1 },
        {
          value: 1.2,
          duration: 1,
          immediateRender: false,
          ease: 'none'
        }, 0)
    this.animmouse.progress(0)

    // Animation timeline with same timing as legacy
    this.animctr = gsap.timeline({ paused: true })
  }

  // Continue with methods...
