// src/context/LenisProvider.jsx

'use client'

import { createContext, useContext, useRef } from 'react'

const LenisContext = createContext({ lenis: null })

export function LenisProvider({ children }) {
  const lenis = useRef(null)
  return (
    <LenisContext.Provider value={{ lenis }}>
      {children}
    </LenisContext.Provider>
  )
}

export const useLenis = () => useContext(LenisContext)