// src/hooks/page/useShowHide.js
"use client";
import { useState, useEffect } from "react";
import gsap from "gsap";

/**
 * Replace showhide.js:
 *  - orchestrates intro/outro via GSAP
 *  - returns control functions
 */
export function useShowHide(containerRef) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    async function intro() {
      if (!containerRef.current) return;
      await gsap.fromTo(
        containerRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.6 }
      );
      setVisible(true);
    }
    intro();
  }, [containerRef]);

  function hide() {
    if (containerRef.current) {
      gsap.to(containerRef.current, { opacity: 0, duration: 0.4 });
      setVisible(false);
    }
  }

  return { visible, hide };
}