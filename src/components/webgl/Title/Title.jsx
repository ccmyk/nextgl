// src/components/webgl/Title/Title.jsx

'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { useWebGL } from '@/context/WebGLContext'
import { useAppContext, useAppState } from '@/context/AppProvider'
import { useTitleAnimation } from '@/hooks/useTitleAnimation'
import useTitleState from '@/hooks/useTitleState'
import useTitleTimeline, { AnimationSequence } from '@/hooks/useTitleTimeline'
import useTitleEvents from '@/hooks/useTitleEvents'
import createTitleGeometry from '@/lib/webgl/createTitleGeometry'

/**
 * WebGL Title component that creates and manages animated title geometry
 * 
 * @param {Object} props - Component props
 * @param {Object} props.titleRefs - Object containing refs to title elements
 * @param {Function} props.onReady - Callback when title is ready to animate
 * @param {Function} props.onError - Error callback
 * @returns {JSX.Element} Renders loading or error state if needed
 */
export default function Title({ titleRefs, onReady, onError }) {
  // Get WebGL context and app state
  const { gl, scene, renderer, camera, isReady: isWebGLReady } = useWebGL()
  const { dimensions, setLoaded, isLoaded } = useAppState()
  const { navRef } = useAppContext()
  
  // Component state
  const [fontsLoaded, setFontsLoaded] = useState(false)
  const [error, setError] = useState(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  
  // Refs for WebGL objects
  const meshRef = useRef(null)
  const programRef = useRef(null)
  const postProcessRef = useRef({ value: null })
  const canvasRefs = useRef([])
  const timeoutRef = useRef(null)
  const rafRef = useRef(null)
  
  // Status tracking
  const statusRef = useRef({
    geometryCreated: false,
    fontsLoaded: false,
    animationsReady: false,
    canvasesReady: false,
    sceneReady: false,
    ready: false,
    error: null
  })
  
  // Handle errors consistently
  const handleError = useCallback((err, errorType) => {
    console.error(`Title Error (${errorType}):`, err)
    statusRef.current.error = err
    
    // Set error state
    setError(errorType || 'Unknown error')
    
    // Notify via callback if provided
    if (onError) {
      onError(err, errorType)
    }
  }, [onError])
  
  // Update loading progress
  const updateProgress = useCallback((progress) => {
    setLoadingProgress(Math.min(100, Math.max(0, progress)))
  }, [])
  
  // Set up title canvas elements
  useEffect(() => {
    if (!isWebGLReady || !titleRefs) return
    
    try {
      // Clear previous timeouts
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      
      // Find all canvas elements in title containers
      const canvases = document.querySelectorAll('.title-canvas')
      if (canvases.length > 0) {
        canvasRefs.current = Array.from(canvases)
        statusRef.current.canvasesReady = true
        updateProgress(20)
      } else {
        // If canvases aren't immediately available, try again after a short delay
        timeoutRef.current = setTimeout(() => {
          const retryCanvases = document.querySelectorAll('.title-canvas')
          if (retryCanvases.length > 0) {
            canvasRefs.current = Array.from(retryCanvases)
            statusRef.current.canvasesReady = true
            updateProgress(20)
          }
        }, 100)
      }
    } catch (err) {
      handleError(err, 'Canvas initialization failed')
    }
    
    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [isWebGLReady, titleRefs, handleError, updateProgress])
  
  // Handle font loading
  useEffect(() => {
    if (!isWebGLReady || fontsLoaded) return
    
    const loadFonts = async () => {
      try {
        updateProgress(30)
        
        // In a real implementation, this would load MSDF font textures
        // For now, we'll simulate the loading with a timeout
        await new Promise(resolve => {
          timeoutRef.current = setTimeout(() => {
            statusRef.current.fontsLoaded = true
            updateProgress(50)
            resolve()
          }, 150)
        })
        
        setFontsLoaded(true)
      } catch (err) {
        handleError(err, 'Font loading failed')
      }
    }
    
    loadFonts()
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [isWebGLReady, fontsLoaded, handleError, updateProgress])
  
  // Initialize WebGL context loss handling
  useEffect(() => {
    if (!gl || !isWebGLReady) return
    
    const handleContextLost = (e) => {
      e.preventDefault()
      console.warn('WebGL context lost')
      cancelAnimationFrame(rafRef.current)
    }
    
    const handleContextRestored = () => {
      console.log('WebGL context restored')
      // Re-initialize all WebGL resources
      setIsInitialized(false)
      statusRef.current.geometryCreated = false
      statusRef.current.ready = false
      
      // Force re-render after a short delay
      setTimeout(() => {
        setIsInitialized(false)
      }, 100)
    }
    
    // Add event listeners to canvas
    const canvas = gl.canvas
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
  }, [gl, isWebGLReady])
  
  // Initialize title geometry
  useEffect(() => {
    if (!gl || !scene || !fontsLoaded || !titleRefs || error || statusRef.current.geometryCreated) return
    
    try {
      updateProgress(60)
      
      // Create common geometry to be used by all title elements
      const { mesh, program } = createTitleGeometry({
        gl,
        renderer,
        devicePixelRatio: Math.min(window.devicePixelRatio, 2),
        width: dimensions.width,
        height: dimensions.height
      })
      
      // Store references
      meshRef.current = mesh
      programRef.current = program
      
      // Set initial uniforms
      if (program && program.uniforms) {
        // Set up shader uniforms
        program.uniforms.uTime = { value: 0 }
        program.uniforms.uResolution = { 
          value: { 
            x: dimensions.width || window.innerWidth, 
            y: dimensions.height || window.innerHeight 
          } 
        }
      }
      
      // Add to scene
      if (scene.addChild) {
        scene.addChild(mesh)
        statusRef.current.sceneReady = true
      }
      
      statusRef.current.geometryCreated = true
      updateProgress(80)
      
      // Cleanup function
      return () => {
        if (scene.removeChild && mesh) {
          scene.removeChild(mesh)
        }
        
        if (program) {
          // Clean up shader resources
          if (program.remove) {
            program.remove()
          }
          
          // Dispose of textures and buffers
          if (program.textures) {
            Object.values(program.textures).forEach(texture => {
              if (texture && texture.dispose) {
                texture.dispose()
              }
            })
          }
        }
      }
    } catch (err) {
      handleError(err, 'WebGL initialization failed')
    }
  }, [gl, scene, renderer, dimensions, fontsLoaded, titleRefs, error, handleError, updateProgress])
  
  // Set up state management
  const stateManager = useTitleState({
    titleRefs,
    programRef,
    dimensions,
    isReady: isWebGLReady && fontsLoaded && statusRef.current.geometryCreated && !error
  })
  
  // Set up animation timelines
  const timelineManager = useTitleTimeline({
    programRef,
    postRef: postProcessRef,
    titleRefs,
    dimensions,
    stateManager,
    isReady: isWebGLReady && fontsLoaded && statusRef.current.geometryCreated && !error
  })
  
  // Set up event handlers
  const eventManager = useTitleEvents({
    titleRefs,
    meshRef,
    programRef,
    canvasRefs,
    dimensions,
    isReady: isWebGLReady && fontsLoaded && statusRef.current.geometryCreated && !error
  })
  
  // Set up main animation loop
  useEffect(() => {
    if (!isWebGLReady || !fontsLoaded || !statusRef.current.geometryCreated || error) return
    
    // Set component as initialized only when everything is ready
    if (!isInitialized && 
        statusRef.current.geometryCreated && 
        statusRef.current.fontsLoaded &&
        statusRef.current.canvasesReady &&
        statusRef.current.sceneReady) {
      
      setIsInitialized(true)
      statusRef.current.ready = true
      updateProgress(100)
      
      // Notify parent component that title is ready
      if (onReady) {
        onReady({
          mesh: meshRef.current,
          program: programRef.current,
          state: stateManager,
          timeline: timelineManager
        })
      }
      
      // Update app state to indicate loading complete
      if (!isLoaded && setLoaded) {
        // Delay slightly to ensure animations have started
        setTimeout(() => {
          setLoaded(true)
        }, 200)
      }
    }
  }, [
    isWebGLReady, 
    fontsLoaded, 
    error, 
    isInitialized, 
    stateManager,
    timelineManager,
    onReady,
    updateProgress,
    isLoaded,
    setLoaded
  ])
  
  // Set up animation loop for continuous updates
  useEffect(() => {
    if (!isWebGLReady || !isInitialized || !programRef.current || error) return
    
    let startTime = performance.now()
    let frameCount = 0
    let lastFpsUpdate = 0
    let fps = 0
    
    // Animation loop function
    const animate = (timestamp) => {
      // Calculate FPS every second
      frameCount++
      if (timestamp - lastFpsUpdate >= 1000) {
        fps = Math.round((frameCount * 1000) / (timestamp - lastFpsUpdate))
        frameCount = 0
        lastFpsUpdate = timestamp
        
        // Log performance data if debugging is enabled
        if (process.env.NODE_ENV === 'development') {
          console.log(`Title WebGL Performance: ${fps} FPS`)
        }
      }
      
      // Update time uniform if it exists
      if (programRef.current && programRef.current.uniforms && programRef.current.uniforms.uTime) {
        programRef.current.uniforms.uTime.value = (timestamp - startTime) * 0.001
        
        // Update in state manager if available
        if (stateManager && stateManager.updateUniform) {
          stateManager.updateUniform('uTime', programRef.current.uniforms.uTime.value)
        }
      }
      
      // Track frame in state manager
      if (stateManager && stateManager.trackFrame) {
        stateManager.trackFrame()
      }
      
      // Request next frame
      rafRef.current = requestAnimationFrame(animate)
    }
    
    // Start animation loop
    rafRef.current = requestAnimationFrame(animate)
    
    // Cleanup animation loop on unmount
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }
  }, [isWebGLReady, isInitialized, error, stateManager])
  
  // Listen for window visibility changes
  useEffect(() => {
    if (!isInitialized) return
    
    // Pause animations when tab is not visible
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Pause animations to save battery
        if (timelineManager && timelineManager.pauseSequence) {
          timelineManager.pauseSequence()
        }
        
        // Cancel animation frame
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current)
          rafRef.current = null
        }
      } else {
        // Resume animations
        if (timelineManager && timelineManager.playSequence) {
          timelineManager.playSequence(timelineManager.currentSequence || AnimationSequence.IDLE)
        }
        
        // Restart animation loop
        if (!rafRef.current) {
          const animate = (timestamp) => {
            if (programRef.current && programRef.current.uniforms && programRef.current.uniforms.uTime) {
              programRef.current.uniforms.uTime.value = (timestamp) * 0.001
            }
            rafRef.current = requestAnimationFrame(animate)
          }
          rafRef.current = requestAnimationFrame(animate)
        }
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [isInitialized, timelineManager])
  
  // Final cleanup - ensure all resources are released when component unmounts
  useEffect(() => {
    return () => {
      // Cancel any pending animations
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
      
      // Cancel any pending timeouts
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
      
      // Cleanup state manager
      if (stateManager && stateManager.cleanup) {
        stateManager.cleanup()
      }
      
      // Cleanup timeline manager
      if (timelineManager && timelineManager.cleanup) {
        timelineManager.cleanup()
      }
      
      // Cleanup event manager
      if (eventManager && eventManager.cleanup) {
        eventManager.cleanup()
      }
    }
  }, [stateManager, timelineManager, eventManager])
  
  // Handle error state rendering if needed
  if (error) {
    return (
      <div className="webgl-title-error">
        <p>WebGL Error: {error}</p>
        <button 
          onClick={() => {
            setError(null)
            statusRef.current.error = null
            setIsInitialized(false)
            statusRef.current.geometryCreated = false
            statusRef.current.ready = false
            updateProgress(0)
          }}
        >
          Retry
        </button>
      </div>
    )
  }
  
  // Handle loading state rendering if needed
  if (!isInitialized && loadingProgress < 100 && !error) {
    return (
      <div className="webgl-title-loading">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${loadingProgress}%` }} 
          />
        </div>
        <p>Loading WebGL Title ({loadingProgress}%)</p>
      </div>
    )
  }
  
  // This component doesn't render anything when successfully initialized
  return null
}
