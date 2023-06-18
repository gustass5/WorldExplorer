void main(){
    vec4 trunkPosition = modelMatrix * vec4(position, 1.0);

    vec4 viewPosition = viewMatrix * trunkPosition;

    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;
}