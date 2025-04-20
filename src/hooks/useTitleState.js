// src/hooks/useTitleState.js

'use client'

import { useRef, useEffect, useState } from 'react'

/**
 * Device type enum for responsive behavior
 * @enum {number}
 */
export const DeviceType = {
  DESKTOP: 0,
  TABLET: 1,
  MOBILE: 2,
  ANDROID: 3
}

/**
 * Uniform defaults for WebGL shader program
 * @type {Object}
 */
const UNIFORM_DEFAULTS = {
  uStart: 1,
  uKey: -2,
  uPower: 1,
  uColor: 0,
  uResolution: null, // Will be set based on canvas size
  uTime: 0,
  uStrength: 0.5,
  uSeed: 0.5,
}

/**
 * Hook to manage WebGL title state including shader uniforms and context
 * @param {Object} params - Hook parameters
 * @param {Object} params.titleRefs - References to title elements
 * @param {Object} params.programRef - Reference to WebGL program
 * @param {Object} params.dimensions - Viewport dimensions
 * @param {boolean} params.isReady - Whether the component is ready
 * @returns {Object} State management object with bounds, device info, and methods
 */
export default function useTitleState({ titleRefs, programRef, dimensions, isReady = false }) {
  const boundsRef = useRef(new Map())
  const uniformsRef = useRef(new Map())
  const contextLostRef = useRef(false)
  const performanceRef = useRef({
    lastFrameTime: 0,
    frameCount: 0,
    fps: 0,
    startTime: 0,
  })
  const [error, setError] = useState(null)
  
  // Detect device type
  const deviceType = useRef(
    typeof window !== 'undefined' 
      ? window.innerWidth < 768 
        ? window.innerWidth < 480
          ? DeviceType.MOBILE
          : DeviceType.TABLET 
        : DeviceType.DESKTOP
      : DeviceType.DESKTOP
  )
  
  // Initialize and update uniform values
  useEffect(() => {
    if (!isReady || !programRef?.current?.uniforms) return
    
    try {
      const uniforms = programRef.current.uniforms
      
      // Initialize uniforms with defaults
      Object.entries(UNIFORM_DEFAULTS).forEach(([key, defaultValue]) => {
        if (uniforms[key] && defaultValue !== null) {
          uniforms[key].value = defaultValue
          
          // Store for tracking changes
          uniformsRef.current.set(key, {
            current: defaultValue,
            default: defaultValue,
            lastUpdate: Date.now()
          })
        }
      })
      
      // Set resolution if available
      if (uniforms.uResolution && dimensions) {
        uniforms.uResolution.value.set(
          dimensions.width || window.innerWidth,
          dimensions.height || window.innerHeight
        )
        
        uniformsRef.current.set('uResolution', {
          current: [dimensions.width || window.innerWidth, dimensions.height || window.innerHeight],
          default: [dimensions.width || window.innerWidth, dimensions.height || window.innerHeight],
          lastUpdate: Date.now()
        })
      }
      
      // Apply theme-specific colors based on data attributes
      if (titleRefs) {
        Object.entries(titleRefs).forEach(([key, ref]) => {
          if (ref?.current?.dataset?.lightTheme && uniforms.uColor) {
            uniforms.uColor.value = 1
            uniformsRef.current.set('uColor', { 
              current: 1, 
              default: 1,
              lastUpdate: Date.now() 
            })
          }
        })
      }
      
      // Initialize performance tracking
      performanceRef.current.startTime = performance.now()
      
    } catch (err) {
      console.error('Error initializing title state:', err)
      setError(err)
    }
  }, [titleRefs, programRef, dimensions, isReady])
  
  // Update bounds for positioning elements
  useEffect(() => {
    if (!isReady || !titleRefs) return
    
    try {
      // Get element bounds for all title elements
      Object.entries(titleRefs).forEach(([key, ref]) => {
        if (ref?.current) {
          const bounds = ref.current.getBoundingClientRect()
          boundsRef.current.set(key, bounds)
        }
      })
    } catch (err) {
      console.error('Error updating title element bounds:', err)
      setError(err)
    }
  }, [titleRefs, isReady, dimensions])
  
  // Handle WebGL context events
  useEffect(() => {
    if (!isReady || !programRef?.current) return
    
    // Handler for WebGL context loss
    const handleContextLost = (event) => {
      event.preventDefault()
      console.warn('WebGL context lost')
      contextLostRef.current = true
    }
    
    // Handler for WebGL context restoration
    const handleContextRestored = () => {
      console.log('WebGL context restored')
      contextLostRef.current = false
      
      // Re-initialize uniforms
      try {
        const uniforms = programRef.current.uniforms
        
        uniformsRef.current.forEach((data, key) => {
          if (uniforms[key]) {
            uniforms[key].value = data.current
          }
        })
      } catch (err) {
        console.error('Error restoring WebGL context:', err)
        setError(err)
      }
    }
    
    // Get canvas from program if available
    const canvas = programRef.current.gl?.canvas
    
    if (canvas) {
      canvas.addEventListener('webglcontextlost', handleContextLost)
      canvas.addEventListener('webglcontextrestored', handleContextRestored)
    }
    
    return () => {
      if (canvas) {
        canvas.removeEventListener('webglcontextlost', handleContextLost)
        canvas.removeEventListener('webglcontextrestored', handleContextRestored)
      }
    }
  }, [programRef, isReady])
  
  // Performance monitoring
  useEffect(() => {
    if (!isReady) return
    
    // Update FPS counter every second
    const interval = setInterval(() => {
      const now = performance.now()
      const elapsed = now - performanceRef.current.startTime
      
      if (elapsed > 0) {
        performanceRef.current.fps = Math.round(
          (performanceRef.current.frameCount * 1000) / elapsed
        )
        
        // Reset counter
        performanceRef.current.frameCount = 0
        performanceRef.current.startTime = now
      }
    }, 1000)
    
    return () => clearInterval(interval)
  }, [isReady])
  
  // Utility function to update a uniform value
  const updateUniform = (name, value) => {
    if (!programRef?.current?.uniforms?.[name]) return false
    
    try {
      programRef.current.uniforms[name].value = value
      
      // Update tracking
      if (uniformsRef.current.has(name)) {
        const data = uniformsRef.current.get(name)
        uniformsRef.current.set(name, {
          ...data,
          current: value,
          lastUpdate: Date.now()
        })
      } else {
        uniformsRef.current.set(name, {
          current: value,
          default: value,
          lastUpdate: Date.now()
        })
      }
      
      return true
    } catch (err) {
      console.error(`Error updating uniform ${name}:`, err)
      return false
    }
  }
  
  // Track frame rendering
  const trackFrame = () => {
    performanceRef.current.frameCount++
    performanceRef.current.lastFrameTime = performance.now()
  }
  
  // Reset all uniforms to defaults
  const resetUniforms = () => {
    try {
      if (!programRef?.current?.uniforms) return false
      
      Object.entries(UNIFORM_DEFAULTS).forEach(([key, defaultValue]) => {
        if (programRef.current.uniforms[key] && defaultValue !== null) {
          programRef.current.uniforms[key].value = defaultValue
          
          if (uniformsRef.current.has(key)) {
            const data = uniformsRef.current.get(key)
            uniformsRef.current.set(key, {
              ...data,
              current: defaultValue,
              lastUpdate: Date.now()
            })
          }
        }
      })
      
      return true
    } catch (err) {
      console.error('Error resetting uniforms:', err)
      return false
    }
  }
  
  return { 
    bounds: boundsRef.current,
    deviceType: deviceType.current,
    contextLost: contextLostRef.current,
    performance: performanceRef.current,
    updateUniform,
    resetUniforms,
    trackFrame,
    error,
    cleanup: () => {
      // Any additional cleanup actions
      uniformsRef.current.clear()
      boundsRef.current.clear()
    }
  }
}
