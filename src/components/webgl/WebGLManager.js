// src/components/webgl/WebGLManager.js

'use client'

import {
  create,
  createIos,
  cleanTemp,
  createTemp,
  show,
} from './create'

import {
  onResize,
  update,
  timeout,
  loadImage,
  loadVideo,
} from './events'

export default class WebGLManager {
  constructor(main) {
    this.main = main
    this.viewport = { w: 1, h: 1 }
    this.isVisible = 0
    this.ios = []
    this.iosmap = new Map()
  }

  timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  async changeSlides(st = 0) {
    let foot = null
    if (st === 1) {
      for (const [, a] of this.iosmap.entries()) {
        if (a.name === 'Slides') a.changeState(st)
      }
      await this.timeout(1400)
      for (const [, a] of this.iosmap.entries()) {
        if (a.name === 'Roll') a.changeState(st)
        else if (a.name === 'Footer') foot = a
      }
    } else {
      for (const [, a] of this.iosmap.entries()) {
        if (a.name === 'Roll') a.changeState(st)
      }
      for (const [, a] of this.iosmap.entries()) {
        if (a.name === 'Slides') a.changeState(st)
        else if (a.name === 'Footer') foot = a
      }
      await this.timeout(800)
    }
    if (foot) foot.onResize(this.viewport, this.main.screen)
  }
}

Object.assign(WebGLManager.prototype, {
  create,
  createIos,
  cleanTemp,
  createTemp,
  show,
  onResize,
  update,
  timeout,
  loadImage,
  loadVideo,
})