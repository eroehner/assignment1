//IMPORT MODULES
import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import GUI from 'lil-gui';

//CONSTANT & VARIABLES
let width = window.innerWidth;
let height = window.innerHeight;
//-- GUI PARAMETERS
var gui;
const parameters = {
  Cubes: 10,
  Distance: 0,
  Size: 1,
  Color: 'blue',
}

//-- SCENE VARIABLES
var scene;
var camera;
var renderer;
var container;
var control;
var ambientLight;
var directionalLight;

//-- GEOMETRY PARAMETERS
//Create an empty array for storing all the cubes
let sceneCubes = [];
let lastCubes = parameters.Cubes;
let lastDistance = parameters.Distance;
let lastSize = parameters.Size;
let lastColor = parameters.Color;

function main(){
  //GUI
  gui = new GUI;
  gui.add(parameters, 'Cubes', 1, 100, 1);
  gui.add(parameters, 'Distance', 0, 10, 0.5);
  gui.add(parameters, 'Size', 1, 20, 1);
  gui.add(parameters, 'Color',['red', 'green', 'blue'])

  //CREATE SCENE AND CAMERA
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera( 15, width / height, 0.1, 5000);
  camera.position.set(50, 50, 50)

  //LIGHTINGS
  ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  directionalLight = new THREE.DirectionalLight( 0xffffff, 1);
  directionalLight.position.set(2,5,5);
  directionalLight.target.position.set(-1,-1,0);
  scene.add( directionalLight );
  scene.add(directionalLight.target);

  //GEOMETRY INITIATION
  // Initiate first cubes
  createCubes();

  //RESPONSIVE WINDOW
  window.addEventListener('resize', handleResize);
 
  //CREATE A RENDERER
  renderer = new THREE.WebGLRenderer({alpha:true, antialias:true});
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container = document.querySelector('#threejs-container');
  container.append(renderer.domElement);
  
  //CREATE MOUSE CONTROL
  control = new OrbitControls( camera, renderer.domElement );

  //EXECUTE THE UPDATE
  animate();
}
 
//-----------------------------------------------------------------------------------
//HELPER FUNCTIONS
//-----------------------------------------------------------------------------------
//GEOMETRY FUNCTIONS
// Create Cubes
function createCubes(){
  let currentCubePosition = [0,0,0];
  let lastCubePosition = [0,0,0];
  let lastCubeSize;
  for(let i=0; i<lastCubes; i++){
    let scaleFactor = Math.random() + 0.5;
    const geometry = new THREE.BoxGeometry(parameters.Size * scaleFactor, parameters.Size * scaleFactor, parameters.Size * scaleFactor);
    const material = new THREE.MeshPhysicalMaterial();

    if (parameters.Color == 'red') {
      material.color.setRGB((parameters.Cubes / 255) * i, 0, 0);
    } else if (parameters.Color == 'green') {
      material.color.setRGB(0, (parameters.Cubes / 255) * i, 0);
    } else if (parameters.Color == 'blue') {
      material.color.setRGB(0, 0, (parameters.Cubes / 255) * i);
    }

    const cube = new THREE.Mesh(geometry, material);
    let currentCubeSize = parameters.Size * scaleFactor;
    if(i==0){
      lastCubeSize = currentCubeSize;
    }
    let direction = Math.floor(Math.random() * 3);
    currentCubePosition = lastCubePosition;
    currentCubePosition[direction] = lastCubePosition[direction]+lastCubeSize/2 + currentCubeSize/2 + parameters.Distance;
    cube.position.set(currentCubePosition[0], currentCubePosition[1], currentCubePosition[2]);
    cube.name = "cube " + i;
    sceneCubes.push(cube);
    lastCubePosition = currentCubePosition;
    lastCubeSize = currentCubeSize;
    scene.add(cube);
  }
}


//Remove 3D Objects and clean the caches
function removeObject(sceneObject) {
  if (!(sceneObject instanceof THREE.Object3D)) return;

  if (sceneObject.geometry) sceneObject.geometry.dispose();

  if (sceneObject.material) {
    if (Array.isArray(sceneObject.material)) {
      sceneObject.material.forEach(material => material.dispose());
    } else {
      sceneObject.material.dispose();
    }
  }

  scene.remove(sceneObject); // Properly remove object from the scene
}

//Remove the cubes
function removeCubes(){
  lastCubes = parameters.Cubes;
  lastDistance = parameters.Distance;
  lastSize = parameters.Size;
  lastColor = parameters.Color;

  sceneCubes.forEach(element =>{
    let scene_cube = scene.getObjectByName(element.name);
    removeObject(scene_cube);
  })

  sceneCubes = [];
}

//RESPONSIVE
function handleResize() {
  width = window.innerWidth;
  height = window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
  renderer.render(scene, camera);
}


//ANIMATE AND RENDER
function animate() {
  requestAnimationFrame(animate);

  control.update();

  if (
    lastCubes != parameters.Cubes ||
    lastSize != parameters.Size ||
    lastDistance != parameters.Distance ||
    lastColor != parameters.Color
  ) {
    removeCubes();
    createCubes();
  }

  renderer.render(scene, camera);
}
//-----------------------------------------------------------------------------------
// CLASS
//-----------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------
// EXECUTE MAIN 
//-----------------------------------------------------------------------------------

main();