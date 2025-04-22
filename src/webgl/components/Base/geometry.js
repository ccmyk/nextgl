'use strict'

export function check(entry) {
  const vis = entry.isIntersecting
  if (vis === undefined) return false
  if (vis) this.start()
  else this.stop()
  return vis
}
export function start() {
  if (this.active === 1) return false
  if (this.isv) this.tex.image.play()
  this.active = 1
  this.updateX()
  this.updateY()
  this.updateScale()
}
export function stop() {
  if (this.active === 0 || this.active === -1) return false
  if (this.isv) this.media.pause()
  this.active = 0
}
export function updateX(x = 0) {}
export function updateY(y = 0) {
  if (this.ctr.stop !== 1) {
    this.ctr.current = Math.min(Math.max(y - this.ctr.start, 0), this.ctr.limit)
  }
}
export function updateAnim() {
  this.ctr.progt = (this.ctr.current / this.ctr.limit).toFixed(3)
  this.ctr.prog = this.ctr.prog * (1 - this.ctr.lerp) + this.ctr.progt * this.ctr.lerp
  this.animctr.progress(this.ctr.prog)
}
export function updateScale() {}