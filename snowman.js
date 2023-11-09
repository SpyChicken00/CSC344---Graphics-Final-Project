import * as THREE from '../modules/three.module.js';
import { OrbitControls } from '../modules/OrbitControls.js';
import { GUI } from '../modules/dat.gui.module.js';

/*
class RobotHead extends THREE.Object3D {
	//materials
	teeth = new THREE.TextureLoader().load('../pictures/teeth2.jpg' );

	headColor = new THREE.MeshPhongMaterial( { color: 0x9C89FF, emissive: 0x9C89FF, shininess: 30, specular: 0x4433FF});
	eyeColor = new THREE.MeshPhongMaterial( { color: 0x55FFFF, emissive: 0xEDDE23, shininess: 90});
	earColor = new THREE.MeshPhongMaterial( { color: 0x55FFFF, emissive: 0xFF3333, shininess: 90});
	earColor2 = new THREE.MeshPhongMaterial( { color: 0xE33FAD, emissive: 0x1FAD52, shininess: 90});
	mouthColor = new THREE.MeshPhongMaterial( { map: this.teeth,  emissive: 0x010101});
	mouthColor2 = new THREE.MeshPhongMaterial( { color: 0x9C89FF, emissive: 0x7A67DD, shininess: 90});
	

	//head and eyes
	head = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), this.headColor);
	leftEye = new THREE.Mesh(drawSphere(0.3, 16, 16), this.eyeColor);
	rightEye = new THREE.Mesh(drawSphere(0.3, 16, 16), this.eyeColor);

	//mouth
	hemiSphereGeom = new THREE.SphereGeometry(0.5, 32, Math.round(32 / 4), 0, Math.PI * 2, 0, Math.PI * 0.5);
	hemiSphere = new THREE.Mesh(this.hemiSphereGeom, this.mouthColor2);
	capGeom = new THREE.CircleGeometry(0.5, 32);
	cap = new THREE.Mesh(this.capGeom, this.mouthColor);
	

	//mouth = new THREE.Mesh(new THREE.SphereGeometry( 4, 32, 16, 0, Math.PI * -2, 0,  Math.PI / -2), this.mouthColor);

	//left ear
	leftEar = new THREE.Mesh(drawCylinder(0.15, 0.15, 0.81), this.earColor);
	leftEarFlat  = new THREE.Mesh(drawCylinder(0.3, 0.3, 0.2), this.earColor);
	leftEarFlat2 = new THREE.Mesh(drawCylinder(0.5, 0.1, 0.2), this.earColor2);

	//right ear
	rightEar = new THREE.Mesh(drawCylinder(0.15, 0.15, 0.81), this.earColor);
	rightEarFlat  = new THREE.Mesh(drawCylinder(0.3, 0.3, 0.2), this.earColor);
	rightEarFlat2 = new THREE.Mesh(drawCylinder(0.1, 0.5, 0.2), this.earColor2);


	constructor() {
		super();

		this.cap.rotation.x = 90 * Math.PI/180;
		this.hemiSphere.add(this.cap);
		this.hemiSphere.rotation.x = 240 * Math.PI/180;
		
		//this.hemiSphere.position.z += 0.7;
		this.hemiSphere.position.z += 1;
		this.hemiSphere.position.y -= 0.3;
		
		 

		//translations, rotations, scales
		//this.leftEye.rotation.x = 90 * Math.PI/180
		this.leftEye.position.x += 2.5;
		this.leftEye.position.y += 3.2;
		this.leftEye.position.z += 3;

		this.rightEye.position.x += 3.5;
		this.rightEye.position.y += 3.2;
		this.rightEye.position.z += 3;

		this.leftEarFlat.rotation.z = 90 * Math.PI/180;
		this.leftEarFlat2.rotation.z = 90 * Math.PI/180;
		this.leftEar.rotation.z = 90 * Math.PI/180;
		this.leftEar.position.x += 0.7;
		this.leftEar.position.y -= 1.7;
		this.leftEar.position.z += 2;

		this.leftEarFlat.position.x += 0.7;
		this.leftEarFlat.position.y -= 1.7;
		this.leftEarFlat.position.z += 2;

		this.leftEarFlat2.position.x += 0.43;
		this.leftEarFlat2.position.y -= 1.7;
		this.leftEarFlat2.position.z += 2;

		//right ear
		this.rightEarFlat.rotation.z = 90 * Math.PI/180;
		this.rightEarFlat2.rotation.z = 90 * Math.PI/180;
		this.rightEar.rotation.z = 90 * Math.PI/180;
		this.rightEar.position.x += 3.3;
		this.rightEar.position.y -= 1.7;
		this.rightEar.position.z += 2;

		this.rightEarFlat.position.x += 3.3;
		this.rightEarFlat.position.y -= 1.7;
		this.rightEarFlat.position.z += 2;

		this.rightEarFlat2.position.x += 3.58;
		this.rightEarFlat2.position.y -= 1.7;
		this.rightEarFlat2.position.z += 2;

		//add to object
		this.add(this.head);
		this.add(this.leftEye);
		this.add(this.rightEye);
		this.add(this.hemiSphere);


		this.add(this.leftEar);
		this.add(this.leftEarFlat);
		this.add(this.leftEarFlat2);

		this.add(this.rightEar);
		this.add(this.rightEarFlat);
		this.add(this.rightEarFlat2);

		
		

		
	}

}
*/

class Body extends THREE.Object3D {
	constructor() {
		super();
		const woodTexture = new THREE.TextureLoader().load('../pictures/wood.jpg' );
		const displacementMap = new THREE.TextureLoader().load(
			'../pictures/wood_displace.jpg'
		)
		// const bodyColor = new THREE.MeshPhongMaterial( { color: 0xcccccc, emissive: 0xcccccc, shininess: 90});
		const bodyColor = new THREE.MeshPhongMaterial( { color: 0xcccccc, shininess: 90, map: woodTexture, displacementMap: displacementMap});
		const torso = new THREE.Mesh(drawSphere(1.5,32, 16), bodyColor);
		const legs  = new THREE.Mesh(drawSphere(2,32, 16), bodyColor);

		//position correctl with transformations
		//torso.position.y += 3;
		//torso.position.z += 2;
		//torso.position.x = 1.2;

		//legs.position.y += 0.5;
		//legs.position.z += 2;
		//legs.position.x = 1.2;


        const translateMatrix = new THREE.Matrix4(
            //--->DOWN
            1, 0, 0, 0,         //ACROSS
            0, 1, 0, -2.8,        //   |
            0, 0, 1, 0,         //   |
            0, 0, 0, 1          //   V
                                                        ) 
        


        legs.matrix = translateMatrix;
        legs.matrixAutoUpdate = false;

		//add to object
		this.add(torso);
		this.add(legs);
	}
}

class Head extends THREE.Object3D {
	constructor() {
		super();
		//create geometries and materials
		const metalTexture = new THREE.TextureLoader().load('../pictures/metal.jpg' );
		const displacementMap = new THREE.TextureLoader().load(
			'../pictures/metal_displace.jpg'
		)
		//const headColor = new THREE.MeshPhongMaterial( { color: 0xcccccc, emissive: 0xcccccc, shininess: 90, map: metalTexture});
		const headColor = new THREE.MeshPhongMaterial( { color: 0xcccccc, shininess: 90, map: metalTexture, displacementMap: displacementMap});
		const noseColor = new THREE.MeshPhongMaterial( { color: 0xFF7518, emissive: 0xff7518, shininess: 90});
		const eyeColor = new THREE.MeshPhongMaterial( { color: 0x000000, emissive: 0x000000, shininess: 90});
		const head = new THREE.Mesh(drawSphere(1,32, 16), headColor);
		const nose = new THREE.Mesh(drawCylinder(0.001, 0.2, 1), noseColor);
		const leftEye = new THREE.Mesh(drawSphere(0.1,32, 16), eyeColor);
		const rightEye = new THREE.Mesh(drawSphere(0.1,32, 16), eyeColor);
		
		

        //nose rotate x matrix
        const rotateX_matrix = new THREE.Matrix4(
            //--->DOWN
            0, 1, 0, 0,         //ACROSS
            -1, 0, 0, 0,        //   |
            0, 0, 1, 0,         //   |
            0, 0, 0, 1          //   V
        ) 

        const identityMatrix = new THREE.Matrix4(
             //--->DOWN
             1, 0, 0, 0,         //ACROSS
             0, 1, 0, 0,        //   |
             0, 0, 1, 0,         //   |
             0, 0, 0, 1          //   V               
        ) 

        const translateMatrix = new THREE.Matrix4(
            //--->DOWN
            1, 0, 0, 0,         //ACROSS
            0, 1, 0, 2,        //   |
            0, 0, 1, 0,         //   |
            0, 0, 0, 1          //   V
        ) 
        const translateRotateMatrix2 = new THREE.Matrix4(
           //--->DOWN
           1, 0, 0, 0,         //ACROSS
           0, 0, -1, 2,        //   |
           0, 1, 0, 1,         //   |
           0, 0, 0, 1          //   V                                             
        ) 

        


        head.matrix = translateMatrix;
        head.matrixAutoUpdate = false;

        nose.matrix = translateRotateMatrix2;
        nose.matrixAutoUpdate = false;


		//position correctl with transformations
		
		//nose.rotation.x = 90 * Math.PI/180;
		//nose.position.x = -3.75;
		//nose.position.y -= 2;
		//nose.position.z -= 1;

        
		
		//this.position.y += 3;
		//this.position.z += 2;
		//this.position.x = 1.2;

		

		//leftEye.position.y += 3.3;
		//leftEye.position.z -= 0.1;
		//leftEye.position.x += 1;

		//rightEye.position.y += 3.3;
		//rightEye.position.z -= 0.3;
		//rightEye.position.x += 1.5;

		//fix again
		//nose.position.y -= 3.2;
		//nose.position.x -= 1.3;
		//nose.position.z -= 1.7;

		//


		//add to object
		
		//this.add(head);
		this.add(head)
		this.add(nose);
		this.add(leftEye);
		this.add(rightEye);
	}
}

class Arms extends THREE.Object3D {
	constructor() {
		super();
		const armColor = new THREE.MeshPhongMaterial( { color: 0x231709, emissive: 0x231709, shininess: 10});
		const arms = new THREE.Mesh(drawCylinder(0.2, 0.2, 7), armColor);

        const rotateX_matrix = new THREE.Matrix4(
            //--->DOWN
            0, 1, 0, 0,         //ACROSS
            -1, 0, 0, 0,        //   |
            0, 0, 1, 0,         //   |
            0, 0, 0, 1          //   V
                        ) 

        arms.matrix = rotateX_matrix;
        arms.matrixAutoUpdate = false;

		//arms.rotation.z = 90 * Math.PI/180;
		//arms.position.z += 2;
		//arms.position.y -= 1.5;

		this.add(arms);
	}
}

class Snowman extends THREE.Object3D {
	//headPivot = new THREE.Group();
	head = new Head();
	constructor() {
		super();
		//this.head.position.y +=2;
		const body = new Body();
		const arms = new Arms();
		//this.headPivot.add(this.head);
		//this.add(this.headPivot);
		this.add(this.head);
		this.add(body);
		this.add(arms);


	}

	getHead() {
	
		return this.head;
	}
    /*
	translate(x, y, z) {
		this.head.translate(0, 0, 0);
	}
    */
} 

//scene and camera and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

//const renderer = new THREE.WebGLRenderer({alpha:true});
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize( window.innerWidth, window.innerHeight );
//renderer.autoClear = false;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
//renderer.setClearColor(0x010101, 1); //white background - replace ffffff with any hex color; second param is opacity, 0 => transparent
document.body.appendChild( renderer.domElement );


//orbit controls
const controls = new OrbitControls( camera, renderer.domElement );
camera.position.set( 0, 0, 5);
controls.update();


// add lights
var ambientLight = new THREE.AmbientLight( 0x333333, 20);
scene.add(ambientLight);
//const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
//hemiLight.position.set(200, 200, 100);
//scene.add(hemiLight);

/*
const dirLight = new THREE.DirectionalLight(0xffffff);
dirLight.position.set(-10, 20, 6);
dirLight.castShadow = true;
dirLight.shadow.camera.top = 2;
dirLight.shadow.camera.bottom = -2;
dirLight.shadow.camera.left = -2;
dirLight.shadow.camera.right = 2;
dirLight.shadow.camera.near = 0.01;
dirLight.shadow.camera.far = 500;
scene.add(dirLight);


var dirLight = new THREE.DirectionalLight(0xFFFFFF, 0.3);
dirLight.position.set(0, 1, 0);
dirLight.castShadow = true;
scene.add(dirLight);
*/


var light = new THREE.PointLight(0xffffff, 40.0, 10);
light.position.set(1,3,0);
light.castShadow = true;
light.shadow.mapSize.width = 512;
light.shadow.mapSize.height = 512;
light.shadow.camera.near = 0.1;
light.shadow.camera.far = 5;
light.shadow.camera.left = -20;
light.shadow.camera.right = 2;
light.shadow.camera.top = 2;
light.shadow.camera.bottom = -2;
scene.add(light);



//Create a helper for the shadow camera (optional)
const helper = new THREE.CameraHelper(light.shadow.camera );
//scene.add( helper );



//textures
const texture = new THREE.TextureLoader().load('../pictures/checkerboard.jpg' );
const spaceTexture = new THREE.TextureLoader().load('../pictures/stars.jpg' );
const metalTexture = new THREE.TextureLoader().load('../pictures/metal1.jpg' );
const grid = new THREE.TextureLoader().load('../pictures/teeth2.jpg' );
//materials
const material = new THREE.MeshPhongMaterial( { color: 0x00ff00, emissive: 0x993300, shininess: 90, specular: 0xff0000, transparent: true, opacity: 0.95} );
const material2 = new THREE.MeshBasicMaterial( { color: 0xffffff } );
const material3 = new THREE.MeshBasicMaterial( { color: 0xddffdd} );
const material4 = new THREE.MeshBasicMaterial( { color: 0xaaccaa} );
const material5 = new THREE.MeshPhongMaterial( { color: 0xfedcba, emissive: 0x990000, transparent: true, opacity: 0.5} );
const material6 = new THREE.MeshPhongMaterial( { color: 0xabcdef, transparent: true, opacity: 0.7} );
const material7 = new THREE.MeshLambertMaterial( { color: 0xfedcba, flatShading: true});
const material8 = new THREE.MeshPhongMaterial( { color: 0x80fc66, emissive: 0x111111, shininess: 120, specular: 0xff0000, transparent: true, opacity: 0.8});
const material9 = new THREE.MeshLambertMaterial( { color: 0x00ff00});
const spaceMaterial = new THREE.MeshPhongMaterial({map: spaceTexture, side: THREE.DoubleSide});
var floorMaterial = new THREE.MeshPhongMaterial( { map: texture, castShadow: true, receiveShadow: true} );
const metalMaterial = new THREE.MeshPhongMaterial({map: metalTexture})
//var floorMaterial = new THREE.MeshPhongMaterial( );



//create geometry mesh with materials
//const geometry = new THREE.BoxGeometry( 1, 1, 1 );
//const cube = new THREE.Mesh( geometry, material);
const cone = new THREE.Mesh(drawCylinder(0.01, 1, 3), material5);
const mycube = new THREE.Mesh(drawCube(0, 2, 0, 2, 0, -2), material);
//const polygon = new THREE.Mesh(PolygonGeometry(5, 3, new THREE.Vector3(-1, -1, 0)), material3);
const sphere = new THREE.Mesh(drawSphere(2, 64, 32), material8);
const bigSphere = new THREE.Mesh(drawSphere(100, 200, 200), spaceMaterial);

const arm1 = new THREE.Mesh(drawCylinder(2, 2, 0.5), spaceMaterial);
const arm1top = new THREE.Mesh(drawCylinder(2, 2, 0.5), spaceMaterial);
const arm2 = new THREE.Mesh(drawCylinder(0.5, 0.5, 5), metalMaterial);

arm1.add(arm2);
arm1.add(arm1top);

var plane = new THREE.PlaneGeometry(25, 25, 1, 1 );
var floor = new THREE.Mesh(plane, floorMaterial);
const knot = new THREE.TorusKnotGeometry(3, 0.4, 64, 8, 6, 8); 
const torusKnot = new THREE.Mesh(knot, material5); 
//scene.add( torusKnot );


const snowman = new Snowman();
snowman.position.y += 1;
//snowman.getHead().center();
//snowman.getHead().rotation.y = 45 * Math.PI/180;

	
mycube.castShadow = true;
plane.receiveShadow = true;
sphere.castShadow = true;
cone.castShadow = true;
torusKnot.castShadow = true;

//TODO figure out how to make combined object - OBJECT3D
//TODO make gui for movement, use dat.gui?
//TODO fix shadows, why not working
//one more interesting geometry (taurous? other?)


const array = [mycube, cone];
//arm transform
arm1top.position.y += 5;
arm2.position.z += 1;
arm2.position.x -= 1;
arm2.position.y += 2.5;

//move things away from center
arm1top.position.z -=10;
arm1.position.z -= 10;
arm2.position.z -= 10;
mycube.position.z -= 10;
sphere.position.z -= 10;
cone.position.z -= 10;


//transform mesh
sphere.position.y += 5;
sphere.position.x -= 2;
sphere.position.z -= 5;
mycube.position.z -= 10;
mycube.position.y += 6;
cone.position.x += 4;
floor.material.side = THREE.DoubleSide;
floor.rotation.x = 90 * Math.PI/180;
floor.position.y -= 3;
torusKnot.position.z -= 20;
//floor.position.y += 5;



//ROBOT PARTS
//const robotHead = new RobotHead();
//robotHead.scale.x = 0.5;
//robotHead.scale.y = 0.5;
//robotHead.scale.z = 0.5;
//scene.add(robotHead);


//create gui to modify cube 
const gui = new GUI();
const cubeFolder = gui.addFolder('Cube');
cubeFolder.add(mycube.rotation, 'x', 0, Math.PI * 4).name("Rotate X Axis");
cubeFolder.add(mycube.rotation, 'y', 0, Math.PI * 4);
cubeFolder.add(mycube.rotation, 'z', 0, Math.PI * 4);
cubeFolder.add(mycube.scale, 'x', 0, 3).name("Scale X Axis");
//cubeFolder.open();
gui.getSaveObject();

const cameraFolder = gui.addFolder('Camera');
cameraFolder.add(camera.position, 'z', 0, 10);
//cameraFolder.open();

const snowmanFolder = gui.addFolder("Snowman");
//const head = snowman.getHead();
snowmanFolder.add(snowman.getHead().rotation, 'y', 0, 180 * Math.PI/180)
const effectController = {
	fov: 40
};
var element = snowmanFolder.add(effectController, "fov", 1.0, 179.0);
element.name("field of view");
//snowmanFolder.open();





//add mesh to scene
/*
scene.add(mycube);
scene.add(cone);
scene.add(sphere);
scene.add(floor); 
scene.add(torusKnot);
scene.add(arm1);
scene.add(arm1top);
scene.add(arm2);
//scene.add(bigSphere);
*/
scene.add(floor); 


//snowman.translate(0,0,0);
//const box = new THREE.BoxHelper(snowman, 0xffff00 );
//scene.add(box);
//snowman.position.z -= 10;
//snowman.position.x -= 10;

scene.add(snowman);








//add background to scene
var bgTexture = new THREE.TextureLoader().load("../pictures/stars.jpg");
bgTexture.minFilter = THREE.LinearFilter;
scene.background = bgTexture;

const clock = new THREE.Clock();

function animate() {
	requestAnimationFrame( animate );
	var delta = clock.getDelta()
	controls.update(delta);

	camera.fov = effectController.fov
	camera.updateProjectionMatrix();
	//add rotations
	//mycube.rotation.x += 0.01;
	//mycube.rotation.y += 0.01;
	//cone.rotation.x += 0.001;
	//sphere.rotation.z += 0.0005
	//sphere.rotation.y += 0.0005;


	//how to get mouse object in threejs
	//cone.rotation.y = THREE.MathUtils.lerp(cone.rotation.y, (mouse.x * Math.PI) / 10, 0.1)
	//cone.rotation.x = THREE.MathUtils.lerp(cone.rotation.x, (mouse.y * Math.PI) / 10, 0.1)

	//update controls 
	controls.update();
	onWindowResize();
	//render image
	renderer.render( scene, camera );
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
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
	//cylinder.translate(2,2,-2);
	return cylinder;
}

function drawSphere(radius, width, height) {
	const sphere = new THREE.SphereGeometry(radius, width, height);
	//sphere.translate(-3, -3, -2);
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

//requestAnimationFrame(renderer);
animate();