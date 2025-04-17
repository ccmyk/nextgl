// src/lib/webgl/events.js

export function onResize() {
  const { iosmap, loader, viewport, main } = this

  for (const [_, instance] of iosmap.entries()) {
    instance?.onResize?.(viewport, main.screen)
  }

  loader?.onResize?.(viewport, main.screen)
}

export function update(time, wheel, pos) {
  const { loader, iosmap, isVisible } = this

  if (loader) {
    if (loader.active !== 0) {
      loader.update(time, wheel, pos)
    } else {
      loader.removeEvents()
      delete this.loader
    }
  }

  if (!isVisible) return

  for (const [_, instance] of iosmap.entries()) {
    if (instance.active === 1) {
      instance.update(time, wheel, pos)
    }
  }
}

export function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function loadImage(url) {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = ''
    img.onload = () => resolve(img)
    img.onerror = () => resolve(img)
    img.src = url
  })
}

function cleanVideo(elem) {
  elem.oncanplay = null
  elem.onplay = null
  elem.currentTime = 0
  elem.pause()
}

export async function loadVideo(elem, url) {
  return new Promise((resolve) => {
    elem.loop = !elem.dataset.loop
    elem.muted = true
    elem.autoplay = true
    elem.setAttribute('webkit-playsinline', 'true')
    elem.setAttribute('playsinline', 'true')

    elem.onplay = () => (elem.isPlaying = true)

    elem.oncanplay = () => {
      if (elem.isPlaying) {
        elem.classList.add('Ldd')
        cleanVideo(elem)
        resolve(elem)
      }
    }

    elem.onerror = () => resolve(elem)
    elem.src = url
    elem.play()
  })
}
