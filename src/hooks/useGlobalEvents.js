// src/hooks/useGlobalEvents.js

'use client'

import { useEffect, useCallback, useRef } from 'react'
import { useAppContext } from '@/context/useAppContext'
import { useResizeEvents } from '@/hooks/useResizeEvents'
import { useTouchScrollControl } from '@/hooks/useTouchScrollControl'
import { useLenis } from '@/context/LenisProvider'

export function useGlobalEvents() {
  const { main, pHide, isload } = useAppContext()
  const { lenis } = useLenis()
  
  // Use refs to maintain event handler references
  const handlersRef = useRef({})

  // Initialize other hooks
  useResizeEvents()
  useTouchScrollControl()

  useEffect(() => {
    // Custom global events (replaces addEvents)
    // Using useCallback to maintain function references
    
    handlersRef.current.startScroll = () => {
      document.documentElement.classList.remove('scroll-stop')
      if (lenis?.current) {
        lenis.current.start()
      }
    }

    handlersRef.current.stopScroll = () => {
      document.documentElement.classList.add('scroll-stop')
      if (lenis?.current) {
        lenis.current.stop()
      }
    }

    handlersRef.current.scrollToHandler = (e) => {
      const id = e.detail?.id || e.target.dataset.goto
      const el = document.getElementById(id)
      if (el) {
        if (lenis?.current) {
          lenis.current.scrollTo(el, { offset: -100 })
        } else {
          el.scrollIntoView({ behavior: 'smooth' })
        }
      }
    }

    handlersRef.current.newLinks = () => {
      // Keep this empty if it's not implemented yet
    }

    handlersRef.current.nextprj = async (e) => {
      if (main.current?.page?.DOM?.el) {
        const nextProject = main.current.page.DOM.el.querySelector('.project_nxt')
        if (nextProject && lenis?.current) {
          lenis.current.scrollTo(nextProject, { duration: 0.3, force: true })
        }
      }
    }

    handlersRef.current.animHandler = (e) => {
      const el = e.detail.el
      const state = e.detail.state
      const style = e.detail.style
    
      if (el?.classList.contains('nono')) return
    
      if (style === 0) {
        import('@/lib/utils/textAnimations').then(({ animateDefault }) => {
          animateDefault(el, state)
        })
      } else if (style === 1) {
        if (typeof main.current?.gl?.changeSlides === 'function') {
          main.current.gl.changeSlides(state)
        }
      }
    }

    handlersRef.current.onPopState = (e) => {
      if (typeof main.current?.onPopState === 'function') {
        main.current.onPopState(e)
      }
    }

    handlersRef.current.onVisibility = () => {
      // Pause or resume animation loop / scroll based on document visibility
      if (document.hidden) {
        if (lenis?.current) {
          lenis.current.stop()
        }
      } else {
        if (lenis?.current) {
          lenis.current.start()
        }
      }
    }

    // Attach listeners
    document.addEventListener('startscroll', handlersRef.current.startScroll)
    document.addEventListener('stopscroll', handlersRef.current.stopScroll)
    document.addEventListener('scrollto', handlersRef.current.scrollToHandler)
    document.addEventListener('newlinks', handlersRef.current.newLinks)
    document.addEventListener('nextprj', handlersRef.current.nextprj)
    document.addEventListener('anim', handlersRef.current.animHandler)
    document.addEventListener('visibilitychange', handlersRef.current.onVisibility)
    window.addEventListener('popstate', handlersRef.current.onPopState)

    // Cleanup function
    return () => {
      document.removeEventListener('startscroll', handlersRef.current.startScroll)
      document.removeEventListener('stopscroll', handlersRef.current.stopScroll)
      document.removeEventListener('scrollto', handlersRef.current.scrollToHandler)
      document.removeEventListener('newlinks', handlersRef.current.newLinks)
      document.removeEventListener('nextprj', handlersRef.current.nextprj)
      document.removeEventListener('anim', handlersRef.current.animHandler)
      document.removeEventListener('visibilitychange', handlersRef.current.onVisibility)
      window.removeEventListener('popstate', handlersRef.current.onPopState)
    }
  }, [main, pHide, isload, lenis])
  
  // Return utility functions that components can use directly
  // This is more React-idiomatic than dispatching events
  return {
    startScroll: useCallback(() => {
      document.dispatchEvent(new Event('startscroll'))
    }, []),
    
    stopScroll: useCallback(() => {
      document.dispatchEvent(new Event('stopscroll'))
    }, []),
    
    scrollTo: useCallback((id) => {
      const event = new CustomEvent('scrollto', { detail: { id } })
      document.dispatchEvent(event)
    }, []),
    
    animateElement: useCallback((el, state = 1, style = 0) => {
      const event = new CustomEvent('anim', { 
        detail: { el, state, style } 
      })
      document.dispatchEvent(event)
    }, [])
  }
}
