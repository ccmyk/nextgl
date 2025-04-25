"use client";
import { useEffect } from 'react';

export default function PageRenderer({ main }) {
  useEffect(() => {
    function frame() {
      main.render(); // legacy render call from 👁️.js
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }, [main]);

  return null;
}