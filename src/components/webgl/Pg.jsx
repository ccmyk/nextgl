"use client";

import { useRef, useEffect } from 'react';
import { usePg } from '@/hooks/webgl/usePg';

export default function PgCanvas({ pos = 0, touch = 0 }) {
  const { containerRef } = usePg({ pos, touch });
  return <div ref={containerRef} className="cPg" />;
}