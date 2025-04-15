// src/components/Interface/AppInitializer.jsx

'use client'

import { useEffect } from 'react'
import { useAppContext } from '@/context/AppContext'
import { useApp } from '@/hooks/useApp'
import { useAnimationLoop } from '@/hooks/useAnimationLoop'

export default function AppInitializer({ main, gl, loader, page }) {
  const {
    main: mainRef,
    gl: glRef,
    loader: loaderRef,
    page: pageRef,
    setIsReady,
    content,
    pHide,
  } = useAppContext()

  const {
    initApp,
    isLoaded,
    navRef,
    mouseRef,
  } = useApp()

  useEffect(() => {
    if (main && gl && loader && page) {
      mainRef.current = main
      glRef.current = gl
      loaderRef.current = loader
      pageRef.current = page

      initApp(main, gl, loader, page)
    }
  }, [main, gl, loader, page])

  // LEGACY: Setup animation loop and loading state
  useEffect(() => {
    if (isLoaded) {
      setIsReady(true)
    }
  }, [isLoaded])

  // ⏱️ Animation frame loop (replaces App.update)
  useAnimationLoop(() => {
    if (!isLoaded) return
    if (!pageRef.current || !glRef.current || !mouseRef.current) return

    pageRef.current.update()
    glRef.current.update()
    mouseRef.current.update()
  })

  return null
}
