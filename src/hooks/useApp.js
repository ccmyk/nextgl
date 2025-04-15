// src/hooks/useApp.js

'use client'

import { useContext, useEffect } from 'react'
import { AppContext } from '@/context/AppProvider'
import { useLenisScroll } from '@/hooks/useLenisScroll'
import { useGlobalEvents } from '@/hooks/useGlobalEvents'
import { useNavigation } from '@/hooks/useNavigation'
import { useLoaderAnimation } from '@/hooks/useLoaderAnimation'
import { useMouseEvents } from '@/hooks/useMouseEvents'

export function useApp() {
  const {
    appState,
    setAppState,
    setMain,
    setGL,
    setPage,
    setLenis,
    mainRef,
    contentRef,
    pageRef,
    navRef,
    loaderRef,
    glRef,
    mouseRef
  } = useContext(AppContext)

  const lenis = useLenisScroll(setLenis)
  useGlobalEvents(mainRef)
  useNavigation()
  useMouseEvents(mouseRef)
  useLoaderAnimation(loaderRef)

  useEffect(() => {
    // LEGACY: Originally this was `firstView()` from main/index.js
    if (appState.isLoaded && appState.page) {
      appState.page.firstView()
    }
  }, [appState.isLoaded, appState.page])

  const initApp = async (main, gl, loader, page) => {
    setMain(main)
    setGL(gl)
    setPage(page)

    setAppState(prev => ({
      ...prev,
      isLoaded: false,
    }))

    // LEGACY: This replaces legacy App init logic — loader.hide(), page.create(), gl.create(), etc.
    await loader?.create()
    await gl?.create()
    await page?.create()

    setAppState(prev => ({
      ...prev,
      isLoaded: true,
    }))
  }

  return {
    ...appState,
    initApp,
    contentRef,
    pageRef,
    navRef,
    loaderRef,
    glRef,
    mouseRef,
  }
}
