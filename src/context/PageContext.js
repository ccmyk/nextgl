"use client";
import { createContext, useState, useEffect } from 'react';
import { initAnims } from '@/legacy/main/anims';
import { initPopups } from '@/legacy/main/pop';
import PageRenderer from '@/components/Renderer';

/**
 * Provides the legacy `main` object to the React tree.
 */
export const PageContext = createContext(null);

export function PageProvider({ children }) {
  const [main, setMain] = useState(null);

  useEffect(() => {
    // Recreate legacy "main" with pixel-perfect parity
    const m = {
      screen: { w: window.innerWidth, h: window.innerHeight },
      events: new CustomEvent('anim'),
      // ... copy other initial props from legacy index.js
    };

    // Initialize legacy animations and popups
    initAnims(m);
    initPopups(m);

    // Kick off render loop via React component
    setMain(m);
  }, []);

  if (!main) return null;

  return (
    <PageContext.Provider value={main}>
      <PageRenderer main={main} />
      {children}
    </PageContext.Provider>
  );
}