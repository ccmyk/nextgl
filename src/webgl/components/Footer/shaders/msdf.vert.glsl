precision highp float;

attribute vec3 position;
attribute vec2 uv;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

varying vec2 vUv;
varying vec2 vUvR;

void main() {
  vUv = uv;
  vUvR = position.xy;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}