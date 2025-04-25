"use client";

import React from 'react';
import { useFooter } from '@/hooks/webgl/useFooter';

export default function FooterEffect({ text, letterSpacing = 0, size = 1, className }) {
  const { containerRef, elementRef } = useFooter({ text, letterSpacing, size });
  return (
    <div ref={containerRef} className={`footer-container relative ${className||''}`}>
      <div className="cCover absolute inset-0 pointer-events-none" />
      <div
        ref={elementRef}
        className="ttj Oiel"
        data-text={text}
        data-l={letterSpacing}
        data-m={size}
      >
        {text}
      </div>
    </div>
  );
}