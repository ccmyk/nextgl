// src/context/AppProvider.jsx

'use client'

import { createContext, useContext, useRef, useEffect } from 'react';
import { create } from 'zustand';

/**
 * @typedef {Object} AppState
 * @property {boolean} isLoaded - Whether the app has finished initial loading
 * @property {string|null} currentPage - Current page route key
 * @property {boolean} isNavigating - Whether navigation is in progress
 * @property {boolean} menuOpen - Whether the menu is open
 * @property {string} theme - Current theme ('light' or 'dark')
 * @property {Object} dimensions - Viewport dimensions
 * @property {number} dimensions.width - Viewport width
 * @property {number} dimensions.height - Viewport height
 * @property {boolean} isMobile - Whether the viewport is mobile-sized
 * @property {boolean} isTablet - Whether the viewport is tablet-sized
 * @property {boolean} isDesktop - Whether the viewport is desktop-sized
 */

/**
 * @typedef {Object} AppActions
 * @property {function} setLoaded - Set app as loaded
 * @property {function(string)} setCurrentPage - Set current page
 * @property {function(boolean)} setNavigating - Set navigation state
 * @property {function(boolean)} setMenuOpen - Set menu open state
 * @property {function(string)} setTheme - Set theme
 * @property {function} updateDimensions - Update viewport dimensions
 */

/**
 * Create Zustand store for app state
 * @type {import('zustand').UseBoundStore<import('zustand').StoreApi<AppState & AppActions>>}
 */
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
  isMobile: typeof window !== 'undefined' ? window.innerWidth < 768 : false,
  isTablet: typeof window !== 'undefined' ? window.innerWidth >= 768 && window.innerWidth < 1024 : false,
  isDesktop: typeof window !== 'undefined' ? window.innerWidth >= 1024 : true,
  
  // Actions
  setLoaded: () => set({ isLoaded: true }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setNavigating: (isNavigating) => set({ isNavigating }),
  setMenuOpen: (menuOpen) => set({ menuOpen }),
  setTheme: (theme) => set({ theme }),
  updateDimensions: () => {
    if (typeof window === 'undefined') return;
    
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    set({
      dimensions: { width, height },
      isMobile: width < 768,
      isTablet: width >= 768 && width < 1024,
      isDesktop: width >= 1024,
    });
  },
}));

// Create context for refs that can't be stored in Zustand
const AppContext = createContext(null);

export function AppProvider({ children }) {
  // DOM refs that need to be accessible app-wide but don't belong in Zustand state
  const mainRef = useRef();
  const pageRef = useRef();
  const contentRef = useRef();
  const navRef = useRef();
  const loaderRef = useRef();
  const mouseRef = useRef();
  
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
  
  // Utility functions to set refs
  const setMain = (main) => (mainRef.current = main);
  const setPage = (page) => (pageRef.current = page);

  return (
    <AppContext.Provider
      value={{
        store: useAppStore,
        setMain,
        setPage,
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

/**
 * Hook to access the App context
 * @returns {Object} The AppContext
 */
export function useAppContext() {
  const context = useContext(AppContext);
  
  if (context === null) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  
  return context;
}

/**
 * Hook to access app state from Zustand store
 * @returns {AppState & AppActions} The app state and actions
 */
export function useAppState() {
  return useAppStore();
}
