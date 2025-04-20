// src/components/Interface/AppInitializer.jsx

'use client'

import { useEffect } from 'react'
import { useApp } from '@/hooks/useApp'

export default function AppInitializer({ main, gl, page, loader }) {
  const {
    isLoaded,
    initApp,
    contentRef,
    pageRef,
    navRef,
    loaderRef,
    glRef,
    mouseRef,
  } = useApp()

  useEffect(() => {
    if (!main || !gl || !page || !loader) return
    initApp(main, gl, loader, page)
  }, [main, gl, page, loader])

  return (
    <div
      id="content"
      ref={contentRef}
      data-id={main?.id}
      data-template={main?.template}
    >
      <div ref={pageRef} id="page" />
      <div ref={loaderRef} id="loader" />
      <div ref={navRef} id="nav" />
      <div ref={glRef} id="gl" />
      <div ref={mouseRef} id="mouse" />
    </div>
  )
}
