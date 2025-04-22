precision highp float;

varying vec2 vUv;

// the rendered text pass
uniform sampler2D tMap;
// control timing & ripple
uniform float uTime;
uniform float uStart;
// mouse ripple uniforms
uniform float uMouseT;
uniform float uMouse;
// overall fade‑out for Footer
uniform float uOut;

float ripple(float uv, float time, float prog, float multi) {
  float dist = length(uv * 3.0 + time * 1.4);
  return tan(dist) * (multi * prog);
}

void main() {
  float timer = uStart;
  float prog   = 1.0 - abs(timer);
  float r      = ripple(vUv.y, timer, prog, -0.36) * (0.1 * prog);
  vec2  uv     = vec2(vUv.x, vUv.y + r);

  vec4 col = texture2D(tMap, uv);

  // apply fade‑out (uOut), then discard if fully transparent
  col.a *= uOut;
  if (col.a < 0.01) discard;

  gl_FragColor = col;
}