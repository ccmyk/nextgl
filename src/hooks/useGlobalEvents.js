// src/hooks/useGlobalEvents.js

'use client'

import { useEffect } from 'react'
import { useAppContext } from '@/context/AppContext'
import { useResizeEvents } from '@/hooks/useResizeEvents'
import { useTouchScrollControl } from '@/hooks/useTouchScrollControl'

export function useGlobalEvents() {
  const { main, pHide, isload } = useAppContext()

  useResizeEvents()
  useTouchScrollControl()

  useEffect(() => {
    // Custom global events (replaces addEvents)

    const startScroll = () => {
      document.documentElement.classList.remove('scroll-stop')
    }

    const stopScroll = () => {
      document.documentElement.classList.add('scroll-stop')
    }

    const scrollToHandler = (e) => {
      const id = e.detail?.id || e.target.dataset.goto
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }

    const newLinks = () => {
      // LEGACY: replaces resetLinks in pop.js
    }

    const nextprj = async (e) => {
      // LEGACY: replaces next project scroll logic
    }

    const animHandler = (e) => {
      const el = e.detail.el
      const state = e.detail.state
      const style = e.detail.style

      if (el?.classList.contains('nono')) return

      if (style === 0) {
        main.current?.writeFn(el, state)
      } else if (style === 1) {
        main.current?.gl?.changeSlides?.(state)
      }
    }

    const onPopState = (e) => {
      main.current?.onPopState?.(e)
    }

    const onVisibility = () => {
      // Pause or resume animation loop / scroll
    }

    // Attach listeners
    document.addEventListener('startscroll', startScroll)
    document.addEventListener('stopscroll', stopScroll)
    document.addEventListener('scrollto', scrollToHandler)
    document.addEventListener('newlinks', newLinks)
    document.addEventListener('nextprj', nextprj)
    document.addEventListener('anim', animHandler)
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('popstate', onPopState)

    return () => {
      document.removeEventListener('startscroll', startScroll)
      document.removeEventListener('stopscroll', stopScroll)
      document.removeEventListener('scrollto', scrollToHandler)
      document.removeEventListener('newlinks', newLinks)
      document.removeEventListener('nextprj', nextprj)
      document.removeEventListener('anim', animHandler)
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('popstate', onPopState)
    }
  }, [main, pHide, isload])
}
