// src/components/gl/gl.js
"use client";

import {
  create,
  createScene,
  createCamera,
  cleanTemp,
  createTemp,
  createIos,
  show,
} from './create.js';

import {
  createEls,
  createMSDF,
  createTex,
  createAssets
} from './els.js';

import {
  callIos,
  loadIos,
  showIos,
  checkIo
} from './ios.js';

import {
  onResize,
  update,
  timeout,
  loadImage,
  loadVideo
} from './events.js';

/**
 * Canvas class for managing WebGL elements
 */
class Canvas {
  /**
   * Create a new Canvas instance
   * @param {Object} main - Main application object
   */
  constructor(main) {
    this.main = main;
    
    this.viewport = {
      w: 1,
      h: 1
    };
    
    this.isVisible = 0;
    
    this.ios = [];
    this.iosmap = new Map();
  }
  
  /**
   * Promise-based timeout function
   * @param {number} ms - Milliseconds to wait
   * @returns {Promise} - Resolves after the specified time
   */
  timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  /**
   * Change slide state
   * @param {number} st - State (0 or 1)
   * @returns {Promise<void>}
   */
  async changeSlides(st = 0) {
    let foot = null;
    
    if (st === 1) {
      // Handle state 1 (showing slides)
      for (let [i, a] of this.iosmap.entries()) {
        if (a.name === 'Slides') {
          a.changeState(st);
        }
      }
      
      await window.waiter(1400);
      
      for (let [i, a] of this.iosmap.entries()) {
        if (a.name === 'Roll') {
          a.changeState(st);
        } else if (a.name === 'Footer') {
          foot = a;
        }
      }
    } else {
      // Handle state 0 (hiding slides)
      for (let [i, a] of this.iosmap.entries()) {
        if (a.name === 'Roll') {
          a.changeState(st);
        }
      }
      
      for (let [i, a] of this.iosmap.entries()) {
        if (a.name === 'Slides') {
          a.changeState(st);
        } else if (a.name === 'Footer') {
          foot = a;
        }
      }
      
      await window.waiter(800);
    }
    
    // Update footer if found
    if (foot) {
      foot.onResize(this.viewport, this.main.screen);
    }
  }
}

// Prototype assignments
Canvas.prototype.create = create;
Canvas.prototype.createScene = createScene;
Canvas.prototype.createCamera = createCamera;
Canvas.prototype.cleanTemp = cleanTemp;
Canvas.prototype.createTemp = createTemp;
Canvas.prototype.createIos = createIos;
Canvas.prototype.show = show;

Canvas.prototype.createMSDF = createMSDF;
Canvas.prototype.createAssets = createAssets;
Canvas.prototype.createEls = createEls;
Canvas.prototype.createTex = createTex;

Canvas.prototype.callIos = callIos;
Canvas.prototype.loadIos = loadIos;
Canvas.prototype.showIos = showIos;
Canvas.prototype.checkIo = checkIo;

Canvas.prototype.onResize = onResize;
Canvas.prototype.update = update;
Canvas.prototype.timeout = timeout;
Canvas.prototype.loadImage = loadImage;
Canvas.prototype.loadVideo = loadVideo;

export default Canvas;
