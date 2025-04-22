'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { Slides as SlidesEffect } from '@/webgl/components/Slides'
import { useWebGL } from '@/webgl/core/WebGLContext'
import gsap from 'gsap'

export default function Slides({ 
  id = 0,
  medias = [],
  className = '',
  onReady,
  onStateChange
}) {
  const containerRef = useRef(null)
  const effectRef = useRef(null)
  const singleRef = useRef(null)
  const [isActive, setIsActive] = useState(false)
  const [state, setState] = useState(0) // 0 = normal, 1 = single view
  const [deviceType, setDeviceType] = useState(0)
  
  const { webgl } = useWebGL()

  // Initialize device type detection
  useEffect(() => {
    // Same device detection logic as legacy
    const ua = navigator.userAgent.toLowerCase()
    let deviceType = 3 // Default: Mobile
    
    if (ua.indexOf('ipad') > -1 || (ua.indexOf('macintosh') > -1 && 'ontouchend' in document)) {
      deviceType = 2 // iPad
    } else if (window.innerWidth >= 1024) {
      deviceType = 1 // Desktop
    }
    
    setDeviceType(deviceType)
  }, [])

  // Initialize WebGL effect
  useEffect(() => {
    if (!containerRef.current || !webgl.gl) return
    
    const element = containerRef.current
    const bounds = element.getBoundingClientRect()

    // Create textures for medias
    const textures = []
    const meshes = []
    
    // Initialize WebGL slides effect
    effectRef.current = new SlidesEffect({
      gl: webgl.gl,
      scene: webgl.scene,
      camera: webgl.camera,
      element,
      bounds: [bounds.x, bounds.y, bounds.width, bounds.height],
      device: deviceType,
      textures,
      meshes,
      medias
    })
    
    // Initialize post-processing
    effectRef.current.createPost()
    
    // Initialize slides
    effectRef.current.initSlides()
    
    // Register with WebGL manager with unique id
    webgl.registerComponent(`slides-${id}`, effectRef.current)
    
    // Initial sizing
    effectRef.current.onResize([window.innerWidth, window.innerHeight], {
      w: window.innerWidth,
      h: window.innerHeight
    })
    
    // Notify when ready
    if (onReady) onReady(effectRef.current)
    
    return () => {
      webgl.unregisterComponent(`slides-${id}`)
      if (effectRef.current) {
        effectRef.current.removeEvents()
      }
    }
  }, [webgl, id, medias, deviceType])

  // Handle resize events
  useEffect(() => {
    if (!effectRef.current) return
    
    const handleResize = () => {
      if (containerRef.current && effectRef.current) {
        const bounds = containerRef.current.getBoundingClientRect()
        effectRef.current.onResize([window.innerWidth, window.innerHeight], {
          w: window.innerWidth,
          h: window.innerHeight
        })
      }
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Handle intersection visibility
  useEffect(() => {
    if (!containerRef.current || !effectRef.current) return
    
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (effectRef.current) {
          effectRef.current.check(entry)
        }
      },
      { threshold: [0.1, 0.5, 0.9] }
    )
    
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  // Handle scroll updates
  useEffect(() => {
    if (!effectRef.current) return
    
    const handleScroll = () => {
      if (effectRef.current && effectRef.current.active === 1) {
        effectRef.current.update(
          performance.now(),
          window.scrollY !== effectRef.current.ctr.actual ? 1 : 0,
          window.scrollY
        )
      }
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Change state method (normal/single view mode)
  const changeState = useCallback(async (newState) => {
    if (!effectRef.current || state === newState) return
    
    // Update internal state
    setState(newState)
    
    // Update WebGL state
    await effectRef.current.changeState(newState)
    
    // Notify parent component
    if (onStateChange) {
      onStateChange(newState)
    }
  }, [state, onStateChange])

  // Toggle between normal and single view
  const toggleView = useCallback(() => {
    changeState(state === 0 ? 1 : 0)
  }, [state, changeState])

  return (
    <div 
      ref={containerRef}
      className={`slides-container relative ${className} ${isActive ? 'is-active' : ''} ${state === 1 ? 'single-view' : ''}`}
      data-ids={id}
    >
      <div 
        ref={singleRef}
        className="single"
        data-ids={id}
        onClick={toggleView}
      />
      {/* Media container - to hold all medias for rendering */}
      <div className="media-container hidden">
        {medias.map((media, index) => (
          <div key={index} className="media-item">
            {media}
          </div>
        ))}
      </div>
      {/* UI elements for slide navigation */}
      <div className="slides-navigation">
        <button 
          className="view-toggle"
          onClick={toggleView}
          aria-label={state === 0 ? "View single slide" : "View all slides"}
        />
      </div>
    </div>
  )
}

