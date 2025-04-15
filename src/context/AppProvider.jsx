// src/context/AppProvider.jsx

'use client'

import { createContext, useContext, useRef, useState } from 'react'

export const AppContext = createContext(null)

export function AppProvider({ children }) {
  // refs replacing legacy this.* assignments
  const main = useRef({})
  const page = useRef(null)
  const gl = useRef(null)
  const mouse = useRef(null)
  const nav = useRef(null)
  const lenis = useRef(null)
  const pHide = useRef(null)
  const isload = useRef(0)
  const content = useRef(null)
  const template = useRef(null)

  const [isReady, setIsReady] = useState(false)

  return (
    <AppContext.Provider
      value={{
        main,
        page,
        gl,
        mouse,
        nav,
        lenis,
        pHide,
        isload,
        content,
        template,
        isReady,
        setIsReady,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  return useContext(AppContext)
}
