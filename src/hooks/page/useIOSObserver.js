"use client";
import { useState, useRef, useEffect } from "react";

/**
 * Replace ios.js:
 *  - returns a ref callback to attach to any element that needs iOS class updates
 *  - tracks which elements are in view and triggers `.update(scrollY)` on them
 */
export function useIOSObserver() {
  const observer = useRef(null);
  const [elements, setElements] = useState([]);

  useEffect(() => {
    const threshold = Array.from({ length: 10 }, (_, i) => (i + 1) / 10).concat(0);
    observer.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const fn = entry.target._onIOUpdate;
          fn && fn(window.scrollY);
        });
      },
      { threshold }
    );
    elements.forEach((el) => observer.current.observe(el));
    return () => observer.current.disconnect();
  }, [elements]);

  function refCallback(el, updateFn) {
    if (!el) return;
    el._onIOUpdate = updateFn;
    setElements((prev) => [...prev, el]);
  }

  return refCallback;
}