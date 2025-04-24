"use client";
"use client"import gsap from 'gsap';

// 1) IntersectionObserver handler
export function check(entry) {
  const vis = entry.isIntersecting;
  if (vis) this.start();
  else     this.stop(entry);
  return vis;
}

// 2) start/stop
export function start() {
  if (this.active === 1) return false;
  this.active = 1;
}
export function stop(entry) {
  if (this.active < 1) return false;
  // if scrolled fully out at top, complete animation
  if (entry?.intersectionRect.y <= 0) {
    gsap.to(this.animctr, { progress: 1, duration: 0.2 });
  }
  this.active = 0;
}

// 3) scroll-no-horizontal
export function updateX() {}

// 4) scroll-driven Y progress
export function updateY(y = 0) {
  if (this.ctr.stop !== 1) {
    const raw = y - this.ctr.start;
    this.ctr.current = Math.min(Math.max(raw, 0), this.ctr.limit);
  }
}

// 5) apply GSAP timeline
export function updateAnim() {
  this.ctr.progt = Number((this.ctr.current / this.ctr.limit).toFixed(3));
  this.ctr.prog  = this.lerp(this.ctr.prog, this.ctr.progt, 0.03);
  this.animctr.progress(this.ctr.prog);
}

// 6) no-op scale
export function updateScale() {}