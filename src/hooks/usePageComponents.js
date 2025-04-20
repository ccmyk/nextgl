// src/hooks/usePageComponents.js

'use client'

import { useEffect } from 'react'
import { useAppContext } from '@/context/useAppContext'
import { useComponentFactory } from '@/hooks/useComponentFactory'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { useIOS } from '@/hooks/useIOS'

export function usePageComponents() {
  const { page } = useAppContext()
  const { createComponent } = useComponentFactory()

  useEffect(() => {
    if (!page?.current) return

    // Replaces legacy createComps()
    page.current.createComps?.()

    // Create common DOM-linked components
    createComponent('.home_intro, .projects_intro, .project_intro, .error_intro, .about_intro', Intro, 'intro')
    createComponent('.toAc', null, 'accordion')
    createComponent('.toLs', null, 'list')

    // Replaces legacy createIos(), callIos(), showIos()
    page.current.createIos?.()
    page.current.callIos?.()
    page.current.showIos?.()
  }, [page, createComponent])

  // Handles scroll-triggered animations
  useScrollAnimation()

  // Attaches IntersectionObserver for `.iO` elements
  useIOS()

  return {
    createComponent, // Optional external use
  }
}