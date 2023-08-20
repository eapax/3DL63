// Import modules
import * as THREE from 'three';
import npyjs from 'npyjs';
import ndarray from 'ndarray';

// Initiate global variables
let camera, scene, renderer, light;
let geometry, material, point;
let pointCloud;

// Function to run on loading website
function init() {

  // Initiate lights, camera, and scene
  light = new THREE.AmbientLight( 0xffffff );
  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
  camera.position.z = 5;
  scene = new THREE.Scene();
  scene.add(light);

  // Initiate renderer
  renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Resize renderer on window resize
  window.addEventListener('resize', function()

    {
      var width = window.innerWidth;
      var height = window.innerHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    });

  // Load point cloud from numpy array
  let n = new npyjs();
  n.load('../assets/l63_point_cloud.npy').then(
    (res) => {
      pointCloud = ndarray( res['data'], res['shape'] );
      addCloudToScene();
    }
  );

}

function animate() {

  requestAnimationFrame(animate);
  renderer.render(scene, camera);

}

// Function to run once point-cloud is loaded

function addCloudToScene() {

  console.log('Point cloud loaded and stored in variable pointCloud');
  console.log(pointCloud);
  let x = pointCloud.get(20,0);
  let y = pointCloud.get(20,1);
  let z = pointCloud.get(20,2);
  console.log(x,y,z);

  // Points will be little spheres
  let pointRad = 0.4;      // sphere radius
  let pointRes = 20;       // sphere resolution
  let pointCol = 0xE0E0E0; // sphere colour (a light grey)
  geometry = new THREE.SphereGeometry( pointRad, pointRes, pointRes );
//  material = new THREE.MeshStandardMaterial( { color: 0xffffff } );
  material = new THREE.MeshNormalMaterial();
  point = new THREE.Mesh(geometry, material);
  console.log(point.position);
  scene.add(point);

}

// ---------- Run the code. ------------ //
init();
animate();
// ------------------------------------- //

