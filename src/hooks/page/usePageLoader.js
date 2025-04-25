// src/hooks/page/usePageLoader.js
"use client";
import { useState, useEffect } from "react";
import gsap from "gsap";

/**
 * Replace loads.js:
 *  - coordinates asset loading
 *  - returns `loaded` flag when initial animations and assets are ready
 */
export function usePageLoader() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function runLoader() {
      // 1) Wait for all "img.Wait" elements to load
      const waitImgs = Array.from(document.querySelectorAll("img.Wait"));
      await Promise.all(
        waitImgs.map(
          (img) =>
            new Promise((res) => {
              img.onload = () => res();
              img.onerror = () => res();
              img.src = img.dataset.src;
            })
        )
      );

      // 2) Scale non-wait images to maintain pixel dimensions
      document.querySelectorAll("img:not(.Wait)").forEach((el) => {
        const w = el.naturalWidth;
        const h = el.naturalHeight;
        const wrapper = el.closest(".Sc");
        if (wrapper) {
          wrapper.style.width = `${w}px`;
          wrapper.style.height = `${h}px`;
        }
      });

      // 3) GSAP intro animation for #content
      const el = document.querySelector("#content");
      if (el) {
        await gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.8 });
      }

      setLoaded(true);
    }
    runLoader();
  }, []);

  return loaded;
}