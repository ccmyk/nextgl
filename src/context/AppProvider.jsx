'use client'

import { createContext, useContext, useRef, useEffect } from 'react';
import { create } from 'zustand';
import { browserCheck } from '@/lib/startup/browser';

const useAppStore = create((set, get) => ({
  // Initial state
  isLoaded: false,
  currentPage: null,
  isNavigating: false,
  menuOpen: false,
  theme: 'light',
  dimensions: {
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  },
  deviceClass: '',
  deviceNum: 0,
  isTouch: false,
  webp: false,
  webm: false,
  vidauto: false,
  
  // Actions
  setLoaded: () => set({ isLoaded: true }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setNavigating: (isNavigating) => set({ isNavigating }),
  setMenuOpen: (menuOpen) => set({ menuOpen }),
  setTheme: (theme) => set({ theme }),
  initializeDevice: () => {
    const { deviceclass, device, isTouch, webp, webm, vidauto } = browserCheck();
    if (typeof document !== 'undefined') {
      const doc = document.documentElement;
      if (!isTouch) {
        doc.classList.add('D');
      } else {
        doc.classList.add('T', deviceclass);
      }
    }
    set({
      deviceClass: deviceclass,
      deviceNum: device,
      isTouch,
      webp,
      webm,
      vidauto
    });
  },
  updateDimensions: () => {
    if (typeof window === 'undefined') return;
    const width = window.innerWidth;
    const height = window.innerHeight;
    set({
      dimensions: { width, height }
    });
  },
}));

// Create context for refs that can't be stored in Zustand
const AppContext = createContext(null);

export function AppProvider({ children }) {
  // DOM refs that need to be accessible app-wide
  const mainRef = useRef();
  const pageRef = useRef();
  const contentRef = useRef();
  const navRef = useRef();
  const loaderRef = useRef();
  const mouseRef = useRef();
  
  // Initialize device detection
  useEffect(() => {
    useAppStore.getState().initializeDevice();
  }, []);

  // Handle window resize
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Initial dimension update
    useAppStore.getState().updateDimensions();
    
    // Add resize listener
    const handleResize = () => {
      useAppStore.getState().updateDimensions();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
    <AppContext.Provider
      value={{
        store: useAppStore,
        mainRef,
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
  const context = useContext(AppContext);
  if (context === null) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}

export function useAppState() {
  return useAppStore();
}
