'use client'

import { Program, Mesh, Post, Texture, Vec2 } from 'ogl'
import gsap from 'gsap'

// Utility functions ported from position.js
function lerp(start, end, amt) {
  return (1 - amt) * start + amt * end
}

function clamp(min, max, number) {
  return Math.max(min, Math.min(number, max))
}

export class Slides {
  constructor({ gl, scene, camera, element, bounds, device, textures, meshes, medias }) {
    this.name = 'Slides'
    this.gl = gl
    this.scene = scene
    this.camera = camera
    this.element = element
    this.bounds = bounds
    this.device = device || 0
    this.meshes = meshes || []
    this.medias = medias || []
    this.textures = textures || []
    this.canvas = gl.canvas

    // Single view element reference
    this.singleId = this.element?.dataset?.ids || 0
    this.single = document.querySelector(`.single[data-ids="${this.singleId}"]`)
    
    if (this.single) {
      this.single.style.opacity = 0
    }

    // State management from original implementation
    this.active = -1
    this.isready = 0
    this.oldpos = 0
    this.statepos = 0
    this.state = 0
    this.ishovered = 0
    this.change = 0
    this.stopt = 0
    this.time = null

    // Mouse tracking from original implementation
    this.norm = 0
    this.end = 0
    this.lerp = 0.6

    // Position tracking from original implementation
    this.posmesh = 0
    this.posmeshes = []
    this.objpos = { x: 0, target: 0, timer: 0 }

    // Scroll tracking from original implementation
    this.ctr = {
      actual: 0,
      current: 0,
      limit: 0,
      start: 0,
      prog: 0,
      progt: 0,
      stop: 0,
    }

    // If first slide, add special class
    if (this.singleId == 0) {
      this.canvas.classList.add('fCanvas')
    }

    // Setup animations and events
    this.initTimelines()
    this.initEvents()

    // Initially hide canvas, will be shown when active
    gsap.set(this.canvas, { display: 'none' })
  }

  initTimelines() {
    // Animation for hovering over slides
    this.animhover = gsap.timeline({ paused: true })
    
    if (this.device < 3) {
      this.animhover.to(this.post?.passes[0]?.program.uniforms.uHover, {
        value: 1,
        duration: 1,
        ease: 'power2.inOut'
      }, 0)
    }

    // Main animation controller
    this.animctr = gsap.timeline({ paused: true })
    
    if (this.singleId != 0) {
      this.animctr
        .fromTo(this.objpos, 
          { timer: 0 }, 
          {
            timer: 1,
            duration: 0.1,
            ease: 'power2.inOut',
            onUpdate: () => {
              if (this.slideanim) {
                this.slideanim.timeScale(this.objpos.timer)
              }
            }
          }, 0)
        .fromTo(this.post?.passes[0]?.program.uniforms.uStart, 
          { value: 1.5 }, 
          { value: 0, duration: 0.45 }, 0)
    } else {
      // Special intro animation for first slide
      this.animin = gsap.timeline({
        paused: true,
        delay: 0.1,
        onStart: () => {
          this.active = 1
          
          for (let a of this.textures) {
            if (a.image.tagName === 'VIDEO') {
              a.image.play()
            }
          }
          
          this.slideanim.play()
        },
        onComplete: () => {
          delete this.animin
        }
      })
      .fromTo(this.canvas, 
        {
          webkitFilter: 'blur(6px)',
          filter: 'blur(6px)'
        },
        {
          webkitFilter: 'blur(0px)',
          filter: 'blur(0px)',
          duration: 0.8,
          ease: 'power2.inOut'
        }, 0)
      .fromTo(this.canvas, 
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.6,
          ease: 'power2.inOut'
        }, 0)
      .fromTo(this.objpos, 
        { timer: 0 },
        {
          timer: 1,
          duration: 0.9,
          ease: 'none',
          onUpdate: () => {
            if (this.slideanim) {
              this.slideanim.timeScale(this.objpos.timer)
            }
          }
        }, 0.8)
      .fromTo(this.post?.passes[0]?.program.uniforms.uStart, 
        { value: 1.5 },
        { value: 0, duration: 2, ease: 'power4.inOut' }, 0.6)
    }

    // Final part of animation sequence
    this.animctr
      .fromTo(this.objpos, 
        { timer: 1 },
        {
          timer: 0,
          duration: 0.05,
          ease: 'power2.inOut',
          onUpdate: () => {
            if (this.slideanim) {
              this.slideanim.timeScale(this.objpos.timer)
            }
          }
        }, 0.95)
        
    // Animation for single slide view
    this.animsinglectr = gsap.timeline({ paused: true })
  }

  // Create post-processing effect
  createPost() {
    if (!this.gl) return
    
    this.post = new Post(this.gl)
    this.post.addPass({
      fragment: /* glsl */`
        precision highp float;
        
        uniform sampler2D tMap;
        uniform float uTime;
        uniform float uStart;
        uniform float uHover;
        
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
      uniforms: {
        uTime: { value: 0 },
        uStart: { value: 0 },
        uHover: { value: 0 }
      }
    })
  }

  // Initialize slide meshes
  initSlides() {
    // Configure slide size and spacing
    if (this.device < 3) {
      this.wel = this.bounds[2] * 0.322
    } else {
      this.wel = this.bounds[2] * 0.75
    }

    // Set up container for slide positions
    this.posmeshes = []
    
    // Calculate space between slides
    this.space = parseFloat(
      window.getComputedStyle(
        this.element.parentNode.parentNode.querySelector('.nfo_t'), null
      ).getPropertyValue('padding-left')
    )
    
    // Calculate position limits
    this.firstpos = 0
    this.minpos = this.wel * -1
    this.maxpos = (this.meshes.length - 1) * (this.wel + this.space)
    this.totalpos = (this.meshes.length) * (this.wel + this.space)
    
    // Setup slide textures
    for (let [i, a] of this.medias.entries()) {
      if (a.tagName === 'VIDEO') {
        this.meshes[i].program.uniforms.uTextureSize.value = [a.width, a.height]
      } else {
        this.meshes[i].program.uniforms.uTextureSize.value = [
          this.textures[i].image.naturalWidth,
          this.textures[i].image.naturalHeight
        ]
      }
    }

    // Setup slide animation
    this.slideanim = gsap.timeline({
      paused: true,
      repeat: -1,
      onRepeat: () => {
        this.resetMeshes()
        this.statepos = 0
      }
    })
    .fromTo(this.objpos, { x: 0 }, { x: 1, ease: 'none', duration: 42 }, 0)
  }

  // Initialize event listeners
  initEvents() {
    // Mouse hover events
    if (this.device < 2) {
      this.element.parentNode.onmouseenter = () => {
        this.animhover.timeScale(1)
        this.animhover.play()
        this.ishovered = 1
      }

      this.element.parentNode.onmouseleave = () => {
        this.animhover.pause()
        this.animhover.timeScale(0.7)
        this.animhover.reverse()
        this.ishovered = 0
      }
    }

    // Visibility change handling
    this.checkVis = (e) => {
      if (this.active !== 1 && this.active !== -2) {
        return false
      }

      if (document.visibilityState === 'hidden') {
        this.active = -2
        this.slideanim.pause()
        this.slideanim.progress(0)
        this.resetMeshes()
        this.statepos = 0
      } else {
        this.active = 1
        this.slideanim.restart()
        this.slideanim.play()
      }
    }

    document.addEventListener('visibilitychange', (e) => this.checkVis(e))
  }

  // Reset mesh positions
  resetMeshes() {
    for (let [i, a] of this.meshes.entries()) {
      this.posmeshes[i] = ((this.wel + this.space)) * i
      a.position.x = -(this.viewport[0] / 2) + (a.scale.x / 2) + 
        ((this.posmeshes[i]) / this.screen[0]) * this.viewport[0]
    }
  }

  // Update slide positions horizontally
  updateX(sum = 0) {
    this.statepos = (this.objpos.x * this.totalpos) / 1
    
    let x = 0
    for (let [i, a] of this.meshes.entries()) {
      x = this.posmeshes[i]
      x -= this.statepos
      
      if (x <= this.minpos) {
        this.posmeshes[i] = this.statepos + this.maxpos + this.space
      }

      a.position.x = -(this.viewport[0] / 2) + (a.scale.x / 2) + 
        ((x) / this.screen[0]) * this.viewport[0]
    }
  }

  // Update slide positions vertically
  updateY(y = 0, state = 0) {
    if (this.ctr.stop !== 1) {
      this.ctr.current = y - this.ctr.start
      this.ctr.current = clamp(0, this.ctr.limit, this.ctr.current)
    }
  }

  // Update animation progress
  updateAnim() {
    this.ctr.progt = (this.ctr.current / this.ctr.limit).toFixed(3)
    
    if (this.active === -2) {
      this.ctr.prog = this.ctr.progt
    } else {
      this.ctr.prog = lerp(this.ctr.prog, this.ctr.progt, 0.015)
    }
    
    this.animctr.progress(this.ctr.prog)
  }

  // Update slide scales
  updateScale() {
    let w = this.screen[0] * 0.322
    let h = this.bounds[3]
    
    if (this.device < 3) {
      w = this.screen[0] * 0.322
    } else {
      w = this.screen[0] * 0.75
    }

    for (let [i, a] of this.meshes.entries()) {
      a.scale.x = this.viewport[0] * w / this.screen[0]
      a.scale.y = this.viewport[1] * h / this.screen[1]
      
      // Update uniform for cover sizing
      if (this.meshes[i].program.uniforms.uCover) {
        this.meshes[i].program.uniforms.uCover.value = [w, this.element.clientHeight]
      }
    }
  }

  // Handle when element becomes visible
  check(entry) {
    let vis = false
    vis = entry.isIntersecting

    if (vis === 1) {
      this.start(entry)
    } else if (vis === 0) {
      this.stop(entry)
    }
    
    return vis
  }

  // Start slide animation
  start(entry) {
    if (this.state === 1) {
      if (this.single) {
        if (this.oldpos > window.scrollY) {
          // We're scrolling up
          if (entry.boundingClientRect.y > 60) {
            this.single.style.pointerEvents = 'all'
          }
        } else {
          // We're scrolling down
          if (entry.boundingClientRect.y > 60) {
            this.single.style.pointerEvents = 'all'
          } else {
            this.single.style.pointerEvents = 'none'
          }
        }

