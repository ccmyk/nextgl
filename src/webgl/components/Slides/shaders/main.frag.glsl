precision highp float;

varying vec2 vUv;
uniform sampler2D tMap;

void main() {
  gl_FragColor = texture2D(tMap, vUv);
}