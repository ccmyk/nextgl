'use client'

const { Program, Mesh, Post } = dynamic(() => import('ogl'), { ssr: false });
import gsap from 'gsap';
import {
  check,
  start,
  stop,
  updateX,
  updateY,
  updateAnim
} from './geometry';
import vertexShader   from './shaders/msdf.vert.glsl';
import fragmentShader from './shaders/msdf.frag.glsl';
import parentShader   from './shaders/parent.frag.glsl';

export default class Footer {
  constructor({ gl, scene, camera, element, renderer, touch = 0 }) {
    this.name     = 'Footer';
    this.gl       = gl;
    this.scene    = scene;
    this.camera   = camera;
    this.element  = element;     // <div class="ttj Oiel">
    this.renderer = renderer;
    this.touch    = touch;

    // legacy state
    this.active = -1;
    this.ctr    = { actual:0, current:0, limit:0, start:0, prog:0, progt:0, stop:0 };
    this.norm   = 0;
    this.end    = 0;
    this.lerpVal= 0.6;
    this.stopt  = 0;

    this.createMesh();
    this.createPost();
    this.initTimelines();
    this.initEvents();
  }

  createMesh() {
    this.program = new Program(this.gl, {
      vertex:   vertexShader,
      fragment: fragmentShader,
      uniforms: {
        tMap:   { value: null },
        uColor: { value: 0 },
        uTime:  { value: 0 },
        uStart: { value: 0.8 }
      },
      transparent: true,
      depthWrite:  false,
      cullFace:    null,
    });

    this.mesh = new Mesh(this.gl, {
      geometry: this.createGeometry(this.gl),
      program:  this.program
    });
    this.scene.addChild(this.mesh);
  }

  createGeometry(gl) {
    // same as legacy: MSDF text geometry built elsewhere
    // here we assume element has been measured into buffers
    // for brevity, delegate to OGL Text in hook instead
    return this.mesh.geometry;
  }

  createPost() {
    this.post = new Post(this.gl);
    this.post.addPass({
      fragment: parentShader,
      uniforms: {
        uTime:   { value: 0 },
        uStart:  { value: 0.8 },
        uMouseT: { value: 0.2 },
        uMouse:  { value: 0.39 },
        uOut:    { value: 0 }
      },
    });
  }

  initTimelines() {
    // scroll animation timeline
    this.animctr = gsap.timeline({ paused: true })
      .fromTo(this.post.passes[0].program.uniforms.uTime,
              { value: 0 }, { value: 2, duration: 0.3, ease:'power2.inOut' }, 0)
      .fromTo(this.post.passes[0].program.uniforms.uTime,
              { value: 2 }, { value: 0, duration: 0.3, ease:'power2.inOut' }, 0.7)
      .fromTo(this.post.passes[0].program.uniforms.uStart,
              { value: 0.39 }, { value: 0.8, duration: 1, ease:'power2.inOut' }, 0);

    // mouse ripple timeline
    this.animmouse = gsap.timeline({ paused: true })
      .fromTo(this.post.passes[0].program.uniforms.uMouseT,
              { value: 0.2 }, { value: 2, duration: 0.3, ease:'power2.inOut' }, 0.1)
      .fromTo(this.post.passes[0].program.uniforms.uMouseT,
              { value: 2 }, { value: 0, duration: 0.3, ease:'power2.inOut' }, 0.7)
      .fromTo(this.post.passes[0].program.uniforms.uMouse,
              { value: 0.39 }, { value: 0.8, duration: 0.9, ease:'none' }, 0.1);
    this.animmouse.progress(0);
  }

  initEvents() {
    const tt = this.element;
    new window.SplitType(tt, { types:'chars,words' });

    this.inFn = () => { this.stopt = 0; this.lerpVal = 0.02 };
    this.mvFn = e => {
      const y = e.touches 
        ? e.touches[0].pageY - this.bound[1]
        : e.layerY;
      this.norm = Math.min(Math.max(y / this.bound[3], 0), 1);
    };
    this.lvFn = () => { this.lerpVal = 0.01 };

    if (this.touch === 0) {
      tt.onmouseenter = this.inFn;
      tt.onmousemove  = this.mvFn;
      tt.onmouseleave = this.lvFn;
    }
  }

  onResize(viewport, screen) {
    const rect = this.element
      .parentNode.querySelector('.cCover')
      .getBoundingClientRect();
    this.bound = [rect.x, rect.y, rect.width, rect.height];

    this.ctr.start = rect.y - screen.h + window.scrollY + rect.height * 0.5;
    this.ctr.limit = this.element.clientHeight + rect.height * 0.5;

    this.renderer.setSize(rect.width, rect.height);
    this.camera.perspective({
      aspect: this.gl.canvas.clientWidth / this.gl.canvas.clientHeight
    });

    const fov    = this.camera.fov * Math.PI/180;
    const height = 2 * Math.tan(fov/2) * this.camera.position.z;
    const width  = height * this.camera.aspect;
    this.viewport = [width, height];

    // initial render
    this.renderer.render({ scene: this.scene, camera:this.camera });
  }

  removeEvents() {
    this.active = -2;
    gsap.timeline({
      onUpdate:   () => this.post.render({ scene: this.mesh }),
      onComplete: () => {
        this.gl.getExtension('WEBGL_lose_context').loseContext();
        this.renderer.canvas.remove();
      }
    })
    .to(this.post.passes[0].program.uniforms.uOut,
        { value:-0.2, duration:1, ease:'power2.inOut' }, 0)
    .to(this.renderer.canvas,
        { opacity:0, duration:0.8, ease:'none' }, 0.2);
  }

  update(time, _, pos) {
    if (this.active !== 1) return false;
    this.end = this.end * (1 - this.lerpVal) + this.norm * this.lerpVal;
    this.animmouse.progress(this.end);

    if (this.ctr.actual !== pos) {
      this.ctr.actual = pos;
      this.updateY(pos);
    }
    if (this.ctr.stop !== 1) {
      this.updateAnim();
    }
    if (this.stopt === 0) {
      this.post.render({ scene: this.mesh });
    }
    return true;
  }
}

// wire up geometry helpers
Footer.prototype.check     = check;
Footer.prototype.start     = start;
Footer.prototype.stop      = stop;
Footer.prototype.updateX   = updateX;
Footer.prototype.updateY   = updateY;
Footer.prototype.updateAnim= updateAnim;