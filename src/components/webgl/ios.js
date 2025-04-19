// src/components/webgl/ios.js

'use client'

export function callIos() {
  const opts = { root: null, threshold: [0] }

  this.callback = (entries) => {
    entries.forEach((entry) => {
      const pos = entry.target.dataset.oi
      if (!pos || this.isVisible === 0) return
      if (this.iosmap.has(+pos)) this.checkIo(pos, entry)
    })
  }

  this.obs = new IntersectionObserver(this.callback, opts)

  for (const [_, instance] of this.iosmap.entries()) {
    this.obs.observe(instance.el)
  }
}

export async function loadIos() {
  for (const [_, instance] of this.iosmap.entries()) {
    if (instance.load) await instance.load(this.loadImage, this.loadVideo)
  }
}

export function showIos() {
  for (const [_, instance] of this.iosmap.entries()) {
    instance.el.style.visibility = 'visible'
  }
}

export function checkIo(pos, entry) {
  const instance = this.iosmap.get(+pos)
  if (instance?.check) instance.check(entry)
}
