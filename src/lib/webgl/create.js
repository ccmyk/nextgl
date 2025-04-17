// src/lib/webgl/create.js

import { createCamera } from './gl.js'

export async function create(texs = []) {
  await this.createAssets(texs)

  const div = document.createElement('div')
  div.dataset.temp = 'loader'
  this.loader = await this.createEls(div)

  await this.onResize()
  this.isVisible = 1
}

export async function cleanTemp() {
  for (const [_, a] of this.iosmap.entries()) {
    if (a.active === 1) {
      a.removeEvents()
    } else if (a.renderer) {
      a.renderer.gl.getExtension('WEBGL_lose_context').loseContext()
      a.canvas.remove()
    }
  }
}

export async function createTemp(temp) {
  this.ios = []
  this.temp = temp
  this.iosmap.clear()
  await this.createIos()
}

export async function createIos() {
  const ios = document.querySelectorAll('main .Oi')

  for (const [i, el] of ios.entries()) {
    el.dataset.oi = i
    const io = await this.createEls(el)

    if (!io.isready) {
      io.isready = 1
      io.el.style.visibility = 'hidden'
      io.isdone = 0
      io.onResize(this.viewport, this.main.screen)
      this.iosmap.set(i, io)
    } else if (io.el.classList.contains('Oi-pgel')) {
      this.iosmap.set(i, io)
      el.dataset.oi = io.pos
    }
  }

  await this.loadIos()
  this.isVisible = 1
}

export async function show() {
  this.showIos()
  await this.timeout(64)
  this.callIos()
}
