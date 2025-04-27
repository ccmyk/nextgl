'use client'

import { createContext, useContext, useRef, useState } from 'react'

/**
 * AppContext:
 * - Provides global refs for DOM elements: main, page, content, nav, mouse
 * - Provides loaded state (for Loader and app transition)
 */
const AppContext = createContext(null)

export function AppProvider({ children }) {
  // DOM Refs (global)
  const mainRef = useRef(null)
  const pageRef = useRef(null)
  const contentRef = useRef(null)
  const navRef = useRef(null)
  const mouseRef = useRef(null)

  // App Loaded State
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <AppContext.Provider
      value={{
        refs: { mainRef, pageRef, contentRef, navRef, mouseRef },
        isLoaded,
        setIsLoaded,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

/**
 * useAppContext:
 * Full context access (refs + state)
 */
export function useAppContext() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider')
  }
  return context
}

/**
 * useAppRefs:
 * Shortcut for accessing refs only
 */
export function useAppRefs() {
  const { refs } = useAppContext()
  return refs
}

/**
 * useAppState:
 * Shortcut for accessing app state only (loaded, setLoaded)
 */
export function useAppState() {
  const { isLoaded, setIsLoaded } = useAppContext()
  return { isLoaded, setIsLoaded }
}