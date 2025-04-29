// src/components/lazy/LazyImage.jsx
'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

export default function LazyImage({ src, alt, placeholder, ...props }) {
  const imgRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useIntersectionObserver(imgRef, ([entry]) => {
    if (entry.isIntersecting) setVisible(true);
  });

  return (
    <div ref={imgRef} style={{ position: 'relative', overflow: 'hidden' }}>
      {!loaded && placeholder && (
        <img src={placeholder} alt="" aria-hidden className="lazy-placeholder" />
      )}
      {visible && (
        <img
          src={src}
          alt={alt}
          onLoad={() => setLoaded(true)}
          {...props}
        />
      )}
    </div>
  );
}