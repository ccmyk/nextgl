// src/hooks/useResizeEvents.js

'use client'

import { useEffect } from 'react'

export function useResizeEvents() {
  useEffect(() => {
    let resizeTimeout

    const onResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        document.documentElement.classList.add('resizing')
        setTimeout(() => {
          document.documentElement.classList.remove('resizing')
        }, 250)
        window.dispatchEvent(new CustomEvent('app:resize'))
      }, 100)
    }

    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [])
}