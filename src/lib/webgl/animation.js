// lib/webgl/animation.js
export class AnimationManager {
  constructor() {
    this.animations = new Set();
    this.rafId = null;
  }

  add(animation) {
    this.animations.add(animation);
    if (this.animations.size === 1) {
      this.start();
    }
  }

  remove(animation) {
    this.animations.delete(animation);
    if (this.animations.size === 0) {
      this.stop();
    }
  }

  start() {
    const animate = (time) => {
      this.animations.forEach(animation => animation(time));
      this.rafId = requestAnimationFrame(animate);
    };
    this.rafId = requestAnimationFrame(animate);
  }

  stop() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }
}

// Example animation function
export function createAnimation(callback, duration = 1000, easing = t => t) {
  let startTime = null;
  
  return (currentTime) => {
    if (!startTime) startTime = currentTime;
    
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easing(progress);
    
    callback(easedProgress);
    
    if (progress >= 1) {
      return true; // Animation complete
    }
    
    return false; // Animation still running
  };
}

// Easing functions
export const easeInOutQuad = (t) => {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
};

export const easeOutQuad = (t) => {
  return t * (2 - t);
};

export const easeInQuad = (t) => {
  return t * t;
};

export const easeOutCubic = (t) => {
  return (--t) * t * t + 1;
};

export const easeInCubic = (t) => {
  return t * t * t;
};

export const easeInOutCubic = (t) => {
  return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
};

export const easeOutExpo = (t) => {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
};

export const easeInExpo = (t) => {
  return t === 0 ? 0 : Math.pow(1024, t - 1);
};

export const easeInOutExpo = (t) => {
  if (t === 0) return 0;
  if (t === 1) return 1;
  if ((t *= 2) < 1) return 0.5 * Math.pow(1024, t - 1);
  return 0.5 * (-Math.pow(2, -10 * (t - 1)) + 2);
};