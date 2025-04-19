// src/components/webgl/els.js

'use client'

import createBaseGeometry from '@/lib/webgl/createBaseGeometry'
import createFooterGeometry from '@/lib/webgl/createFooterGeometry'
import createRollGeometry from '@/lib/webgl/createRollGeometry'
import createSlidesGeometry from '@/lib/webgl/createSlidesGeometry'
import createTitleGeometry from '@/lib/webgl/createTitleGeometry'
import createAboutGeometry from '@/lib/webgl/createAboutGeometry'
import createPgGeometry from '@/lib/webgl/createPgGeometry'
import createLoaderGeometry from '@/lib/webgl/createLoaderGeometry'
import createBackgroundGeometry from '@/lib/webgl/createBackgroundGeometry'

export default function createElsMap({ gl, font, texture, elements, device }) {
  const map = new Map()

  elements.forEach((el) => {
    const temp = el.dataset.temp

    let result = null

    switch (temp) {
      case 'title':
        result = createTitleGeometry({ gl, font, texture, el })
        break
      case 'footer':
        result = createFooterGeometry(gl, el)
        break
      case 'roll':
        result = createRollGeometry(gl, el)
        break
      case 'slides':
        result = createSlidesGeometry({ gl, el, dataset: el.dataset })
        break
      case 'base':
        result = createBaseGeometry(gl)
        break
      case 'about':
        result = createAboutGeometry({ gl, el, device })
        break
      case 'pg':
        result = createPgGeometry(gl)
        break
      case 'loader':
        result = createLoaderGeometry(gl)
        break
      case 'bg':
        result = createBackgroundGeometry(gl)
        break
      default:
        console.warn(`Unknown temp: ${temp}`)
    }

    if (result) {
      map.set(temp, result)
    }
  })

  return map
}