import gsap from 'gsap'

// Optional: if you need clamp and lerp here,
// either import from a small utils file or inline them:
const clamp = (v, min, max) => Math.min(Math.max(v, min), max)
const lerp  = (a, b, t)    => a * (1 - t) + b * t

export function check(entry) {
  const vis = entry.isIntersecting
  if (vis) this.start()
  else     this.stop()
  return vis
}

export function start() {
  if (this.active === 1) return false
  if (this.active === -1) {
    this.animstart = gsap.timeline({ paused: true })
      .set(this.canvas, { opacity: 1 }, 0)
      .fromTo(
        this.post.passes[0].program.uniforms.uStart,
        { value: -0.92 },
        { value: 1, duration: 4, ease: 'power2.inOut' },
        0
      )
    this.animstart.play()
  }
  this.active = 1
}

export function stop() {
  this.end = 0
  Object.assign(this.ctr, { prog: 0, progt: 0 })
  this.animctr.progress(0)
  if (this.active < 1) return false
  this.active = 0
}

export function updateX(x = 0) {}

export function updateY(y = 0) {
  if (this.ctr.stop !== 1) {
    this.ctr.current = clamp(y - this.ctr.start, 0, this.ctr.limit)
  }
}

export function updateAnim() {
  this.ctr.progt = Number((this.ctr.current / this.ctr.limit).toFixed(3))
  this.ctr.prog  = lerp(this.ctr.prog, this.ctr.progt, 0.015)
  this.animctr.progress(this.ctr.prog)
}

export function updateScale() {}