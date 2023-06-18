varying float vElevation;

void main(){
    vec3 topColor = vec3(0.0, 1.0, 0.0);
    vec3 bottomColor = vec3(0.0, 0.25, 0.0);
    vec3 color = mix(bottomColor, topColor, vElevation);

    gl_FragColor = vec4(color, 1.0);
}