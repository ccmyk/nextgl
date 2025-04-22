'use client'

import { Program, Mesh, Text } from 'ogl'
import gsap from 'gsap'

export class Title {
  constructor({ gl, scene, camera, element, bounds }) {
    // Same state management as legacy
    this.el = element
    this.scene = scene
    this.camera = camera
    this.bounds = bounds
    
    this.active = -1
    this.isready = 0
    this.stopt = 0

    // Same coordinate tracking as legacy
    this.coords = [0, 0]
    this.norm = [0, 0]
    this.end = [0, 0]
    this.lerp = 0.6

    // Same character tracking as legacy
    this.power = []
    this.positioncur = []
    this.positiontar = []
    this.actualChar = -2
    this.lastx = 0

    // Same uniforms setup as legacy
    this.uniforms = {
      tMap: { value: null },
      uTime: { value: 0 },
      uScreen: { value: [0, 0] },
      uMouse: { value: [0, 0] },
      uPower: { value: 0 },
      uCols: { value: 1.5 },
      uColor: { value: 0 },
      uStart: { value: 1 },
      uKey: { value: -2 },
      uPowers: { value: [] },
      uWidth: { value: [] },
      uHeight: { value: [] }
    }

    this.createGeometry()
    this.createMesh()
    this.initTimelines()
  }

  createGeometry() {
    // Create text geometry with same settings as legacy
    this.text = new Text(this.gl, {
      font: this.gl.msdfFont,
      text: this.el.dataset.text,
      width: 1000,
      align: 'center',
      letterSpacing: -0.05,
      size: 1,
      lineHeight: 1
    })
  }

  createMesh() {
    // Same program setup as legacy
    const program = new Program(this.gl, {
      vertex: /* glsl */`
        attribute vec3 position;
        attribute vec2 uv;
        attribute float id;
        
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        uniform float uTime;
        uniform vec2 uMouse;
        
        varying vec2 vUv;
        varying vec2 vUvR;
        varying float vId;
        
        void main() {
          vUv = uv;
          vUvR = position.xy;
          vId = id;
          
          vec3 pos = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragment: /* glsl */`
        precision highp float;
        
        uniform sampler2D tMap;
        uniform float uTime;
        uniform vec2 uMouse;
        uniform float uPower;
        uniform float uCols;
        uniform float uColor;
        uniform float uStart;
        uniform float uKey;
        uniform float uPowers[{{numChars}}];
        
        varying vec2 vUv;
        varying vec2 vUvR;
        varying float vId;
        
        float ripple(float uv, float time, float prog) {
          float distance = length((uv) + time);
          return tan(distance * (prog)) * (-0.01);
        }
        
        void main() {
          vec3 tex = texture2D(tMap, vUv).rgb;
          float signedDist = max(min(tex.r, tex.g), min(max(tex.r, tex.g), tex.b)) - 0.5;
          float d = fwidth(signedDist);
          float alpha = smoothstep(-d, d, signedDist);
          
          float time = abs(sin(uTime * 0.002));
          float time2 = sin(uTime * 0.001);
          float time3 = abs(sin(uTime * 0.001));
          float rippleUV = 0.0;
          float cols = uCols;
          float startshit = 0.0;
          float halfv = (vUvR.y - 1.0) * 7.0;
          float sumac = 0.0;
          
          highp int index = int(vId);
          float mPos = uPowers[index] * -2.0;
          float mPower = abs(uPowers[index] * (2.0 - abs(time2 * 0.5)));
          
          if (uKey == -2.0) {
            mPower = 1.0 - uStart;
            mPos = (uStart - 1.0) * 1.0;
            startshit = ((halfv * 0.001)) * uStart;
            sumac = ripple(vUvR.y, mPos, cols) * (0.4 * (1.0 - mPower + (1.0 * uPower)));
            rippleUV = (vUv.x + startshit) + sumac;
          } else {
            sumac = ripple(vUvR.y, mPos, cols) * (0.2 * (1.0 - mPower) * (1.0 - mPower));
            rippleUV = vUv.x + sumac;
          }
          
          tex = texture2D(tMap, vec2(rippleUV, vUv.y)).rgb;
          signedDist = max(min(tex.r, tex.g), min(max(tex.r, tex.g), tex.b)) - 0.5;
          d = fwidth(signedDist);
          alpha = smoothstep(-d, d, signedDist);
          
          gl_FragColor.rgb = vec3(uColor);
          gl_FragColor.a = alpha * (1.0 - uStart * 1.9);
          gl_FragColor.a -= abs(sumac * 8.0);
        }
      `.replace('{{numChars}}', this.text.text.length),
      uniforms: this.uniforms,
      transparent: true,
      cullFace: null,
      depthWrite: false
    })

    const mesh = new Mesh(this.gl, {
      geometry: this.text,
      program
    })

    this.program = program
    this.mesh = mesh

    if (this.scene) {
      this.scene.addChild(mesh)
    }
  }

  initTimelines() {
    // Mouse enter animation with exact same timing as legacy
    this.animin = gsap.timeline({ paused: true })
      .to(this.program.uniforms.uPower,
        {
          value: 1,
          duration: 0.36,
          ease: 'power4.inOut'
        }, 0)

    // Mouse leave animation with exact same timing as legacy
    this.animout = gsap.timeline({ paused: true })
      .to(this.program.uniforms.uPower,
        {
          value: 0,
          duration: 0.6,
          ease: 'none',
          onComplete: () => {
            this.program.uniforms.uKey.value = -1
          }
        }, 0)
  }

  // Continue with methods...

  start() {
    if (this.active === 1) return false
    if (this.active === -1) {
      // Exact same animation sequence as legacy
      const arr = this.el.dataset.nome ? [0.8, 2, 2] : [0.8, 2, 2]
      
      this.animstart = gsap.timeline({
        paused: true,
        onComplete: () => {
          this.tt?.classList.add('act')
          this.stopt = 1
          this.actualChar = -1
        }
      })
      .fromTo(this.program.uniforms.uStart,
        { value: 1 },
        {
          value: 0,
          duration: arr[0],
          ease: 'power4.inOut'
        }, 0)
      .fromTo(this.program.uniforms.uPower,
        { value: 0.5 },
        {
          value: 0,
          duration: arr[1],
          ease: 'power2.inOut'
        }, 0)
      .set(this.program.uniforms.uKey,
        {
          value: -1
        }, '>')

      this.animstart.play()
    }
    this.active = 1
  }

  stop() {
    if (this.animstart && this.animstart.progress() !== 1) {
      return false
    }
    if (this.active < 1) {
      return false
    }
    this.active = 0
  }

  // Character tracking exactly like legacy
  getChars() {
    this.chars = this.tt.querySelectorAll('.char')
    this.charw = []
    this.charsposw = []
    this.totalw = 0
    
    const arrw = []
    const arrh = []

    for (let i = 0; i < this.chars.length; i++) {
      const char = this.chars[i]
      
      this.positiontar.push(0.5)
      this.positioncur.push(0.5)

      this.charw.push(char.clientWidth)
      this.charsposw.push(this.totalw)
      this.totalw += char.clientWidth

      arrw.push(char.clientWidth)
      arrw.push(char.clientWidth)
      arrh.push(char.clientHeight)
    }

    this.program.uniforms.uWidth.value = arrw
    this.program.uniforms.uHeight.value = arrh
  }

  // Same character calculation as legacy
  calcChars(x, out = undefined) {
    this.lastx = x
    const arr = []
    
    if (out !== undefined) {
      for (let i = 0; i < this.chars.length; i++) {
        arr.push(out)
      }
    } else {
      for (let i = 0; i < this.chars.length; i++) {
        let tot = x - this.charsposw[i]
        tot = tot / this.charw[i]
        tot -= 0.5
        tot = Math.min(Math.max(tot, -0.5), 0.5)
        arr.push(tot)
      }
    }

    this.positiontar = arr
  }

  // Same lerp calculation as legacy
  lerpArr(value1, value2, t) {
    if (typeof value1 === 'number' && typeof value2 === 'number') {
      return value1 * (1 - t) + value2 * t
    }
    
    const len = Math.min(value1.length, value2.length)
    const out = new Array(len)
    for (let i = 0; i < len; i++) {
      out[i] = value1[i] * (1 - t) + value2[i] * t
    }
    return out
  }

  update(time) {
    if (!this.program || this.active === 2) return false

    this.end[0] = this.lerpArr(this.end[0], this.norm[0], this.lerp)
    
    this.program.uniforms.uMouse.value = [this.end[0], 0]
    this.program.uniforms.uTime.value = time

    this.positioncur = this.lerpArr(this.positioncur, this.positiontar, this.lerp)
    this.program.uniforms.uPowers.value = this.positioncur

    if (this.stopt === 0) {
      this.renderer.render({
        scene: this.scene,
        camera: this.camera
      })
    }
  }

  handleMouseEnter() {
    this.stopt = 0
    this.lerp = 0.03
    this.animout.pause()
    this.animin.play()
    this.lerp = 0.06
  }

  handleMouseMove(e) {
    const { layerX } = e
    this.calcChars(layerX)
  }

  handleMouseLeave(e) {
    const { layerX } = e
    this.lerp = 0.03
    const out = layerX < 60 ? 0.5 : -0.5
    this.calcChars(layerX, out)
    this.animin.pause()
  }

  resize(width, height) {
    if (!this.program) return
    
    const bounds = this.el.getBoundingClientRect()
    this.bound = [bounds.x, bounds.y, bounds.width, bounds.height]
    this.screen = [bounds.width, bounds.height]

    this.renderer.setSize(bounds.width, bounds.height)
    
    // Same camera setup as legacy
    this.camera.perspective({
      aspect: this.renderer.gl.canvas.clientWidth / this.renderer.gl.canvas.clientHeight
    })
    this.camera.fov = 45
    this.camera.position.set(0, 0, 7)

    const fov = this.camera.fov * (Math.PI / 180)
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z
    const width = height * this.camera.aspect
    
    this.viewport = [width, height]

    this.getChars()
  }

  destroy() {
    if (this.mesh) {
      this.scene.removeChild(this.mesh)
      this.mesh.geometry.dispose()
      this.mesh.program.dispose()
    }
  }
}

export default Title
