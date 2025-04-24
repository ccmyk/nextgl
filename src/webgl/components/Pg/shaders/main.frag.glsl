precision highp float;

uniform sampler2D tMap;
uniform vec2      uCover;
uniform float     uMouse;
uniform vec2      uTextureSize;
uniform float     uLoad;
uniform float     uZoom;
uniform float     uMove;
varying vec3      vUv;

vec2 coverTexture(vec2 imgSize, vec2 ouv, float mouse) {
  vec2 s = uCover, i = imgSize;
  ouv.x -= mouse;
  float rs = s.x/s.y, ri = i.x/i.y;
  vec2 new = rs < ri ? vec2(i.x*s.y/i.y, s.y) : vec2(s.x, i.y*s.x/i.x);
  vec2 off = (rs<ri
    ? vec2((new.x-s.x)/2.0,0.0)
    : vec2(0.0,(new.y-s.y)/2.0)
  ) / new;
  return ouv * s / new + off;
}

void main() {
  if(uLoad > 0.0) {
    vec2 tsize = uTextureSize * vec2(1.0 + abs(uMouse), 1.0);
    float cols = 4.0 * uZoom;
    vec2 uv0 = coverTexture(tsize, vUv.xy, uMouse);
    vec2 P   = vec2(cols);
    // grid→ripple dist
    float cent = abs(mix(uv0.x*2.0-1.0, 1.0-uv0.x, uMouse));
    float step = floor(cent * P.x) / P.x;
    uv0.x += uMouse * (step*0.2) + step + uMouse*0.2;
    vec4 c = texture2D(tMap, uv0);
    c.a = uLoad;
    gl_FragColor = c;
  } else {
    gl_FragColor = vec4(0,0,0,0);
  }
}