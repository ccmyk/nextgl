#version 300 es
precision highp float;
#define varying in
#define texture2D texture

uniform sampler2D tMap;
uniform float uColor;

varying vec2 vUv;
varying vec2 vUvR;

out vec4 FragColor;

void main() {
  vec3 tex = texture2D(tMap, vUv).rgb;
  float signedDist = max(min(tex.r, tex.g), min(max(tex.r, tex.g), tex.b)) - 0.5;
  float d = fwidth(signedDist);
  float alpha = smoothstep(-d, d, signedDist);

  FragColor.rgb = vec3(uColor);
  FragColor.a   = alpha;