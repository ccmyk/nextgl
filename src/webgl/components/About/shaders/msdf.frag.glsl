#version 300 es
precision highp float;
#define varying in
#define texture2D texture
#define gl_FragColor FragColor
out vec4 FragColor;

uniform sampler2D tMap;
uniform float uTime;
uniform float uStart;
uniform float uColor;
uniform vec2 uMouse;

varying vec2 vUv;
varying vec2 vUvR;

float median(float r, float g, float b) {
    return max(min(r, g), min(max(r, g), b));
}

void main() {
    vec3 tex = texture2D(tMap, vUv).rgb;
    float signedDist = median(tex.r, tex.g, tex.b) - 0.5;
    float d = fwidth(signedDist);
    float alpha = smoothstep(-d, d, signedDist);

    vec3 color = vec3(uColor);
    
    // Add ripple effect based on mouse position
    float distToMouse = distance(uMouse + 0.5, vUvR.xy * 0.5);
    color.r += distToMouse * sin(uTime * 0.5) * 0.1;
    
    gl_FragColor = vec4(color, alpha * uStart);
}
