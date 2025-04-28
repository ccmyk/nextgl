// src/components/AnimatedWrite.jsx

'use client';

import React, { useRef, useState } from 'react';
import { useWriteFn } from '@/hooks/useWriteFn';

/**
 * Exactly replicates legacy writeFn on a container.
 *
 * Props:
 * - children: text or elements to animate
 * - state: 0 | 1 | -1  (initial split | entry | exit)
 * - params: optional "delay,duration" string for dataset.params
 */
export default function AnimatedWrite({ children, state = 1, params = '0,3' }) {
  const ref = useRef(null);

  // Set dataset.params on mount/update
  React.useEffect(() => {
    if (ref.current && params) {
      ref.current.dataset.params = params;
    }
  }, [params]);

  // Drive the legacy animation
  useWriteFn(ref, state);

  // Render a container with the exact class name
  return (
    <div ref={ref} className="Awrite">
      {children}
    </div>
  );
}