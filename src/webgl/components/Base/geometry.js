"use client";
"use client"import gsap from 'gsap'

export function check(entry) {
  const vis = entry.isIntersecting
  if (vis) this.start()
  else     this.stop()
  return vis
}

export function start() {
  if (this.active === 1) return false
  this.active = 1
  this.timeline.play()
}

export function stop() {
  if (this.active === 0) return false
  this.active = 0
  if (this.timeline) this.timeline.pause()
}

export function updateX(x = 0) {}
export function updateY(y = 0) {}
export function updateScale() {}