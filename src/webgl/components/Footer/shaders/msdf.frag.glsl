precision highp float;

varying vec2 vUv;
varying vec2 vUvR;

// the signed‑distance texture atlas
uniform sampler2D tMap;
// text color (0 = black, 1 = white)
uniform float uColor;

void main() {
  vec3 tex = texture2D(tMap, vUv).rgb;
  // reconstruct signed distance
  float sd = max(
    min(tex.r, tex.g),
    min(max(tex.r, tex.g), tex.b)
  ) - 0.5;
  float d = fwidth(sd);
  float alpha = smoothstep(-d, d, sd);
  gl_FragColor = vec4(vec3(uColor), alpha);
}