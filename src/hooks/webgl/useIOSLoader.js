// src/hooks/webgl/useIOSLoader.js

import { useEffect } from 'react';

/**
 * React hook refactoring of legacy ios.js for intersection-based GL element loading and visibility.
 *
 * @param {Map<number, { el: Element, load?: Function, check?: Function }>} iosMap
 *    Map of index to element configs (el, optional load, optional check).
 * @param {boolean} enabled  Whether to activate the IntersectionObserver.
 */
export function useIOSLoader(iosMap, enabled = true) {
  useEffect(() => {
    if (!enabled || !iosMap || iosMap.size === 0) return;

    // Legacy callIos: set up observer callback
    const callback = (entries) => {
      entries.forEach((entry) => {
        const el = entry.target;
        const posAttr = el.dataset.oi;
        if (!posAttr) return;
        const pos = parseInt(posAttr, 10);
        const config = iosMap.get(pos);
        if (config && typeof config.check === 'function') {
          config.check(pos, entry);
        }
      });
    };

    // Instantiate IntersectionObserver
    const observer = new IntersectionObserver(callback, {
      root: null,
      threshold: [0],
    });

    // Legacy callIos: observe each element
    iosMap.forEach(({ el }) => {
      observer.observe(el);
    });

    // Legacy loadIos: load assets if present
    iosMap.forEach(({ load }) => {
      if (typeof load === 'function') {
        load();
      }
    });

    // Legacy showIos: make elements visible
    iosMap.forEach(({ el }) => {
      el.style.visibility = 'visible';
    });

    // Cleanup
    return () => {
      observer.disconnect();
    };
  }, [iosMap, enabled]);
}