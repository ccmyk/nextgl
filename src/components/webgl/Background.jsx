"use client";

import { useBackground } from '@/hooks/webgl/useBackground';

export default function BackgroundEffect() {
  // Instantiates & starts the WebGL Background; renders nothing in the DOM
  useBackground();
  return null;
}