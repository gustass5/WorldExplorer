uniform float uOpacity;
uniform float uBlueValue;

void main(){
    gl_FragColor = vec4(0.2, 0.6, 0.3 + uBlueValue, uOpacity);
}