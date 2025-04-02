// src/lib/startup/ease.js
"use client";

export const Power2 = {
  easeIn: (t) => t * t,
  easeOut: (t) => t * (2 - t),
  easeInOut: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
};

export const Power4 = {
  easeIn: (t) => t * t * t * t,
  easeOut: (t) => 1 - (--t) * t * t * t,
  easeInOut: (t) => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t
};
