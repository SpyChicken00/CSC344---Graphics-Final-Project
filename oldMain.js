import * as THREE from '../modules/three.module.js';
import { OrbitControls } from '../modules/OrbitControls.js';

//scene and camera and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

//const renderer = new THREE.WebGLRenderer({alpha:true});
const renderer = new THREE.WebGLRenderer({antialias: false});
renderer.setSize( window.innerWidth, window.innerHeight );
//renderer.setClearColor(0x010101, 1); //white background - replace ffffff with any hex color; second param is opacity, 0 => transparent
document.body.appendChild( renderer.domElement );


//orbit controls
const controls = new OrbitControls( camera, renderer.domElement );
camera.position.set( 0, 0, 5);
controls.update();


// add lights
var ambientLight = new THREE.AmbientLight( 0x0000FF );
scene.add(ambientLight);

var dirLight = new THREE.DirectionalLight( 0xFFFFFF, 0.5);
scene.add(dirLight);

//materials
const material = new THREE.MeshPhongMaterial( { color: 0x00ff00, emissive: 0x993300, shininess: 50, specular: 0xff0000, transparent: true, opacity: 1.0} );
const material2 = new THREE.MeshBasicMaterial( { color: 0xffffff } );
const material3 = new THREE.MeshBasicMaterial( { color: 0xddffdd} );
const material4 = new THREE.MeshBasicMaterial( { color: 0xaaccaa} );
const material5 = new THREE.MeshLambertMaterial( { color: 0xfedcba, emissive: 0x990000, transparent: true, opacity: 0.5} );
const material6 = new THREE.MeshLambertMaterial( { color: 0xabcdef, transparent: true, opacity: 0.7} );
const material7 = new THREE.MeshLambertMaterial( { color: 0xfedcba, flatShading: true});
const material8 = new THREE.MeshPhongMaterial( { color: 0x80fc66, emissive: 0x111111, shininess: 70, specular: 0xff0000, transparent: true, opacity: 0.8});
const material9 = new THREE.MeshLambertMaterial( { color: 0x00ff00});

//create geometry mesh with materials
const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const cube = new THREE.Mesh( geometry, material);
const cone = new THREE.Mesh(drawCylinder(0.01, 1, 3), material5);
const mycube = new THREE.Mesh(drawCube(0, 2, 0, 2, 0, -2), material);
const polygon = new THREE.Mesh(PolygonGeometry(5, 3, new THREE.Vector3(-1, -1, 0)), material3);
const sphere = new THREE.Mesh(drawSphere(2, 64, 32), material8);


//TODO figure out how to make combined object 
//TODO figure out how to add textures to objects
//TODO add floor


const array = [mycube, cone];


//transform mesh
sphere.position.y += 5

//add mesh to scene
scene.add(mycube);
scene.add(cone);
scene.add(sphere);
scene.add(polygon);

//add background to scene
var bgTexture = new THREE.TextureLoader().load("../pictures/stars.jpg");
bgTexture.minFilter = THREE.LinearFilter;
scene.background = bgTexture;

renderer.autoClear = false;

function animate() {
	requestAnimationFrame( animate );
;
	//add rotations
	mycube.rotation.x += 0.01;
	mycube.rotation.y += 0.01;
	//cone.rotation.x += 0.001;
	sphere.rotation.z += 0.0005
	sphere.rotation.y += 0.0005;


	//how to get mouse object in threejs
	//cone.rotation.y = THREE.MathUtils.lerp(cone.rotation.y, (mouse.x * Math.PI) / 10, 0.1)
	//cone.rotation.x = THREE.MathUtils.lerp(cone.rotation.x, (mouse.y * Math.PI) / 10, 0.1)

	//update controls 
	controls.update();
	//render image
	renderer.render( scene, camera );
}


function drawTriangle() {
	const triangle = new THREE.BufferGeometry();
	// vertices
	const points = [
	new THREE.Vector3(1, 1, 0),
	new THREE.Vector3(3, 1, 0),
	new THREE.Vector3(3, 3, 0)
	]
	triangle.setFromPoints(points);
	return triangle;
}

function drawCube(x1, x2, y1, y2, z1, z2) {
	const cube = new THREE.BufferGeometry();
	const points = new Float32Array([

		//NEEDS TO BE CLOCKWISE BECAUSE FACIGN FROM BACK ITSCOUNTER CLOCKWISE

		//FRONT SIDE TWO TRIANGLES same z
		x1, y1, z1,
		x2, y1, z1,
		x2, y2, z1,

		x2, y2, z1, 
		x1, y2, z1,
		x1, y1, z1,

		//BACK SIDE TWO TRIANGLES same z (FIXED)
		x1, y1, z2,
		x1, y2, z2,
		x2, y2, z2,

		x2, y2, z2,
		x2, y1, z2,
		x1, y1, z2,

		//TOP SIDE- same y
		x1, y2, z1,
		x2, y2, z1,
		x2, y2, z2,

		x2, y2, z2,
		x1, y2, z2,
		x1, y2, z1,

		//BOTTOM SIDE- same y

		x1, y1, z1,
		x1, y1, z2,
		x2, y1, z2,

		x2, y1, z2,
		x2, y1, z1,
		x1, y1, z1,

		
		//RIGHT SIDE SIDE - same x
		x2, y1, z1,
		x2, y1, z2,
		x2, y2, z2,

		x2, y2, z2,
		x2, y2, z1,
		x2, y1, z1,

		 
		//LEFT SIDE SIDE - same x

		x1, y1, z1,
		x1, y2, z1,
		x1, y2, z2,

		x1, y2, z2,
		x1, y1, z2,
		x1, y1, z1,

	]);

	cube.setAttribute('position', new THREE.BufferAttribute (points, 3));

	return cube;
}

function drawCylinder(topRadius, bottomRadius, height) {
	const cylinder = new THREE.CylinderGeometry(topRadius, bottomRadius, height);
	cylinder.translate(2,2,-2);
	return cylinder;
}

function drawSphere(radius, width, height) {
	const sphere = new THREE.SphereGeometry(radius, width, height);
	sphere.translate(-3, -3, -2);
	return sphere;
}
	
//broken but i dont know why, are the vertexes being defined in the wrong order? 
function PolygonGeometry(sides, radius, location) {
	var geo = new THREE.BufferGeometry();
	var indices = [];
	//generate vertices
	for (var pt = 0; pt < sides; pt++) {
		//add 90 degrees so we start at +Y axis
		//rotate counterclockwise around
		var angle = (Math.PI/2) + (pt / sides) * 2 * Math.PI;

		var x = radius * Math.sin(angle) + location.x;
		var y = radius * Math.cos(angle) + location.y;

		//save the vertex location : fill in the code
		//geo.Vertices.push(new THREE.Vector3(x,y,0.0));
		

		
		
		
		//save the vertex location : fill in the code
		indices.push(x, y, 0.0); // face 1
	}
	geo.setIndex(indices);
	//geo.setAttribute( 'position', new THREE.BufferAttribute(vertices, 3 ) );

	//your code to generate minimum amount of faces for the polygon
	//for (var face = 0; face < sides-2; face++) {
		//triangle fanm from first +Y point around
		//geo.faces.push( new THREE.Face3(0, face+1, face+2));
	//}
	//return the geometry object
	
	return geo;
}


animate();