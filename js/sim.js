window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );

}
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.rotateX( -0.2 );

const renderer = new THREE.WebGLRenderer();
renderer.setClearColor( 0xFFFFFF, 1 );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const cubeGeometry = new THREE.BoxGeometry();
const shaderMaterial = new THREE.ShaderMaterial({
    vertexShader: document.getElementById('vertexShader').textContent,
    fragmentShader: document.getElementById('fragmentShader').textContent
})

function randomBetween(min, max){
    return (Math.random() * (max - min) + min);
}
const cubes = [];
for(var i = 0; i < 30; i++){
    const cube = new THREE.Mesh( cubeGeometry, shaderMaterial );
    cube.position.set(randomBetween(-4,4), randomBetween(-4,2), randomBetween(-4,2));
    cube.rotation.set(randomBetween(-2,2), randomBetween(-2,2), randomBetween(-2,2));
    cubes.push(cube);
    scene.add(cube);
}

/*const planeGeometry = new THREE.PlaneGeometry(20, 20, 20);
const plane = new THREE.Mesh(planeGeometry, shaderMaterial);
plane.rotation.set(-Math.PI / 2, 0,  0);
plane.position.set(0, -2, 0);
cube.rotation.set(0,0,0);
scene.add( plane );
const cubeVel = new THREE.Vector3(0, 5, 0);
const cubePos = new THREE.Vector3(0, 0, 0);
const grav = new THREE.Vector3(0, -9, 0);*/

camera.position.z = 5;
var lastTime = 0;
var t = 0;
var deltaTime = 0;
function render(currTime) {
    if(!lastTime) {lastTime = currTime };
    renderer.render(scene, camera);
    deltaTime = (currTime - lastTime) / 1000;
    if(!deltaTime){
      deltaTime = 0;
    }
    lastTime = currTime;
    t = deltaTime * 1; 
    for(var i = 0; i < cubes.length; i++){
        cubes[i].rotation.set(cubes[i].rotation.x + (t * 0.5), cubes[i].rotation.y + (t * 0.2), cubes[i].rotation.z + t);
    }
    requestAnimationFrame(render);
}
render();
