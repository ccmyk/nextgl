import gsap from 'gsap';

// Visibility check
export function check(entry) {
  const vis = entry.isIntersecting;
  if (vis) this.start();
  else     this.stop(entry);
  return vis;
}

// Activate roll
export function start() {
  if (this.active === 1) return false;
  this.active = 1;
}

// Deactivate roll
export function stop(entry) {
  if (this.active < 1) return false;
  // if intersection gone above viewport, finish the swipe animation
  if (entry && entry.intersectionRect.y <= 0 && this.state === 1) {
    gsap.to(this.animctr, { progress: 1, duration: 0.2 });
  }
  this.active = 0;
}

// No horizontal scroll-based shift needed
export function updateX() {}

// Update scroll-driven progress
export function updateY(y = 0) {
  if (this.ctr.stop !== 1) {
    const raw = y - this.ctr.start;
    this.ctr.current = this.clamp(raw, 0, this.ctr.limit);
  }
}

// Apply animation timeline
export function updateAnim() {
  this.ctr.progt = Number((this.ctr.current / this.ctr.limit).toFixed(3));
  this.ctr.prog  = this.lerp(this.ctr.prog, this.ctr.progt, 0.03);
  this.animctr.progress(this.ctr.prog);
}

// Resize-driven scaling (no-op here)
export function updateScale() {}
