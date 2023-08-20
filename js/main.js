import * as THREE from 'three';

// ---- BEGIN PRELIMIARIES ---- //

// Grab html element to contain scene
const container = document.querySelector( '#scene-container' );

// Set up scene
const scene = new THREE.Scene();

// Set up camera
let fov = 75;
let aspect = window.innerWidth / window.innerHeight;
let near = 0.1;
let far = 500;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 10;

// Initiate renderer
const renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setSize( window.innerWidth, window.innerHeight);
document.body.appendChild( renderer.domElement );

// Initiate the animation loop
function animate() {
    requestAnimationFrame( animate );
    renderer.render( scene, camera );
}
animate()

// Deal with browser window resizes
const setSize = ( container, camera, renderer ) => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( container.clientWidth, container.clientHeight );
    renderer.setPixelRatio( window.devicePixelRatio );
}

class Resizer {
    contructor( container, camera, renderer ) {
        // set initial size on load
        setSize( container, camera, renderer );

        window.addEventListener("resize", () => {
            // set the size again if a resize occurs
            setSize( container, camera, renderer );
            this.onResize();
        });
    }

    onResize() {}
}

const resizer = new Resizer( container, camera, renderer);
resizer.onResize = () => {
    this.render();
}

function render() {
    // draw a single frame
    renderer.render(scene, camera);
}

// ---- END PRELIMIARIES ---- //

// Make a sphere
let sphereRes = 5; // resolution for discretization
let sphereCol = 0xE0E0E0; // sphere colour (a light grey)
const geometry = new THREE.SphereGeometry( 3, sphereRes, sphereRes );
const material = new THREE.MeshBasicMaterial( { color: sphereCol } );
const cube = new THREE.Mesh( geometry, material );

// Add cube to scene
scene.add( cube );
