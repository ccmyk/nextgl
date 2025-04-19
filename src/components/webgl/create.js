// src/components/webgl/create.js

'use client'

import WebGLManager from './Canvas'

let manager = null

export async function createWebGL(temp = 'loader') {
  const main = window.__main || {}
  const canvas = document.querySelector('#glBg') || document.createElement('canvas')

  if (!manager) {
    manager = new WebGLManager(main)
    manager.canvas = canvas
  }

  await manager.createAssets([])

  const div = document.createElement('div')
  div.dataset.temp = temp
  manager.loader = await manager.createEls(div)

  await manager.onResize()
  manager.isVisible = 1

  return manager
}

export async function createWebGLInstances(temp = null) {
  if (!manager) return
  manager.ios = []
  manager.temp = temp
  manager.iosmap.clear()
  await manager.createIos()
}

export async function cleanWebGLInstances() {
  if (!manager) return

  for (const [, instance] of manager.iosmap.entries()) {
    if (instance.active === 1) {
      instance.removeEvents?.()
    } else if (instance.renderer) {
      instance.renderer.gl.getExtension('WEBGL_lose_context')?.loseContext?.()
      instance.canvas?.remove()
    }
  }
}

export async function showWebGL() {
  if (!manager) return
  manager.showIos()
  await manager.timeout(64)
  manager.callIos()
}