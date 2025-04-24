#version 300 es
precision highp float;

uniform sampler2D tMap;
uniform float uColor;
uniform float uStart;

in vec2 vUv;
in vec2 vUvR;

out vec4 FragColor;

void main() {
  vec3 tex = texture(tMap, vUv).rgb;
  float sd = max(min(tex.r, tex.g), min(max(tex.r, tex.g), tex.b)) - 0.5;
  float d  = fwidth(sd);
  float alpha = smoothstep(-d, d, sd);
  FragColor = vec4(vec3(uColor), alpha);
}