// Import modules
import * as THREE from 'three';
import npyjs from 'npyjs';
import ndarray from 'ndarray';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Initiate global variables
let camera, scene, renderer, light, controls;
let geometry, material, point;
let pointCloud;

// Function to run on loading website
function init() {

  // Initiate lights, camera, and scene
  light = new THREE.AmbientLight( 0xffffff );

  camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 1000 );

  // Set camera position -- not currently working...
  camera.position.set( 0, 0, 50 );
  camera.lookAt( new THREE.Vector3( 0, 0, 1000 ) );

  scene = new THREE.Scene();
  scene.add( light );

  // Initiate renderer
  renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  // Resize renderer on window resize
  window.addEventListener('resize', function()

    {
      var width = window.innerWidth;
      var height = window.innerHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    });

  // Add controls for moving / rotating / zooming of camera
  controls = new OrbitControls( camera, renderer.domElement );

  controls.update();

  // Load point cloud from numpy array
  let n = new npyjs();
  n.load('../assets/l63_point_cloud.npy').then(
    (res) => {
      pointCloud = ndarray( res['data'], res['shape'] );
      drawPointCloud();
    }
  );

}

function animate() {

  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);

}

// Function to run once point-cloud is loaded
function drawPointCloud() {

  console.log('Point cloud loaded and stored in variable pointCloud');
  console.log(pointCloud);

  for ( let i=1; i<100000; i+=50 ) {

    let x = pointCloud.get( i, 0 );
    let y = pointCloud.get( i, 1 );
    let z = pointCloud.get( i, 2 );
    console.log( i, x, y, z );

    drawPoint( x, y, z );

  }

  drawPoint( 0, 0, 1 );

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
//  console.log(point.position);
  scene.add(point);
  point.position.set( x, y, z );

}

// ---------- Run the code. ------------ //
init();
animate();
// ------------------------------------- //

