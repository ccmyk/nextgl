// src/components/gl/els.js
"use client";

// Consolidate imports
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
const ASSET_PATH = "/public/assets/fonts/";
const FONT_NAME = "PPNeueMontreal-Medium";
const FONT_EXT = {
  json: ".json",
  png: "-msdf.png",
};
const mapTexSrcD = `${ASSET_PATH}${FONT_NAME}${FONT_EXT.png}`;
const jsonTexSrcD = `${ASSET_PATH}${FONT_NAME}${FONT_EXT.json}`;

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

// PG 📄
import pgF from "@/components/gl/pg/shaders/frag.main.glsl";
import pgV from "@/components/gl/pg/shaders/vert.main.glsl";

import BgF from "@/shaders/bg/frag.main.glsl";
import BgV from "@/shaders/bg/vert.main.glsl";

import textF from "@/shaders/title/frag.msdf.glsl";
import textV from "@/shaders/title/vert.msdf.glsl";

import textFF from "@/shaders/footer/frag.msdf.glsl";
import textpF from "@/shaders/footer/frag.parent.glsl";

import textFA from "@/shaders/tta/frag.msdf.glsl";
import textpA from "@/shaders/tta/frag.parent.glsl";

import SlF from "@/shaders/slides/frag.main.glsl";
import SlV from "@/shaders/slides/vert.main.glsl";
import SlPF from "@/shaders/slides/frag.parent.glsl";

import SlSF from "@/shaders/roll/frag.single.glsl";
import SlVF from "@/shaders/roll/vert.single.glsl";

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
  tta: ttaPosition,
};

// FONT LOADING
export async function createMSDF() {
  const mapTexSrc = process.env.NODE_ENV === "production"
    ? `${ASSET_PATH}${FONT_NAME}${FONT_EXT.png}`
    : mapTexSrcD;
  const jsonTexSrc = process.env.NODE_ENV === "production"
    ? `${ASSET_PATH}${FONT_NAME}${FONT_EXT.json}`
    : jsonTexSrcD;

  const rt = [];
  // 🔠🔠🔠 Load font JSON
  const fJson = await (await fetch(jsonTexSrc)).json();
  rt.push(fJson);
  // 🔚🔚🔚🔚
  return rt;
}

export async function createAssets() {
  // 💬💬💬 Preload font assets
  const fntAss = await createMSDF();
  this.fontMSDF = fntAss[0];

  const mapTexSrc = process.env.NODE_ENV === "production"
    ? `${ASSET_PATH}${FONT_NAME}${FONT_EXT.png}`
    : mapTexSrcD;
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
  const textSize = parseFloat(el.dataset.m) || 1;
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
  texTx.image = this.fontTex;

  // Shaders Setup
  let vertexShader = null;
  let fragmentShader = [];
  switch (temp) {
    case "loader":
      vertexShader = LoaderV;
      fragmentShader = [LoaderF];
      break;
    case "bg":
      vertexShader = BgV;
      fragmentShader = [BgF];
      break;
    case "pg":
      vertexShader = pgV;
      fragmentShader = [pgF];
      break;
    case "title":
      vertexShader = textV;
      fragmentShader = [textF];
      break;
    case "footer":
      vertexShader = textV;
      fragmentShader = [textFF, textpF];
      break;
    case "tta":
      vertexShader = textV;
      fragmentShader = [textFA, textpA];
      break;
    case "slides":
      vertexShader = SlV;
      fragmentShader = [SlF, SlPF];
      break;
    case "roll":
      vertexShader = SlVF;
      fragmentShader = [SlSF];
      break;
    default:
      console.warn("Unknown template type: ", temp);
  }

  const program = new Program(gl, {
    vertex: vertexShader,
    fragment: fragmentShader.join('\n'),
    uniforms: {
      uTexture: { value: texTx },
      uColor: { value: [1, 1, 1] },
    },
  });

  // Mesh Setup
  const mesh = new Mesh(gl, { geometry, program });
  mesh.setParent(cam);

  // Transform Setup
  const transform = new Transform();
  transform.addChild(mesh);

  // Post Processing Setup
  const post = new Post(gl);
  post.addPass({
    fragment: "",
  });

  // Add to scene
  cam.addChild(transform);

  // Set position
  const position = positionModules[temp]?.getPosition(pos);
  if (position) {
    transform.position.set(position.x, position.y, position.z);
  }

  // Return Object for Component Creation
  const obj = {
    el,
    pos,
    renderer,
    mesh,
    text,
    post,
    scene: transform,
    cam,
    touch: this.mainDevice.isTouch,
    canvas: gl.canvas,
    check: positionModules[temp]?.check,
    start: positionModules[temp]?.start,
    stop: positionModules[temp]?.stop,
    updateX: positionModules[temp]?.updateX,
    updateY: positionModules[temp]?.updateY,
    updateScale: positionModules[temp]?.updateScale,
    updateAnim: positionModules[temp]?.updateAnim
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
