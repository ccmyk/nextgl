'use client';

/**
 * LazyImage class for lazy loading images with Intersection Observer
 * @deprecated This class-based approach is being phased out in favor of Next.js Image component
 * and React hooks for lazy loading
 */
export default class LazyImage {
  constructor(obj, device, touch) {
    // Don't initialize on server
    if (typeof window === 'undefined') return;
    
    this.el = obj.el;
    this.pos = obj.pos;
    this.device = device;
    this.touch = touch;

    this.DOM = {
      el: obj.el,
      img: obj.el.parentNode.querySelector('img'),
    };

    this.active = 0;
    this.isupdate = 3;

    this.create();
  }

  /**
   * Initialize the lazy image
   */
  create() {
    // Don't execute if we're on the server
    if (typeof window === 'undefined') return;
  }

  /**
   * Check if the image is in view and load it if necessary
   * @param {IntersectionObserverEntry} entry - Intersection observer entry
   * @param {number} pos - Position
   * @returns {number} - Status code
   */
  check(entry, pos) {
    // Don't execute if we're on the server
    if (typeof window === 'undefined') return false;
    
    let vis = false;
    if (!entry || entry.isIntersecting == undefined) {
      return false;
    }
    
    vis = entry.isIntersecting;
    if (vis == true) {
      this.start();
      vis = entry.isIntersecting;

      if (!this.DOM.img) {
        return -1;
      }

      if (this.DOM.img.getAttribute('src')) {
        return -1;
      }

      let img = new Image();
      let url = '';
      if (this.DOM.img.dataset.lazy) {
        url = this.DOM.img.dataset.lazy;
      }

      let gif = 0;
      if (/\.(gif)$/.test(url)) {
        gif = 1;
      }

      this.DOM.img.onload = () => {
        delete this.DOM.img.dataset.lazy;
        this.DOM.img.classList.add('Ldd');
      };
      
      img.onload = () => {
        this.DOM.img.src = url;
      };
      
      img.onerror = () => {
        // Handle image load error
        console.error('Error loading image:', url);
      };
      
      img.src = url;

      if (gif == 1) {
        this.DOM.img.src = url;
        this.DOM.img.classList.add('Ldd');
      }

      vis = -1;
    } else if (vis == false) {
      this.stop();
    }
    return vis;
  }

  /**
   * Start displaying the image
   */
  start() {
    // Don't execute if we're on the server
    if (typeof window === 'undefined') return;
    
    if (!this.DOM || !this.DOM.img) return;
    
    this.DOM.img.classList.add('ivi');
    this.active = 1;
  }

  /**
   * Stop displaying the image
   */
  stop() {
    // Don't execute if we're on the server
    if (typeof window === 'undefined') return;
    
    if (!this.DOM || !this.DOM.img) return;
    
    this.DOM.img.classList.remove('ivi');
    this.active = 0;
  }

  /**
   * Initialize event listeners
   */
  initEvents() {
    // Don't execute if we're on the server
    if (typeof window === 'undefined') return;
  }

  /**
   * Remove event listeners
   */
  removeEvents() {
    // Don't execute if we're on the server
    if (typeof window === 'undefined') return;
  }

  /**
   * Update the image state
   */
  update() {
    // Don't execute if we're on the server
    if (typeof window === 'undefined') return;
  }

  /**
   * Handle resize events
   * @param {number} scrollCurrent - Current scroll position
   */
  onResize(scrollCurrent) {
    // Don't execute if we're on the server
    if (typeof window === 'undefined') return;
    
    if (!this.el) return;
    
    this.h = window.innerHeight;
    this.max = this.el.clientHeight;

    this.checkobj = {
      firstin: Math.min(this.h, this.el.clientHeight) * 0.92,
      firstout: this.h * 0.92,
      secout: this.el.clientHeight * -1,
      limit: this.el.clientHeight,
    };
  }
}
