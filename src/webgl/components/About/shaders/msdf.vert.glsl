#version 300 es
precision highp float;
#define attribute in
#define varying out
#define gl_Position Position
out vec4 Position;

attribute vec3 position;
attribute vec2 uv;
attribute float id;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

uniform float uTime;
uniform vec2 uMouse;
uniform float uStart;
uniform float uPower;
uniform float uKey;
uniform float uCols;

varying vec2 vUv;
varying vec2 vUvR;

void main() {
    vUv = uv;
    vUvR = position.xy;
    
    vec3 pos = position;
    pos.y *= 1.0;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
