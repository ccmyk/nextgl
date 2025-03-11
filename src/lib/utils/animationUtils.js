"use client";

/**
 * Animation utility functions for legacy compatibility
 */

/**
 * Linear interpolation function
 * @param {number} start - Starting value
 * @param {number} end - Ending value
 * @param {number} amt - Amount to interpolate (0-1)
 * @returns {number} Interpolated value
 */
export function lerp(start, end, amt) {
  return (1 - amt) * start + amt * end;
}

/**
 * Clamp a value between min and max
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @param {number} value - Value to clamp
 * @returns {number} Clamped value
 */
export function clamp(min, max, value) {
  return Math.max(min, Math.min(max, value));
}

/**
 * Wait for a specified amount of time
 * @param {number} ms - Time to wait in milliseconds
 * @returns {Promise} Promise that resolves after the specified time
 */
export function waiter(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Add global window utilities for legacy compatibility
 * This should be called in a client component
 */
export function setupGlobalUtils() {
  if (typeof window !== 'undefined') {
    window.lerp = lerp;
    window.clamp = clamp;
    window.waiter = waiter;
  }
}
