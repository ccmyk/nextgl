// src/hooks/useLoaderEvents.js

import { useEffect } from 'react'

export default function useLoaderEvents({ meshRef }) {
  useEffect(() => {
    if (!meshRef.current) return

    const onResize = () => {
      const gl = meshRef.current.gl
      meshRef.current.program.uniforms.uResolution.value.set(gl.canvas.offsetWidth, gl.canvas.offsetHeight)
    }

    window.addEventListener('resize', onResize)
    onResize()

    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [meshRef])
}