// src/context/AppProvider.jsx

'use client'

import { createContext, useContext, useRef, useState } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [appState, setAppState] = useState({ isLoaded: false, page: null });
  const mainRef = useRef();
  const glRef = useRef();
  const pageRef = useRef();
  const contentRef = useRef();
  const navRef = useRef();
  const loaderRef = useRef();
  const mouseRef = useRef();
  const lenisRef = useRef();

  const setMain = (main) => (mainRef.current = main);
  const setGL = (gl) => (glRef.current = gl);
  const setPage = (page) => (pageRef.current = page);
  const setLenis = (lenis) => (lenisRef.current = lenis);

  return (
    <AppContext.Provider
      value={{
        appState,
        setAppState,
        setMain,
        setGL,
        setPage,
        setLenis,
        mainRef,
        glRef,
        pageRef,
        contentRef,
        navRef,
        loaderRef,
        mouseRef,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
