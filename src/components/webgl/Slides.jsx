"use client";
"use client";
"use client""use client"'use client';

import { useSlides } from '@/hooks/webgl/useSlides';

export default function SlidesCanvas({ pos = 0, touch = 0 }) {
  const { containerRef } = useSlides({ pos, touch });

  return (
    <div
      ref={containerRef}
      className="cSlides"
      style={{ position: 'relative', width: '100%', height: '100%' }}
    />
  );
}