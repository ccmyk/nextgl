"use client";
import { useState, useEffect } from "react";

/**
 * Replace events.js:
 *  - tracks window size
 *  - tracks touch press state
 *  - tracks scrollY
 */
export function usePageEvents() {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [isDown, setIsDown] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    function onResize() {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    }
    function onScroll() {
      setScrollY(window.scrollY);
    }
    function onTouchStart() {
      setIsDown(true);
    }
    function onTouchEnd() {
      setIsDown(false);
    }

    onResize();
    setScrollY(window.scrollY);

    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll);
    window.addEventListener("touchstart", onTouchStart);
    window.addEventListener("touchend", onTouchEnd);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  return { windowSize, isDown, scrollY };
}