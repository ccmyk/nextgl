// src/lib/utils/math.js

export function lerp(a, b, t) {
  return a + (b - a) * t
}

export function clamp(min, max, value) {
  return Math.max(min, Math.min(max, value))
}