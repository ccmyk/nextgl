// src/components/gl/events.js
"use client";

/**
 * Handle resize events for WebGL elements
 */
export function onResize() {
  // Update all elements in the map
  for (let [i, a] of this.iosmap.entries()) {
    if (a.onResize) a.onResize(this.viewport, this.main.screen);
  }
  
  // Update loader if it exists
  if (this.loader) {
    this.loader.onResize(this.viewport, this.main.screen);
  }
}

/**
 * Update WebGL elements
 * @param {number} time - Current timestamp
 * @param {number} wheel - Wheel delta
 * @param {Object} pos - Position object
 * @returns {boolean} - False if not visible
 */
export function update(time, wheel, pos) {
  // Update loader if it exists
  if (this.loader) {
    if (this.loader.active !== 0) {
      this.loader.update(time, wheel, pos);
    } else if (this.loader.active === 0) {
      this.loader.removeEvents();
      delete this.loader;
    }
  }
  
  // Skip if not visible
  if (this.isVisible === 0) {
    return false;
  }
  
  // Update all active elements
  if (this.ios) {
    for (let [i, a] of this.iosmap.entries()) {
      if (a.active === 1) {
        a.update(time, wheel, pos);
      }
    }
  }
}

/**
 * Promise-based timeout function
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise} - Resolves after the specified time
 */
export function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Load an image asynchronously
 * @param {string} url - Image URL
 * @returns {Promise<HTMLImageElement>} - Resolves with the loaded image
 */
export async function loadImage(url) {
  return new Promise((resolve, reject) => {
    let img = new Image();
    img.crossOrigin = '';
    
    img.onload = () => {
      resolve(img);
    };
    
    img.src = url;
    
    img.onerror = (e) => {
      resolve(img); // Resolve even on error to prevent breaking the flow
    };
  });
}

/**
 * Clean up video element
 * @param {HTMLVideoElement} elem - Video element to clean
 */
function cleanVid(elem) {
  elem.oncanplay = null;
  elem.onplay = null;
  elem.currentTime = 0;
  
  let isPlaying = elem.currentTime > 0 && !elem.paused && !elem.ended 
    && elem.readyState > elem.HAVE_CURRENT_DATA;
  
  elem.pause();
}

/**
 * Load a video asynchronously
 * @param {HTMLVideoElement} elem - Video element
 * @param {string} url - Video URL
 * @returns {Promise<HTMLVideoElement>} - Resolves with the loaded video
 */
export async function loadVideo(elem, url) {
  return new Promise((resolve, reject) => {
    if (elem.dataset.loop) {
      elem.loop = false;
    } else {
      elem.loop = true;
    }
    
    elem.muted = true;
    elem.autoplay = true;
    elem.setAttribute('webkit-playsinline', 'webkit-playsinline');
    elem.setAttribute('playsinline', 'playsinline');
    
    elem.onplay = () => {
      elem.isPlaying = true;
    };
    
    elem.oncanplay = () => {
      if (elem.isPlaying) {
        elem.classList.add('Ldd');
        cleanVid(elem);
        resolve(elem);
      }
    };
    
    elem.src = url;
    
    elem.onerror = () => {
      resolve(elem); // Resolve even on error to prevent breaking the flow
    };
    
    elem.play();
  });
}

export default {
  onResize,
  update,
  timeout,
  loadImage,
  loadVideo
};
