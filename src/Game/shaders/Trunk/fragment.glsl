uniform float uOpacity;
uniform float uBlueValue;

void main(){
    gl_FragColor = vec4(0.4, 0.3, 0.05 + uBlueValue, uOpacity);
}