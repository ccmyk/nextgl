// src/components/lazy/LazyVideo.jsx
'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

export default function LazyVideo({ src, poster, ...props }) {
  const vidRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useIntersectionObserver(vidRef, ([entry]) => {
    if (entry.isIntersecting) setVisible(true);
  });

  return (
    <div ref={vidRef} style={{ position: 'relative', overflow: 'hidden' }}>
      {visible && (
        <video
          src={src}
          poster={poster}
          autoPlay
          muted
          playsInline
          {...props}
        />
      )}
    </div>
  );
}