uniform float uTime;

void main(){
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    modelPosition.x += uTime;

    vec4 viewPosition = viewMatrix * modelPosition;

    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;
}