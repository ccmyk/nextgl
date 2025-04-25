'use client'

import gsap from 'gsap'
import { clamp, lerp } from '@/webgl/core/utils'

// scroll & mouse “geometry” helpers for Slides
export function check(entry) {
  const vis = entry.isIntersecting
  if (vis) this.start(entry)
  else     this.stop(entry)
  return vis
}

export function start(entry) {
  // if we’re mid‐state (e.g. a single slide), only toggle pointer‐events
  if (this.state === 1 && this.single) {
    const y = entry.boundingClientRect.y
    this.single.style.pointerEvents = y > 60 ? 'all' : 'none'
    return
  }
  gsap.set(this.canvas, { display: 'block' })
  if (this.animin) {
    this.animin.play()
    if (this.touchl) this.active = 1
    return
  }
  if (this.active === 1) return
  this.active = 1
  this.textures.forEach(t => t.image.tagName === 'VIDEO' && t.image.play())
  this.slideanim.play()
}

export function stop(entry) {
  gsap.set(this.canvas, { display: 'none' })
  if (this.state === 1 && this.single) {
    this.single.style.pointerEvents = 'none'
    this.single.style.opacity       = 0
    this.oldpos = window.scrollY
  }
  if (this.active < 1 || this.state !== 0) return
  this.slideanim.pause()
  this.textures.forEach(t => t.image.tagName === 'VIDEO' && t.image.pause())
  this.active = 0
}

export function updateX() {
  this.statepos = this.objpos.x * this.totalpos
  this.meshes.forEach((m, i) => {
    let x = this.posmeshes[i] - this.statepos
    if (x <= this.minpos) {
      this.posmeshes[i] = this.statepos + this.maxpos + this.space
    }
    m.position.x = -(this.viewport[0]/2)
      + (m.scale.x/2)
      + (x / this.screen[0]) * this.viewport[0]
  })
}

export function updateY(y = 0) {
  if (this.ctr.stop !== 1) {
    this.ctr.current = clamp(y - this.ctr.start, 0, this.ctr.limit)
  }
}

export function updateScale() {
  const w = this.device < 3
    ? this.screen[0] * 0.322
    : this.screen[0] * 0.75
  const h = this.bound[3]
  this.meshes.forEach(m => {
    m.scale.x = (this.viewport[0] * w) / this.screen[0]
    m.scale.y = (this.viewport[1] * h) / this.screen[1]
  })
}

export function updateAnim() {
  this.ctr.progt = Number((this.ctr.current / this.ctr.limit).toFixed(3))
  this.ctr.prog  = lerp(this.ctr.prog, this.ctr.progt, 0.015)
  this.animctr.progress(this.ctr.prog)
}