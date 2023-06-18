uniform float uOpacity;
uniform float uBlueValue;

void main(){
    gl_FragColor = vec4(0.3, 0.3, 0.3 + uBlueValue, uOpacity);
}