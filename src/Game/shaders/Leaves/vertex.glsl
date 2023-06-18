void main(){
    vec4 leavesPosition = modelMatrix * vec4(position, 1.0);

    vec4 viewPosition = viewMatrix * leavesPosition;

    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;
}