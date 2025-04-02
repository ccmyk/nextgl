"use client";

/**
 * Scroll control functions for page animations
 * These functions integrate with the Lenis smooth scrolling library
 */

// Helper to safely get the Lenis instance
const getLenisInstance = () => {
  if (typeof window === 'undefined') return null;
  return window.lenisInstance;
};

/**
 * Stop scrolling on the page
 */
export function stopScroll() {
  const lenis = getLenisInstance();
  if (!lenis) return;
  
  lenis.stop();
  document.documentElement.classList.add('lenis-stopped');
}

/**
 * Start scrolling on the page
 */
export function startScroll() {
  const lenis = getLenisInstance();
  if (!lenis) return;
  
  lenis.start();
  document.documentElement.classList.remove('lenis-stopped');
}

/**
 * Scroll to a specific element
 * @param {string|HTMLElement} target - Target element or selector
 * @param {Object} options - Scroll options
 */
export function scrollTo(target, options = {}) {
  const lenis = getLenisInstance();
  if (!lenis) return;
  
  const defaultOptions = {
    offset: 0,
    duration: 1,
    immediate: false,
    lock: false,
    force: false,
  };
  
  lenis.scrollTo(target, { ...defaultOptions, ...options });
}

/**
 * Scroll to the top of the page
 * @param {Object} options - Scroll options
 */
export function scrollToTop(options = {}) {
  scrollTo(0, options);
}

/**
 * Get current scroll position
 * @returns {number} Current scroll position
 */
export function getScrollPosition() {
  const lenis = getLenisInstance();
  if (!lenis) return 0;
  
  return lenis.scroll;
}

/**
 * Update animations based on scroll position
 * This is a compatibility function for legacy code
 */
export function animIosScroll() {
  if (typeof window === 'undefined') return false;
  
  // Skip if not visible
  if (this.isVisible === 0) {
    return false;
  }
  
  // Get current scroll position from Lenis or fallback to window.scrollY
  const scrollY = getScrollPosition() ?? window.scrollY;
  
  // Update all IO observers
  if (this.iosupdaters && this.iosupdaters.length) {
    for (let c of this.iosupdaters) {
      if (this.ios && this.ios[c] && this.ios[c].class) {
        this.ios[c].class.update(scrollY);
      }
    }
  }
}

/**
 * Scroll class for handling scroll-based animations
 * This is for backward compatibility with the legacy code
 */
export class Scroll {
  constructor(animobj, device) {
    this.el = animobj.el;
    this.device = device;
    this.isVisible = 0;
    this.scrollY = 0;
    this.rect = this.el.getBoundingClientRect();
    this.init();
  }

  init() {
    // Initialize scroll animation
    this.isVisible = 1;
  }

  update(scrollY) {
    if (this.isVisible === 0) return;
    
    this.scrollY = scrollY;
    this.rect = this.el.getBoundingClientRect();
    
    // Calculate animation values based on scroll position
    const progress = this.calculateProgress();
    
    // Apply animations
    this.applyAnimations(progress);
  }
  
  calculateProgress() {
    const windowHeight = window.innerHeight;
    const elementTop = this.rect.top;
    const elementHeight = this.rect.height;
    
    // Calculate how far the element is in the viewport
    let progress = 0;
    
    if (elementTop < windowHeight && elementTop + elementHeight > 0) {
      // Element is in view
      progress = 1 - (elementTop / windowHeight);
      progress = Math.max(0, Math.min(1, progress));
    } else if (elementTop <= 0 && elementTop + elementHeight > 0) {
      // Element is partially above viewport
      progress = 1;
    } else {
      // Element is not in view
      progress = 0;
    }
    
    return progress;
  }
  
  applyAnimations(progress) {
    // Apply animations based on progress
    // This is a simplified version - customize based on your needs
    if (this.el.dataset.scrollOpacity) {
      this.el.style.opacity = progress;
    }
    
    if (this.el.dataset.scrollY) {
      const yMove = parseFloat(this.el.dataset.scrollY);
      this.el.style.transform = `translateY(${(1 - progress) * yMove}px)`;
    }
    
    // Add more animation types as needed
  }
}

/**
 * React hook for using scroll functionality
 * @returns {Object} Scroll control methods
 */
export function usePageScroll() {
  return {
    stopScroll,
    startScroll,
    scrollTo,
    scrollToTop,
    getScrollPosition,
  };
}
