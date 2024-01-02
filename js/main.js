// Import modules
import npyjs from 'npyjs';
import ndarray from 'ndarray';
import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import { addAxis } from './accessories.js';

// Initiate global variables
let camera, scene, renderer, light, controls;
let geometry, material;
let orbit, pointCloud;
let gui;

// Points will be little spheres
let pointRad = 0.1;      // sphere radius
let pointRes = 20;       // sphere resolution
let pointCol = 0xE0E0E0; // sphere colour (a light grey)
let pointGeometry = new THREE.SphereGeometry( pointRad, pointRes, pointRes );
let pointMaterial = new THREE.MeshNormalMaterial();
// pointMaterial = new THREE.MeshStandardMaterial( { color: 0xffffff } );

// Set material for orbit path
let lineMaterial = new THREE.LineBasicMaterial( { color: 0xff0000 } );

// Define model names
const MODEL_NAMES = [
  'Orbit',
  'Point cloud',
];

// Define parameters for axis
const AX_ORIGIN = [-20, -20, 0];
const AX_LEN = 12;
const AX_TEXT_SCALE = 0.3;
const AX_TEXT_OFFSET = 1.0;
const AX_COLOUR = '#FBF7F5';     // Chalk white

// The point that the camera will look at
const X0 = 0;
const Y0 = 0;
const Z0 = 20;

// The point that the camera is initially placed at
const X1 = 45;
const Y1 = -60;
const Z1 = 30;

// Set "up" direction as Z (threejs uses Y by default)
THREE.Object3D.DEFAULT_UP.set( 0, 0, 1 );

// Function to run on loading website
function init() {

  // Initiate lights, camera, and scene
  light = new THREE.AmbientLight( 0xffffff );
  camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 1000 );
  camera.position.set( X1, Y1, Z1 );
  scene = new THREE.Scene();
  scene.add( light );

  // Initiate renderer
  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  // Resize renderer on window resize
  window.addEventListener( 'resize', function()
    {
      var width = window.innerWidth;
      var height = window.innerHeight;
      renderer.setSize( width, height );
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }
  );

  // Add controls for moving / rotating / zooming of camera
  controls = new OrbitControls( camera, renderer.domElement );
  //controls = new OrbitControls( camera, document.body );
  controls.target.set( X0, Y0, Z0 );
  controls.update();

  // Add axis
  addAxis( scene, AX_ORIGIN, AX_LEN, AX_COLOUR, AX_TEXT_OFFSET, AX_TEXT_SCALE );

  // Load point cloud from numpy array
//  let n = new npyjs();
//  n.load('../assets/l63_point_cloud.npy').then(
//    (res) => {
//
//      // Draw point cloud
//      let particleTrajectory = ndarray( res['data'], res['shape'] );
//      let numPoints = particleTrajectory.shape[0];
//      pointCloud = makePointCloud( particleTrajectory, numPoints, 25 );
//
//      // Plotting too long an orbit becomes a bit dense, so cap at length 25000
//      let numOrbitPoints = Math.min( numPoints, 25000 );
//
//      // Make orbit
//      orbit = makeOrbit( particleTrajectory, numOrbitPoints, 1 );
//
//      // Add orbit to scene
//      scene.add( orbit );
//
//      // Add point cloud to scene
//      //for ( const point of pointCloud ) {
//      //  scene.add(point);
//      //}
//
//      // Add GUI with drop-down list to select orbit or point cloud
//      createGUI();
//
//    }
//  );

  let n2 = new npyjs();
  n2.load('../assets/l63_hist.npy').then(
    (res) => {

      let histData = ndarray( res['data'], res['shape'] );
      makeHistogram( histData, 2, 1000 );

    }
  );

}

function animate() {

  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);

}

function makeHistogram( histData, binwidth, opacityFactor ) {

  let numBins = histData.shape[0];

  for ( let i=0; i<numBins; i+=1 ) {

    let x = histData.get( i, 0 );
    let y = histData.get( i, 1 );
    let z = histData.get( i, 2 );
    let p = histData.get( i, 3 );

    // Set material for 3D probability distribution (histogram made of cubes)
    let cubeGeometry = new THREE.BoxGeometry( binwidth, binwidth, binwidth );
    let cubeMaterial = new THREE.MeshBasicMaterial( {
      color: 0xff66ff,
      opacity: p*opacityFactor,
      transparent: true,
    } );
    let cube = new THREE.Mesh( cubeGeometry, cubeMaterial );
    scene.add( cube );

    cube.position.set( x, y, z );

  }

}


// Function to make a list of point (i.e. sphere) Meshes
function makePointCloud( points, numPoints, skipLength ) {

  let x, y, z, point;
  let pointCloud = [];

  for ( let i=0; i<numPoints; i+=skipLength ) {

    x = points.get( i, 0 );
    y = points.get( i, 1 );
    z = points.get( i, 2 );

    point = new THREE.Mesh( pointGeometry, pointMaterial );
    point.position.set( x, y, z );
    pointCloud.push( point );

  }

  return pointCloud

}

// Function to draw an orbit (i.e. a particle trajectory)
function makeOrbit( points, numPoints, numSkip ) {

  let startPoint, endPoint;
  let lineSegmentGeometries = [];

  startPoint = [
    points.get( 0, 0 ),
    points.get( 0, 1 ),
    points.get( 0, 2 ),
  ];

  for ( let i=1; i<numPoints; i+=numSkip ) {

   endPoint = [
     points.get( i, 0 ),
     points.get( i, 1 ),
     points.get( i, 2 ),
   ];

   let geometry = makeLineSegmentGeometry( startPoint, endPoint );
   lineSegmentGeometries.push( geometry );

   startPoint = endPoint;

  }

  let mergedGeometry = BufferGeometryUtils.mergeGeometries( lineSegmentGeometries );
  let orbit = new THREE.Line( mergedGeometry, lineMaterial );

  return orbit

}

function makeLineSegmentGeometry( startPoint, endPoint ) {

  // Following example at threejs.org/docs/#manual/en/introduction/Drawing-lines

  let points = [];
  points.push( new THREE.Vector3( startPoint[0], startPoint[1], startPoint[2] ) );
  points.push( new THREE.Vector3( endPoint[0], endPoint[1], endPoint[2] ) );
  let geometry = new THREE.BufferGeometry().setFromPoints( points );

  return geometry

}

function createGUI() {

  const guiContainer = document.getElementById( 'gui-container' );
  gui = new GUI( { 'container': guiContainer } );

  const folder1 = gui.addFolder( 'Representation' );

  const dropdown = folder1.add( MODEL_NAMES, 'Representation', MODEL_NAMES );

  // Define default value as first item in list
  dropdown.setValue( MODEL_NAMES[0] );

  dropdown.onChange( switchModel );

}

function switchModel( name ) {

  // Remove point cloud and orbit
  for ( const point of pointCloud ) {
    scene.remove( point );
  }
  scene.remove( orbit );

  if ( name == 'Point cloud' ) {
      for ( const point of pointCloud ) {
        scene.add(point);
      }
      //console.log(pointCloud);
  } else if ( name == 'Orbit' ) {
      scene.add( orbit );
  } else {
      console.log('Warning! Attempting to switch GUI to unknown model ', name)
  }

}

// ---------- Run the code. ------------ //
init();
animate();
// ------------------------------------- //

