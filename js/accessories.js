import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

const TEXT3D_FONT = "assets/fonts/helvetiker_regular.typeface.json";

function addLine( scene, startPoint, endPoint, lineMaterial ) {

   // Following example at threejs.org/docs/#manual/en/introduction/Drawing-lines

   let points = [];
   points.push( new THREE.Vector3( startPoint[0], startPoint[1], startPoint[2] ) );
   points.push( new THREE.Vector3( endPoint[0], endPoint[1], endPoint[2] ) );

   let geom = new THREE.BufferGeometry().setFromPoints( points );
   let line = new THREE.Line( geom, lineMaterial);

   scene.add( line );

}

function addText( scene, txt, colour, x, y, z, scale ) {

  // Use NWS color #647A70 for text
  const textMaterial = new THREE.MeshBasicMaterial( { color: colour } );

  var loader = new FontLoader();
  loader.load( TEXT3D_FONT, function ( font ) {

    let textGeometry = new TextGeometry( txt, {
      font: font,
      size: 5*scale,
      height: 1*scale,
      curveSegments: 10*scale,
      bevelThickness: 0.1*scale,
      bevelSize: 0.1*scale,
      bevelEmbedded: true,
    });

    var text = new THREE.Mesh( textGeometry, textMaterial );

    text.position.x = x;
    text.position.y = y;
    text.position.z = z;

    // Rotate so that letters are right way up
    // i.e. top of letter points in the Z direction
    text.rotation.x = Math.PI / 2;

    scene.add( text );

  });

}

function addAxis( scene, axOrigin, axLen, axColour, axTextOffset, textScale ) {

  //  const textMaterial = new THREE.MeshPhongMaterial( { color: 0xff0000, specular: 0xffffff } );
  const lineMaterial = new THREE.LineBasicMaterial( { color: axColour } );

  // Build axes from 3 lines
  let xAxisEnd = [ axOrigin[0] + axLen, axOrigin[1], axOrigin[2] ];
  let yAxisEnd = [ axOrigin[0], axOrigin[1] + axLen, axOrigin[2] ];
  let zAxisEnd = [ axOrigin[0], axOrigin[1], axOrigin[2] + axLen ];

  addLine( scene, axOrigin, xAxisEnd, lineMaterial );
  addLine( scene, axOrigin, yAxisEnd, lineMaterial );
  addLine( scene, axOrigin, zAxisEnd, lineMaterial );

  // Add labels next to axes
  let delta = axLen + axTextOffset;

  addText( scene, 'x', axColour, axOrigin[0] + delta, axOrigin[1], axOrigin[2], textScale );
  addText( scene, 'y', axColour, axOrigin[0], axOrigin[1] + delta, axOrigin[2], textScale );
  addText( scene, 'z', axColour, axOrigin[0], axOrigin[1], axOrigin[2] + delta, textScale );

}

export { addAxis }
