// src/components/webgl/events.js

'use client'

export function onResize(gl, { width, height }) {
  gl.canvas.width = width
  gl.canvas.height = height
  gl.viewport(0, 0, width, height)
}

export function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export async function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

export async function loadVideo(src) {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    video.autoplay = true
    video.muted = true
    video.loop = true
    video.playsInline = true
    video.crossOrigin = 'anonymous'
    video.onloadeddata = () => resolve(video)
    video.onerror = reject
    video.src = src
  })
}