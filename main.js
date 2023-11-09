import * as THREE from '../modules/three.module.js';
import { OrbitControls } from '../modules/OrbitControls.js';
import { GUI } from '../modules/dat.gui.module.js';

//TODO animation "Trick" Ideas - Rotate head around z axis 360 degrees, simplify to do "bounce effect"
//TODO first person camera?
class RobotHead extends THREE.Object3D {
	//textures
	teeth = new THREE.TextureLoader().load('../pictures/teeth2.jpg' );

	//materials
	headColor = new THREE.MeshPhongMaterial( { color: 0x4db4d5, emissive: 0x4db4d5, shininess: 30, specular: 0x4433FF, emissiveIntensity: 0.05});
	eyeColor = new THREE.MeshPhongMaterial( { color: 0x55FFFF, emissive: 0xEDDE23, shininess: 90, emissiveIntensity: 0.5 });
	lightColor = new THREE.MeshPhongMaterial( { color: 0x888888, emissive: 0x888888, shininess: 90, emissiveIntensity: 0.05});
	earColor = new THREE.MeshPhongMaterial( { color: 0x55FFFF, emissive: 0xFF3333, shininess: 90, emissiveIntensity: 0.05});
	earColor2 = new THREE.MeshPhongMaterial( { color: 0xE33FAD, emissive: 0x1FAD52, shininess: 90, emissiveIntensity: 0.05});
	mouthColor = new THREE.MeshPhongMaterial( { map: this.teeth,  emissive: 0x010101});
	mouthColor2 = new THREE.MeshPhongMaterial( { color: 0x9C89FF, emissive: 0x7A67DD, shininess: 90, emissiveIntensity: 0.05});
	hatColor = new THREE.MeshPhongMaterial( { color: 0x68431e, emissive: 0x68431e, shininess: 90, emissiveIntensity: 0.05});
	hatColor2 = new THREE.MeshPhongMaterial( { color: 0x68431e, emissive: 0x333333, shininess: 90, emissiveIntensity: 0.05});
	
	//hat
	hatBottom = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.5, 2.4), this.hatColor);
	hatBottom2 = new THREE.Mesh(new THREE.BoxGeometry(1.65, 0.25, 1.65), this.hatColor2);
	hatTop = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1, 1.5), this.hatColor);
	hatLight = new THREE.Mesh(drawCylinderNew(0.25, 0.25, 1), this.lightColor);
	
	//head + eyes
	head = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), this.headColor);
	leftEye = new THREE.Mesh(drawSphere(0.3, 16, 16), this.eyeColor);
	rightEye = new THREE.Mesh(drawSphere(0.3, 16, 16), this.eyeColor);

	//mouth
	hemiSphereGeom = new THREE.SphereGeometry(0.5, 32, Math.round(32 / 4), 0, Math.PI * 2, 0, Math.PI * 0.5);
	hemiSphere = new THREE.Mesh(this.hemiSphereGeom, this.mouthColor2);
	capGeom = new THREE.CircleGeometry(0.5, 32);
	cap = new THREE.Mesh(this.capGeom, this.mouthColor);
	
	//left ear
	leftEar = new THREE.Mesh(drawCylinder(0.15, 0.15, 0.81), this.earColor);
	leftEarFlat  = new THREE.Mesh(drawCylinder(0.3, 0.3, 0.2), this.earColor);
	leftEarFlat2 = new THREE.Mesh(drawCylinder(0.5, 0.1, 0.2), this.earColor2);

	//right ear
	rightEar = new THREE.Mesh(drawCylinder(0.15, 0.15, 0.81), this.earColor);
	rightEarFlat  = new THREE.Mesh(drawCylinder(0.3, 0.3, 0.2), this.earColor);
	rightEarFlat2 = new THREE.Mesh(drawCylinder(0.1, 0.5, 0.2), this.earColor2);

	//lights
	lightTarget = new THREE.Mesh(drawSphereNew(0.3, 16, 16), this.eyeColor);
	spotLight = new THREE.SpotLight(0xEDDF96);

	//camera 
	robotCamera= new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );
	cameraTarget = new THREE.Mesh(drawSphereNew(0.3, 16, 16), this.eyeColor);


	constructor() {
		super();
		//translations, rotations, scales
		this.cap.rotation.x = 90 * Math.PI/180;
		this.hemiSphere.add(this.cap);
		this.hemiSphere.rotation.x = 240 * Math.PI/180;
		
		this.hemiSphere.position.z += 1;
		this.hemiSphere.position.y -= 0.3;
		
		this.hatBottom.position.y += 1;
		this.hatTop.position.y += 1.5;
		this.hatBottom2.position.y +=1.4
		this.hatLight.rotation.x = 90 * Math.PI/180;
		this.hatLight.position.y +=1.45;
		this.hatLight.position.z +=0.4;
		
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


		this.lightTarget.position.y -= 2;
		this.lightTarget.position.z += 6;

		
		this.spotLight.position.set(0, 3, 2);
		this.spotLight.intensity = 100;
		this.spotLight.angle = 30* Math.PI/180;
		this.spotLight.distance = 15;

		this.spotLight.target.position.set(0, -200, 100);
		this.spotLight.target.updateMatrixWorld();
		
		this.spotLight.target.angle = 30 * Math.PI/180;
		this.spotLight.target.updateMatrixWorld();
		this.add(this.spotLight);
		this.add(this.spotLight.target);
		this.spotLight.visible = false;		

		this.robotCamera.position.z += 1;
		this.cameraTarget.position.z += 3;
		this.cameraTarget.position.y -= 1;
		this.cameraTarget.visible = false;

		//add to object
		this.add(this.hatBottom);
		this.add(this.hatBottom2);
		this.add(this.hatTop);
		this.add(this.hatLight);


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
		this.add(this.robotCamera);
		this.add(this.cameraTarget);
	}

	getHead() {
		return this.head;
	}

	getLeftEye() {
		return this.leftEye;
	}

	getRightEye() {
		return this.rightEye;
	}

	getSpotLight() {
		return this.spotLight;
	}

	getLightTarget() {
		return this.lightTarget;
	}

	getHelmetLight() {
		return this.hatLight;
	}

	getRobotCamera() {
		return this.robotCamera;
	}

	getCameraTarget() {
		this.cameraTarget.updateMatrix();
		return this.cameraTarget;
	}


}

class RobotBody extends THREE.Object3D {
	grid = new THREE.TextureLoader().load('../pictures/teeth2.jpg' );
	panel = new THREE.TextureLoader().load('../pictures/panel.png' );
	//materials
	bodyColor = new THREE.MeshPhongMaterial( { color: 0x4db4d5, emissive: 0x4db4d5, shininess: 30, specular: 0x4433FF, emissiveIntensity: 0.05});
	lightColor = new THREE.MeshPhongMaterial( {map: this.grid, emissive: 0x555555, emissiveIntensity: 0.05});
	lightColor2 = new THREE.MeshPhongMaterial( {color: 0x222222, emissive: 0x222222, emissiveIntensity: 0.05});
	panelColor = new THREE.MeshPhongMaterial( {map: this.panel, emissive: 0x010101,emissiveIntensity: 0.05});
	coreColor = new THREE.MeshPhongMaterial( {color: 0x444444, emissive: 0x444444, emissiveIntensity: 0.05});

	//objects
	body = new THREE.Mesh(new THREE.BoxGeometry(1.3, 2, 1.3), this.bodyColor);
	innerBody = new THREE.Mesh(new THREE.BoxGeometry(1, 1.5, 1.4), this.panelColor);
	neck = new THREE.Mesh(drawCylinderNew(0.2, 0.2, 1.5), this.lightColor);
	neckRing = new THREE.Mesh(drawCylinderNew(0.25, 0.25, 0.1), this.lightColor2);
	armPosts = new THREE.Mesh(drawCylinderNew(0.2, 0.2, 2), this.lightColor);

	legCoreL = new THREE.Mesh(drawCylinderNew(0.2, 0.15, 2), this.coreColor);
	legCoreR = new THREE.Mesh(drawCylinderNew(0.2, 0.15, 2), this.coreColor);


	constructor() {
		super();

		//transformations
		this.body.position.y -= 0.75;
		this.innerBody.position.y -= 0.65;
		this.neckRing.position.y += 0.36;

		this.armPosts.rotation.z = 90 * Math.PI / 180;
		this.legCoreL.position.x += 0.3;
		this.legCoreR.position.x -= 0.3;
		this.legCoreL.position.y -= 1;
		this.legCoreR.position.y -= 1;


		//add to this object
		this.add(this.body);
		this.add(this.innerBody);
		this.add(this.neck);
		this.add(this.neckRing);
		this.add(this.armPosts)
		this.add(this.legCoreL);
		this.add(this.legCoreR);
	}
}

class RobotArm extends THREE.Object3D {
	armColor = new THREE.MeshPhongMaterial( { color: 0x4db4d5, emissive: 0x4db4d5, shininess: 30, specular: 0x4433FF, emissiveIntensity: 0.05});
	coreColor = new THREE.MeshPhongMaterial( {color: 0x444444, emissive: 0x444444, emissiveIntensity: 0.05});
	ballColor = new THREE.MeshPhongMaterial( {color: 0x222222, emissive: 0x222222, emissiveIntensity: 0.05});


	arm = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 2), this.armColor);
	armCore = new THREE.Mesh(drawCylinderNew(0.2, 0.2, 2.5), this.coreColor);
	hand = new RobotHand();
	armBall = new THREE.Mesh(drawSphereNew(0.3, 16, 16), this.ballColor);
	upperArm = new RobotArmTop();
	lowerArm = new THREE.Group();
	

	constructor() {
		super()
		//transformations
		this.armCore .rotation.x = 90 * Math.PI / 180;
		this.hand.rotation.x = 90 * Math.PI / 180;
		this.hand.rotation.y = 45 * Math.PI / 180;
		this.hand.scale.x = 0.5;
		this.hand.scale.y = 0.5;
		this.hand.scale.z = 0.5;
		this.hand.position.z += 1.3;
		this.armBall.position.z -= 1.4;
		this.upperArm.rotation.x = 45 * Math.PI / 180;
		this.upperArm.position.y += 1;
		this.upperArm.position.z -= 2.3;
		
		

		//change rotation position of object by adding to a group
		this.arm.position.z += 1.4;
		this.hand.position.z += 1.4;
		this.armCore.position.z += 1.4;
		this.armBall.position.z += 1.4;
		
		this.lowerArm.add(this.arm);
		this.lowerArm.add(this.hand);
		this.lowerArm.add(this.armCore);
		this.lowerArm.add(this.armBall);
		this.lowerArm.position.z -= 1.4;


		const group = new THREE.Group();
		group.add(this.lowerArm);
		group.add(this.upperArm);
		group.position.y -= 2;
		group.position.z += 3.3;	

		//add group to object
		this.add(group);
	}

	getRobotHand() {
		return this.hand;
	}

	getRobotLowerArm() {
		return this.lowerArm;
	}

}

class RobotArmTop extends THREE.Object3D {
	armColor = new THREE.MeshPhongMaterial( { color: 0x4db4d5, emissive: 0x4db4d5, shininess: 30, specular: 0x4433FF, emissiveIntensity: 0.05});
	coreColor = new THREE.MeshPhongMaterial( {color: 0x444444, emissive: 0x444444, emissiveIntensity: 0.05});
	ballColor = new THREE.MeshPhongMaterial( {color: 0x222222, emissive: 0x222222, emissiveIntensity: 0.05});


	arm = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 2), this.armColor);
	armCore = new THREE.Mesh(drawCylinderNew(0.2, 0.2, 2.5), this.coreColor);
	armBall = new THREE.Mesh(drawSphereNew(0.55, 16, 16), this.ballColor);

	constructor() {
		super()

		this.armCore .rotation.x = 90 * Math.PI / 180;
		this.armBall.position.z -= 1.4;

		//add objects
		this.add(this.arm);
		this.add(this.armCore);
		this.add(this.armBall);
	}
}

class RobotHand extends THREE.Object3D {
	lightColor2 = new THREE.MeshPhongMaterial( {color: 0x222222, emissive: 0x222222, emissiveIntensity: 0.05});

	palm = new THREE.Mesh(new THREE.BoxGeometry(1, 0.5, 1), this.lightColor2);
	finger1 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1, 1), this.lightColor2);
	finger2 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1, 1), this.lightColor2);
	finger12 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.9, 1), this.lightColor2);
	finger22 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.9, 1), this.lightColor2);

	constructor() {
		super();
		//transformations
		this.finger1.position.x += 0.6;
		this.finger12.position.x += 0.6;
		this.finger2.position.x -= 0.6;
		this.finger22.position.x -= 0.6;
		this.finger1.position.y += 0.3;
		this.finger12.position.y += 0.8;
		this.finger2.position.y += 0.3;
		this.finger22.position.y += 0.8;
		this.finger1.rotation.z = 145 * Math.PI/180;
		this.finger12.rotation.z = 35 * Math.PI/180;
		this.finger2.rotation.z = 35 * Math.PI/180;
		this.finger22.rotation.z = 145 * Math.PI/180;
		//add to hand
		this.add(this.palm);
		this.add(this.finger1);
		this.add(this.finger12);
		this.add(this.finger2);
		this.add(this.finger22);
	}
}

class RobotFoot extends THREE.Object3D {

	ballColor = new THREE.MeshPhongMaterial( {color: 0x222222, emissive: 0x222222, emissiveIntensity: 0.05});
	coreColor = new THREE.MeshPhongMaterial( {color: 0x444444, emissive: 0x444444, emissiveIntensity: 0.05});
	legColor = new THREE.MeshPhongMaterial( { color: 0x4db4d5, emissive: 0x4db4d5, shininess: 30, specular: 0x4433FF, emissiveIntensity: 0.05});

	foot = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.5, 1.5), this.ballColor);
	footCore = new THREE.Mesh(drawCylinderNew(0.2, 0.2, 0.7), this.coreColor);
	footBall = new THREE.Mesh(drawSphereNew(0.30, 16, 16), this.ballColor);
	
	constructor() {
		super();
		//translations
		this.footCore.rotation.x = 330 * Math.PI/180;
		this.footCore.position.y += 0.3;
		this.footCore.position.z -= 0.5;
		this.footBall.position.y += 0.78;
		this.footBall.position.z -= 0.75;
		
		//add to object
		this.add(this.foot);
		this.add(this.footCore)
		this.add(this.footBall);
	}
}

class RobotLowerLeg extends THREE.Object3D {

	ballColor = new THREE.MeshPhongMaterial( {color: 0x222222, emissive: 0x222222, emissiveIntensity: 0.05});
	coreColor = new THREE.MeshPhongMaterial( {color: 0x444444, emissive: 0x444444, emissiveIntensity: 0.05});
	legColor = new THREE.MeshPhongMaterial( { color: 0x4db4d5, emissive: 0x4db4d5, shininess: 30, specular: 0x4433FF, emissiveIntensity: 0.05});

	leg = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.5, 1.5), this.legColor);
	legCore = new THREE.Mesh(drawCylinderNew(0.2, 0.2, 2), this.coreColor);
	legBall = new THREE.Mesh(drawSphereNew(0.4, 16, 16), this.ballColor); 
	
	constructor() {
		super();
		this.leg.rotation.x = 90 * Math.PI/180;
		this.leg.position.z -= 0.77;
		this.leg.position.y += 2;
		this.legCore.position.z -= 0.77;
		this.legCore.position.y += 2;
		this.legBall.position.z -= 0.77;
		this.legBall.position.y += 3.2;

		const group = new THREE.Group();
		group.add(this.leg);
		group.add(this.legCore);
		group.add(this.legBall);

		group.position.z += 0.1;
		group.position.y += 0.1;

		this.add(group);
	}
}

class RobotLeg extends THREE.Object3D {
	foot = new RobotFoot();
	lowerLeg = new RobotLowerLeg();
	upperLeg = new RobotLowerLeg();
	
	constructor() {
		super();
		//transformations
		this.upperLeg.position.y += 2.5;
		
		//assign to group to set center of rotation?
		const leg = new THREE.Group();
		leg.add(this.foot)
		leg.add(this.lowerLeg);
		leg.add(this.upperLeg);
		this.add(leg);
	}
}

class Robot extends THREE.Object3D {
	robotHead = new RobotHead();
	robotBody = new RobotBody();
	robotArmRight = new RobotArm();
	robotArmLeft = new RobotArm();
	robotLegLeft = new RobotLeg();
	robotLegRight = new RobotLeg();

	constructor() {
		super()
		this.robotHead.scale.x = 0.5;
		this.robotHead.scale.y = 0.5;
		this.robotHead.scale.z = 0.5;
		this.robotHead.position.y += 1;

		this.robotArmRight.rotation.x = 15 * Math.PI/180;
		this.robotArmRight.scale.x = 0.6;
		this.robotArmRight.scale.y = 0.4;
		this.robotArmRight.scale.z = 0.4;
		this.robotArmRight.position.x -= 0.9;
		

		this.robotArmLeft.rotation.x = 15 * Math.PI/180;
		this.robotArmLeft.scale.x = 0.6;
		this.robotArmLeft.scale.y = 0.4;
		this.robotArmLeft.scale.z = 0.4;
		this.robotArmLeft.position.x += 0.9;
		this.robotArmLeft.getRobotHand().rotation.y = 135 * Math.PI/180;

		this.robotLegLeft.scale.x = 0.6;
		this.robotLegLeft.scale.y = 0.4;
		this.robotLegLeft.scale.z = 0.8;
		this.robotLegLeft.position.y -= 4.3;
		this.robotLegLeft.position.z += 0.47;
		this.robotLegLeft.position.x += 0.3;

		this.robotLegRight.scale.x = 0.6;
		this.robotLegRight.scale.y = 0.4;
		this.robotLegRight.scale.z = 0.8;
		this.robotLegRight.position.y -= 4.3;
		this.robotLegRight.position.z += 0.47;
		this.robotLegRight.position.x -= 0.3;
		

		this.add(this.robotHead);
		this.add(this.robotBody);
		this.add(this.robotArmRight);
		this.add(this.robotArmLeft);
		this.add(this.robotLegLeft);
		this.add(this.robotLegRight);
	}

	getRobotHead() {
		return this.robotHead;
	}
	
	getRobotBody() {
		return this.robotBody;
	}

	getRobotArm() {
		return this.robotArmLeft;
	}

	getRobotArmR() {
		return this.robotArmRight;
	}
}

//renderer
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
document.body.appendChild( renderer.domElement );

//scene + clock
const scene = new THREE.Scene();
const clock = new THREE.Clock();
//add background to scene
const bgTexture = new THREE.TextureLoader().load("../pictures/stars.jpg");
bgTexture.minFilter = THREE.LinearFilter;
scene.background = bgTexture;

//camera
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.name = "DefaultCamera";
camera.position.set(0,0,1);
var renderCamera = camera;
const controlsDefault = new OrbitControls(renderCamera, renderer.domElement );

//lights
var ambientLight = new THREE.AmbientLight( 0x333333, 0.5);
var dirLight = new THREE.DirectionalLight(0xFFFFFF, 0.2);
var pointLight = new THREE.PointLight(0xFFA500, 100, 1000, 0.93);
const redSpotlight = new THREE.SpotLight(0xFFFFFF);
const greenSpotlight = new THREE.SpotLight(0x00FF00);

//death star light
greenSpotlight.position.set(-95, 15, -90);
greenSpotlight.intensity = 300;
greenSpotlight.angle = 180* Math.PI/180;
greenSpotlight.distance = 1000;

//overhead spotlight
redSpotlight.position.set(0, 7, 1);
redSpotlight.angle = 45 * Math.PI/180;
redSpotlight.intensity = 100;
redSpotlight.castShadow = true;
redSpotlight.visible = false;
redSpotlight.distance = 15;

dirLight.position.set(0, 1, 10);
dirLight.castShadow = true;
dirLight.visible = false;

//sunlight
pointLight.castShadow = true;
pointLight.shadow.mapSize.width = 4096
pointLight.shadow.mapSize.height = 4096
pointLight.shadow.camera.near = 0.5
pointLight.shadow.camera.far = 1000
pointLight.position.set(100, 10, -100)

scene.add(dirLight);
scene.add(ambientLight);
scene.add(pointLight);
scene.add(greenSpotlight);
scene.add(redSpotlight);

//textures
const texture = new THREE.TextureLoader().load('../pictures/checkerboard.jpg' );
const spaceTexture = new THREE.TextureLoader().load('../pictures/stars.jpg' );
const metalTexture = new THREE.TextureLoader().load('../pictures/metal1.jpg' );
const planetTexture = new THREE.TextureLoader().load('../pictures/planet.jpg' );
const planetNormal = new THREE.TextureLoader().load('../pictures/planetNormal.jpg');
const sunTexture = new THREE.TextureLoader().load('../pictures/sun.jpg');
const sunLight = new THREE.TextureLoader().load('../pictures/sunLight.jpg');
const deathstarTexture = new THREE.TextureLoader().load('../pictures/deathstar.jpg');
const ringsTexture = new THREE.TextureLoader().load('../pictures/rings.jpg');

//materials
const material = new THREE.MeshPhongMaterial( { color: 0x00ff00, emissive: 0x00FF00, shininess: 90, specular: 0x00ee00, transparent: true, opacity: 0.95} );
const material2 = new THREE.MeshBasicMaterial( { color: 0xffffff } );
const material3 = new THREE.MeshBasicMaterial( { color: 0xddffdd} );
const material4 = new THREE.MeshBasicMaterial( { color: 0xaaccaa} );
const material5 = new THREE.MeshPhongMaterial( { color: 0xfedcba, emissive: 0x990000, transparent: true, opacity: 0.9, shininess: 90, specular: 0x00ff00} );
const material6 = new THREE.MeshPhongMaterial( { color: 0xabcdef, transparent: true, opacity: 0.7} );
const material7 = new THREE.MeshLambertMaterial( { color: 0xfedcba, flatShading: true});
const material8 = new THREE.MeshPhongMaterial( { color: 0x80fc66, emissive: 0x111111, shininess: 120, specular: 0xff0fff, transparent: true, opacity: 0.8});
const material9 = new THREE.MeshLambertMaterial( { color: 0x00ff00});
const spaceMaterial = new THREE.MeshPhongMaterial({map: spaceTexture, side: THREE.DoubleSide});
var floorMaterial = new THREE.MeshPhongMaterial( { map: texture, castShadow: true, receiveShadow: true} );
const metalMaterial = new THREE.MeshPhongMaterial({map: metalTexture})
const planetMaterial = new THREE.MeshPhongMaterial({map: planetTexture, normalMap: planetNormal	})
const sunMaterial = new THREE.MeshPhongMaterial({map: sunTexture, emissive: 0xFFA500, emissiveMap: sunLight, emissiveIntensity: 1})
const deathstarMaterial= new THREE.MeshPhongMaterial({map: deathstarTexture})

//geometries 
const knot = new THREE.TorusKnotGeometry(3, 0.4, 64, 8, 6, 8); 
var plane = new THREE.PlaneGeometry(25, 25, 1, 1 );

//objects
const deathstar = new THREE.Mesh(drawSphereNew(5, 64, 64), deathstarMaterial);
const lazer = new THREE.Mesh(drawCylinderNew(0.1, 0.1, 50), material);
const planet = new THREE.Mesh(drawSphereNew(25, 64, 64), planetMaterial);
const sun = new THREE.Mesh(drawSphereNew(100, 64, 64), sunMaterial);

const torusKnot = new THREE.Mesh(knot, material5);
const floor = new THREE.Mesh(plane, floorMaterial);
const robot = new Robot();

//traverse robot to enable shadows on all objects
robot.traverse(function( child ) { 
    if ( child.type == 'Mesh' ) {
        child.castShadow = true;
        child.receiveShadow = true;
    }
} );


//transformations
torusKnot.position.z -= 20;
torusKnot.castShadow = true;
floor.material.side = THREE.DoubleSide;
floor.rotation.x = 90 * Math.PI/180;
floor.position.y -= 3;
floor.receiveShadow = true;
deathstar.position.z -= 60;
deathstar.position.x -= 55;
deathstar.position.y += 20;
deathstar.rotation.y = 200 * Math.PI / 180;
lazer.rotation.x = 70 * Math.PI / 180;
lazer.rotation.z = -50 * Math.PI / 180;
lazer.position.x -= 80;
lazer.position.z -= 80;
lazer.position.y += 15;
planet.position.z -= 110;
planet.position.x -= 110;
sun.position.x += 100;
sun.position.z -= 300;
sun.position.y -= 10;
robot.position.z -= 4;
robot.position.y += 1.42;
robot.receiveShadow = true;


//add to scene
scene.add(floor); 
scene.add(torusKnot);
scene.add(deathstar);
scene.add(sun);
scene.add(lazer);
scene.add(planet);
scene.add(robot);


//gui robot parts
const robotHead = robot.getRobotHead();
const robotArmL = robot.getRobotArm();
const robotHandL = robotArmL.getRobotHand();
const robotLowerArmL = robotArmL.getRobotLowerArm();
const robotArmR = robot.getRobotArmR();
const robotHandR = robotArmR.getRobotHand();
const robotLowerArmR = robotArmR.getRobotLowerArm();
const leftEye = robotHead.getLeftEye();
const cameraTarget = robotHead.getCameraTarget();

//gui
const gui = new GUI();
gui.getSaveObject();
//folders
const robotFolder = gui.addFolder("Robot");
const headFolder = robotFolder.addFolder("Head");
const leftArmFolder = robotFolder.addFolder("Left Arm");
const rightArmFolder = robotFolder.addFolder("Right Arm");
const lightFolder = robotFolder.addFolder("Lights");
robotFolder.open();
headFolder.open();
leftArmFolder.open()
rightArmFolder.open();
lightFolder.open();
//sliders
leftArmFolder.add(robotHandL.rotation, 'y', 0, Math.PI * 4).name("Rotate Left Hand");
leftArmFolder.add(robotLowerArmL.rotation, 'x', Math.PI * -0.25, Math.PI * 0.25).name("Rotate Left Elbow");
leftArmFolder.add(robotArmL.rotation, 'x', 0, Math.PI * 4).name("Rotate Left Arm");
rightArmFolder.add(robotHandR.rotation, 'y', 0, Math.PI * 4).name("Rotate Right Hand");
rightArmFolder.add(robotLowerArmR.rotation, 'x', Math.PI * -0.25, Math.PI * 0.25).name("Rotate Right Elbow");
rightArmFolder.add(robotArmR.rotation, 'x', 0, Math.PI * 4).name("Rotate Right Arm");
headFolder.add(robotHead.rotation, 'y', Math.PI * -2, Math.PI * 2).name("Shake Head");
headFolder.add(robotHead.rotation, 'x', Math.PI * -0.13, Math.PI * 0.13).name("Nod Head");
headFolder.add(robotHead.rotation, 'z', Math.PI * -2, Math.PI * 2).name("Rotate Head");

//change eye color
const emissiveParams = {
	emissive: robotHead.getLeftEye().material.emissive.getHex()
};
headFolder.addColor(emissiveParams, 'emissive')
		   .onChange((value) =>  leftEye.material.emissive.set(value)).name("Eye Color");

//toggle buttons
headFolder.add(leftEye.material, 'wireframe').name("Wireframe Eyes");
lightFolder.add(ambientLight, 'visible').name("Toggle Ambient Light");
lightFolder.add(dirLight, 'visible').name("Toggle Directional Light");
lightFolder.add(redSpotlight, 'visible').name("Toggle Spotlight");
lightFolder.add(pointLight, 'visible').name("Toggle Sunlight");
lightFolder.add(pointLight, 'intensity', 50, 2000).name("Sunlight Intensity");

//keyboard controls
var xSpeed = 0.05;
var ySpeed = 0.05;

//ANIMATION KEY VALUE
let zValue = 126;
let yValue = 126;

document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
    const keyCode = event.which;
	//translate with wasd controls
    if (keyCode == 82) {
		//R - Up
       // robot.position.y += ySpeed;
	   robot.translateY(ySpeed);
    } else if (keyCode == 70) {
		//F- Down
        robot.translateY(-ySpeed);
    } else if (keyCode == 65) {
		//A - Left
        robot.translateX(-xSpeed);
    } else if (keyCode == 68) {
		//D- Right
        robot.translateX(xSpeed);
    } else if (keyCode == 87) {
		//W- Foward
       // robot.position.z += xSpeed;
	   robot.translateZ(xSpeed);
    } else if (keyCode == 83) {
		//S - Backwards
        //robot.position.z -= xSpeed;
		robot.translateZ(-xSpeed);
    } else if (keyCode == 32) {
		//Space- reset position
    	robot.position.set(0, 1.5, -4);
    } else if (keyCode == 81) {
		//Q - rotate counterclockwise
		//robot.rotation.y += xSpeed;
		robot.rotateY(xSpeed);
	} else if (keyCode == 69) {
		//E - rotate clockwise
		//robot.rotation.y -= xSpeed;
		robot.rotateY(-xSpeed);
	} else if (keyCode == 67) {
		//C- control light 
		if (robotHead.getSpotLight().visible == true) {
			robotHead.getSpotLight().visible = false;
		}
		else {
			robotHead.getSpotLight().visible = true;
		}
	} else if (keyCode == 88) {
		//X - toggle first person
		if (renderCamera == camera) {
			renderCamera = robotHead.getRobotCamera();
			renderCamera.lookAt(new THREE.Vector3(cameraTarget.position.x, cameraTarget.position.y, cameraTarget.position.z));
		}
		else {
			renderCamera = camera;
		}
	}
	else if (keyCode == 90) {
		//headspin animation, make rotate value 0 to start
		zValue = 0
	}

	
};


//enable all shadows
/*
scene.traverse( function( child ) { 
    if ( child.type == 'Mesh') {
        child.castShadow = true;
        child.receiveShadow = true;
    }
} );
*/


animate();

function animate() {
	requestAnimationFrame(animate);
	robotHead.getSpotLight().target.updateMatrixWorld();
	controlsDefault.update();
	onWindowResize();
	
	//animation check
	//flip
	if (zValue == 124) {
		robotHead.rotation.z += 0.1
		zValue += 2
		yValue = 0;
		// 1 second delay
		window.cancelAnimationFrame
	} else if (zValue < 126) {
		robotHead.rotation.z += 0.1
		zValue += 2
		clock.getElapsedTime(1);
	} 

	//spin
	if (yValue < 126) {
		robotHead.rotation.y += 0.1
		yValue += 2
		clock.getElapsedTime(1);
	}

	//animation idea - death star shoot lazer and particle explosion? 

	renderer.render( scene, renderCamera);
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
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

function drawCylinderNew(topRadius, bottomRadius, height) {
	const cylinder = new THREE.CylinderGeometry(topRadius, bottomRadius, height);
	//cylinder.translate(2,2,-2);
	return cylinder;
}

function drawSphereNew(radius, width, height) {
	const sphere = new THREE.SphereGeometry(radius, width, height);
	//sphere.translate(-3, -3, -2);
	return sphere;
}	