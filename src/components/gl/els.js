// src/components/gl/els.js
"use client";

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

// Import position utilities for each component
import * as basePosition from "@/components/gl/base/position";
import * as bgPosition from "@/components/gl/bg/position";
import * as footerPosition from "@/components/gl/footer/position";
import * as loaderPosition from "@/components/gl/loader/position";
import * as pgPosition from "@/components/gl/pg/position";
import * as rollPosition from "@/components/gl/roll/position";
import * as slidesPosition from "@/components/gl/slides/position";
import * as titlePosition from "@/components/gl/title/position";
import * as ttaPosition from "@/components/gl/tta/position";

// LOADER ⌛️
// import Loader from "@/components/gl/loader/Loader.jsx";
import LoaderF from "@/components/gl/loader/shaders/frag.main.glsl";
import LoaderV from "@/components/gl/loader/shaders/vert.main.glsl";

// BASE 🖼
//import Base from "@/components/gl/base/Base.jsx";
import fractalF from "@/components/gl/base/shaders/frag.main.glsl";
import fractalV from "@/components/gl/base/shaders/vert.main.glsl";

// BACKGROUND 🏜
// import Bg from "@/components/gl/bg/Bg.jsx";
import BgF from "@/components/gl/bg/shaders/frag.main.glsl";
import BgV from "@/components/gl/bg/shaders/vert.main.glsl";

// TITLE 💬
// import Tt from "@/components/gl/title/title.jsx";
import textF from "@/components/gl/title/shaders/frag.msdf.glsl";
import textV from "@/components/gl/title/shaders/vert.msdf.glsl";

// FOOTER 🔥
// import TtF from "@/components/gl/footer/Footer.jsx";
import textFF from "@/components/gl/footer/shaders/frag.msdf.glsl";
import textpF from "@/components/gl/footer/shaders/frag.parent.glsl";

// ABOOUT 👩‍⚖️
// import TtA from "@/components/gl/tta/About.jsx";
import textFA from "@/components/gl/tta/shaders/frag.msdf.glsl";
import textpA from "@/components/gl/tta/shaders/frag.parent.glsl";

// SLIDES 🎞️
// import Slides from "@/components/gl/slides/Slides.jsx";
import SlF from "@/components/gl/slides/shaders/frag.main.glsl";
import SlV from "@/components/gl/slides/shaders/vert.main.glsl";
import SlPF from "@/components/gl/slides/shaders/frag.parent.glsl";

// ROLL 🎢
// import Roll from "@/components/gl/roll/Roll.jsx";
import SlSF from "@/components/gl/roll/shaders/frag.main.glsl";
import SlVF from "@/components/gl/roll/shaders/vert.main.glsl";

// Map of position modules for each component type
const positionModules = {
  base: basePosition,
  bg: bgPosition,
  footer: footerPosition,
  loader: loaderPosition,
  pg: pgPosition,
  roll: rollPosition,
  slides: slidesPosition,
  title: titlePosition,
  tta: ttaPosition
};

// FONT LOADING
export async function createMSDF() {
  let mapTexSrc = mapTexSrcD;
  let jsonTexSrc = jsonTexSrcD;

  if (process.env.NODE_ENV === "production") {
    mapTexSrc = "@/public/assets/fonts/PPNeueMontreal-Medium.png";
    jsonTexSrc = "@/public/assets/fonts/PPNeueMontreal-Medium.json";
  }

  let rt = [];
  // 🔠🔠🔠 Load font JSON
  let fJson = await (await fetch(jsonTexSrc)).json();
  rt.push(fJson);
  // 🔚🔚🔚🔚
  return rt;
}

export async function createAssets() {
  // 💬💬💬 Preload font assets
  const fntAss = await createMSDF();
  this.fontMSDF = fntAss[0];

  let mapTexSrc = mapTexSrcD;
  if (process.env.NODE_ENV === "production") {
    mapTexSrc = "@/public/assets/fonts/PPNeueMontreal-Medium.png";
  }

  this.fontTex = await this.loadImage(mapTexSrc);
}

// ELEMENT CREATION
export async function createEls(el = null, temp, canvasRef) {
  if (!el || !canvasRef?.current) return;

  const pos = el.dataset.oi;

  // Renderer Setup
  const renderer = new Renderer({
    alpha: true,
    dpr: Math.min(window.devicePixelRatio, 2),
    canvas: canvasRef.current,
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const { gl } = renderer;
  gl.canvas.classList.add("glF");

  // Ensure cCover is correctly placed
  const cover = el.parentNode.querySelector(".cCover");
  if (cover && !canvasRef.current.parentNode.contains(cover)) {
    cover.style.position = "absolute";
    cover.style.pointerEvents = "none";
    canvasRef.current.parentNode.appendChild(cover);
  }

  // Camera Setup
  const cam = new Camera(gl, { fov: 45 });

  // Text Setup
  let textSize = parseFloat(el.dataset.m) || 1;
  const letterSpacing = parseFloat(el.dataset.l) || 0;

  const text = new Text({
    font: this.fontMSDF,
    text: el.dataset.text,
    align: "center",
    letterSpacing,
    size: textSize,
    lineHeight: 1,
  });

  // Geometry Setup
  const geometry = new Geometry(gl, {
    position: { size: 3, data: text.buffers.position },
    uv: { size: 2, data: text.buffers.uv },
    id: { size: 1, data: text.buffers.id },
    index: { data: text.buffers.index },
  });
  geometry.computeBoundingBox();

  // Texture Setup
  const texTx = new Texture(gl, { generateMipmaps: false });
  texTx.image = fontTex;

  // Shader Selection
  let vertexShader, fragmentShader;
  switch (temp) {
    case "loader":
      vertexShader = LoaderV;
      fragmentShader = LoaderF;
      break;
    case "bg":
      vertexShader = BgV;
      fragmentShader = BgF;
      break;
    case "pg":
      vertexShader = pgV;
      fragmentShader = pgF;
      break;
    case "title":
      vertexShader = textV;
      fragmentShader = textF;
      break;
    case "footer":
      vertexShader = textV;
      fragmentShader = textFF;
      break;
    case "tta":
      vertexShader = textV;
      fragmentShader = textFA;
      break;
    default:
      console.warn(`No shader assigned for ${temp}`);
  }

  // Shader Program Setup
  const program = new Program(gl, {
    vertex: vertexShader,
    fragment: fragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uKey: { value: -2 },
      uPower: { value: 1 },
      tMap: { value: texTx },
    },
    transparent: true,
    cullFace: null,
    depthWrite: false,
  });

  // Mesh Setup
  const mesh = new Mesh(gl, { geometry, program });
  const scene = new Transform();
  mesh.setParent(scene);

  // Post Processing Setup
  let post = null;
  if (temp === "foot" || temp === "about") {
    post = new Post(gl);
    post.addPass({
      fragment: temp === "foot" ? textpF : textpA,
      uniforms: {
        uTime: { value: 0 },
        uStart: { value: 0 },
        uMouseT: { value: 0 },
        uMouse: { value: 0 },
        uOut: { value: 1 },
      },
    });
  }

  // Get the appropriate position module based on template type
  const positionModule = positionModules[temp] || basePosition;

  // Return Object for Component Creation
  const obj = {
    el,
    pos,
    renderer,
    mesh,
    text,
    post,
    scene,
    cam,
    touch: mainDevice.isTouch,
    canvas: gl.canvas,
    check: positionModule.check,
    start: positionModule.start,
    stop: positionModule.stop,
    updateX: positionModule.updateX,
    updateY: positionModule.updateY,
    updateScale: positionModule.updateScale,
    updateAnim: positionModule.updateAnim
  };

  switch (temp) {
    case "loader":
      return new Loader(obj);
    case "bg":
      return new Bg(obj);
    case "pg":
      return new PG(obj);
    case "foot":
      return new TtF(obj);
    case "about":
      return new TtA(obj);
    default:
      return new Tt(obj);
  }
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
    renderer,
    texture,
    scene,
    geometry,
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
