// src/components/media/LazyVideo.jsx

'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import gsap from 'gsap'

export default function LazyVideo({ src, auto = false, touch = false }) {
  const containerRef = useRef(null)
  const videoRef = useRef(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [visible, setVisible] = useState(false)
  const observerRef = useRef(null)

  // Audio toggle logic (with GSAP animation fallback)
  const toggleAudio = useCallback(async () => {
    if (!videoRef.current) return

    const video = videoRef.current
    const muted = video.muted

    const bOn = containerRef.current?.querySelector('.on')
    const bOff = containerRef.current?.querySelector('.off')

    if (muted) {
      video.muted = false
      gsap.to(bOn, { autoAlpha: 1, duration: 0.3 })
      gsap.to(bOff, { autoAlpha: 0, duration: 0.3 })
    } else {
      video.muted = true
      gsap.to(bOn, { autoAlpha: 0, duration: 0.3 })
      gsap.to(bOff, { autoAlpha: 1, duration: 0.3 })
    }
  }, [])

  // Lazy load trigger via IO
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true)
        observer.disconnect()
      }
    }, { threshold: 0.25 })

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    observerRef.current = observer

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!visible || !videoRef.current) return

    const video = videoRef.current
    video.src = src
    video.classList.add('ivi')

    if (auto) {
      video.loop = true
      video.muted = true
      video.setAttribute('playsinline', 'true')
      video.setAttribute('webkit-playsinline', 'true')
      if (!touch) video.play()
    }

    const onCanPlay = () => {
      setIsLoaded(true)
      video.classList.add('Ldd')
    }

    video.addEventListener('canplay', onCanPlay)
    return () => {
      video.removeEventListener('canplay', onCanPlay)
    }
  }, [visible, auto, touch, src])

  return (
    <div className="lazy-video-container" ref={containerRef}>
      <video ref={videoRef} preload="none" playsInline muted />
      <button className="cAudio" onClick={toggleAudio}>
        <span className="on">🔊</span>
        <span className="off">🔇</span>
      </button>
    </div>
  )
}