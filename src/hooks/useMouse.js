'use client'

import { useState, useEffect } from 'react'

export function useMouse() {
  const [coords, setCoords] = useState({ x: 0, y: 0, speed: 0 })
  let lastX = 0, lastY = 0, lastTime = performance.now()

  useEffect(() => {
    function onMove(e) {
      const t = performance.now()
      const x = e.clientX
      const y = e.clientY
      const dt = t - lastTime || 16
      const dx = x - lastX
      const dy = y - lastY
      const speed = Math.hypot(dx, dy) / dt
      lastX = x; lastY = y; lastTime = t
      setCoords({ x, y, speed })
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('touchmove', onMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('touchmove', onMove)
    }
  }, [])

  return coords
}