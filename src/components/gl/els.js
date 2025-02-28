// src/components/gl/els.js

import { useWebGLCanvas } from "@/components/gl/utils/SceneProvider";
import {
  Camera,
  Plane,
  Triangle,
  Mesh,
  Geometry,
  Texture,
  Text,
  Renderer,
  Transform,
  Program,
  Post,
  Vec2,
} from "ogl";

// ASSETS
import mapTexSrcD from "@/assets/fonts/PPNeueMontreal-Medium.png";
import jsonTexSrcD from "@/assets/fonts/PPNeueMontreal-Medium.json";

// LOADER ⌛️
import Loader from "@/components/gl/loader/base.js";
import LoaderF from "@/components/gl/loader/shaders/frag.main.glsl";
import LoaderV from "@/components/gl/loader/shaders/vert.main.glsl";

// OIS 🖼
import Base from "@/components/gl/ois/base.js";
import fractalF from "@/components/gl/ois/shaders/frag.main.glsl";
import fractalV from "@/components/gl/ois/shaders/vert.main.glsl";

// BG 🏜
import Bg from "@/components/gl/bg/base.js";
import BgF from "@/components/gl/bg/shaders/frag.main.glsl";
import BgV from "@/components/gl/bg/shaders/vert.main.glsl";

// TEXT 💬
import Tt from "@/components/gl/tt/base.js";
import textF from "@/components/gl/tt/shaders/frag.msdf.glsl";
import textV from "@/components/gl/tt/shaders/vert.msdf.glsl";

// FLAME 🔥
import TtF from "@/components/gl/ttf/base.js";
import textFF from "@/components/gl/ttf/shaders/frag.msdf.glsl";
import textpF from "@/components/gl/ttf/shaders/frag.parent.glsl";

// JUDGE 👩‍⚖️
import TtA from "@/components/gl/tta/base.js";
import textFA from "@/components/gl/tta/shaders/frag.msdf.glsl";
import textpA from "@/components/gl/tta/shaders/frag.parent.glsl";

// SLIDER 🎞️
import Sl from "@/components/gl/sl/base.js";
import SlF from "@/components/gl/sl/shaders/frag.main.glsl";
import SlV from "@/components/gl/sl/shaders/vert.main.glsl";
import SlPF from "@/components/gl/sl/shaders/frag.parent.glsl";

// ROLLER 🎢
import Roll from "@/components/gl/roll/base.js";
import SlSF from "@/components/gl/roll/shaders/frag.single.glsl";
import SlVF from "@/components/gl/roll/shaders/vert.single.glsl";

// PARTICLE GRID 🧮
import PG from "@/components/gl/pg/base.js";
import PGs from "@/components/gl/pg/shaders/frag.main.glsl";
import PGv from "@/components/gl/pg/shaders/vert.main.glsl";

export async function createMSDF() {
  let mapTexSrc = mapTexSrcD;
  let jsonTexSrc = jsonTexSrcD;

  if (process.env.NODE_ENV === "production") {
    mapTexSrc = "@/public/assets/fonts/PPNeueMontreal-Medium.png";
    jsonTexSrc = "@/public/assets/fonts/PPNeueMontreal-Medium.json";
  }

  let rt = [];
  //🔠🔠🔠🔠
  let fJson = await (await fetch(jsonTexSrc)).json();
  rt.push(fJson);
  //🔚🔚🔚🔚🔚
  return rt;
}

export async function createAssets(texs) {
  //💬💬💬💬💬💬
  const fntAss = await createMSDF();
  this.fontMSDF = fntAss[0];

  let mapTexSrc = mapTexSrcD;
  if (process.env.NODE_ENV === "production") {
    mapTexSrc = "@/public/assets/fonts/PPNeueMontreal-Medium.png";
  }

  this.fontTex = await this.loadImage(mapTexSrc);
}
export async function createEls(el = null, temp, canvasRef) {
  if (!el || !canvasRef?.current) return;

  const pos = el.dataset.oi;

  // 🅰️🅰️🅰️🅰️ Renderer Setup
  const renderer = new Renderer({
    alpha: true,
    dpr: Math.min(window.devicePixelRatio, 2),
    canvas: canvasRef.current,
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const { gl } = renderer;
  gl.canvas.classList.add('glF');

  // Ensure cCover is correctly placed
  const cover = el.parentNode.querySelector('.cCover');
  if (cover && !canvasRef.current.parentNode.contains(cover)) {
    cover.style.position = 'absolute';
    cover.style.pointerEvents = 'none';
    canvasRef.current.parentNode.appendChild(cover);
  }

  // 📽️📽️📽️📽️📽️📽️📽️📽️ Camera Setup
  const cam = this.createCamera(gl);

  // 🔠🔠🔠🔠 Text Setup
  let text;
  let siz = parseFloat(el.dataset.m) || 1;
  const letterSpacing = parseFloat(el.dataset.l) || 0;

  if (temp === 'foot') {
    text = new Text({
      font: this.fontMSDF,
      text: el.dataset.text,
      align: 'center',
      letterSpacing,
      size: siz,
      lineHeight: 1,
    });
  } else if (temp === 'about') {
    let br = ' ';
    let br2 = ' ';
    let w = (6.2 * siz) / 0.6;
    let l = 0.995;

    if (this.main.device < 2) {
      br = '\n';
      br2 = '\n';
      w = 13.1;
      l = 1.035;
    } else if (this.main.device === 2) {
      w = 7.5;
      l = 1.01;
      siz *= 0.77;
    }

    text = new Text({
      font: this.fontMSDF,
      text:
        'Enthusiastic about graphic design, typography, and the dynamic areas of motion and web-based animations.' +
        br +
        'Specialized in translating brands into unique and immersive digital' +
        br2 +
        'user experiences.',
      width: w,
      align: 'center',
      letterSpacing,
      size: siz,
      lineHeight: l,
    });
  } else {
    text = new Text({
      font: this.fontMSDF,
      text: el.dataset.text,
      align: 'center',
      letterSpacing,
      size: siz,
      lineHeight: 1,
    });
  }

  // 📐📐📐📐📐📐📐 Geometry Setup
  const geometry = new Geometry(gl, {
    position: { size: 3, data: text.buffers.position },
    uv: { size: 2, data: text.buffers.uv },
    id: { size: 1, data: text.buffers.id },
    index: { data: text.buffers.index },
  });
  geometry.computeBoundingBox();

  // 📺📺📺📺📺📺📺 Texture Setup
  const texTx = new Texture(gl, { generateMipmaps: false });
  texTx.image = this.fontTex;

  // 🎨🎨🎨 Program Setup
  let program;
  let shaderMod;
  if (temp === 'foot') {
    shaderMod = textFF.replaceAll('PITO', el.parentNode.querySelector('.Oiel').innerHTML.length);
    program = new Program(gl, {
      vertex: textV,
      fragment: shaderMod,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: 0 },
        tMap: { value: texTx },
      },
      transparent: true,
      cullFace: null,
      depthWrite: false,
    });
  } else if (temp === 'about') {
    shaderMod = textFA.replaceAll('PITO', el.parentNode.querySelector('.Oiel').innerHTML.length);
    program = new Program(gl, {
      vertex: textV,
      fragment: shaderMod,
      uniforms: {
        uTime: { value: 0 },
        uStart: { value: 1 },
        uColor: { value: 0 },
        tMap: { value: texTx },
      },
      transparent: true,
      cullFace: null,
      depthWrite: false,
    });
  } else {
    shaderMod = textF.replaceAll('PITO', el.parentNode.querySelector('.Oiel').innerHTML.length);
    program = new Program(gl, {
      vertex: textV,
      fragment: shaderMod,
      uniforms: {
        uTime: { value: 0 },
        uKey: { value: -2 },
        uPower: { value: 1 },
        uPowers: { value: [] },
        uWidth: { value: [] },
        uHeight: { value: [] },
        uCols: { value: 1.5 },
        uStart: { value: 1 },
        uColor: { value: 0 },
        tMap: { value: texTx },
        uMouse: { value: new Vec2(0, 0) },
      },
      transparent: true,
      cullFace: null,
      depthWrite: false,
    });
  }

  // 🟥🟥🟥 Mesh Setup
  const mesh = new Mesh(gl, { geometry, program });
  const scene = new Transform();
  mesh.setParent(scene);
  mesh.position.y = text.height * 0.58;

  // 📦📦📦 Post-processing Setup
  let post = null;
  if (temp === 'foot') {
    post = new Post(gl);
    post.addPass({
      fragment: textpF,
      uniforms: {
        uTime: { value: 0 },
        uStart: { value: 0 },
        uMouseT: { value: 0 },
        uMouse: { value: 0 },
        uOut: { value: 1 },
      },
    });
  } else if (temp === 'about') {
    post = new Post(gl);
    post.addPass({
      fragment: textpA,
      uniforms: {
        uTime: { value: 0.4 },
        uStart: { value: -1 },
        uMouseT: { value: 0.4 },
        uMouse: { value: -1 },
      },
    });
  }

  // Apply color if `data-white` attribute is set
  if (el.dataset.white) {
    program.uniforms.uColor.value = 1;
  }

  // 📌 Object Return
  const obj = {
    el,
    pos,
    renderer,
    mesh,
    text,
    post,
    scene,
    cam,
    touch: this.main.isTouch,
    canvas: gl.canvas,
  };

  if (temp === 'foot') return new TtF(obj);
  if (temp === 'about') return new TtA(obj);
  return new Tt(obj);

// 📌 Utility Function: Shader Program Creation
  function createShaderProgram(gl, vertexShader, fragmentShader, texTx, uniforms = {}) {
    return new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: 0 },
        tMap: { value: texTx },
        ...uniforms, // Allow additional uniforms
      },
      transparent: true,
      cullFace: null,
      depthWrite: false,
    });
  }
export async function createEls(el = null, temp, canvasRef) {
  if (!el || !canvasRef?.current) return;

  const pos = el.dataset.oi;
  const renderer = new Renderer({
    alpha: true,
    dpr: Math.min(window.devicePixelRatio, 2),
    canvas: canvasRef.current,
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const { gl } = renderer;
  gl.canvas.classList.add('glF');

  // 📽️ Camera Setup
  const cam = this.createCamera(gl);

  // 🔠 Text Setup
  let shaderMod;
  let text = new Text({
    font: this.fontMSDF,
    text: el.dataset.text || '',
    align: 'center',
    letterSpacing: parseFloat(el.dataset.l) || 0,
    size: parseFloat(el.dataset.m) || 1,
    lineHeight: 1,
  });

  // 📐 Geometry Setup
  const geometry = new Geometry(gl, {
    position: { size: 3, data: text.buffers.position },
    uv: { size: 2, data: text.buffers.uv },
    id: { size: 1, data: text.buffers.id },
    index: { data: text.buffers.index },
  });
  geometry.computeBoundingBox();

  // 📺 Texture Setup
  const texTx = new Texture(gl, { generateMipmaps: false });
  texTx.image = this.fontTex;

  // 🎨 Shader Program Setup
  let program;
  const textLength = el.parentNode.querySelector('.Oiel')?.innerHTML.length || 0;

  if (temp === 'about') {
    shaderMod = textFA.replaceAll('PITO', textLength);
    program = createShaderProgram(gl, textV, shaderMod, texTx, { uStart: { value: 1 } });
  } else {
    shaderMod = textF.replaceAll('PITO', textLength);
    program = createShaderProgram(gl, textV, shaderMod, texTx, {
      uKey: { value: -2 },
      uPower: { value: 1 },
      uPowers: { value: [] },
      uWidth: { value: [] },
      uHeight: { value: [] },
      uCols: { value: 1.5 },
      uStart: { value: 1 },
      uMouse: { value: new Vec2(0, 0) },
    });
  }

  // 🟥 Mesh Setup
  const mesh = new Mesh(gl, { geometry, program });
  const scene = new Transform();
  mesh.setParent(scene);
  mesh.position.y = text.height * 0.58;

  // 📦 Post-processing Setup
  let post = null;
  if (temp === 'foot' || temp === 'about') {
    post = new Post(gl);
    post.addPass({
      fragment: temp === 'foot' ? textpF : textpA,
      uniforms: {
        uTime: { value: temp === 'about' ? 0.4 : 0 },
        uStart: { value: temp === 'about' ? -1 : 0 },
        uMouseT: { value: temp === 'about' ? 0.4 : 0 },
        uMouse: { value: temp === 'about' ? -1 : 0 },
        uOut: { value: 1 },
      },
    });
  }

  // Apply color if `data-white` attribute is set
  if (el.dataset.white) {
    program.uniforms.uColor.value = 1;
  }

  // 📌 Object Return
  const obj = {
    el,
    pos,
    renderer,
    mesh,
    text,
    post,
    scene,
    cam,
    touch: this.main.isTouch,
    canvas: gl.canvas,
  };

  if (temp === 'foot') return new TtF(obj);
  if (temp === 'about') return new TtA(obj);
  return new Tt(obj);
}
  return new Bg(obj);
}

// 🎢 Roll Section
if (temp === 'roll') {
  const parent = document.querySelector('.cRoll');
  const renderer = new Renderer({
    alpha: true,
    dpr: Math.max(window.devicePixelRatio, 2),
    width: parent.offsetWidth,
    height: parent.offsetHeight,
  });

  const { gl } = renderer;
  const scene = new Transform();

  gl.canvas = canvasRef.current;
  gl.canvas.classList.add('glRoll');

  // 📐 Geometry
  const geometry = new Triangle(gl);

  // 🎞️ Load Textures
  const textures = [];
  const medias = parent.parentNode.querySelectorAll('video,img');

  for (let a of medias) {
    const texture = new Texture(gl, { generateMipmaps: false });
    const url = a.dataset.src || a.dataset.oi;
    let existingTexture = this.texs.find((element) => element.src === url);

    if (process.env.NODE_ENV === 'development') {
      existingTexture = url.includes('.mp4') ? this.texs[0] : this.texs[2];
    }

    texture.image = existingTexture ? existingTexture : (url.includes('.mp4')
      ? await this.loadVideo(a, url)
      : await this.loadImage(url));

    textures.push(texture);
  }

  // 🎛️ Shader Program
  const program = new Program(gl, {
    vertex: SlVF,
    fragment: SlSF,
    uniforms: {
      uStart: { value: 0 },
      uEnd: { value: 0 },
      uPos: { value: 0 },
      uChange: { value: 0 },
      tMap: { value: textures[0] },
      tMap2: { value: textures[0] },
      uCover: { value: new Vec2(0, 0) },
      uTextureSize: { value: new Vec2(0, 0) },
      uTextureSize2: { value: new Vec2(0, 0) },
    },
  });

  const mesh = new Mesh(gl, { geometry, program });

  const obj = {
    el,
    pos,
    renderer,
    mesh,
    medias,
    textures,
    canvas: gl.canvas,
  };

  return new Roll(obj);
}

// 🎞️ Slider Section
if (temp === 'slider') {
  const renderer = new Renderer({
    alpha: true,
    dpr: Math.max(window.devicePixelRatio, 2),
    width: el.offsetWidth,
    height: el.offsetWidth,
  });

  const { gl } = renderer;
  const scene = new Transform();

  gl.canvas = canvasRef.current;
  gl.canvas.classList.add('glSlider');

  const cover = el.parentNode.querySelector('.cCover');
  if (cover && !canvasRef.current.parentNode.contains(cover)) {
    cover.appendChild(gl.canvas);
  }

  // 📽️ Camera
  const cam = this.createCamera(gl);

  // 📐 Geometry
  const geometry = new Plane(gl, {
    heightSegments: 1,
    widthSegments: 1,
  });

  // 🎞️ Load Textures
  const textures = [];
  const meshes = [];
  const medias = el.parentNode.querySelectorAll('video,img');

  for (let a of medias) {
    const texture = new Texture(gl, { generateMipmaps: false });
    const url = a.dataset.src || a.dataset.oi;
    let existingTexture = this.texs.find((element) => element.src === url);

    if (process.env.NODE_ENV === 'development') {
      existingTexture = url.includes('.mp4') ? this.texs[0] : this.texs[2];
    }

    texture.image = existingTexture ? existingTexture : (url.includes('.mp4')
      ? await this.loadVideo(a, url)
      : await this.loadImage(url));

    textures.push(texture);

    // 🎛️ Shader Program
    const program = new Program(gl, {
      vertex: SlV,
      fragment: SlF,
      uniforms: {
        uStart: { value: 0 },
        uTime: { value: 0 },
        tMap: { value: texture },
        uCover: { value: new Vec2(0, 0) },
        uTextureSize: { value: new Vec2(0, 0) },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });
    mesh.setParent(scene);
    meshes.push(mesh);
  }

  // 🌀 Post Processing Effect
  let post = null;
  if (true) {
    post = new Post(gl);
    post.addPass({
      fragment: SlPF,
      uniforms: {
        uTime: { value: 0 },
        uStart: { value: 0 },
        uHover: { value: 0 },
      },
    });
  }
}
    const obj = {
      el,
      pos,
      renderer,
      scene,
      meshes,
      medias,
      textures,
      post,
      cam,
      canvas: gl.canvas,
      dev: this.main.device,
      // singledad,
      // singlewatch,
      // renderersingle,
      // meshsingle,
      // texturesingle,
    };
    return new Sl(obj);
  } else if (temp === 'pg') {
    //🧮🧮🧮🧮🧮🧮

    const renderer = new Renderer({
      alpha: true,
      dpr: Math.max(window.devicePixelRatio, 2),

      width: window.innerWidth,
      height: el.innerHeight,
    });
    //📐📐📐📐📐📐📐

    const canvasRef = useWebGLCanvas();

    const { gl } = renderer;

    gl.canvas = canvasRef.current;
    gl.canvas.classList.add('glPlay');;

    //📽️📽️📽️📽️📽️📽️📽️📽️
    const cam = this.createCamera(gl);
    const scene = new Transform();

    const geometry = new Plane(gl, {
      heightSegments: 1,
      widthSegments: 1,
    });

    //📺📺📺📺📺📺📺
    const texture = new Texture(gl, {
      generateMipmaps: false,
    });

    const obj = {
      el,
      pos,
      cam,
      // mesh,
      renderer,
      texture,
      scene,
      geometry,
      // program,
      canvas: gl.canvas,
      touch: this.main.isTouch,
      device: this.main.device,
      rev: this.main.events.anim,
    };

    return new PG(obj);
  } else if (temp === 'pgel') {
    const obj = {
      el,
      pgid: el.dataset.pg,
      pos: document.querySelector('.Oi-pg').dataset.oi,
    };
    return obj;
  } else {
    //🖼️🖼️🖼️🖼️🖼️🖼️

    const renderer = new Renderer({
      alpha: true,
      dpr: Math.max(window.devicePixelRatio, 2),

      width: el.offsetWidth,
      height: el.offsetHeight,
    });
    //📐📐📐📐📐📐📐

      const { gl } = renderer;
      gl.canvas = canvasRef.current; //
      gl.canvas.classList.add('glMedia');

      if (!el.parentNode.contains(gl.canvas)) {
        el.parentNode.appendChild(gl.canvas); //
      }

    const geometry = new Triangle(gl, {
      heightSegments: 1,
      widthSegments: 1,
    });

    //📺📺📺📺📺📺📺
    const texture = new Texture(gl, {
      generateMipmaps: false,
    });

    let url = el.dataset.src;

    let exists = this.texs.find((element) => element.src === url);

    if (process.env.NODE_ENV === 'development') {
      if (url.includes('.mp4')) {
        exists = this.texs[0];
      } else {
        exists = this.texs[2];
      }
    }

    if (url.includes('.mp4')) {
      if (exists) {
        texture.image = exists;
      } else {
        console.log('no fun');
        texture.image = await this.loadVideo(el.parentNode.querySelector('video'), url);
      }
    } else {
      if (exists) {
        texture.image = exists;
      } else {
        console.log('no fun');
        texture.image = await this.loadImage(url);
      }
    }

    const program = new Program(gl, {
      vertex: fractalV,
      fragment: fractalF,
      uniforms: {
        uTime: { value: 0 },
        uStart: { value: 0 },
        uStart1: { value: 0.5 },
        tMap: { value: texture },
        uCover: { value: new Vec2(0, 0) },
        uTextureSize: { value: new Vec2(texture.image.naturalWidth, texture.image.naturalHeight) },
        uMouse: { value: new Vec2(0, 0) },
      },
    });
    const mesh = new Mesh(gl, { geometry, program });

    const obj = {
      el,
      pos,
      mesh,
      renderer,
      texture,
      canvas: gl.canvas,
      touch: this.main.isTouch,
    };

    return new Base(obj);
  }
}
