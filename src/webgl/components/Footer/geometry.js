"use client";
"use client"// scroll & mouse helpers for Footer
export function check(entry) {
  const vis = entry.isIntersecting;
  if (vis) this.start();
  else     this.stop();
  return vis;
}

export function start() {
  if (this.active === 1) return;
  this.active = 1;
}

export function stop() {
  if (this.active < 1) return;
  this.active = 0;
  // if timeline mid-play, rewind to start
  if (this.animctr) this.animctr.pause(0);
}

export function updateX(x = 0) {}
export function updateY(y = 0) {
  if (this.ctr.stop !== 1) {
    this.ctr.current = Math.min(Math.max(y - this.ctr.start, 0), this.ctr.limit);
  }
}
export function updateAnim() {
  this.ctr.progt = this.ctr.current / this.ctr.limit;
  this.ctr.prog  = this.ctr.prog * (1 - 0.015) + this.ctr.progt * 0.015;
  this.animctr.progress(this.ctr.prog);
}