'use client'

import { createContext, useContext, useRef } from 'react'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const mainRef = useRef(null)
  const pageRef = useRef(null)
  const contentRef = useRef(null)
  const navRef = useRef(null)
  const mouseRef = useRef(null)

  return (
    <AppContext.Provider value={{ mainRef, pageRef, contentRef, navRef, mouseRef }}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext must be used inside AppProvider')
  }
  return context
}
