export function check(entry) {
  const vis = entry.isIntersecting
  if (vis) this.start()
  else     this.stop(entry)
  return vis
}

export function start() {
  if (this.active === 1) return false
  this.active = 1
}

export function stop(entry) {
  if (this.active < 1) return false

  // if we're mid‐state, ease the timeline to the end
  if (this.state === 1) {
    gsap.to(this.animctr, {
      progress: 1,
      duration: 0.2,
      onComplete: () => {
        this.ctr.current = this.ctr.limit
        this.ctr.prog    = 1
      },
    })
  }

  this.active = 0
}

export function updateY(y = 0) {
  if (this.ctr.stop !== 1) {
    this.ctr.current = y - this.ctr.start
    // clamp between 0 and limit
    this.ctr.current = Math.min(Math.max(this.ctr.current, 0), this.ctr.limit)
  }
}

export function updateAnim() {
  // map scroll progress [0..limit] → [0..1]
  const prog = this.ctr.current / this.ctr.limit
  this.animctr.progress(prog)
}

export function updateScale() {
  // no per‐frame scale logic for Roll
}