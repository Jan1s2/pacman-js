#ifdef GL_ES

precision mediump float;

#endif

varying vec2 vTexCoord;


void main() {
    vec3 color = vec3(0., 0., 1.);
    gl_FragColor = vec4(color, 1.);
}