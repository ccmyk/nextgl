"use client";
"use client";
"use client""use client"// src/components/webgl/Background.jsx
'use client';

import { useBackground } from '@/hooks/webgl/useBackground';

export default function BackgroundEffect() {
  // Instantiates & starts the WebGL Background; renders nothing in the DOM
  useBackground();
  return null;
}