precision highp float;

// Default uniform for previous pass is 'tMap'.
// Can change this using the 'textureUniform' property
// when adding a pass.
uniform sampler2D tMap;

uniform float uTime;
uniform float uStart;
uniform float uMouseT;
uniform float uMouse;

varying vec2 vUv;

float ripple(float uv, float time, float prog, float multi) {
    float distance = length((uv * 3.) + (time * 1.4));
    return tan(distance * (1.)) * (multi * prog);
}

void main() {
    float timer = uStart;
    float centeredx = (vUv.x - .5) * 2.;
    float centeredy = (vUv.y - .5) * 2.;
    
    float rippleUV = (ripple(vUv.y, timer, 1. - abs(timer), -.36) * ((.1 * (1. - abs(timer)))));
    
    vec2 U = vec2(vUv.x, rippleUV + vUv.y);

    float distor = 1.;

    vec4 im = texture2D(tMap, U);

    if(rippleUV * -100. > centeredy + timer) {
        gl_FragColor = vec4(0., 0., 0., 0.);
    } else {
        gl_FragColor = vec4(im);
    }
} 