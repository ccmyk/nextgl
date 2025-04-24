"use client";
"use client";
"use client""use client"'use client';

import { useEffect, useRef } from 'react';
import { useRoll } from '@/hooks/webgl/useRoll';

export default function RollComponent({ children }) {
  // we’ll look for `<img>` / `<video>` inside this container
  const ref = useRoll({ selector: '.cRoll' });

  return (
    <div className="cRoll-wrapper" ref={ref}>
      <div className="cRoll">
        {children}
      </div>
    </div>
  );
}