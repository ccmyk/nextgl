precision highp float;

varying vec2 vUv;

uniform sampler2D tMap;
uniform float uTime;
uniform float uStart;
uniform float uMouseT;
uniform float uMouse;
uniform float uOut;

float ripple(float uv, float time, float prog, float multi) {
  float dist = length(uv * 3.0 + time * 1.4);
  return tan(dist) * (multi * prog);
}

void main() {
  float timer = uStart;
  float prog  = 1.0 - abs(timer);
  float rOut  = ripple(vUv.y, timer, prog, -0.36) * (0.1 * prog);
  vec2 uvp    = vec2(vUv.x, vUv.y +  rOut + ripple(vUv.y, uMouse, 1.0 - abs(uMouse), -0.36) * 0.1);

  vec4 col = texture2D(tMap, uvp);
  col.a *= uOut;
  if (col.a < 0.01) discard;
  gl_FragColor = col;
}