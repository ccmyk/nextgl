// src/hooks/useTitleTimeline.js

'use client'

import { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'

/**
 * Animation sequence types
 * @enum {string}
 */
export const AnimationSequence = {
  INTRO: 'intro',
  IDLE: 'idle',
  HOVER: 'hover',
  EXIT: 'exit'
}

/**
 * Hook to create and manage title animation timeline
 * @param {Object} params - Hook parameters
 * @param {Object} params.programRef - Reference to WebGL program
 * @param {Object} params.postRef - Reference to post-processing effects
 * @param {Object} params.titleRefs - References to title text elements
 * @param {Object} params.dimensions - Viewport dimensions
 * @param {Object} params.stateManager - Title state manager from useTitleState
 * @param {boolean} params.isReady - Whether the component is ready to animate
 * @returns {Object} Timeline controller with play, pause, methods and cleanup
 */
export default function useTitleTimeline({ 
  programRef, 
  postRef, 
  titleRefs,
  dimensions,
  stateManager,
  isReady = false 
}) {
  // Timeline references
  const mainTimelineRef = useRef(null)
  const sequencesRef = useRef(new Map())
  const isInitializedRef = useRef(false)
  const [currentSequence, setCurrentSequence] = useState(null)
  const performanceRef = useRef({
    startTime: 0,
    lastFrameTime: 0,
    duration: 0,
    completed: false
  })
  
  // Create main animation timeline
  useEffect(() => {
    // Skip if not ready or already initialized
    if (!isReady || !programRef?.current?.uniforms || !titleRefs || isInitializedRef.current) return
    
    try {
      // Create master GSAP timeline for sequencing
      const mainTimeline = gsap.timeline({ 
        paused: true,
        onComplete: () => {
          performanceRef.current.completed = true
          performanceRef.current.duration = performance.now() - performanceRef.current.startTime
          console.log('Title animation sequence completed in', performanceRef.current.duration, 'ms')
          
          // Update state tracking if available
          if (stateManager?.trackFrame) {
            stateManager.trackFrame()
          }
        },
        onUpdate: () => {
          performanceRef.current.lastFrameTime = performance.now()
          
          // Update state tracking if available
          if (stateManager?.trackFrame) {
            stateManager.trackFrame()
          }
        }
      })
      
      // Store main timeline reference
      mainTimelineRef.current = mainTimeline
      
      // Create intro sequence
      const introSequence = createIntroSequence({
        programRef,
        postRef,
        titleRefs,
        dimensions,
        stateManager
      })
      sequencesRef.current.set(AnimationSequence.INTRO, introSequence)
      
      // Create idle sequence for continuous subtle animation
      const idleSequence = createIdleSequence({
        programRef,
        postRef, 
        titleRefs,
        dimensions,
        stateManager
      })
      sequencesRef.current.set(AnimationSequence.IDLE, idleSequence)
      
      // Create hover sequence for interactive elements
      const hoverSequence = createHoverSequence({
        programRef,
        postRef,
        titleRefs,
        dimensions,
        stateManager
      })
      sequencesRef.current.set(AnimationSequence.HOVER, hoverSequence)
      
      // Create exit sequence
      const exitSequence = createExitSequence({
        programRef,
        postRef,
        titleRefs,
        dimensions,
        stateManager
      })
      sequencesRef.current.set(AnimationSequence.EXIT, exitSequence)
      
      isInitializedRef.current = true
      
    } catch (err) {
      console.error('Failed to create title animation timeline:', err)
    }
    
    return () => {
      // Kill all timelines
      if (mainTimelineRef.current) {
        mainTimelineRef.current.kill()
        mainTimelineRef.current = null
      }
      
      sequencesRef.current.forEach(timeline => {
        if (timeline) {
          timeline.kill()
        }
      })
      sequencesRef.current.clear()
      
      isInitializedRef.current = false
      setCurrentSequence(null)
    }
  }, [programRef, postRef, titleRefs, dimensions, stateManager, isReady])
  
  /**
   * Create intro animation sequence
   */
  const createIntroSequence = ({ programRef, postRef, titleRefs, dimensions, stateManager }) => {
    try {
      const timeline = gsap.timeline({ 
        paused: true,
        onComplete: () => {
          // Transition to idle animation after intro completes
          playSequence(AnimationSequence.IDLE)
        }
      })
      
      // Main WebGL shader animation
      if (programRef.current?.uniforms) {
        // Animate key uniform for main effect
        if (programRef.current.uniforms.uKey) {
          timeline.fromTo(
            programRef.current.uniforms.uKey, 
            { value: -1 }, 
            { 
              value: 1, 
              duration: 2, 
              ease: 'power2.inOut',
              onUpdate: () => {
                if (stateManager?.updateUniform) {
                  stateManager.updateUniform('uKey', programRef.current.uniforms.uKey.value)
                }
              }
            }, 
            0
          )
        }
        
        // Animate power uniform for intensity
        if (programRef.current.uniforms.uPower) {
          timeline.fromTo(
            programRef.current.uniforms.uPower, 
            { value: 2 }, 
            { 
              value: 0, 
              duration: 2, 
              ease: 'power4.out',
              onUpdate: () => {
                if (stateManager?.updateUniform) {
                  stateManager.updateUniform('uPower', programRef.current.uniforms.uPower.value)
                }
              }
            }, 
            0
          )
        }
        
        // Animate start uniform
        if (programRef.current.uniforms.uStart) {
          timeline.fromTo(
            programRef.current.uniforms.uStart,
            { value: 0 },
            {
              value: 1,
              duration: 1.5,
              ease: 'power2.inOut',
              onUpdate: () => {
                if (stateManager?.updateUniform) {
                  stateManager.updateUniform('uStart', programRef.current.uniforms.uStart.value)
                }
              }
            },
            0.2
          )
        }
      }
      
      // Add post-processing effects if available
      if (postRef?.current?.value) {
        timeline.fromTo(
          postRef.current.value, 
          { strength: 0 }, 
          { strength: 0.1, duration: 1.5, ease: 'power2.inOut' }, 
          0.5
        )
      }
      
      // Coordinate with HTML text animations if DOM elements are available
      if (titleRefs) {
        // Create staggered animation for each title element
        Object.entries(titleRefs).forEach(([key, ref], index) => {
          if (ref?.current) {
            timeline.fromTo(
              ref.current,
              { 
                opacity: 0, 
                y: '20px' 
              },
              { 
                opacity: 1, 
                y: '0px', 
                duration: 1.2, 
                ease: 'power3.out' 
              },
              0.3 + (index * 0.15) // Stagger the animations
            )
          }
        })
      }
      
      return timeline
    } catch (err) {
      console.error('Error creating intro sequence:', err)
      return null
    }
  }
  
  /**
   * Create idle animation sequence for subtle continuous motion
   */
  const createIdleSequence = ({ programRef, postRef, titleRefs, dimensions, stateManager }) => {
    try {
      const timeline = gsap.timeline({ 
        paused: true,
        repeat: -1, // Loop indefinitely
        yoyo: true, // Reverse on alternate cycles
        repeatDelay: 0.5, // Pause between cycles
        onRepeat: () => {
          // Track performance on each cycle if needed
          if (stateManager?.trackFrame) {
            stateManager.trackFrame()
          }
        }
      })
      
      // Add subtle animations for idle state
      if (programRef.current?.uniforms) {
        // Subtle power oscillation
        if (programRef.current.uniforms.uPower) {
          timeline.fromTo(
            programRef.current.uniforms.uPower,
            { value: 0 },
            {
              value: 0.2,
              duration: 3,
              ease: 'sine.inOut',
              onUpdate: () => {
                if (stateManager?.updateUniform) {
                  stateManager.updateUniform('uPower', programRef.current.uniforms.uPower.value)
                }
              }
            },
            0
          )
        }
        
        // Subtle time-based animation
        if (programRef.current.uniforms.uTime) {
          // We'll update this directly in a tick function instead of GSAP
          // as time uniform usually needs to be updated every frame
        }
      }
      
      // Add subtle text animations
      if (titleRefs) {
        Object.entries(titleRefs).forEach(([key, ref], index) => {
          if (ref?.current) {
            // Subtle floating animation
            timeline.fromTo(
              ref.current,
              { y: '0px' },
              { 
                y: '-3px', 
                duration: 2.5 + (index * 0.2), 
                ease: 'sine.inOut' 
              },
              0
            )
          }
        })
      }
      
      return timeline
    } catch (err) {
      console.error('Error creating idle sequence:', err)
      return null
    }
  }
  
  /**
   * Create hover animation sequence for interactive elements
   */
  const createHoverSequence = ({ programRef, postRef, titleRefs, dimensions, stateManager }) => {
    try {
      const timeline = gsap.timeline({ 
        paused: true,
        onComplete: () => {
          // Return to idle state after hover completes
          playSequence(AnimationSequence.IDLE)
        }
      })
      
      // Add WebGL shader animations
      if (programRef.current?.uniforms) {
        // Increase power for stronger effect
        if (programRef.current.uniforms.uPower) {
          timeline.to(
            programRef.current.uniforms.uPower,
            {
              value: 0.8,
              duration: 0.4,
              ease: 'power2.out',
              onUpdate: () => {
                if (stateManager?.updateUniform) {
                  stateManager.updateUniform('uPower', programRef.current.uniforms.uPower.value)
                }
              }
            },
            0
          )
          
          // Return to normal power
          timeline.to(
            programRef.current.uniforms.uPower,
            {
              value: 0.2,
              duration: 0.8,
              ease: 'power2.inOut',
              onUpdate: () => {
                if (stateManager?.updateUniform) {
                  stateManager.updateUniform('uPower', programRef.current.uniforms.uPower.value)
                }
              }
            },
            0.4
          )
        }
        
        // Adjust key for distortion effect
        if (programRef.current.uniforms.uKey) {
          timeline.to(
            programRef.current.uniforms.uKey,
            {
              value: 1.5,
              duration: 0.4,
              ease: 'power2.out',
              onUpdate: () => {
                if (stateManager?.updateUniform) {
                  stateManager.updateUniform('uKey', programRef.current.uniforms.uKey.value)
                }
              }
            },
            0
          )
          
          // Return to normal key
          timeline.to(
            programRef.current.uniforms.uKey,
            {
              value: 1,
              duration: 0.8,
              ease: 'power2.inOut',
              onUpdate: () => {
                if (stateManager?.updateUniform) {
                  stateManager.updateUniform('uKey', programRef.current.uniforms.uKey.value)
                }
              }
            },
            0.4
          )
        }
      }
      
      // Add text animation
      if (titleRefs) {
        Object.entries(titleRefs).forEach(([key, ref], index) => {
          if (ref?.current) {
            // Quick scale up effect
            timeline.to(
              ref.current,
              { 
                scale: 1.02, 
                duration: 0.4, 
                ease: 'power2.out' 
              },
              0
            )
            
            // Return to normal scale
            timeline.to(
              ref.current,
              { 
                scale: 1, 
                duration: 0.8, 
                ease: 'power2.inOut' 
              },
              0.4
            )
          }
        })
      }
      
      return timeline
    } catch (err) {
      console.error('Error creating hover sequence:', err)
      return null
    }
  }
  
  /**
   * Create exit animation sequence
   */
  const createExitSequence = ({ programRef, postRef, titleRefs, dimensions, stateManager }) => {
    try {
      const timeline = gsap.timeline({ 
        paused: true,
        onComplete: () => {
          // Reset all values when exit completes
          if (stateManager?.resetUniforms) {
            stateManager.resetUniforms()
          }
        }
      })
      
      // Add WebGL shader animations
      if (programRef.current?.uniforms) {
        // Fade out effect with power
        if (programRef.current.uniforms.uPower) {
          timeline.to(
            programRef.current.uniforms.uPower,
            {
              value: 2,
              duration: 1,
              ease: 'power3.in',
              onUpdate: () => {
                if (stateManager?.updateUniform) {
                  stateManager.updateUniform('uPower', programRef.current.uniforms.uPower.value)
                }
              }
            },
            0
          )
        }
        
        // Fade out with start
        if (programRef.current.uniforms.uStart) {
          timeline.to(
            programRef.current.uniforms.uStart,
            {
              value: 0,
              duration: 1.2,
              ease: 'power3.in',
              onUpdate: () => {
                if (stateManager?.updateUniform) {
                  stateManager.updateUniform('uStart', programRef.current.uniforms.uStart.value)
                }
              }
            },
            0.2
          )
        }
      }
      
      // Add text fade out
      if (titleRefs) {
        Object.entries(titleRefs).forEach(([key, ref], index) => {
          if (ref?.current) {
            timeline.to(
              ref.current,
              { 
                opacity: 0, 
                y: '20px', 
                duration: 0.8, 
                ease: 'power3.in' 
              },
              0.1 + (index * 0.05) // Stagger the fade out
            )
          }
        })
      }
      
      // Fade out post effects
      if (postRef?.current?.value) {
        timeline.to(
          postRef.current.value,
          { strength: 0, duration: 0.8, ease: 'power3.in' },
          0
        )
      }
      
      return timeline
    } catch (err) {
      console.error('Error creating exit sequence:', err)
      return null
    }
  }
  
  /**
   * Play a specific animation sequence
   * @param {string} sequenceName - Name of sequence to play from AnimationSequence enum
   */
  const playSequence = (sequenceName) => {
    if (!sequencesRef.current.has(sequenceName)) {
      console.warn(`Animation sequence "${sequenceName}" not found`)
      return false
    }
    
    try {
      // Stop current sequence if any
      if (currentSequence) {
        const currentTimeline = sequencesRef.current.get(currentSequence)
        if (currentTimeline) {
          currentTimeline.pause()
        }
      }
      
      // Start new sequence
      const timeline = sequencesRef.current.get(sequenceName)
      if (timeline) {
        // Reset and play
        timeline.restart()
        
        // Set current sequence
        setCurrentSequence(sequenceName)
        
        // Update performance tracking
        performanceRef.current.startTime = performance.now()
        performanceRef.current.completed = false
        
        return true
      }
    } catch (err) {
      console.error(`Error playing sequence "${sequenceName}":`, err)
      return false
    }
    
    return false
  }
  
  /**
   * Pause current animation sequence
   */
  const pauseSequence = () => {
    if (!currentSequence) return false
    
    try {
      const timeline = sequencesRef.current.get(currentSequence)
      if (timeline) {
        timeline.pause()
        return true
      }
    } catch (err) {
      console.error('Error pausing sequence:', err)
    }
    
    return false
  }
  
  /**
   * Reset current animation sequence
   */
  const resetSequence = () => {
    if (!currentSequence) return false
    
    try {
      const timeline = sequencesRef.current.get(currentSequence)
      if (timeline) {
        timeline.pause(0)
        return true
      }
    } catch (err) {
      console.error('Error resetting sequence:', err)
    }
    
    return false
  }
  
  // Auto-start intro animation when ready
  useEffect(() => {
    if (isReady && isInitializedRef.current && !currentSequence) {
      playSequence(AnimationSequence.INTRO)
    }
  }, [isReady, isInitializedRef.current, currentSequence])
  
  return {
    sequences: sequencesRef.current,
    currentSequence,
    performance: performanceRef.current,
    isInitialized: isInitializedRef.current,
    playSequence,
    pauseSequence,
    resetSequence,
    cleanup: () => {
      // Kill all timelines
      sequencesRef.current.forEach(timeline => {
        if (timeline) {
          timeline.kill()
        }
      })
      
      if (mainTimelineRef.current) {
        mainTimelineRef.current.kill()
      }
    }
  }
}
