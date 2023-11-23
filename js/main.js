// Import modules
import * as THREE from 'three';
import npyjs from 'npyjs';
import ndarray from 'ndarray';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Initiate global variables
let camera, scene, renderer, light, controls;
let geometry, material, point;
let particleTrajectory;

// Function to run on loading website
function init() {

  // Initiate lights, camera, and scene
  light = new THREE.AmbientLight( 0xffffff );

  camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 1000 );

  // Set camera position -- not currently working...
  camera.position.set( 0, 0, 50 );
  //camera.lookAt( new THREE.Vector3( 0, 0, 1000 ) );

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

  controls.update();

  // Load point cloud from numpy array
  let n = new npyjs();
  n.load('../assets/l63_point_cloud.npy').then(
    (res) => {

      // Draw point cloud
      particleTrajectory = ndarray( res['data'], res['shape'] );
      console.log('Particle trajectory loaded and stored in variable particleTrajectory pointCloud');
      console.log( particleTrajectory );
      //drawPointCloud( particleTrajectory );

      drawOrbit( particleTrajectory );

    }
  );

}

function animate() {

  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);

}

// Function to run once point-cloud is loaded
function drawPointCloud( points ) {

  for ( let i=1; i<100000; i+=50 ) {

    let x = points.get( i, 0 );
    let y = points.get( i, 1 );
    let z = points.get( i, 2 );

    drawPoint( x, y, z );

  }

  drawPoint( 0, 0, 1 );

}

// Function to draw an orbit (i.e. a particle trajectory)
function drawOrbit( points ) {

  let lineMaterial = new THREE.LineBasicMaterial( { color: 0xff0000 } );
  let startPoint, endPoint;

  startPoint = [
    points.get( 0, 0 ),
    points.get( 0, 1 ),
    points.get( 0, 2 ),
  ];

  for ( let i=1; i<100000; i+=1 ) {

   endPoint = [
     points.get( i, 0 ),
     points.get( i, 1 ),
     points.get( i, 2 ),
   ];
   drawLineSegment( startPoint, endPoint, lineMaterial );
   startPoint = endPoint;

  }

}

function drawPoint( x, y, z ) {

  // Points will be little spheres
  let pointRad = 0.4;      // sphere radius
  let pointRes = 20;       // sphere resolution
  let pointCol = 0xE0E0E0; // sphere colour (a light grey)
  geometry = new THREE.SphereGeometry( pointRad, pointRes, pointRes );
//  material = new THREE.MeshStandardMaterial( { color: 0xffffff } );
  material = new THREE.MeshNormalMaterial();
  point = new THREE.Mesh(geometry, material);
  scene.add(point);
  point.position.set( x, y, z );

}

function drawLineSegment( startPoint, endPoint, lineMaterial ) {

  // Following example at threejs.org/docs/#manual/en/introduction/Drawing-lines

  let points = [];
  points.push( new THREE.Vector3( startPoint[0], startPoint[1], startPoint[2] ) );
  points.push( new THREE.Vector3( endPoint[0], endPoint[1], endPoint[2] ) );

  let geometry = new THREE.BufferGeometry().setFromPoints( points );
  let line = new THREE.Line( geometry, lineMaterial );

  scene.add( line );

}

// ---------- Run the code. ------------ //
init();
animate();
// ------------------------------------- //

