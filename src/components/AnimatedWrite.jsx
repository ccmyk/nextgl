// src/components/AnimatedWrite.jsx

'use client';

import React, { useRef, useState } from 'react';
import { useWriteFn } from '@/hooks/useWriteFn';

/**
 * Wraps text in `.Awrite` container and drives those animations.
 *
 * Props:
 * - state: 0 | 1 | -1
 * - params: "delay,duration" string
 */
export default function AnimatedWrite({ children, state = 1, params = '0,3' }) {
  const ref = useRef(null);

  // Set dataset.params on mount/update
  useEffect(() => {
    if (ref.current) {
      ref.current.dataset.params = params;
    }
  }, [params]);

  useWriteFn(ref, state);

  return (
    <div ref={ref} className="Awrite">
      {children}
    </div>
  );
}