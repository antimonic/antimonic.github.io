window.addEventListener( 'resize', onWindowResize, false );

const mouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();

function onMouseMove (e) {
    mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;
}


function onWindowResize(){

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );

}

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const portalLCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const portalRCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const world = new CANNON.World();
world.gravity.set(0, -3.82, 0);


camera.rotateX( -0.1 );
camera.rotateY( 0.8 );
camera.translateY( 3.0 );


const renderer = new THREE.WebGLRenderer();
renderer.setClearColor( 0xFFFFFF, 1 );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const cubeGeometry = new THREE.BoxGeometry(1);
const largeCubeGeometry = new THREE.BoxGeometry(2, 2, 2);
/*const shaderMaterial = new THREE.ShaderMaterial({
    vertexShader: document.getElementById('vertexShader').textContent,
    fragmentShader: document.getElementById('fragmentShader').textContent
})*/
const activeMaterial = new THREE.MeshPhongMaterial({
    color: 0xFFFFFF
});

const behindMaterial = new THREE.MeshBasicMaterial({
    color: 0xFF0000
})

const floorMaterial = new THREE.MeshPhongMaterial({
    color: 0x00FFFF
});
const backMaterial = new THREE.MeshPhongMaterial({
    color: 0x00FF00
});
const leftMaterial = new THREE.MeshPhongMaterial({
    color: 0xFFFF00
});

const directionalLight = new THREE.DirectionalLight( 0xFFFFFF, 1.4);
directionalLight.castShadow = true;
directionalLight.position.set(8, 8, 8);
directionalLight.target.position.set(-8, -8, -8);
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.near = 0.1;
directionalLight.shadow.camera.far = 500;
const d = 24;
directionalLight.shadow.camera.left = -d;
directionalLight.shadow.camera.right = d;
directionalLight.shadow.camera.top = d;
directionalLight.shadow.camera.bottom = -d;
scene.add(directionalLight);
scene.add(directionalLight.target);
renderer.shadowMap.enabled = true;

const pointLight = new THREE.PointLight(0xFF0000, 1.5, 20, 2);
pointLight.position.set(0, 8, 0);
//scene.add(pointLight);

var directLightOn = true;


const meshes = [];
const bodies = [];

const lightSwitchGeometry = new THREE.BoxGeometry(0.5, 1,0.5);
const lightSwitch = new THREE.Mesh( lightSwitchGeometry, backMaterial );
lightSwitch.position.set(-7.5, 4, 2);
scene.add(lightSwitch);
bodies.push(new CANNON.Body({ mass: 0, position: new CANNON.Vec3(-7.5, 4, 2) }));
meshes.push(lightSwitch);

const wallGeometry = new THREE.BoxGeometry(16,1,16);
const floor = new THREE.Mesh( wallGeometry, floorMaterial );
floor.receiveShadow = true;
meshes.push(floor);
scene.add(floor);
const physPlane = new CANNON.Body({
    mass: 0,
    position: new CANNON.Vec3(0, 0, 0),
    shape: new CANNON.Box(new CANNON.Vec3(8,0.5,8))
})
physPlane.quaternion.setFromEuler(0, 0, 0);
bodies.push(physPlane);
world.addBody(physPlane);

const farBackWall = new THREE.Mesh( wallGeometry, behindMaterial );
farBackWall.receiveShadow = true;
meshes.push(farBackWall);
scene.add(farBackWall);
const physFarBack = new CANNON.Body({
    mass: 0,
    position: new CANNON.Vec3(0, 8, 8),
    shape: new CANNON.Box(new CANNON.Vec3(8,0.5,8))
})
physFarBack.quaternion.setFromEuler(Math.PI / 2, 0, 0);
bodies.push(physFarBack);
world.addBody(physFarBack);

const farRightWall = new THREE.Mesh( wallGeometry, behindMaterial );
farRightWall.receiveShadow = true;
meshes.push(farRightWall);
scene.add(farRightWall);
const physFarRight = new CANNON.Body({
    mass: 0,
    position: new CANNON.Vec3(8, 8, 0),
    shape: new CANNON.Box(new CANNON.Vec3(8,0.5,8))
})
physFarRight.quaternion.setFromEuler(0, 0, Math.PI / 2);
bodies.push(physFarRight);
world.addBody(physFarRight);

const backWall = new THREE.Mesh( wallGeometry, backMaterial );
meshes.push(backWall);
backWall.receiveShadow = true;
scene.add(backWall);
const physBackWall = new CANNON.Body({
    mass: 0,
    position: new CANNON.Vec3(0, 8, -8),
    shape: new CANNON.Box(new CANNON.Vec3(8,0.5,8))
})
physBackWall.quaternion.setFromEuler(Math.PI / 2, 0, 0);
bodies.push(physBackWall);
world.addBody(physBackWall);

const leftWall = new THREE.Mesh( wallGeometry, leftMaterial );
leftWall.receiveShadow = true;
meshes.push(leftWall);
scene.add(leftWall);
const physLeftWall = new CANNON.Body({
    mass: 0,
    position: new CANNON.Vec3(-8, 8, 0),
    shape: new CANNON.Box(new CANNON.Vec3(8,0.5,8))
})
physLeftWall.quaternion.setFromEuler(0, 0, Math.PI / 2);
bodies.push(physLeftWall);
world.addBody(physLeftWall);

const testCube = new THREE.Mesh( cubeGeometry, activeMaterial );
testCube.castShadow = true;
meshes.push(testCube);
scene.add(testCube);
const physTestCube = new CANNON.Body({
    mass: 50,
    position: new CANNON.Vec3(-4, 4, 0),
    shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)),
    linearDamping: 0.6,
    angularDamping: 0.6
})
physTestCube.quaternion.setFromEuler(0, -0.2, 0);
bodies.push(physTestCube);
world.addBody(physTestCube);

const largeTestCube = new THREE.Mesh( largeCubeGeometry, activeMaterial );
largeTestCube.castShadow = true;
meshes.push(largeTestCube);
scene.add(largeTestCube);
const largPhysTestCube = new CANNON.Body({
    mass: 100,
    position: new CANNON.Vec3(-6, 6, 0),
    shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)),
    linearDamping: 0.6,
    angularDamping: 0.6
})
largPhysTestCube.position.set(-4.128, 1.5, -0.28);
largPhysTestCube.quaternion.setFromEuler(0, 0.15, 0);
bodies.push(largPhysTestCube);
world.addBody(largPhysTestCube);
function randomBetween(min, max){
    return (Math.random() * (max - min) + min);
}

const fixedTimeStep = 1.0 / 60.0;
const maxSubSteps = 3;

camera.position.z = 5;
var lastTime = 0;
var t = 0;
var deltaTime = 0;
var isHolding = false;
var startPos;
var constrained;
var heldBody;
const renderTargetL = new THREE.WebGLRenderTarget( 256, 512, { format: THREE.RGBFormat } );
const renderTargetR = new THREE.WebGLRenderTarget( 256, 512, { format: THREE.RGBFormat } );



var planelikeGeometry = new THREE.CubeGeometry( 0.1, 4, 2 );
var portalL = new THREE.Mesh( planelikeGeometry, new THREE.MeshBasicMaterial( { map: renderTargetL.texture } ) );
portalL.position.set(-7.5,4,4);
var portalR = new THREE.Mesh( planelikeGeometry, new THREE.MeshBasicMaterial( { map: renderTargetR.texture } ) );
portalR.position.set(-3,4,-7.5);
portalR.rotation.set(0, Math.PI / 2, 0);
portalLCamera.position.copy(portalR.position);
portalLCamera.rotation.set(0, Math.PI, 0);
portalRCamera.position.copy(portalL.position);
portalRCamera.rotation.set(0, Math.PI / -2, 0);
scene.add(portalL);
scene.add(portalR);

function frame(currTime){
    if(!lastTime) {lastTime = currTime };
    deltaTime = (currTime - lastTime);
    if(!deltaTime){
      deltaTime = 0;
    }
    lastTime = currTime;
        
    if(isHolding){
       const forward = new THREE.Vector3(0, 0, -1);
       forward.applyQuaternion(camera.quaternion);
       //Project view ray onto original plane
       raycaster.setFromCamera(mouse, camera);
       const rayDir = raycaster.ray.direction;
       rayDir.normalize();
       const denom = forward.dot(rayDir);
       const cameraPos = new THREE.Vector3();
       cameraPos.copy(camera.position);
       const t = (cameraPos.sub(startPos)).dot(forward) / (denom);
       const projected = raycaster.ray.origin.addScaledVector(rayDir, -t);
       constrained.position.copy(projected);
    }
    world.step(fixedTimeStep, deltaTime, maxSubSteps);

    render();
    requestAnimationFrame(frame);
}


function onMouseDown (e) {
   raycaster.setFromCamera( mouse, camera );
   let hits = raycaster.intersectObjects(meshes);
   if(hits.length > 0){
     if(hits[0].object.id == lightSwitch.id){
        if(directLightOn){
            scene.remove(directionalLight);
            scene.add(pointLight);
        }else{
            scene.remove(pointLight);
            scene.add(directionalLight);
        }
        directLightOn = !directLightOn;
        return;
     }
     isHolding = true;
     const hitPoint = new CANNON.Vec3();
     const body = bodies[meshes.indexOf(hits[0].object)];
     hitPoint.copy(hits[0].point);
     startPos = new THREE.Vector3();
     startPos.copy(hits[0].object.position);
     heldBody = body;
     constrained = new CANNON.Body({ mass: 0, position: hitPoint });
     const toContact = hitPoint.vsub(body.position);
     const transform = CANNON.Transform;
     constraint = new CANNON.PointToPointConstraint(constrained, new CANNON.Vec3(0,0,0), body, body.pointToLocalFrame(hitPoint), 4);
     world.add(constrained);
     world.addConstraint(constraint);
   }
   
}

function onMouseUp (e) {
    if(!isHolding){
        return;
    }
    isHolding = false;
    world.remove(constrained);
    world.removeConstraint(constraint);
}

document.onkeypress = function (e){
    e = e || window.event;
    if(e.code == "KeyF"){
        if(isHolding){
            const forward = new THREE.Vector3(0, 0, -1);
            forward.applyQuaternion(camera.quaternion);
            forward.multiplyScalar(500);
            onMouseUp();
            heldBody.applyImpulse(forward, heldBody.position);
        }
    }
}

document.querySelector('canvas').onmousedown = onMouseDown;
document.querySelector('canvas').onmousemove = onMouseMove;
document.querySelector('canvas').onmouseup = onMouseUp;
document.querySelector('canvas').onmouseleave = onMouseUp;
document.querySelector('canvas').onwheel = scroll;

function scroll(e){
    if(isHolding){
        const forward = new THREE.Vector3(0, 0, -1);
        forward.multiplyScalar(e.deltaY / -200);
        forward.applyQuaternion(camera.quaternion);
        startPos.add(forward);
    }
}


function render() {
    for(var i = 0; i < bodies.length; i++){
        meshes[i].position.copy(bodies[i].position);
        meshes[i].quaternion.copy(bodies[i].quaternion);
    }
    renderer.render(scene, camera);
    renderer.setRenderTarget(renderTargetL)
    renderer.render(scene, portalLCamera);
    renderer.setRenderTarget(renderTargetR);
    renderer.render(scene, portalRCamera);
    renderer.setRenderTarget(null);
}

frame();
