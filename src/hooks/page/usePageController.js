"use client";
import { useRef } from "react";
import { usePageEvents } from "./usePageEvents";
import { usePageLoader } from "./usePageLoader";
import { useIOSObserver } from "./useIOSObserver";
import { useDynamicCreation } from "./useDynamicCreation";
import { usePageScroll } from "./usePageScroll";
import { useShowHide } from "./useShowHide";

/**
 * Composite hook that wires all legacy logic into one React model.
 * Usage in your page component:
 *   const page = usePageController(containerRef);
 */
export function usePageController(containerRef) {
  const { windowSize, isDown, scrollY } = usePageEvents();
  const loaded = usePageLoader();
  const iosRefCallback = useIOSObserver();
  const { ios, iosUpdaters, updaters, components } = useDynamicCreation();
  const { scrollY: lenisY, stopScroll, startScroll } = usePageScroll();
  const { visible, hide } = useShowHide(containerRef);

  // Expose unified page API
  return {
    windowSize,
    isDown,
    scrollY,
    lenisY,
    loaded,
    visible,
    hide,
    stopScroll,
    startScroll,
    ios,
    iosUpdaters,
    updaters,
    components,
    iosRefCallback,
  };
}