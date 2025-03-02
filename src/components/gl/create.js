// src/components/gl/create.js
"use client";

import { Camera, Transform } from 'ogl';

/**
 * Create and initialize WebGL components
 * @param {Array} texs - Array of textures to load
 * @param {React.RefObject} canvasRef - Reference to the canvas element
 * @returns {Promise<void>}
 */
export async function create(texs = [], canvasRef) {
  // Create assets
  await this.createAssets(texs);

  // Create loader element
  let div = document.createElement('div');
  div.dataset.temp = 'loader';
  this.loader = await this.createEls(div, 'loader', canvasRef);
  
  // Initialize size
  await this.onResize();
  
  this.isVisible = 1;
}

/**
 * Create a camera for the WebGL scene
 * @param {WebGLRenderingContext} gl - WebGL context
 * @returns {Camera} - OGL Camera instance
 */
export function createCamera(gl = this.gl) {
  let camera = new Camera(gl);
  camera.position.z = 45;
  return camera;
}

/**
 * Create a scene transform
 */
export function createScene() {
  this.scene = new Transform();
}

/**
 * Clean up temporary WebGL resources
 * @returns {Promise<void>}
 */
export async function cleanTemp() {
  for (let [i, a] of this.iosmap.entries()) {
    if (a.active === 1) {
      a.removeEvents();
    } else if (a.renderer) {
      a.renderer.gl.getExtension('WEBGL_lose_context').loseContext();
      a.canvas.remove();
    }
  }
}

/**
 * Create temporary elements based on a template
 * @param {string} temp - Template HTML
 * @param {React.RefObject} canvasRef - Reference to the canvas element
 * @returns {Promise<void>}
 */
export async function createTemp(temp, canvasRef) {
  this.ios = [];
  this.temp = temp;
  
  // Clear existing map
  for (let [i, a] of this.iosmap.entries()) {
    this.iosmap.delete(i);
  }
  
  this.iosmap = new Map();
  
  // Create new elements
  await this.createIos(canvasRef);
}

/**
 * Create WebGL elements for each .Oi element in the document
 * @param {React.RefObject} canvasRef - Reference to the canvas element
 * @returns {Promise<void>}
 */
export async function createIos(canvasRef) {
  let ios = document.querySelectorAll('main .Oi');
  
  for (let [i, ioel] of ios.entries()) {
    ioel.dataset.oi = i;
    
    // Get template type from data attribute
    let exp = ioel.dataset.temp || 'base';
    
    // Create element
    let io = await this.createEls(ioel, exp, canvasRef);
    
    if (io.isready === 0) {
      io.isready = 1;
      io.el.style.visibility = 'hidden';
      io.isdone = 0;
      
      io.onResize(this.viewport, this.main.screen);
      this.iosmap.set(i, io);
    } else if (io.el.classList.contains('Oi-pgel')) {
      this.iosmap.set(i, io);
      ioel.dataset.oi = io.pos;
    }
  }
  
  // Load and initialize elements
  await this.loadIos();
  this.isVisible = 1;
}

/**
 * Show WebGL elements
 * @returns {Promise<void>}
 */
export async function show() {
  this.showIos();
  await this.timeout(64);
  this.callIos();
}

export default {
  create,
  createCamera,
  createScene,
  cleanTemp,
  createTemp,
  createIos,
  show
};
