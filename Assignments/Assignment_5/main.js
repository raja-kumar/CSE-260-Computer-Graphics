// // import * as THREE from '../node_modules/three/build/three.module.js';
// // import {OrbitControls} from '../node_modules/three/examples/jsm/controls/OrbitControls.js';

// // import * as THREE from 'three';
import * as THREE from "https://cdn.skypack.dev/three@0.132.2";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/OrbitControls.js";
import { OBJLoader } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/loaders/OBJLoader.js';
import {MTLLoader} from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/loaders//MTLLoader.js';

// Create a scene
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// Set the camera position
camera.position.set(0, 0, 50);

// add fog

// {
//   const near = 60;
//   const far = 61;
//   const color = 'lightblue';
//   scene.fog = new THREE.Fog(color, near, far);
//   // scene.background = new THREE.Color(color);
// }
const canvas = document.getElementById('c')

// Create a renderer
const renderer = new THREE.WebGLRenderer({canvas});
// renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
// document.body.appendChild(renderer.domElement);

// create a texture loader
const textureLoader = new THREE.TextureLoader();

// add a skybox
const texture = textureLoader.load(
  'resources/universe.jpeg',
  () => {
    const rt = new THREE.WebGLCubeRenderTarget(texture.image.height);
    rt.fromEquirectangularTexture(renderer, texture);
    scene.background = rt.texture;
  });



// Create a sun
const sunGeometry = new THREE.SphereGeometry(7, 32, 32);
const sunTexture = textureLoader.load('./resources/sun.jpeg');
const sunMaterial = new THREE.MeshPhongMaterial({ map: sunTexture });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
sun.castShadow = true;
sun.receiveShadow = true;
// sun.position.set();
scene.add(sun);

// Aadd a cube

const cubeGeometry = new THREE.BoxGeometry(2, 2, 2);
// const cubeTexture = textureLoader.load('./resources/sun.jpeg');
const cubeMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
const cubeEle = new THREE.Mesh(cubeGeometry, cubeMaterial);
cubeEle.castShadow = true;
cubeEle.receiveShadow = true;
cubeEle.position.set(30,0,0);
scene.add(cubeEle);

// Create the stars
const starGeometry = new THREE.SphereGeometry(0.2, 10, 10);
const starMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
for (let i = 0; i < 200; i++) {
  const star = new THREE.Mesh(starGeometry, starMaterial);
  star.position.set(
    Math.random() * 200 - 100,
    Math.random() * 200 - 100,
    Math.random() * 200 - 100
  );
  scene.add(star);
}

// Create an array of planet properties


const planetProperties = [
  { radius: 0.5, color: 0xff0000, distance: 9, texture: './resources/mercury.jpeg'},
  { radius: 1.2, color: 0x00ff00, distance: 13, texture: './resources/venus.jpeg' },
  { radius: 1.3, color: 0x0000ff, distance: 15, texture: './resources/earth.jpeg' },
  { radius: 0.7, color: 0xff00ff, distance: 20, texture: './resources/mars.png' },
  { radius: 3, color: 0x00ffff, distance: 22, texture: './resources/jupiter.jpeg' },
  { radius: 2.7, color: 0xffff00, distance: 26, texture: './resources/saturn.jpeg' },
  { radius: 2, color: 0x00ff7f, distance: 30, texture: './resources/uranus.png' },
  { radius: 2, color: 0x00ff7f, distance: 32, texture: './resources/neptune.jpeg' }
];

// Create an array to hold the planet meshes
const planets = [];

// Create the planets and add them to the scene
planetProperties.forEach(props => {
  const planetGeometry = new THREE.SphereGeometry(props.radius, 32, 32);
  const planetTexture = textureLoader.load(props.texture)
  const planetMaterial = new THREE.MeshPhongMaterial({ map:planetTexture });
  const planet = new THREE.Mesh(planetGeometry, planetMaterial);
  planet.castShadow = true;
  planets.push(planet);
  scene.add(planet);
  
  // Set the planet's position relative to the sun
  planet.position.set(props.distance, 0, 0);
});

// add ring around saturn

const ringGeometry = new THREE.TorusBufferGeometry(5.5, 0.4, 32, 100);
const matrix = new THREE.Matrix4().makeRotationX(-Math.PI / 6);
ringGeometry.applyMatrix4(matrix);
ringGeometry.scale(1, 0, 1);
const ringTexture = textureLoader.load('./resources/ring.jpeg')
const ringMaterial = new THREE.MeshBasicMaterial({ map:ringTexture, side: THREE.DoubleSide });
const ring = new THREE.Mesh(ringGeometry, ringMaterial);
planets[5].add(ring);
//ring.position.set(26,0,0);

// //test code

// const sunGeometry1 = new THREE.SphereGeometry(7, 32, 32);
// const sunTexture1 = textureLoader.load('./resources/sun.jpeg');
// const sunMaterial1 = new THREE.MeshPhongMaterial({ map: sunTexture1 });
// const sun1 = new THREE.Mesh(sunGeometry1, sunMaterial1);
// // sun.position.set();
// scene.add(sun1);
// sun1.position.set(50,0,0);


// add label
function makeLabelCanvas(size, name) {
  const borderSize = 2;
  const ctx = document.createElement('canvas').getContext('2d');
  const font =  `${size}px bold sans-serif`;
  ctx.font = font;
  // measure how long the name will be
  const doubleBorderSize = borderSize * 2;
  const width = ctx.measureText(name).width + doubleBorderSize;
  const height = size + doubleBorderSize;
  ctx.canvas.width = width;
  ctx.canvas.height = height;
 
  // need to set font again after resizing canvas
  ctx.font = font;
  ctx.textBaseline = 'top';
 
  ctx.fillStyle = 'blue';
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = 'white';
  ctx.fillText(name, borderSize, borderSize);
 
  return ctx.canvas;
}

const canvas1 = makeLabelCanvas(500, "Elon Musk");
const texture_can = new THREE.CanvasTexture(canvas1);
const labelMaterial = new THREE.SpriteMaterial({
  map: texture_can,
  side: THREE.DoubleSide,
  transparent: true,
});

const label = new THREE.Sprite(labelMaterial);
label.position.set(0, 5, 0)


// load the astronaut obj file
var mtlLoader = new MTLLoader();

// Load the material file
mtlLoader.load(
    // Material file URL
    './resources/Astronaut/Astronaut.mtl',

    // Called when the material file is loaded
    function ( materials ) {
        materials.preload();

        // Create an OBJLoader
        var objLoader = new OBJLoader();

        // Set the materials for the OBJLoader
        objLoader.setMaterials(materials);

        objLoader.load(
          // OBJ file URL
          './resources/Astronaut/Astronaut.obj',

          // Called when the OBJ file is loaded
          function ( object ) {
              scene.add( object );
              object.position.set(20, 0, 0);
              object.add(label)
          },

          // Called while loading is progressing
          function ( xhr ) {
              console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
          },

          // Called when loading has errors
          function ( error ) {
              console.log( 'An error happened' );
          }
      );
  }
);

//add a ground for shadow

{
  const planeSize = 100;

  //const loader = new THREE.TextureLoader();
  const floorTexture = textureLoader.load('https://threejs.org/manual/examples/resources/images/checker.png');
  floorTexture.encoding = THREE.sRGBEncoding;
  floorTexture.wrapS = THREE.RepeatWrapping;
  floorTexture.wrapT = THREE.RepeatWrapping;
  floorTexture.magFilter = THREE.NearestFilter;
  const repeats = planeSize / 2;
  floorTexture.repeat.set(repeats, repeats);

  const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
  const planeMat = new THREE.MeshPhongMaterial({
    map: floorTexture,
    side: THREE.DoubleSide,
  });
  const mesh = new THREE.Mesh(planeGeo, planeMat);
  mesh.rotation.x = Math.PI * -.5;
  mesh.position.set(0,-10,0);
  mesh.receiveShadow = true;
  scene.add(mesh);
  
}


// add light source 
const color_amb = 0xFFFFFF;
const intensity_amb = 1;
const light_amb = new THREE.AmbientLight(color_amb, intensity_amb);
// light.position.set(0,0,0);
scene.add(light_amb);

// Create a point light
var pointLight = new THREE.PointLight(0xFFFF00, 1, 0);
// Set the position of the point light
pointLight.position.copy(sun.position);
// Add the point light to the cube mesh
scene.add(pointLight);


// create a spot light

const spotLight = new THREE.SpotLight( 0xFF0000, 1);
spotLight.position.set(0,50,0);
spotLight.castShadow = true;
scene.add(spotLight);
scene.add(spotLight.target);


// const color_dir = 0xFFFFFF;
// const intensity_dir = 1;
// const light_dir = new THREE.DirectionalLight(color_dir, intensity_dir);
// light_dir.position.set(0, 50, 0);
// light_dir.target.position.set(0, 0, 0);
// light_dir.castShadow = true;
// scene.add(light_dir);
// scene.add(light_dir.target);

// add picking

class PickHelper {
  constructor() {
    this.raycaster = new THREE.Raycaster();
    this.pickedObject = null;
    this.pickedObjectSavedColor = 0;
  }
  pick(normalizedPosition, scene, camera) {
    // restore the color if there is a picked object
    if (this.pickedObject) {
      this.pickedObject.material.emissive.setHex(this.pickedObjectSavedColor);
      this.pickedObject = undefined;
    }
 
    // cast a ray through the frustum
    this.raycaster.setFromCamera(normalizedPosition, camera);
    // get the list of objects the ray intersected
    const intersectedObjects = this.raycaster.intersectObjects(scene.children);
    if (intersectedObjects.length) {
      // pick the first object. It's the closest one
      this.pickedObject = intersectedObjects[0].object;
      // save its color
      this.pickedObjectSavedColor = this.pickedObject.material.emissive.getHex();
      // set its emissive color to flashing red/yellow
      this.pickedObject.material.emissive.setHex(0xFFFF00);
    }
  }
}

const pickPosition = {x: 0, y: 0};
clearPickPosition();


function getCanvasRelativePosition(event) {
  const rect = canvas.getBoundingClientRect();
  // console.log(event.clientX)
  // console.log(event.clientY)
  return {
    x: (event.clientX - rect.left) * canvas.width  / rect.width,
    y: (event.clientY - rect.top ) * canvas.height / rect.height,
  //   x : event.clientX,
  //   y: event.clientY,
  };
}
 
function setPickPosition(event) {
  const pos = getCanvasRelativePosition(event);
  pickPosition.x = (pos.x / canvas.width ) *  2 - 1;
  pickPosition.y = (pos.y / canvas.height) * -2 + 1;  // note we flip Y
  // pickPosition.x = pos.x;
  // pickPosition.y = -pos.y;
}
 
function clearPickPosition() {
  // unlike the mouse which always has a position
  // if the user stops touching the screen we want
  // to stop picking. For now we just pick a value
  // unlikely to pick something
  pickPosition.x = -100000;
  pickPosition.y = -100000;
}

window.addEventListener('mousemove', setPickPosition);
window.addEventListener('mouseout', clearPickPosition);
window.addEventListener('mouseleave', clearPickPosition);

window.addEventListener('touchstart', (event) => {
  // prevent the window from scrolling
  event.preventDefault();
  setPickPosition(event.touches[0]);
}, {passive: false});
 
window.addEventListener('touchmove', (event) => {
  setPickPosition(event.touches[0]);
});
 
window.addEventListener('touchend', clearPickPosition);





// Add mouse controls
const controls = new OrbitControls(camera, renderer.domElement);

const pickHelper = new PickHelper();


// Animate the scene
function animate() {
  requestAnimationFrame(animate);

  // Rotate each planet around the sun
  planets.forEach((planet, index) => {
    const angle = 0.001 * (index + 1);
    planet.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), angle);
    planet.rotation.x += 0.01;
    planet.rotation.y -= 0.01;
  });
  cubeEle.rotation.x += 0.01;
  cubeEle.rotation.y -= 0.01;
  pickHelper.pick(pickPosition, scene, camera);
  renderer.render(scene, camera);
  controls.update();
}
animate();


// to do
// add space obj file
// make astronaut rotate around the mars

