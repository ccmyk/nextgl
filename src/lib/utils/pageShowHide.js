'use client';

/**
 * Page transition and animation functions
 * These functions are being phased out in favor of React hooks and Next.js page transitions
 */

//READY
export async function getReady() {
  // Don't execute if we're on the server
  if (typeof window === 'undefined') return;
    
  if (typeof this.cleanP === 'function') this.cleanP();
  if (typeof this.cleanWysi === 'function') this.cleanWysi();
  if (typeof this.startComps === 'function') await this.startComps();
}

//INTRO
export async function show() {
  // Don't execute if we're on the server
  if (typeof window === 'undefined') return;
    
  if (typeof this.showIos === 'function') this.showIos();
  if (typeof this.onResize === 'function') this.onResize();
  await this.timeout(1);
}

export async function start(val = 0) {
  // Don't execute if we're on the server
  if (typeof window === 'undefined') return;

  this.isVisible = 1;

  let result = val;
  if (typeof this.animIntro === 'function') {
    result = await this.animIntro(val);
  }
  
  if (typeof this.callIos === 'function') this.callIos();
  return result;
}

export async function animIntro() {
  // Don't execute if we're on the server
  if (typeof window === 'undefined') return;
  
  if (typeof gsap !== 'undefined') {
    await gsap.fromTo(this.DOM.el, {opacity: 1, duration: .45, delay: .1});
  }
}

//OUT
export async function animOut() {
  // Don't execute if we're on the server
  if (typeof window === 'undefined') return;

  if (this.main && this.main.isTouch) {
    if (this.DOM && this.DOM.el) {
      this.DOM.el.classList.add('isGone');
    }
  }
  
  if (this.DOM && this.DOM.el && this.DOM.el.querySelectorAll) {
    for (let a of this.DOM.el.querySelectorAll('.inview')) {
      a.classList.remove('inview');
      a.classList.remove('stview');
      
      if (this.main && this.main.events && this.main.events.anim) {
        this.main.events.anim.detail.state = -1;
        this.main.events.anim.detail.el = a;
        document.dispatchEvent(this.main.events.anim);
      }
    }
  }
}

export async function hide() {
  // Don't execute if we're on the server
  if (typeof window === 'undefined') return;
    
  this.isVisible = 0;
  if (typeof this.stopComps === 'function') this.stopComps();
}