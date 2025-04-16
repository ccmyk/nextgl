// src/components/media/LazyImage.jsx

'use client'

import { useEffect, useRef, useState } from 'react'

export default function LazyImage({ src, alt = '', className = '', ...props }) {
  const imgRef = useRef(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const imgEl = imgRef.current
    if (!imgEl || !src) return

    const loadImage = () => {
      const tempImg = new Image()
      tempImg.src = src
      tempImg.onload = () => {
        if (imgEl) {
          imgEl.src = src
          setLoaded(true)
        }
      }
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          loadImage()
          observer.disconnect()
        }
      })
    }, { threshold: 0.1 })

    observer.observe(imgEl)

    return () => observer.disconnect()
  }, [src])

  return (
    <img
      ref={imgRef}
      alt={alt}
      data-lazy={src}
      className={`lazy-img ${loaded ? 'Ldd ivi' : ''} ${className}`.trim()}
      {...props}
    />
  )
}
