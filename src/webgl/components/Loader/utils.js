// src/webgl/components/Loader/utils.js

/**
 * Generate a full-screen quad covering NDC [-1,1] × [-1,1]
 */
export function createPlaneVertices() {
  return [
    -1, -1,
     1, -1,
     1,  1,
    -1,  1,
  ];
}

/**
 * Corresponding UV coordinates for the quad
 */
export function createPlaneUVs() {
  return [
    0, 0,
    1, 0,
    1, 1,
    0, 1,
  ];
}