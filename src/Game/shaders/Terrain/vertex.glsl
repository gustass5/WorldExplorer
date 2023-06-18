varying float vElevation;

void main(){
    vec4 terrainPosition = modelMatrix * vec4(position, 1.0);

    vec4 viewPosition =  viewMatrix * terrainPosition;

    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    vElevation = terrainPosition.y;
}