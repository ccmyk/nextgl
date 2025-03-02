'use client';

/**
 * Browser detection and capability utilities
 * Refactored from the original browser.js
 */

/**
 * Detects browser capabilities and device type
 * @returns {Object} Browser and device information
 */
export function detectBrowserCapabilities() {
  // Prevent browser history scroll restoration
  if (typeof window !== 'undefined' && window.history.scrollRestoration) {
    window.history.scrollRestoration = 'manual';
  }
  
  // Device detection
  if (typeof window === 'undefined') {
    return {
      deviceclass: 'server',
      device: 0,
      isTouch: false,
      webp: 0,
      webm: 0,
      vidauto: 0,
      webgl: 0
    };
  }

  // Touch detection
  const isTouch = /Mobi|Android|Tablet|iPad|iPhone/.test(navigator.userAgent) || 
                 ("MacIntel" === navigator.platform && navigator.maxTouchPoints > 1);
  const w = window.innerWidth;
  const h = window.innerHeight;
  let devnum = 0;
  let devicec = '';
  
  if (!isTouch) {
    devicec = 'desktop';
    devnum = 0;
    document.documentElement.classList.add("D");

    if (w > 1780) {
      devnum = -1;
    }
  } else {
    devicec = 'mobile';
    devnum = 3;
    if (w > 767) {
      if (w > h) {
        devicec = 'tabletL';
        devnum = 1;
      } else {
        devicec = 'tabletS';
        devnum = 2;
      }
    }
    
    document.documentElement.classList.add("T");
    document.documentElement.classList.add(devicec);
  }

  // WebP support detection
  let isWebPCheck = false;
  const element = document.createElement('canvas');
  if (element.getContext && element.getContext('2d')) {
    isWebPCheck = element.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }

  // WebM support detection
  let isWebMCheck = true;
  const ua = navigator.userAgent.toLowerCase();
  if (ua.indexOf('safari') !== -1 && ua.indexOf('chrome') === -1) {
    isWebMCheck = false;
  }
  
  // Autoplay detection
  let autoplay = true;
  try {
    const video = document.createElement('video');
    video.muted = true;
    video.playsInline = true;
    video.setAttribute('webkit-playsinline', 'webkit-playsinline');
    video.setAttribute('playsinline', 'playsinline');
    
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        autoplay = false;
      });
    }
  } catch (e) {
    autoplay = false;
  }

  // Firefox detection
  if (ua.indexOf('firefox') > -1) {
    document.documentElement.classList.add('CBff');
  }

  return {
    deviceclass: devicec,
    device: devnum,
    isTouch: isTouch,
    webp: isWebPCheck ? 1 : 0,
    webm: isWebMCheck ? 1 : 0,
    vidauto: autoplay ? 1 : 0,
  };
}

/**
 * Checks for WebGL support
 * @returns {string|boolean} WebGL version or false if not supported
 */
export function checkWebGLSupport() {
  if (typeof window === 'undefined') return false;
  
  try {
    const canvas = document.createElement('canvas');
    
    if (!!window.WebGL2RenderingContext &&
      (canvas.getContext('webgl2') || canvas.getContext('experimental-webgl2'))) {
      return 'webgl2';
    }
    
    if (!!window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))) {
      return 'webgl';
    }
  } catch(e) {
    return false;
  }
  
  return false;
}

/**
 * Debug function to show device dimensions
 * Only used in development
 */
export function showDeviceDebugInfo() {
  if (typeof window === 'undefined') return;
  
  const checkfix = document.createElement('div');
  checkfix.className = 'checkfix';
  checkfix.insertAdjacentHTML('afterbegin', '<div class="checkfix_t"></div>');
  
  document.querySelector('body').appendChild(checkfix);
  
  const updateInfo = () => {
    const ratio = ((window.innerWidth * 9) / window.innerHeight).toFixed(2);
    const zoom = window.innerWidth !== window.outerWidth;
    document.querySelector('.checkfix_t').innerHTML = 
      `Width: ${window.innerWidth}<br>` +
      `Height: ${window.innerHeight}<br>` +
      `Ratio: ${ratio}/9<br>` +
      `${(16/ratio).toFixed(3)}<br>` +
      `Zoom: ${zoom}`;
  };
  
  updateInfo();
  window.addEventListener('resize', updateInfo);
}

/**
 * Utility functions for easing animations
 */
export const easingFunctions = {
  Power2: {
    easeIn: (t) => t * t,
    easeOut: (t) => t * (2 - t),
    easeInOut: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
  },
  Power4: {
    easeIn: (t) => t * t * t * t,
    easeOut: (t) => 1 - (--t) * t * t * t,
    easeInOut: (t) => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t
  }
};

/**
 * Helper utility functions
 */
export function lerp(p1, p2, t) {
  return p1 + (p2 - p1) * t;
}

export function clamp(min, max, num) {
  return Math.min(Math.max(num, min), max);
}

export function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
