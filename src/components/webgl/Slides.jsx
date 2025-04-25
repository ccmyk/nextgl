"use client";

import { useRef, useEffect } from 'react';
import { useSlides } from '@/hooks/webgl/useSlides';

export default function SlidesCanvas({ slides, active }) {
  const { containerRef } = useSlides({ slides, active });
  return <div ref={containerRef} className="cSlides" />;
}