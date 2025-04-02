// src/lib/controllers/ScrollController.js

import { create } from 'zustand';

/**
 * Global scroll state management
 */
export const useScrollStore = create((set, get) => ({
  // Scroll state
  isScrolling: true,
  scrollY: 0,
  scrollDirection: 0, // 1: down, -1: up, 0: none
  
  // Scroll locks
  locks: new Set(),
  
  // Actions
  setScrollY: (y) => set({ scrollY: y }),
  setDirection: (dir) => set({ scrollDirection: dir }),
  
  // Lock/unlock scrolling
  lockScroll: (id) => {
    const { locks } = get();
    locks.add(id);
    
    // Get Lenis instance
    const lenis = window.lenisInstance;
    if (lenis && locks.size === 1) {
      lenis.stop();
      document.documentElement.classList.add('lenis-stopped');
    }
    
    set({ isScrolling: false, locks });
  },
  
  unlockScroll: (id) => {
    const { locks } = get();
    locks.delete(id);
    
    // Get Lenis instance
    const lenis = window.lenisInstance;
    if (lenis && locks.size === 0) {
      lenis.start();
      document.documentElement.classList.remove('lenis-stopped');
    }
    
    set({ isScrolling: locks.size === 0, locks });
  },
  
  // Scroll to functions
  scrollTo: (target, options = {}) => {
    const lenis = window.lenisInstance;
    if (!lenis) return;
    
    lenis.scrollTo(target, options);
  },
}));

/**
 * Hook to use scroll controller
 */
export function useScrollController() {
  return useScrollStore();
}