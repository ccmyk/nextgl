// 🧠 Refactored version of: ../../evasanchez-portfolio/wp-content/themes/src/main🐙🐙🐙/events.js
// ✅ Output location: nextgl/src/lib/animations/events.js (React-friendly, traceable, modular)

import { useEffect, useCallback } from "react";
import { eventDefinitions } from "@/context/EventsContext"; // Must ensure event names like nextprj stay traceable

// Hook version of event handlers from legacy events.js
export function useLegacyEventHandlers({ componentsRef, iosRef, scrollRef, domRef, mainRef, isVisibleRef, setIsDownRef }) {

  // Equivalent of: this.onResize
  const onResize = useCallback(() => {
    const components = componentsRef.current;
    const ios = iosRef.current;
    const scroll = scrollRef.current;
    const dom = domRef.current;
    const main = mainRef.current;

    for (const key of Object.keys(components)) {
      const value = components[key];
      if (Array.isArray(value)) {
        value.forEach((comp) => comp?.onResize?.());
      } else {
        value?.onResize?.();
      }
    }

    ios?.forEach((el) => {
      el?.class?.onResize?.(scroll?.target);
    });

    resizeLimit(scroll, dom, main);
  }, []);

  const resizeLimit = (scroll, dom, main) => {
    if (!scroll || !dom || !main) return;
    scroll.limit = dom.el.clientHeight - main.screen.h;
  };

  const onTouchDown = () => {
    setIsDownRef.current = true;
  };

  const onTouchMove = () => {
    if (!setIsDownRef.current) return;
  };

  const onTouchUp = () => {
    setIsDownRef.current = false;
  };

  const onWheel = (y) => {
    if (isVisibleRef.current === 0) return;
    // scrollRef.current.target += y (if using manual scroll control)
  };

  // Lifecycle: attach any global DOM events here (if still needed outside component tree)
  useEffect(() => {
    window.addEventListener("touchstart", onTouchDown);
    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("touchend", onTouchUp);

    return () => {
      window.removeEventListener("touchstart", onTouchDown);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchUp);
    };
  }, [onTouchDown, onTouchMove, onTouchUp]);

  return {
    onResize,
    onTouchDown,
    onTouchMove,
    onTouchUp,
    onWheel,
  };
}
