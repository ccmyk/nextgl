#version 300 es
precision highp float;

in vec3 position;
in vec2 uv;
in float id;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

out vec2 vUv;
out float vId;

void main() {
  vUv = uv;
  vId = id;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}