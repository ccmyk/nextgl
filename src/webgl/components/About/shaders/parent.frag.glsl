#version 300 es
precision highp float;

uniform sampler2D tMap;
uniform float uTime;
uniform float uStart;
uniform float uMouseT;
uniform float uMouse;

in vec2 vUv;
out vec4 FragColor;

float ripple(float uv, float time, float prog, float multi) {
  float dist = length((uv * 3.0) + (time * 1.4));
  return tan(dist) * (multi * prog);
}

void main() {
  float timer     = uStart;
  float centeredY = (vUv.y - 0.5) * 2.0;
  float prog      = 1.0 - abs(timer);
  float wave      = ripple(vUv.y, timer, prog, -0.36) * (0.1 * prog);
  vec2  shifted   = vec2(vUv.x, vUv.y + wave);
  vec4  im        = texture(tMap, shifted);

  if (wave * -100.0 > centeredY + timer) {
    FragColor = vec4(0.0);
  } else {
    FragColor = im;
  }
}