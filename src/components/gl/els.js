import { Camera, Plane, Triangle, Mesh, Geometry, Texture, Text, Renderer, Transform, Program, Post, Vec2 } from 'ogl';

// ASSETS
// import imurl from '/assets/1.jpg'

// import imurl from '/assets/ciclope.jpg';
import mapTexSrcD from '@/assets/fonts/PPNeueMontreal-Medium.png';
import jsonTexSrcD from '@/assets/fonts/PPNeueMontreal-Medium.json';

// import vidurl from '@/assets/vid.mp4?url';
// import vidsmall from '@/assets/vidsmall.mp4?url';
// import vidsmall from '@/assets/vid.mp4?url';

//LOADER
import Loader from '@/components/gl/effects/⌛\uFE0F/base';
import LoaderF from '@/shaders/⌛/\uD83E\uDDEAmain.glsl?raw';
import LoaderV from '@/shaders/⌛/\uD83E\uDE7Bmain.glsl?raw';

//OIS
import Base from '@/components/gl/effects/\uD83D\uDDBC/base';
import fractalF from '@/shaders/\uD83D\uDDBC/\uD83E\uDDEAmain.glsl?raw';
import fractalV from '@/shaders/\uD83D\uDDBC/\uD83E\uDE7Bmain.glsl?raw';

import Bg from '@/components/gl/effects/\uD83C\uDFDC/base.js';
import BgF from '@/shaders/\uD83C\uDFDC/\uD83E\uDDEAmain.glsl?raw';
import BgV from '@/shaders/\uD83C\uDFDC/\uD83E\uDE7Bmain.glsl?raw';

import Tt from '@/components/gl/effects/\uD83D\uDCAC/base.js';
import textF from '@/shaders/\uD83D\uDCAC/\uD83E\uDDEAmsdf.glsl?raw';
import textV from '@/shaders/\uD83D\uDCAC/\uD83E\uDE7Bmsdf.glsl?raw';

import TtF from '@/components/gl/effects/\uD83D\uDD25/base.js';
import textFF from '@/shaders/\uD83D\uDD25/\uD83E\uDDEAmsdf.glsl?raw';
// import textFV from '@/shaders/🔥/🩻msdf.glsl'
import textpF from '@/shaders/\uD83D\uDD25/\uD83E\uDDEAparent.glsl?raw';

import TtA from '@/components/gl/effects/\uD83D\uDC69\u200D⚖\uFE0F/base.js';
import textFA from '@/shaders/\uD83D\uDC69\u200D⚖\uFE0F/\uD83E\uDDEAmsdf.glsl?raw';
// import textFV from '@/shaders/👩‍⚖️/🩻msdf.glsl'
import textpA from '@/shaders/\uD83D\uDC69\u200D⚖\uFE0F/\uD83E\uDDEAparent.glsl?raw';

import Sl from '@/components/gl/effects/\uD83C\uDF9E\uFE0F/base.js';
import SlF from '@/shaders/\uD83C\uDF9E\uFE0F/\uD83E\uDDEAmain.glsl?raw';
import SlV from '@/shaders/\uD83C\uDF9E\uFE0F/\uD83E\uDE7Bmain.glsl?raw';
import SlPF from '@/shaders/\uD83C\uDF9E\uFE0F/\uD83E\uDDEAparent.glsl?raw';

import Roll from '@/components/gl/effects/\uD83C\uDFA2/base.js';
import SlSF from '@/shaders/\uD83C\uDFA2/\uD83E\uDDEAsingle.glsl?raw';
import SlVF from '@/shaders/\uD83C\uDFA2/\uD83E\uDE7Bsingle.glsl?raw';

import PG from '@/components/gl/effects/\uD83E\uDDEE/base.js';
import PGs from "@/shaders/\uD83E\uDDEE/\uD83E\uDDEAmain.glsl?raw";
import PGv from "@/shaders/\uD83E\uDDEE/\uD83E\uDE7Bmain.glsl?raw";

// import textpV from './💬/🩻parent.glsl'

export async function createMSDF() {
  let mapTexSrc = mapTexSrcD;
  let jsonTexSrc = jsonTexSrcD;

  if (process.env.NODE_ENV === 'production') {
    mapTexSrc = '/PPNeueMontreal-Medium.png';
    jsonTexSrc = '/PPNeueMontreal-Medium.json';
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
  const fntAss = await this.createMSDF();

  this.fontMSDF = fntAss[0];

  let mapTexSrc = mapTexSrcD;

  if (process.env.NODE_ENV === 'production') {
    mapTexSrc = '/PPNeueMontoral-Medium.png';
  }
  this.fontTex = await this.loadImage(mapTexSrc);

  // const fakeImg = new Image()
  // fakeImg.crossOrigin = ''

  // this.imagefak = new Texture(this.gl, {
  //   generateMipmaps: false,
  //   image : fakeImg
  // })
  // fakeImg.onload = () => {
  //   this.imagefak.image = fakeImg
  // }

  // // fakeImg.src = imurl
  // fakeImg.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAE4AAABOCAYAAACOqiAdAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACuSURBVHgB7dAxAcAgAASxb/17Bg3cnEjIt+2MZ/9IxEXiInGRuEhcJC4SF4mLxEXiInGRuEhcJC4SF4mLxEXiInGRuOgCb+wBm1B9GmcAAAAASUVORK5CYII='

  // await this.timeout(640)

  const video = document.createElement('video');
  video.isPlaying = false;
  video.style.display = 'none';
  video.autoplay = true;
  video.setAttribute('webkit-playsinline', 'webkit-playsinline');
  video.setAttribute('playsinline', 'playsinline');
  video.muted = true;
  video.loop = true;
  video.dataset.auto = true;

  let promiseswait = [];
  let lnt = Object.values(texs).length - 1;

  document.addEventListener('click', () => {
    video.play();
  });

  for (let a in texs) {
    if (Array.isArray(texs[a])) {
      for (let [b, u] of texs[a].entries()) {
        if (texs[a][b].i) {
          if (process.env.NODE_ENV === 'development') {
            promiseswait.push(this.loadImage(imurl));
          } else {
            promiseswait.push(this.loadImage(texs[a][b].i));
          }
        } else if (texs[a][b].v) {
          let vidclone = video.cloneNode();
          if (process.env.NODE_ENV === 'development') {
            promiseswait.push(this.loadVideo(vidclone, vidsmall));
          } else {
            promiseswait.push(this.loadVideo(vidclone, texs[a][b].v));
          }
        }
      }
    } else {
      if (texs[a].i) {
        if (process.env.NODE_ENV === 'development') {
          promiseswait.push(this.loadImage(imurl));
        } else {
          promiseswait.push(this.loadImage(texs[a].i));
        }
      } else if (texs[a].v) {
        let vidclone = video.cloneNode();
        if (process.env.NODE_ENV === 'development') {
          promiseswait.push(this.loadVideo(vidclone, vidsmall));
        } else {
          promiseswait.push(this.loadVideo(vidclone, texs[a].v));
        }
      }
    }
  }

  this.texs = [];
  for (let [i, a] of promiseswait.entries()) {
    this.texs.push(await Promise.resolve(a));
  }

  // await Promise.all(promiseswait).then((data)=>{

  //   this.texs = data

  // })
}

export async function createTex(el = null, video = null) {}

export async function createEls(el = null) {
  const temp = el.dataset.temp || 'base';
  const pos = el.dataset.oi;

  //💬💬💬💬💬💬
  if (temp === 'tt' || temp === 'foot' || temp === 'about') {
    //🅰️🅰️🅰️🅰️

    // const renderer = new Renderer({
    //   alpha: true,
    //   dpr: Math.max(window.devicePixelRatio, 2),

    //   width: el.offsetWidth,
    //   height: el.offsetHeight,
    // })
    const renderer = new Renderer({
      alpha: true,
      dpr: Math.max(window.devicePixelRatio, 2),

      width: el.offsetWidth,
      height: el.offsetHeight,
    });

    const { gl } = renderer;

    gl.canvas.classList.add('glF');
    el.parentNode.querySelector('.cCover').appendChild(gl.canvas);
    //📽️📽️📽️📽️📽️📽️📽️📽️
    const cam = this.createCamera(gl);

    let text = '';
    let siz = el.dataset.m;

    if (temp === 'foot') {
      text = new Text({
        font: this.fontMSDF,
        text: el.dataset.text,
        // text:'a',
        // width: el.dataset.w,
        align: 'center',
        letterSpacing: el.dataset.l,
        size: siz,
        lineHeight: 1,
      });
    } else if (temp === 'about') {
      let br = ' ';
      let br2 = ' ';
      let w = (6.2 * el.dataset.m) / 0.6;
      let ls = el.dataset.l;
      let l = 0.995;
      if (this.main.device < 2) {
        br = '\n';
        br2 = '\n';
        w = 13.1;
        l = 1.035;
      }
      if (this.main.device === 2) {
        // br2 ='\n'
        w = 7.5;
        l = 1.01;
        ls = -0.015;
        siz *= 0.77;
      }
      // el.dataset.l = -.01
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
        letterSpacing: ls,
        size: siz,
        lineHeight: l,
      });
    } else {
      text = new Text({
        font: this.fontMSDF,
        text: el.dataset.text,
        // text:'a',
        // letterSpacing: el.dataset.l,
        // width: el.dataset.w,
        align: 'center',
        letterSpacing: el.dataset.l,
        size: siz,
        lineHeight: 1,
      });
    }

    // gl.clearColor(0, 0, 0, 0)

    //📐📐📐📐📐📐📐

    const geometry = new Geometry(gl, {
      position: { size: 3, data: text.buffers.position },
      uv: { size: 2, data: text.buffers.uv },
      // id provides a per-character index, for effects that may require it
      id: { size: 1, data: text.buffers.id },
      index: { data: text.buffers.index },
    });
    geometry.computeBoundingBox();
    // const geometry = new Triangle(gl)

    //📺📺📺📺📺📺📺
    const texTx = new Texture(gl, {
      generateMipmaps: false,
    });

    texTx.image = this.fontTex;

    // const program = new Program(gl,this.programops.text)

    let program = '';

    if (temp === 'foot') {
      let shaderMod = textFF;
      shaderMod = shaderMod.replaceAll('PITO', el.parentNode.querySelector('.Oiel').innerHTML.length);

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
      let shaderMod = textFA;
      shaderMod = shaderMod.replaceAll('PITO', el.parentNode.querySelector('.Oiel').innerHTML.length);

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
      let shaderMod = textF;
      shaderMod = shaderMod.replaceAll('PITO', el.parentNode.querySelector('.Oiel').innerHTML.length);

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
    // console.log(program)
    // 🟥🟥🟥🟥🟥🟥

    const mesh = new Mesh(gl, { geometry, program });

    const scene = new Transform();
    mesh.setParent(scene);

    //❗ Posible borrada o reajuste para meterlo en medio
    // mesh.position.x =  text.width * -0.5
    // mesh.position.y = text.height * 0.5
    let post = '';
    if (temp === 'foot') {
      // console.log(mesh.position.y)

      // console.log(mesh.position.y)
      // console.log(program)
      mesh.position.y = text.height * 0.58;

      post = new Post(gl);
      post.addPass({
        // If not passed in, pass will use the default vertex/fragment
        // shaders found within the class.
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
      // console.log(mesh.position.y)

      // console.log(mesh.position.y)
      // console.log(program)
      mesh.position.y = text.height * 0.58;

      post = new Post(gl);
      post.addPass({
        // If not passed in, pass will use the default vertex/fragment
        // shaders found within the class.
        fragment: textpA,
        uniforms: {
          uTime: { value: 0.4 },
          uStart: { value: -1 },
          uMouseT: { value: 0.4 },
          uMouse: { value: -1 },
        },
      });
    } else {
      mesh.position.y = text.height * 0.58;
    }
    if (el.dataset.white) {
      program.uniforms.uColor.value = 1;
    }

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

    if (temp === 'foot') {
      return new TtF(obj);
    } else if (temp === 'about') {
      return new TtA(obj);
    } else {
      return new Tt(obj);
    }
  } else if (temp === 'bg' || temp === 'loader') {
    //⌛️⌛️⌛️⌛️⌛️⌛️⌛️⌛️⌛️⌛️⌛️

    const renderer = new Renderer({
      alpha: true,
      dpr: Math.min(window.devicePixelRatio, 2),
      width: window.innerWidth,
      height: window.innerHeight,
    });

    const { gl } = renderer;
    const geometry = new Triangle(gl);

    if (temp === 'loader') {
      gl.canvas.id = 'glLoader';

      document.body.appendChild(gl.canvas);

      const program = new Program(gl, {
        vertex: LoaderV,
        fragment: LoaderF,
        uniforms: {
          uTime: { value: 0 },
          //BORRAR
          uStart1: { value: 0.5 },
          //BORRAR
          uStart0: { value: 1 },
          uStart2: { value: 1 },
          uStartX: { value: 0 },
          uStartY: { value: 0.1 },
          uMultiX: { value: -0.4 },
          uMultiY: { value: 0.45 },
          uResolution: { value: new Vec2(gl.canvas.offsetWidth, gl.canvas.offsetHeight) },
        },
      });

      const mesh = new Mesh(gl, { geometry, program: program });

      const obj = {
        el,
        pos,
        renderer,
        mesh,
        canvas: gl.canvas,
      };

      return new Loader(obj);
    } else {
      gl.canvas.id = 'glBg';
      document.body.insertBefore(gl.canvas, document.querySelector('.Mbg'));

      const program = new Program(gl, {
        vertex: BgV,
        fragment: BgF,
        uniforms: {
          uTime: { value: 0 },
          //BORRAR
          uStart1: { value: 0.5 },
          //BORRAR
          uStart0: { value: 1 },
          uStart2: { value: 1 },
          uStartX: { value: 0 },
          uStartY: { value: 0.1 },
          uMultiX: { value: -0.4 },
          uMultiY: { value: 0.45 },
          uResolution: { value: new Vec2(gl.canvas.offsetWidth, gl.canvas.offsetHeight) },
        },
      });

      const mesh = new Mesh(gl, { geometry, program: program });

      const obj = {
        el,
        pos,
        renderer,
        mesh,
        canvas: gl.canvas,
      };

      return new Bg(obj);
    }
  } else if (temp === 'roll') {
    const parent = document.querySelector('.cRoll');
    const renderer = new Renderer({
      alpha: true,
      dpr: Math.max(window.devicePixelRatio, 2),

      width: parent.offsetWidth,
      height: parent.offsetHeight,
    });
    const { gl } = renderer;
    //Slider
    const scene = new Transform();

    gl.canvas.classList.add('glRoll');
    parent.appendChild(gl.canvas);

    //📐📐📐📐📐📐📐

    const geometry = new Triangle(gl);

    const textures = [];
    let medias = parent.parentNode.querySelectorAll('video,img');

    for (let [i, a] of medias.entries()) {
      let texture = new Texture(gl, {
        generateMipmaps: false,
      });

      let url = a.dataset.src || a.dataset.oi;
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
          texture.image = await this.loadVideo(a, url);
        }
      } else {
        if (exists) {
          texture.image = exists;
        } else {
          console.log('no fun');
          texture.image = await this.loadImage(url);
        }
      }
      // if(i == 0){
      //   texturesingle.image = texture.image
      // }

      textures.push(texture);
    }

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
    let mesh = new Mesh(gl, { geometry, program });

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
  } else if (temp === 'slider') {
    //🎞️🎞️🎞️🎞️🎞️🎞️🎞️🎞️🎞️🎞️🎞️🎞️🎞️🎞️🎞️

    //Inits
    // const singledad = document.querySelector('.single[data-ids="'+el.dataset.ids+'"]')
    // const singlewatch = document.querySelector('.Oiwatch[data-ids="'+el.dataset.ids+'"]')

    // const renderersingle = new Renderer({
    //   alpha: true,
    //   dpr: Math.max(window.devicePixelRatio, 2),

    //   width: singledad.offsetWidth,
    //   height: singledad.offsetHeight,
    // })
    const renderer = new Renderer({
      alpha: true,
      dpr: Math.max(window.devicePixelRatio, 2),

      width: el.offsetWidth,
      height: el.offsetWidth,
    });

    const { gl } = renderer;
    //Slider
    const scene = new Transform();

    gl.canvas.classList.add('glSlider');
    el.parentNode.querySelector('.cCover').appendChild(gl.canvas);

    //📽️📽️📽️📽️📽️📽️📽️📽️
    const cam = this.createCamera(gl);

    //📐📐📐📐📐📐📐

    const geometry = new Plane(gl, {
      heightSegments: 1,
      widthSegments: 1,
    });

    //👓👓👓👓👓👓👓
    // let texturesingle = new Texture( renderersingle.gl, {
    //   generateMipmaps: false,
    // })

    const textures = [];
    const meshes = [];

    let medias = el.parentNode.querySelectorAll('video,img');
    // START TEXTURES AQUI

    for (let [i, a] of medias.entries()) {
      let texture = new Texture(gl, {
        generateMipmaps: false,
      });

      let url = a.dataset.src || a.dataset.oi;
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
          console.log('no fun' + url);
          texture.image = await this.loadVideo(a, url);
        }
      } else {
        if (exists) {
          texture.image = exists;
        } else {
          console.log('no fun' + url);
          texture.image = await this.loadImage(url);
        }
      }

      // if(i == 0){
      //   texturesingle.image = texture.image
      // }

      textures.push(texture);
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
      let mesh = new Mesh(gl, { geometry, program });

      mesh.setParent(scene);
      meshes.push(mesh);
    }
    let post = null;
    // if(this.main.device < 2){
    if (1 === 1) {
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
    //Single

    // renderersingle.gl.canvas.classList.add('glSingle')
    // singledad.appendChild(renderersingle.gl.canvas)
    // const programsingle = new Program(renderersingle.gl,{
    //   vertex:SlVF,
    //   fragment:SlSF,
    //   uniforms:{
    //     uStart: { value: 0 },
    //     uEnd: { value: 0 },
    //     uTime: { value: 0 },
    //     tMap: { value: texturesingle },
    //     uCover: { value: new Vec2(0, 0) },
    //     uTextureSize: { value: new Vec2(0, 0) },

    //   },

    // })

    // let tr = new Triangle(renderersingle.gl)

    // let meshsingle = new Mesh( renderersingle.gl, { geometry:tr, program:programsingle })

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

    const { gl } = renderer;

    gl.canvas.classList.add('glPlay');
    document.body.appendChild(gl.canvas);
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

    // const program = new Program(gl,{
    //   vertex:PGv,
    //   fragment:PGs,
    //   uniforms:{
    //     uTime: { value: 0 },
    //     uStart: { value: 0 },
    //     uStart1: { value: .5 },
    //     tMap: { value: texture },
    //     uCover: { value: new Vec2(0, 0) },
    //     uTextureSize: { value: new Vec2(0, 0)},
    //     uMouse: { value: new Vec2(0,0) },
    //     uLoad:{value:0}
    //   },

    // })
    // const mesh = new Mesh(gl, { geometry ,  program })

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

    gl.canvas.classList.add('glMedia');
    el.parentNode.appendChild(gl.canvas);

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
