// src/hooks/useSlidesEvents.js

import { useEffect } from 'react'

export default function useSlidesEvents({
  el,
  state,
  animhover,
  slideanim,
  resetMeshes,
  meshes,
  screen,
  viewport,
  textures,
  dev,
  canvasRef,
  start,
  stop,
}) {
  useEffect(() => {
    if (dev < 2) {
      el.parentNode.onmouseenter = () => {
        animhover.current?.timeScale(1)
        animhover.current?.play()
      }
      el.parentNode.onmouseleave = () => {
        animhover.current?.pause()
        animhover.current?.timeScale(0.7)
        animhover.current?.reverse()
      }
    }

    const handleVis = (e) => {
      if (![1, -2].includes(state)) return

      if (document.visibilityState === 'hidden') {
        slideanim.pause()
        slideanim.progress(0)
        resetMeshes()
      } else {
        slideanim.restart()
        slideanim.play()
      }
    }

    document.addEventListener('visibilitychange', handleVis)

    // Set video texture sizes
    meshes.forEach((mesh, i) => {
      const tex = textures[i]
      const media = tex?.image
      if (!media) return

      mesh.program.uniforms.uTextureSize.value = media.tagName === 'VIDEO'
        ? [media.width, media.height]
        : [media.naturalWidth, media.naturalHeight]
    })

    return () => {
      document.removeEventListener('visibilitychange', handleVis)
    }
  }, [el, state, animhover, slideanim, resetMeshes, meshes, screen, viewport, textures, dev, canvasRef])
}
