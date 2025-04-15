// src/context/AppContext.jsx

'use client'
import { createContext, useContext, useRef, useState } from 'react'

export const AppContext = createContext()

export function AppProvider({ children }) {
  const contentRef = useRef(null)
  const [main, setMain] = useState({})
  const [gl, setGl] = useState(null)
  const [page, setPage] = useState(null)
  const [loader, setLoader] = useState(null)
  const [nav, setNav] = useState(null)
  const [mouse, setMouse] = useState(null)
  const [isload, setIsload] = useState(0)
  const [template, setTemplate] = useState('')

  return (
    <AppContext.Provider
      value={{
        contentRef,
        main, setMain,
        gl, setGl,
        page, setPage,
        loader, setLoader,
        nav, setNav,
        mouse, setMouse,
        isload, setIsload,
        template, setTemplate
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  return useContext(AppContext)
}
