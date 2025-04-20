// src/hooks/useTitleEvents.js

'use client'

import { useEffect, useRef } from 'react'
import { DeviceType } from './useTitleState'

/**
 * Hook to handle title interaction events
 * @param {Object} params - Hook parameters
 * @param {Object} params.titleRefs - Object containing refs to title elements
 * @param {Object} params.meshRef - Reference to WebGL mesh
 * @param {Object} params.programRef - Reference to WebGL program
 * @param {Object} params.canvasRefs - Array of canvas element references
 * @param {Object} params.dimensions - Viewport dimensions
 * @param {boolean} params.isReady - Whether components are ready for interaction
 * @returns {Object} Event handler cleanup functions
 */
export default function useTitleEvents({ 
  titleRefs, 
  meshRef, 
  programRef, 
  canvasRefs,
  dimensions,
  isReady = false
}) {
  const eventListenersRef = useRef(new Map())
  const isInitializedRef = useRef(false)
  const errorRef = useRef(null)
  
  // Detect device type for appropriate event handling
  const deviceType = useRef(
    typeof window !== 'undefined' 
      ? window.innerWidth < 768 
        ? DeviceType.MOBILE 
        : DeviceType.DESKTOP
      : DeviceType.DESKTOP
  )
  
  // Handle mouse/touch interactions with title elements
  useEffect(() => {
    if (!isReady || !titleRefs || !programRef?.current?.uniforms || isInitializedRef.current) return
    
    try {
      // Clear any previous listeners
      eventListenersRef.current.forEach((listeners, element) => {
        Object.entries(listeners).forEach(([event, handler]) => {
          element.removeEventListener(event, handler)
        })
      })
      eventListenersRef.current.clear()
      
      // Process all title elements
      Object.entries(titleRefs).forEach(([key, ref]) => {
        if (!ref?.current) return
        
        const element = ref.current
        const listeners = {}
        
        // Mouse enter handler - increase power value for hover effect
        const handleMouseEnter = () => {
          if (programRef.current?.uniforms?.uPower) {
            programRef.current.uniforms.uPower.value = 1.5
          }
        }
        
        // Mouse leave handler - reset power value
        const handleMouseLeave = () => {
          if (programRef.current?.uniforms?.uPower) {
            programRef.current.uniforms.uPower.value = 1
          }
        }
        
        // Touch start handler for mobile
        const handleTouchStart = () => {
          if (programRef.current?.uniforms?.uPower) {
            programRef.current.uniforms.uPower.value = 1.5
          }
        }
        
        // Touch end handler for mobile
        const handleTouchEnd = () => {
          if (programRef.current?.uniforms?.uPower) {
            programRef.current.uniforms.uPower.value = 1
          }
        }
        
        // Add mouse events for desktop
        if (deviceType.current === DeviceType.DESKTOP) {
          element.addEventListener('mouseenter', handleMouseEnter)
          element.addEventListener('mouseleave', handleMouseLeave)
          
          listeners.mouseenter = handleMouseEnter
          listeners.mouseleave = handleMouseLeave
        } 
        // Add touch events for mobile
        else {
          element.addEventListener('touchstart', handleTouchStart)
          element.addEventListener('touchend', handleTouchEnd)
          
          listeners.touchstart = handleTouchStart
          listeners.touchend = handleTouchEnd
        }
        
        // Store listeners for cleanup
        eventListenersRef.current.set(element, listeners)
      })
      
      isInitializedRef.current = true
      
    } catch (err) {
      console.error('Error setting up title events:', err)
      errorRef.current = err
    }
    
    // Cleanup function to remove all event listeners
    return () => {
      eventListenersRef.current.forEach((listeners, element) => {
        Object.entries(listeners).forEach(([event, handler]) => {
          element.removeEventListener(event, handler)
        })
      })
      eventListenersRef.current.clear()
    }
  }, [titleRefs, programRef, isReady])
  
  // Handle window resize events
  useEffect(() => {
    if (!isReady || !programRef?.current?.uniforms) return
    
    const handleResize = () => {
      try {
        // Update device type
        deviceType.current = window.innerWidth < 768 
          ? DeviceType.MOBILE 
          : DeviceType.DESKTOP
          
        // Update shader uniforms based on new dimensions if needed
        if (programRef.current?.uniforms?.uResolution) {
          programRef.current.uniforms.uResolution.value.set(
            dimensions.width || window.innerWidth,
            dimensions.height || window.innerHeight
          )
        }
        
        // Reinitialize event listeners if device type changed
        isInitializedRef.current = false
        
      } catch (err) {
        console.error('Error handling resize in title events:', err)
        errorRef.current = err
      }
    }
    
    // Initial call
    handleResize()
    
    // Add resize listener
    window.addEventListener('resize', handleResize)
    
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [isReady, programRef, dimensions])
  
  return {
    isInitialized: isInitializedRef.current,
    error: errorRef.current,
    cleanup: () => {
      eventListenersRef.current.forEach((listeners, element) => {
        Object.entries(listeners).forEach(([event, handler]) => {
          element.removeEventListener(event, handler)
        })
      })
      eventListenersRef.current.clear()
    }
  }
}
