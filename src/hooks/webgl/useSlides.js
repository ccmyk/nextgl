'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useWebGL } from '@/webgl/core/WebGLContext'
import gsap from 'gsap'

export function useSlides({ elementRef, id = 0, medias = [] }) {
  const [slideState, setSlideState] = useState({
    isActive: false,           // Whether component is visible/active
    viewMode: 0,               // 0 = normal view, 1 = single view
    currentIndex: 0,           // Current slide index
    totalSlides: medias.length, // Total number of slides
    isReady: false,            // Component initialization status
    deviceType: 0              // Device type (1 = desktop, 2 = tablet, 3 = mobile)
  })
  
  // Refs for animation instances and WebGL effect
  const effectRef = useRef(null)
  const slidesRef = useRef([])
  const animationsRef = useRef({})
  const observerRef = useRef(null)
  const scrollPosRef = useRef(0)
  const videosRef = useRef([])
  
  const { webgl } = useWebGL()
  
  // Detect device type
  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase()
    let deviceType = 3 // Default: Mobile
    
    if (ua.indexOf('ipad') > -1 || (ua.indexOf('macintosh') > -1 && 'ontouchend' in document)) {
      deviceType = 2 // iPad
    } else if (window.innerWidth >= 1024) {
      deviceType = 1 // Desktop
    }
    
    setSlideState(prev => ({ ...prev, deviceType }))
  }, [])
  
  // Initialize WebGL effect
  const initializeEffect = useCallback(() => {
    if (!elementRef.current || !webgl.gl || effectRef.current) return
    
    const element = elementRef.current
    const bounds = element.getBoundingClientRect()
    
    // Find media elements
    const mediaElements = Array.from(element.querySelectorAll('.media-item > *'))
    
    // Setup textures and meshes
    const textures = []
    const meshes = []
    
    // Store video elements for later control
    videosRef.current = mediaElements.filter(el => el.tagName === 'VIDEO')
    
    // Placeholder for textures setup - this would be implemented in the WebGL component
    
    // Create and initialize the WebGL effect
    try {
      // Import dynamically to avoid SSR issues
      import('@/webgl/components/Slides').then(({ Slides }) => {
        effectRef.current = new Slides({
          gl: webgl.gl,
          scene: webgl.scene,
          camera: webgl.camera,
          element,
          bounds: [bounds.x, bounds.y, bounds.width, bounds.height],
          device: slideState.deviceType,
          textures,
          meshes,
          medias: mediaElements
        })
        
        // Initialize post-processing
        effectRef.current.createPost()
        
        // Initialize slides
        effectRef.current.initSlides()
        
        // Register with WebGL manager
        webgl.registerComponent(`slides-${id}`, effectRef.current)
        
        // Initial sizing
        effectRef.current.onResize([window.innerWidth, window.innerHeight], {
          w: window.innerWidth,
          h: window.innerHeight
        })
        
        setSlideState(prev => ({ ...prev, isReady: true }))
      })
    } catch (error) {
      console.error('Failed to initialize WebGL effect:', error)
    }
    
    return () => {
      if (effectRef.current) {
        webgl.unregisterComponent(`slides-${id}`)
        effectRef.current.removeEvents()
        effectRef.current = null
      }
    }
  }, [elementRef, id, webgl, slideState.deviceType, medias])
  
  // Setup intersection observer
  useEffect(() => {
    if (!elementRef.current || !effectRef.current) return
    
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        const isIntersecting = entry.isIntersecting
        
        setSlideState(prev => ({ ...prev, isActive: isIntersecting }))
        
        if (effectRef.current) {
          effectRef.current.check(entry)
        }
      },
      { threshold: [0.1, 0.5, 0.9] }
    )
    
    observerRef.current.observe(elementRef.current)
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [elementRef])
  
  // Setup scroll event handling
  useEffect(() => {
    if (!effectRef.current) return
    
    const handleScroll = () => {
      if (!effectRef.current || effectRef.current.active !== 1) return
      
      const currentScrollY = window.scrollY
      const hasScrolled = currentScrollY !== scrollPosRef.current
      
      scrollPosRef.current = currentScrollY
      
      effectRef.current.update(
        performance.now(),
        hasScrolled ? 1 : 0,
        currentScrollY
      )
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  // Handle resize events
  useEffect(() => {
    if (!effectRef.current) return
    
    const handleResize = () => {
      if (!elementRef.current || !effectRef.current) return
      
      const bounds = elementRef.current.getBoundingClientRect()
      
      effectRef.current.onResize([window.innerWidth, window.innerHeight], {
        w: window.innerWidth,
        h: window.innerHeight
      })
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [elementRef])
  
  // Video playback control
  const controlVideos = useCallback((shouldPlay) => {
    videosRef.current.forEach(video => {
      if (shouldPlay) {
        video.play().catch(err => console.log('Video play error:', err))
      } else {
        video.pause()
      }
    })
  }, [])
  
  // Play video at specific index
  const playVideoAtIndex = useCallback((index) => {
    if (index < 0 || index >= videosRef.current.length) return
    
    videosRef.current.forEach((video, i) => {
      if (i === index) {
        video.play().catch(err => console.log('Video play error:', err))
      } else {
        video.pause()
      }
    })
  }, [])
  
  // Handle view mode switching (normal/single)
  const setViewMode = useCallback(async (mode) => {
    if (!effectRef.current || slideState.viewMode === mode) return
    
    try {
      // Update state
      setSlideState(prev => ({ ...prev, viewMode: mode }))
      
      // Update WebGL state
      await effectRef.current.changeState(mode)
      
      // Manage video playback based on mode
      if (mode === 1) {
        // In single view, only play the current video
        playVideoAtIndex(slideState.currentIndex)
      } else {
        // In normal view, play all videos
        controlVideos(slideState.isActive)
      }
    } catch (error) {
      console.error('Error changing view mode:', error)
    }
  }, [slideState.viewMode, slideState.currentIndex, slideState.isActive, controlVideos, playVideoAtIndex])
  
  // Toggle between view modes
  const toggleViewMode = useCallback(() => {
    setViewMode(slideState.viewMode === 0 ? 1 : 0)
  }, [slideState.viewMode, setViewMode])
  
  // Navigate to specific slide
  const goToSlide = useCallback((index) => {
    if (!effectRef.current || index < 0 || index >= slideState.totalSlides) return
    
    // Update current index
    setSlideState(prev => ({ ...prev, currentIndex: index }))
    
    // If in single view mode, update the active slide
    if (slideState.viewMode === 1 && effectRef.current.activateSlide) {
      effectRef.current.activateSlide(index)
      playVideoAtIndex(index)
    }
  }, [slideState.totalSlides, slideState.viewMode, playVideoAtIndex])
  
  // Navigate to next/previous slide
  const nextSlide = useCallback(() => {
    const nextIndex = (slideState.currentIndex + 1) % slideState.totalSlides
    goToSlide(nextIndex)
  }, [slideState.currentIndex, slideState.totalSlides, goToSlide])
  
  const prevSlide = useCallback(() => {
    const prevIndex = (slideState.currentIndex - 1 + slideState.totalSlides) % slideState.totalSlides
    goToSlide(prevIndex)
  }, [slideState.currentIndex, slideState.totalSlides, goToSlide])
  
  // Initialize effect on mount
  useEffect(() => {
    initializeEffect()
  }, [initializeEffect])
  
  // Control videos based on active state
  useEffect(() => {
    controlVideos(slideState.isActive && slideState.viewMode === 0)
  }, [slideState.isActive, slideState.viewMode, controlVideos])
  
  return {
    ...slideState,
    effectRef,
    toggleViewMode,
    setViewMode,
    goToSlide,
    nextSlide,
    prevSlide,
    controlVideos
  }
}

