// src/lib/webgl/gl.js

import {
  createCamera,
  createScene,
  create,
  cleanTemp,
  createTemp,
  createIos,
  show,
} from '@/lib/webgl/create'

import {
  createEls,
  createAssets,
  createMSDF,
  createTex,
} from '@/lib/webgl/els'

import {
  callIos,
  loadIos,
  showIos,
  checkIo,
} from '@/lib/ios/io'

import {
  onResize,
  update,
  timeout,
  loadImage,
  loadVideo,
} from '@/lib/webgl/events'

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
  createScene,
  createCamera,
  cleanTemp,
  createTemp,
  createIos,
  show,

  createMSDF,
  createAssets,
  createEls,
  createTex,

  callIos,
  loadIos,
  showIos,
  checkIo,

  onResize,
  update,
  timeout,
  loadImage,
  loadVideo,
})
