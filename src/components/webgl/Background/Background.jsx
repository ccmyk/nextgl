// src/components/webgl/Background/Background.jsx

'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useWebGL } from '@/context/WebGLContext'
import { useAppContext, useAppState } from '@/context/AppProvider'
import createBackgroundGeometry from '@/lib/webgl/createBackgroundGeometry'
import useBackgroundState from '@/hooks/useBackgroundState'
import useBackgroundTimeline from '@/hooks/useBackgroundTimeline'

/**
 * Background WebGL component responsible for creating and rendering the site background
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onReady - Optional callback when background is ready
 * @param {Function} props.onError - Optional callback when an error occurs
 * @returns {JSX.Element | null} - Renders loading/error state or nothing if successful
 */
export default function Background({ onReady, onError }) {
  // Get WebGL context and app state
  const { gl, scene, renderer, camera, isReady: isWebGLReady } = useWebGL()
  const { dimensions, isLoaded } = useAppState()
  
  // Component state
  const [error, setError] = useState(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  
  // Refs for WebGL objects and animation
  const meshRef = useRef(null)
  const programRef = useRef(null)
  const timeoutRef = useRef(null)
  const rafRef = useRef(null)
  
  // Status tracking
  const statusRef = useRef({
    geometryCreated: false,
    shadersCompiled: false,
    sceneReady: false,
    ready: false,
    error: null
  })
  
  // Performance monitoring
  const performanceRef = useRef({
    startTime: 0,
    frameCount: 0,
    fps: 0,
    lastFrameTime: 0
  })
  
  // Handle errors consistently
  const handleError = useCallback((err, errorType) => {
    console.error(`Background Error (${errorType}):`, err)
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
  
  // Initialize WebGL context loss handling
  useEffect(() => {
    if (!gl || !isWebGLReady) return
    
    const handleContextLost = (e) => {
      e.preventDefault()
      console.warn('WebGL context lost in Background component')
      cancelAnimationFrame(rafRef.current)
    }
    
    const handleContextRestored = () => {
      console.log('WebGL context restored in Background component')
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

  // Initialize background geometry
  useEffect(() => {
    if (!gl || !scene || error || statusRef.current.geometryCreated) return
    
    try {
      updateProgress(30)
      
      // Create background geometry
      const { mesh, program } = createBackgroundGeometry({
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
      updateProgress(70)
      
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
      handleError(err, 'Background geometry creation failed')
    }
  }, [gl, scene, renderer, dimensions, error, handleError, updateProgress])
  
  // Set up state and timeline management
  const stateManager = useBackgroundState({ 
    meshRef, 
    programRef,
    dimensions, 
    isReady: isWebGLReady && statusRef.current.geometryCreated && !error 
  })
  
  const timelineManager = useBackgroundTimeline({ 
    meshRef, 
    programRef,
    stateManager,
    isReady: isWebGLReady && statusRef.current.geometryCreated && !error 
  })
  
  // Set component as initialized and notify parent when ready
  useEffect(() => {
    if (!isWebGLReady || !statusRef.current.geometryCreated || error) return
    
    if (!isInitialized && statusRef.current.geometryCreated && statusRef.current.sceneReady) {
      setIsInitialized(true)
      statusRef.current.ready = true
      updateProgress(100)
      
      // Notify parent component
      if (onReady) {
        onReady({
          mesh: meshRef.current,
          program: programRef.current,
          state: stateManager,
          timeline: timelineManager
        })
      }
    }
  }, [
    isWebGLReady, 
    error, 
    isInitialized, 
    stateManager, 
    timelineManager, 
    onReady, 
    updateProgress
  ])
  
  // Set up animation loop for continuous updates
  useEffect(() => {
    if (!isWebGLReady || !isInitialized || !programRef?.current || error) return
    
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
        
        // Store performance data
        performanceRef.current.fps = fps
      }
      
      // Update time uniform if it exists
      if (programRef.current?.uniforms?.uTime) {
        programRef.current.uniforms.uTime.value = (timestamp - startTime) * 0.001
        
        // Update in state manager if available
        if (stateManager?.updateUniform) {
          stateManager.updateUniform('uTime', programRef.current.uniforms.uTime.value)
        }
      }
      
      // Track performance
      if (stateManager?.trackFrame) {
        stateManager.trackFrame()
      }
      
      rafRef.current = requestAnimationFrame(animate)
    }
    
    // Start animation
    rafRef.current = requestAnimationFrame(animate)
    
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }
  }, [isWebGLReady, isInitialized, error, stateManager])
  
  // Final cleanup
  useEffect(() => {
    return () => {
      // Cancel animation frame
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
      
      // Cancel any timeouts
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
      
      // Clean up managers
      if (stateManager?.cleanup) {
        stateManager.cleanup()
      }
      
      if (timelineManager?.cleanup) {
        timelineManager.cleanup()
      }
    }
  }, [stateManager, timelineManager])
  
  // Handle error state rendering if needed
  if (error) {
    return (
      <div className="webgl-background-error">
        <p>Background Error: {error}</p>
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
  
  // This component doesn't render anything when successful
  return null
}
