precision highp float;

uniform sampler2D tMap;
uniform float uTime;
uniform float uStart;
uniform float uMouseT;
uniform float uMouse;

varying vec2 vUv;

float ripple(float uv, float time, float prog, float multi) {
    float distance = length((uv * 3.0) + (time * 1.4));
    return tan(distance * (1.0)) * (multi * prog);
}

void main() {
    float timer = uStart;
    float centeredx = (vUv.x - 0.5) * 2.0;
    float centeredy = (vUv.y - 0.5) * 2.0;
    
    // Same ripple calculation as legacy
    float rippleUV = (ripple(vUv.y, timer, 1.0 - abs(timer), -0.36) * ((0.1 * (1.0 - abs(timer)))));
    
    vec2 U = vec2(vUv.x, rippleUV + vUv.y);
    
    vec4 im = texture2D(tMap, U);
    
    // Maintain exact same masking effect
    if (rippleUV * -100.0 > centeredy + timer) {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
    } else {
        gl_FragColor = im;
    }
}
