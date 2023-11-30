import * as THREE from '../modules/three.module.js';
import { OrbitControls } from '../modules/OrbitControls.js';
import { GUI } from '../modules/dat.gui.module.js';

// creates the tank class
class Tank extends THREE.Object3D {
	constructor(x, y, z) {
		super();

		// dimensions
		this.width = 18;
		this.height = 9;
		this.depth = 12;

		// wireframe fish tank
		const tankG = new THREE.BoxGeometry(this.width, this.height, this.depth);
		const tankEdgesG = new THREE.EdgesGeometry(tankG)
		const tankM = new THREE.LineBasicMaterial({
			color: 0x000000,
			linewidth: 0.75
		});
		const tankEdges = new THREE.LineSegments(tankEdgesG, tankM);
		this.add(tankEdges);

		// adds the water
		const waterG = new THREE.BoxGeometry(this.width, this.height-2, this.depth);
		const waterM = new THREE.MeshBasicMaterial({
			color: 0xACEBFF, 
			// light: 0xCFF4FF 
			// medium: 0xACEBFF
			// darker: 0x91E5FF 
			opacity: 0.4, 
			transparent: true,
			side: THREE.DoubleSide
		})
		const water = new THREE.Mesh(waterG, waterM);
		water.position.y -= 1;
		this.add(water);

		// positions the tank
		this.position.set(x, y, z);

		// adds the camera fish
		this.nemoRadius = 0.25;
		const nemoG = new THREE.SphereGeometry(this.nemoRadius);
		const nemoM = new THREE.MeshBasicMaterial({
			color: 0xEA4700
		});
		this.nemo = new THREE.Mesh(nemoG, nemoM);
		this.nemo.position.set(0, 0, 0);
		this.add(this.nemo);

		// tells if nemo should not sink
		this.nemo.shouldFloat = false;
		// makes the sand for the fish tank
		this.sand = new Sand(this.depth/0.05-2, this.width/0.04-2);
		this.sand.position.set(0, -this.height/2 + 0.04, 0);
		this.add(this.sand);
	}

	getWidth() {
		return this.width;
	}

	getHeight() {
		return this.height;
	}

	getDepth() {
		return this.depth;
	}

	getNemo() {
		return this.nemo;
	}

	getNemoRadius() {
		return this.nemoRadius;
	}

	sandOscillation() {
		this.sand.oscillation();
	}
}

class Sand extends THREE.Object3D {
	constructor(x, z) {
		// calls the constructor for THREE.Object3D
		super();

		// counter for the oscillation function
		this.count = 0;

		// the amount of particles in the x and y directions
		this.AMOUNTX = x;
		this.AMOUNTZ = z;

		// the total number of particles is the x amount * the z amount
		const numParticles = this.AMOUNTX * this.AMOUNTZ;

		this.oscillation();
	}

	oscillation() {
		// makes a position array without a fixed size
		const uPosTemp = [];

		for (let ix = -this.AMOUNTX/2; ix < this.AMOUNTX/2; ix++) {
			for (let iz = 0; iz < this.AMOUNTZ; iz++) { 
				let x = ix * 0.05;
				let y = (Math.cos((iz + this.count) * 0.15) * 0.2) + 0.2;
				let z = -(iz * 0.04 - ((this.AMOUNTZ * 0.04) / 2));

				// calculates the coordinates
				// and adds them to the array
				for (let iy = y; iy >= 0; iy -= 0.1) {
					uPosTemp.push(x);
					uPosTemp.push(iy);
					uPosTemp.push(z);
				}
				uPosTemp.push(x);
				uPosTemp.push(0);
				uPosTemp.push(z);
			}
		}

		// Particle Systems need fixed sized arrays
		// so copy everything in the temporary array
		// into the fixed size array
		const uPositions = new Float32Array(uPosTemp.length);
		for (let j = 0; j < uPosTemp.length; j++) {
			uPositions[j] = uPosTemp[j];
		}

		this.clear();

		// creates a particle system using the fixed size array
		const sandG = new THREE.BufferGeometry();
		sandG.setAttribute('position', new THREE.BufferAttribute(uPositions, 3));
		const sandM = new THREE.PointsMaterial({
			color: 0xffaabc,
			size: 0.1
		})
		this.sand = new THREE.Points(sandG, sandM);
		this.sand.rotation.y = 90 * Math.PI/180;
		this.add(this.sand);

		// increases the count to make the oscillation work
		this.count += 1;
	}
}

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

		this.robotCamera.position.z += 2;
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

class Lamp extends THREE.Object3D {
	//materials
	shadeTexture = new THREE.TextureLoader().load("../pictures/lampshade.jpg");
	white = new THREE.MeshPhongMaterial( { color: 0xfffcc3, transparent: true, opacity: 0.3});
	gray = new THREE.MeshPhongMaterial( { color: 0xaaaaaa});
	black = new THREE.MeshPhongMaterial( { color: 0x010101 , emissive: 0x111111, });
	lampColor = new THREE.MeshPhongMaterial( {transparent: true, opacity: 0.97, map: this.shadeTexture, side: THREE.DoubleSide});
	//geometries 
	sphere1 = new THREE.SphereGeometry(1, 32, 32);
	halfsphere = new THREE.SphereGeometry(3 ,32,32, 0.3,  Math.PI*2, 0, Math.PI * 0.5);
	cylinder = new THREE.CylinderGeometry( 0.4, 0.4, 4, 32 );
	//objects
	lightBall = new THREE.Mesh(this.sphere1, this.white); 
	lightBall2 = new THREE.Mesh(this.sphere1, this.white); 
	shade = new THREE.Mesh(this.halfsphere, this.lampColor); 
	ring = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.4, 0.5, 32), this.gray);
	stem = new THREE.Mesh(this.cylinder, this.black);

	constructor() {
		super();
		//transformation
		this.shade.scale.y = 1.3;
		this.lightBall.position.y += 1.9;
		this.lightBall.scale.y = 1.1;
		this.lightBall.scale.x = 0.6;
		this.lightBall.scale.z = 0.6;
		this.lightBall2.position.y += 1.4;
		this.lightBall2.scale.x = 0.9;
		this.lightBall2.scale.y = 0.9;
		this.lightBall2.scale.z = 0.9;
		this.ring.position.y += 3;
		this.stem.position.y += 5.3;
		//add to object
		this.add(this.stem);
		this.add(this.shade);
		this.add(this.ring);
		this.add(this.lightBall);
		this.add(this.lightBall2)
	}
}

class Bed extends THREE.Object3D {
	//textures
	pillowTexture = new THREE.TextureLoader().load("../pictures/pillowGreen.jpg");
	pillowTexture2 = new THREE.TextureLoader().load("../pictures/fluffypillow.jpg");
	pillowTexture3 = new THREE.TextureLoader().load("../pictures/leafpillow.jpg");
	//materials
	brown = new THREE.MeshPhongMaterial( {color: 0x2B1700});
	gray = new THREE.MeshPhongMaterial( {color: 0x999999});
	red = new THREE.MeshPhongMaterial( {color: 0x7dc0f1});
	cream = new THREE.MeshPhongMaterial( {color: 0xf9f3e7});
	pillowMat = new THREE.MeshPhongMaterial({map: this.pillowTexture})
	pillowMat2 = new THREE.MeshPhongMaterial({map: this.pillowTexture2})
	pillowMat3 = new THREE.MeshPhongMaterial({map: this.pillowTexture3})
	//geometries
	cube = new THREE.BoxGeometry(1,2,1);
	sphere1 = new THREE.SphereGeometry(1, 32, 32);
	cylinder = new THREE.CylinderGeometry( 2.3, 2.3, 0.5, 32 );
	//objects 
	legBL = new THREE.Mesh(this.cube, this.brown);
	legBR = new THREE.Mesh(this.cube, this.brown);
	legTL = new THREE.Mesh(this.cube, this.brown);
	legTR = new THREE.Mesh(this.cube, this.brown);
	base = new THREE.Mesh(new THREE.BoxGeometry(5, 0.5, 10), this.gray);
	blanket = new THREE.Mesh(new THREE.BoxGeometry(4.8, 1, 9.8), this.red);
	pillow = new THREE.Mesh(this.sphere1, this.pillowMat);
	pillow2 = new THREE.Mesh(this.sphere1, this.pillowMat);
	pillow3 = new THREE.Mesh(this.sphere1, this.pillowMat3);
	longPillow = new THREE.Mesh(this.sphere1, this.pillowMat2);
	headboardBottom = new THREE.Mesh(new THREE.BoxGeometry(5,5, 0.5), this.brown);
	headboardTop = new THREE.Mesh(this.cylinder, this.brown);
	runner = new THREE.Mesh(new THREE.BoxGeometry(4.9, 1.2, 2.5), this.cream);
	//mattress/blanket
	//pillows

	//headboard 
	//squishmallow sphere/oval?

	constructor() {
		super();
		//transformations
		this.base.position.y += 1;
		this.pillow.scale.z = 0.5;
		this.pillow.position.y += 3.1;
		this.pillow.position.z -= 3.8;
		this.pillow.position.x -= 1;
		this.pillow2.scale.z = 0.5;
		this.pillow2.position.y += 3.1;
		this.pillow2.position.z -= 3.8;
		this.pillow2.position.x += 1;
		this.pillow3.scale.z = 0.5;
		this.pillow3.scale.x = 0.7;
		this.pillow3.scale.y = 0.7;
		this.pillow3.position.y += 2.9;
		this.pillow3.position.z -= 3.5;
		this.longPillow.scale.x = 2.5;
		this.longPillow.scale.y = 1.3;
		this.longPillow.scale.z = 0.7;
		this.longPillow.position.y += 2.8;
		this.longPillow.position.z -= 4.5;
		this.blanket.position.y += 1.7;
		this.runner.position.y += 1.7;
		this.runner.position.z += 3.69;
		this.headboardBottom.position.z -= 5;
		this.headboardBottom.position.y += 1.9;
		this.headboardTop.position.y += 3.5;
		this.headboardTop.position.z -= 5;
		this.headboardTop.rotation.x = 90 * Math.PI/180;

		this.legBL.position.z += 4.4;
		this.legBL.position.x -= 1.9;
		this.legBR.position.z += 4.4;
		this.legBR.position.x += 1.9;
		this.legTL.position.z -= 4.4;
		this.legTL.position.x -= 1.9;
		this.legTR.position.z -= 4.4;
		this.legTR.position.x += 1.9;

		//add to object
		this.add(this.legBL);
		this.add(this.legBR);
		this.add(this.legTL);
		this.add(this.legTR);
		this.add(this.base);
		this.add(this.pillow);
		this.add(this.pillow2)
		this.add(this.pillow3);
		this.add(this.longPillow);
		this.add(this.blanket);
		this.add(this.headboardBottom);
		this.add(this.headboardTop);
		this.add(this.runner);
	}
}

class Dresser extends THREE.Object3D {
	//materials
	brown = new THREE.MeshPhongMaterial( {color: 0x2B1700});
	gold = new THREE.MeshPhongMaterial( {color: 0xf7c401});

	sphere1 = new THREE.SphereGeometry(0.2, 32, 32);

	//meshes
	base = new THREE.Mesh(new THREE.BoxGeometry(10, 6.5, 4), this.brown);
	top = new THREE.Mesh(new THREE.BoxGeometry(9.5, 2, 4.5), this.brown);
	middle = new THREE.Mesh(new THREE.BoxGeometry(9.5, 2, 4.5), this.brown);
	bottom = new THREE.Mesh(new THREE.BoxGeometry(9.5, 2, 4.5), this.brown);
	ballTop = new THREE.Mesh(this.sphere1, this.gold);
	ballMiddle = new THREE.Mesh(this.sphere1, this.gold);
	ballBottom = new THREE.Mesh(this.sphere1, this.gold);


	constructor() {
		super();
		this.top.position.y += 2.1;
		this.bottom.position.y -= 2.1;
		this.ballTop.position.z += 2.2;
		this.ballTop.scale.x = 3;
		this.ballTop.position.y += 2.2;
		this.ballMiddle.position.z += 2.2;
		this.ballMiddle.scale.x = 3;
		this.ballBottom.position.z += 2.2;
		this.ballBottom.scale.x = 3;
		this.ballBottom.position.y -= 2.2;

		this.add(this.base)
		this.add(this.top)
		this.add(this.middle)
		this.add(this.bottom)
		this.add(this.ballTop)
		this.add(this.ballMiddle)
		this.add(this.ballBottom)
		
	}
}

class Nightstand extends THREE.Object3D {
	//textures
	bookTexture = new THREE.TextureLoader().load("../pictures/book2.jpg");
	bookTexture2 = new THREE.TextureLoader().load("../pictures/book1.jpg");
	bookTexture3 = new THREE.TextureLoader().load("../pictures/books3.jpg");
	bookTexture4 = new THREE.TextureLoader().load("../pictures/booktop.jpg");
	alarmTexture = new THREE.TextureLoader().load("../pictures/alarmclock.jpg");
	//materials
	bookMat1 = new THREE.MeshPhongMaterial({map: this.bookTexture});
	bookMat2 = new THREE.MeshPhongMaterial({map: this.bookTexture2});
	bookMat3 = new THREE.MeshPhongMaterial({map: this.bookTexture3});
	bookMat4 = new THREE.MeshPhongMaterial({map: this.bookTexture4});
	alarmMat = new THREE.MeshPhongMaterial({map: this.alarmTexture});
	brown = new THREE.MeshPhongMaterial( {color: 0x2B1700});
	gray = new THREE.MeshPhongMaterial( {color: 0x222222});
	gold = new THREE.MeshPhongMaterial( {color: 0xf7c401});

	//right, left, top, bottom. front, back
	bookMats = [this.bookMat1, this.bookMat1, this.bookMat2, this.bookMat1, this.bookMat2, this.bookMat1];
	bookMats2 = [this.bookMat1, this.bookMat1, this.bookMat1, this.bookMat1, this.bookMat1, this.bookMat1];
	bookMats3 = [this.bookMat3, this.bookMat3, this.bookMat4, this.bookMat3, this.bookMat3, this.bookMat3];
	//geometries
	sphere1 = new THREE.SphereGeometry(0.2, 32, 32);

	//meshes
	base = new THREE.Mesh(new THREE.BoxGeometry(4, 5.5, 1), this.brown);
	drawer = new THREE.Mesh(new THREE.BoxGeometry(4, 1, 4.3), this.brown);
	drawerBottom = new THREE.Mesh(new THREE.BoxGeometry(4, 1, 4.3), this.brown);
	drawerSide = new THREE.Mesh(new THREE.BoxGeometry(0.5, 5.5, 4.3), this.brown);
	drawerSideR = new THREE.Mesh(new THREE.BoxGeometry(0.5, 5.5, 4.3), this.brown);
	ball = new THREE.Mesh(this.sphere1, this.gold);
	book = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.25, 1.7), this.bookMats);
	book2 = new THREE.Mesh(new THREE.BoxGeometry(1.5, 2, 0.25), this.bookMats2);
	bookBox = new THREE.Mesh(new THREE.BoxGeometry(2.5, 2, 2), this.bookMats3);

	//clock
	clockBase = new THREE.Mesh(new THREE.BoxGeometry(2, 1, 1), this.gray); 
	clockFace = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.8, 0.1), this.alarmMat);

	constructor() {
		super();
		this.base.position.z -= 1.65
		this.drawer.position.y += 3;
		this.drawerBottom.position.y -= 2.2;
		this.ball.position.y += 3;
		this.ball.position.z += 2.2;
		this.book.position.y += 0.05;
		this.book2.position.y += 1;
		this.book2.rotation.y = 15 * Math.PI/180;
		this.bookBox.position.y -= 1;
		this.drawerSide.position.x -= 1.75;
		this.drawerSideR.position.x += 1.75;
		this.clockBase.position.y += 3.6;
		this.clockBase.rotation.x = 50 * Math.PI/180;
		this.clockFace.position.z+= 0.4;
		this.clockFace.position.y += 3.9;
		this.clockFace.rotation.x = 320 * Math.PI/180;
		const clock = new THREE.Group();
		clock.add(this.clockBase);
		clock.add(this.clockFace);
		clock.position.z -= 0.5
		clock.position.x -= 0.2
		clock.position.y += 0.2
		clock.rotation.x = 10 * Math.PI/180;

		this.add(this.book);
		this.add(this.book2)
		this.add(this.bookBox);
		this.add(this.drawerBottom)
		this.add(this.drawer);
		this.add(this.drawerSide);
		this.add(this.drawerSideR);
		this.add(this.ball);
		this.add(this.base);
		this.add(clock);
	}
}

class Chest extends THREE.Object3D {
	brown = new THREE.MeshPhongMaterial( {color: 0x2B1700});
	gray = new THREE.MeshPhongMaterial( { color: 0x333333});
	gold = new THREE.MeshPhongMaterial( {color: 0xf7c401});
	cylinder = new THREE.CylinderGeometry( 2, 2, 7, 32 );

	base = new THREE.Mesh(new THREE.BoxGeometry(7, 3.5, 4), this.brown);
	top = new THREE.Mesh(this.cylinder, this.brown);
	open = new THREE.Mesh(new THREE.BoxGeometry(7.1, 0.5, 4.1), this.gray);
	latch = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.6, 0.6), this.gold);

	constructor() {
		super();
		this.top.rotation.z = 90 * Math.PI/180;
		this.top.position.y += 1.5;
		this.open.position.y += 1.5;
		this.latch.position.z += 2;
		this.latch.position.y += 1.5

		this.add(this.base);
		this.add(this.top);
		this.add(this.open);
		this.add(this.latch)
	}
}

class Bookshelf extends THREE.Object3D {

	booktopTexture = new THREE.TextureLoader().load("../pictures/booktop.jpg");
	bookfaceTexture = new THREE.TextureLoader().load("../pictures/book1.jpg");
	bookfaceTexture2 = new THREE.TextureLoader().load("../pictures/book2.jpg");
	bookspineTexture1 = new THREE.TextureLoader().load("../pictures/bookspine1.jpg");
	bookspineTexture2 = new THREE.TextureLoader().load("../pictures/bookspine2.jpg");
	bookspineTexture3 = new THREE.TextureLoader().load("../pictures/bookspine3.jpg");
	bookspineTexture4 = new THREE.TextureLoader().load("../pictures/bookspine4.jpg");
	bookspineTexture5 = new THREE.TextureLoader().load("../pictures/bookspine5.jpg");

	booktop = new THREE.MeshPhongMaterial({map: this.booktopTexture});
	bookface1 = new THREE.MeshPhongMaterial({map: this.bookfaceTexture}); 
	bookface2 = new THREE.MeshPhongMaterial({map: this.bookfaceTexture2}); 
	bookspine1 = new THREE.MeshPhongMaterial({map: this.bookspineTexture1});
	bookspine2 = new THREE.MeshPhongMaterial({map: this.bookspineTexture2});
	bookspine3 = new THREE.MeshPhongMaterial({map: this.bookspineTexture3});
	bookspine4 = new THREE.MeshPhongMaterial({map: this.bookspineTexture4});
	bookspine5 = new THREE.MeshPhongMaterial({map: this.bookspineTexture5});
	brown = new THREE.MeshPhongMaterial( {color: 0x2B1700});

	//right, left, top, bottom. front, back
	bookMats = [this.bookface1, this.bookspine1, this.booktop, this.bookspine1, this.bookspine1, this.bookspine1];
	bookMats2 = [this.bookface1, this.bookspine1, this.booktop, this.bookspine1, this.bookspine2, this.bookspine2];
	bookMats3 = [this.bookface1, this.bookspine1, this.booktop, this.bookspine1, this.bookspine3, this.bookspine3];
	bookMats4 = [this.bookface2, this.bookspine1, this.booktop, this.bookspine1, this.bookspine4, this.bookspine4];
	bookMats5 = [this.bookface1, this.bookspine1, this.booktop, this.bookspine1, this.bookspine5, this.bookspine5];

	top = new THREE.Mesh(new THREE.BoxGeometry(6, 0.5, 4), this.brown);
	bottom = new THREE.Mesh(new THREE.BoxGeometry(6, 0.5, 4), this.brown);
	back = new THREE.Mesh(new THREE.BoxGeometry(6, 14, 1), this.brown);
	left = new THREE.Mesh(new THREE.BoxGeometry(0.5, 14, 4), this.brown);
	right = new THREE.Mesh(new THREE.BoxGeometry(0.5, 14, 4), this.brown);
	bottomShelf = new THREE.Mesh(new THREE.BoxGeometry(6, 0.5, 4), this.brown);
	topShelf = new THREE.Mesh(new THREE.BoxGeometry(6, 0.5, 4), this.brown);
	middleShelf = new THREE.Mesh(new THREE.BoxGeometry(6, 0.5, 4), this.brown);

	//books
	book1 = new THREE.Mesh(new THREE.BoxGeometry(2.5, 2.8, 2), this.bookMats);
	book2 = new THREE.Mesh(new THREE.BoxGeometry(4, 2.2, 2), this.bookMats2);
	book3 = new THREE.Mesh(new THREE.BoxGeometry(2.5, 2.6, 1.9), this.bookMats3);
	book4 = new THREE.Mesh(new THREE.BoxGeometry(4, 2.4, 1.9), this.bookMats4);
	book5 = new THREE.Mesh(new THREE.BoxGeometry(4.6, 2.4, 2.2), this.bookMats5);


	constructor() {
		super();

		this.top.position.y += 6.75;
		this.bottom.position.y -= 6.75;
		this.back.position.z -= 1.5;
		this.left.position.x -= 3;
		this.right.position.x += 3;
		this.bottomShelf.position.y -= 3.5;
		this.topShelf.position.y += 3.5;

		this.add(this.bottom);
		this.add(this.top);
		this.add(this.back);
		this.add(this.left)
		this.add(this.right);
		this.add(this.bottomShelf)
		this.add(this.topShelf)
		this.add(this.middleShelf)

		//books
		this.book1.position.y += 1.4
		this.book1.position.x -= 1.6
		this.book2.position.y += 4.5;
		this.book2.position.x += 1;
		this.book3.position.y += 1.4
		this.book3.position.x += 1;
		this.book4.position.y -= 2.2;
		this.book4.position.x -= 1.6;
		this.book5.position.y -= 5.5;

		this.add(this.book1)
		this.add(this.book2)
		this.add(this.book3)
		this.add(this.book4)
		this.add(this.book5);
	}
}

class Bookshelf2 extends THREE.Object3D {
	booktopTexture = new THREE.TextureLoader().load("../pictures/booktop.jpg");
	bookfaceTexture = new THREE.TextureLoader().load("../pictures/book1.jpg");
	bookfaceTexture2 = new THREE.TextureLoader().load("../pictures/book2.jpg");
	bookspineTexture1 = new THREE.TextureLoader().load("../pictures/bookspine5.jpg");
	bookspineTexture2 = new THREE.TextureLoader().load("../pictures/bookspine4.jpg");
	bookspineTexture3 = new THREE.TextureLoader().load("../pictures/bookspine7.jpg");
	bookspineTexture4 = new THREE.TextureLoader().load("../pictures/bookspine3.jpg");
	bookspineTexture5 = new THREE.TextureLoader().load("../pictures/bookspine6.jpg");

	booktop = new THREE.MeshPhongMaterial({map: this.booktopTexture});
	bookface1 = new THREE.MeshPhongMaterial({map: this.bookfaceTexture}); 
	bookface2 = new THREE.MeshPhongMaterial({map: this.bookfaceTexture2}); 
	bookspine1 = new THREE.MeshPhongMaterial({map: this.bookspineTexture1});
	bookspine2 = new THREE.MeshPhongMaterial({map: this.bookspineTexture2});
	bookspine3 = new THREE.MeshPhongMaterial({map: this.bookspineTexture3});
	bookspine4 = new THREE.MeshPhongMaterial({map: this.bookspineTexture4});
	bookspine5 = new THREE.MeshPhongMaterial({map: this.bookspineTexture5});
	brown = new THREE.MeshPhongMaterial( {color: 0x2B1700});

	//right, left, top, bottom. front, back
	bookMats = [this.bookface1, this.bookspine1, this.booktop, this.bookspine1, this.bookspine1, this.bookspine1];
	bookMats2 = [this.bookface1, this.bookspine1, this.booktop, this.bookspine1, this.bookspine2, this.bookspine2];
	bookMats3 = [this.bookface1, this.bookspine1, this.booktop, this.bookspine1, this.bookspine3, this.bookspine3];
	bookMats4 = [this.bookface2, this.bookspine1, this.booktop, this.bookspine1, this.bookspine4, this.bookspine4];
	bookMats5 = [this.bookface1, this.bookspine1, this.booktop, this.bookspine1, this.bookspine5, this.bookspine5];

	//base = new THREE.Mesh(new THREE.BoxGeometry(6, 15, 4), this.brown);
	top = new THREE.Mesh(new THREE.BoxGeometry(6, 0.5, 4), this.brown);
	bottom = new THREE.Mesh(new THREE.BoxGeometry(6, 0.5, 4), this.brown);
	back = new THREE.Mesh(new THREE.BoxGeometry(6, 14, 1), this.brown);
	left = new THREE.Mesh(new THREE.BoxGeometry(0.5, 14, 4), this.brown);
	right = new THREE.Mesh(new THREE.BoxGeometry(0.5, 14, 4), this.brown);
	bottomShelf = new THREE.Mesh(new THREE.BoxGeometry(6, 0.5, 4), this.brown);
	topShelf = new THREE.Mesh(new THREE.BoxGeometry(6, 0.5, 4), this.brown);
	middleShelf = new THREE.Mesh(new THREE.BoxGeometry(6, 0.5, 4), this.brown);

	//books
	book1 = new THREE.Mesh(new THREE.BoxGeometry(2.5, 2.8, 2), this.bookMats);
	book2 = new THREE.Mesh(new THREE.BoxGeometry(4, 2.7, 2), this.bookMats2);
	book3 = new THREE.Mesh(new THREE.BoxGeometry(2.5, 2.6, 1.9), this.bookMats3);
	book4 = new THREE.Mesh(new THREE.BoxGeometry(5, 2.4, 1.9), this.bookMats4);
	book5 = new THREE.Mesh(new THREE.BoxGeometry(5.5, 2.4, 2.2), this.bookMats5);

	constructor() {
		super();

		this.top.position.y += 6.75;
		this.bottom.position.y -= 6.75;
		this.back.position.z -= 1.5;
		this.left.position.x -= 3;
		this.right.position.x += 3;
		this.bottomShelf.position.y -= 3.5;
		this.topShelf.position.y += 3.5;

		this.add(this.bottom);
		this.add(this.top);
		this.add(this.back);
		this.add(this.left)
		this.add(this.right);
		this.add(this.bottomShelf)
		this.add(this.topShelf)
		this.add(this.middleShelf)

		//books
		this.book1.position.y += 1.4
		this.book1.position.x -= 1.6
		this.book2.position.y += 5;
		this.book2.position.x -= 1;
		this.book3.position.y += 1.4
		this.book3.position.x += 1;
		this.book4.position.y -= 2.2;
		this.book4.position.x -= 0.4;
		this.book5.position.y -= 5.5;

		this.add(this.book1)
		this.add(this.book2)
		this.add(this.book3)
		this.add(this.book4)
		this.add(this.book5);
	}
}

class Desk extends THREE.Object3D {
	computerTopTexture = new THREE.TextureLoader().load("../pictures/macScreen.jpeg");
	computerBottomTexture = new THREE.TextureLoader().load("../pictures/macKeyboard.jpg");
	pizzaboxTexture = new THREE.TextureLoader().load("../pictures/pizzabox.png");

	brown = new THREE.MeshPhongMaterial( {color: 0x2B1700});
	black = new THREE.MeshPhongMaterial( {color: 0xFFFFFF});
	black2 = new THREE.MeshPhongMaterial( {color: 0x010101});
	gray = new THREE.MeshPhongMaterial( {color: 0xC0C0C0});
	pizzacolor = new THREE.MeshPhongMaterial( {color: 0xe8e5d8});
	trashMat = new THREE.MeshPhongMaterial({map: this.trashTexture})
	computerTopMat = new THREE.MeshPhongMaterial({map: this.computerTopTexture})
	computerBottomMat = new THREE.MeshPhongMaterial({map: this.computerBottomTexture})
	computerTopMats = [this.gray, this.gray, this.gray, this.gray, this.computerTopMat, this.gray];
	pizzaBoxMat = new THREE.MeshPhongMaterial({map: this.pizzaboxTexture})


	top = new THREE.Mesh(new THREE.BoxGeometry(10, 0.3, 4), this.brown); 
	back = new THREE.Mesh(new THREE.BoxGeometry(10, 6.3, 0.3), this.brown);
	left = new THREE.Mesh(new THREE.BoxGeometry(0.3, 6.3, 4.2), this.brown);
	right = new THREE.Mesh(new THREE.BoxGeometry(0.3, 6.3, 4.2), this.brown);
	trash = new THREE.Mesh(new THREE.BoxGeometry(2, 3, 2), this.black);
	trashRing = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.2, 2.1), this.black2);
	computerTop = new THREE.Mesh(new THREE.BoxGeometry(3, 2.3, 0.05), this.computerTopMats);
	computerBottom = new THREE.Mesh(new THREE.BoxGeometry(3, 0.05, 2.3), this.computerBottomMat);
	pizzaBox = new THREE.Mesh(new THREE.BoxGeometry(4, 0.25, 4), this.pizzaBoxMat);

	constructor() {
		super();

		//trashcan
		this.trash.position.x -= 7;
		this.trash.position.y -= 1.5;
		this.trashRing.position.x -= 7;
		this.trashRing.position.y -= 0.5;
		const trashcan = new THREE.Group();
		trashcan.add(this.trash);
		trashcan.add(this.trashRing);


		//computer
		this.computerTop.position.y += 4.5;
		this.computerTop.position.z -= 1.4;
		this.computerTop.rotation.x = 345 * Math.PI/180;
		this.computerBottom.position.y += 3.3;

		const macbook = new THREE.Group();
		macbook.position.x -= 0.5;
		macbook.add(this.computerTop);
		macbook.add(this.computerBottom);

		//pizzaBox
		this.pizzaBox.position.y += 3.25;
		this.pizzaBox.position.x += 4;
		this.pizzaBox.position.z += 0.5
		this.pizzaBox.rotation.y = 20 * Math.PI/180;
		this.add(this.pizzaBox);

		//desklamp + family photo


		//desk
		this.top.position.y += 3;
		this.back.position.z -= 2;
		this.left.position.x -= 5;
		this.left.position.z -= 0.05;
		this.right.position.x += 5;
		this.right.position.z += 0.05;

		const desk = new THREE.Group();
		desk.add(this.top);
		desk.add(this.back);
		desk.add(this.left)
		desk.add(this.right)


		this.add(desk);
		this.add(macbook);
		this.add(trashcan)
	}
}

class Chair extends THREE.Object3D {
	//TODO FINISH CHAIR - add cloth texture instead of gray? 

	chairTexture = new THREE.TextureLoader().load("../pictures/chaircloth.jpg");

	gray = new THREE.MeshPhongMaterial( {color: 0x777777});
	black = new THREE.MeshPhongMaterial( {color: 0x010101});
	chairMat = new THREE.MeshPhongMaterial({map: this.chairTexture})

	sphere = new THREE.SphereGeometry(2, 32, 32);
	smallsphere = new THREE.SphereGeometry(0.4, 32, 32);

	base = new THREE.Mesh(new THREE.BoxGeometry(7, 4, 4), this.chairMat);
	back = new THREE.Mesh(this.sphere, this.chairMat);
	backpost = new THREE.Mesh(new THREE.BoxGeometry(0.5, 2.5, 0.5), this.black);
	bottompost = new THREE.Mesh(new THREE.BoxGeometry(0.5, 2.5, 0.5), this.black);
	bottom = new THREE.Mesh(this.sphere, this.chairMat);

	chairleg1 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 2, 0.5), this.black);
	chairleg2 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 2, 0.5), this.black);
	chairleg3 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 2, 0.5), this.black);
	chairwheel1 = new THREE.Mesh(this.smallsphere, this.black);
	chairwheel2 = new THREE.Mesh(this.smallsphere, this.black);
	chairwheel3 = new THREE.Mesh(this.smallsphere, this.black);

	constructor() {
		super();

		this.back.scale.z = 0.35
		this.back.scale.x = 1.25
		this.back.position.y += 3.5;
		this.back.position.z -= 1.5
		this.bottom.scale.y = 0.35
		this.bottom.scale.x = 1.25
		this.backpost.position.y += 1
		this.backpost.position.z -= 1.5
		this.bottompost.position.y -= 1
		this.chairleg1.rotation.z = 55 * Math.PI/180;
		this.chairleg1.rotation.x = 55 * Math.PI/180;
		this.chairleg1.position.y -= 2.25;
		this.chairleg1.position.x += 0.8
		this.chairleg1.position.z -= 0.5
		this.chairleg2.rotation.x = -55 * Math.PI/180;
		this.chairleg2.position.y -= 2;
		this.chairleg2.position.z += 0.6;
		this.chairleg3.rotation.z = -55 * Math.PI/180;
		this.chairleg3.rotation.x =  55 * Math.PI/180;
		this.chairleg3.position.y -= 2.25;
		this.chairleg3.position.x -= 0.8;
		this.chairleg3.position.z -= 0.5;
		this.chairwheel1.position.y -= 2.7;
		this.chairwheel1.position.z += 1.5;
		this.chairwheel2.position.y -= 2.7;
		this.chairwheel2.position.z -= 1;
		this.chairwheel2.position.x -= 1.9
		this.chairwheel3.position.y -= 2.7;
		this.chairwheel3.position.z -= 1;
		this.chairwheel3.position.x += 1.9
		
		const chair = new THREE.Group();
		chair.add(this.back);
		chair.add(this.bottom);
		chair.add(this.backpost);
		chair.add(this.bottompost);
		chair.add(this.chairleg1);
		chair.add(this.chairleg2);
		chair.add(this.chairleg3);
		chair.add(this.chairwheel1);
		chair.add(this.chairwheel2);
		chair.add(this.chairwheel3);

		chair.position.y += 1;
		
		this.add(chair)
	}
}

class Room extends THREE.Object3D {

	texture = new THREE.TextureLoader().load('../pictures/floor.jpg' );
	bricks = new THREE.TextureLoader().load('../pictures/wallpaper2.jpg' );
	rugmap = new THREE.TextureLoader().load('../pictures/rug1.jpg' );
	doormap = new THREE.TextureLoader().load('../pictures/door.png' );
	windowmap1 = new THREE.TextureLoader().load('../pictures/window2crop.jpg' );
	postermap1 = new THREE.TextureLoader().load('../pictures/poster1.jpg' );
	postermap2 = new THREE.TextureLoader().load('../pictures/poster2.jpg' );
	postermap3 = new THREE.TextureLoader().load('../pictures/poster3.webp' );
	postermap4 = new THREE.TextureLoader().load('../pictures/poster4.jpg' );
	postermap5 = new THREE.TextureLoader().load('../pictures/fishboat.jpg' );

	floorMaterial = new THREE.MeshPhongMaterial( { map: this.texture, castShadow: true, receiveShadow: true, color:0x999999} );
	wallMaterial = new THREE.MeshPhongMaterial( { map: this.bricks, castShadow: true, receiveShadow: true} );
	material2 = new THREE.MeshPhongMaterial( { color: 0xffffff } );
	rugMaterial = new THREE.MeshPhongMaterial( { map: this.rugmap, castShadow: true, receiveShadow: true} );
	doorMaterial = new THREE.MeshPhongMaterial( { map: this.doormap} );
	windowMaterial1 = new THREE.MeshPhongMaterial( { map: this.windowmap1,} );
	posterMaterial1 = new THREE.MeshPhongMaterial( { map: this.postermap1} );
	posterMaterial2 = new THREE.MeshPhongMaterial( { map: this.postermap2} );
	posterMaterial3 = new THREE.MeshPhongMaterial( { map: this.postermap3} );
	posterMaterial4 = new THREE.MeshPhongMaterial( { map: this.postermap4} );
	posterMaterial5 = new THREE.MeshPhongMaterial( { map: this.postermap5} );

	wall = new THREE.BoxGeometry(30, 20.6, 0.72	);
	wallTop = new THREE.BoxGeometry(30, 30, 0.7);

	//objects
	floor = new THREE.Mesh(this.wallTop, this.floorMaterial);
	ceiling = new THREE.Mesh(this.wallTop, this.material2);
	rug = new THREE.Mesh(new THREE.BoxGeometry(20, 20, 0.2), this.rugMaterial)
	poster1 = new THREE.Mesh(new THREE.BoxGeometry(7, 10, 0.2), this.posterMaterial1)
	poster2 = new THREE.Mesh(new THREE.BoxGeometry(7, 10, 0.2), this.posterMaterial2)
	poster3 = new THREE.Mesh(new THREE.BoxGeometry(3, 4, 0.2), this.posterMaterial3)
	poster4 = new THREE.Mesh(new THREE.BoxGeometry(7, 10, 0.2), this.posterMaterial4)
	poster5 = new THREE.Mesh(new THREE.BoxGeometry(3, 4, 0.2), this.posterMaterial5)

	wall1 = new THREE.Mesh(this.wall, this.wallMaterial);
	wall2 = new THREE.Mesh(this.wall, this.wallMaterial);
	wall3 = new THREE.Mesh(this.wall, this.wallMaterial);
	door = new THREE.Mesh(new THREE.BoxGeometry(7, 15, 0.9), this.doorMaterial);
	window1 = new THREE.Mesh(new THREE.BoxGeometry(10, 10, 0.9), this.windowMaterial1);
	window2 = new THREE.Mesh(new THREE.BoxGeometry(10, 10, 0.9), this.windowMaterial1);
	robot = new Robot();
	lamp = new Lamp();
	bed = new Bed();
	dresser = new Dresser();
	nightstand = new Nightstand();
	bookshelf = new Bookshelf();
	bookshelf2 = new Bookshelf2();
	chest = new Chest();
	desk = new Desk();
	chair = new Chair();

	//lights
	//lampLight = new THREE.PointLight(0xDDDDDD, 300 , 1000, 2);  -- scale 1 intensity
	lampLight = new THREE.PointLight(0xDDDDDD, 2800, 1000, 2); 

	constructor() {
		super()

		//transformations
		this.floor.rotation.x = 90 * Math.PI/180;
		this.floor.position.y -= 3;
		this.floor.receiveShadow = true;

		this.ceiling.material.side = THREE.DoubleSide;
		this.ceiling.rotation.x = 90 * Math.PI/180;
		this.ceiling.position.y += 17;
		this.ceiling.receiveShadow = true;

		
		this.rug.rotation.x = 90 * Math.PI/180;
		this.rug.position.y -= 2.73

		this.poster1.position.x -= 14.6;
		this.poster1.position.y += 9.5;
		this.poster1.position.z -= 9.3;
		this.poster1.rotation.y = 90 * Math.PI/180;
		this.poster1.rotation.z = 359 * Math.PI/180;

		this.poster2.position.x -= 14.6;
		this.poster2.position.y += 8.5;
		this.poster2.position.z += 1;
		this.poster2.rotation.y = 90 * Math.PI/180;
		this.poster2.rotation.z = 1 * Math.PI/180;

		this.poster3.position.z -= 14.6;
		this.poster3.position.x -= 3.5; 
		this.poster3.position.y += 8.5;

		this.poster4.position.z -= 14.6;
		this.poster4.position.x -= 10.5;
		this.poster4.position.y += 11.5;

		this.poster5.position.z -= 14.6;
		this.poster5.position.x -= 3.5; 
		this.poster5.position.y += 13.5;

		this.door.rotation.y = 90 * Math.PI/180;
		this.door.position.x -= 15;
		this.door.position.y += 4.7;
		this.door.position.z += 10;

		this.window1.position.z -= 15;
		this.window1.position.y += 9;
		this.window1.position.x += 5;

		this.window2.rotation.y = 90 * Math.PI/180;
		this.window2.position.y += 9;
		this.window2.position.x += 15;
		this.window2.position.z += 9;

		this.lamp.position.y += 11;
		this.lamp.scale.x = 0.8;
		this.lamp.scale.y = 0.8;
		this.lamp.scale.z = 0.8;
		this.bed.scale.x = 1.5
		this.bed.scale.z = 1.5
		this.bed.scale.y = 1.5
		this.bed.position.y -= 1.8;
		this.bed.position.x -= 10.5;
		this.bed.position.z -= 7;
		this.dresser.position.z -= 13
		this.dresser.position.x += 5;
		this.dresser.position.y += 0.5;
		this.chest.position.x -= 10.5;
		this.chest.position.z += 2.5;
		this.chest.position.y -= 1;
		this.nightstand.position.z -= 13;
		this.nightstand.position.x -= 4;

		this.bookshelf.position.y += 4.3;
		this.bookshelf2.position.y += 4.3;
		this.bookshelf.position.x += 13;
		this.bookshelf.position.z -= 8.5;
		this.bookshelf.rotation.y = 270	 * Math.PI/180;
		this.bookshelf2.rotation.y = 270 * Math.PI/180;
		this.bookshelf2.position.x += 13;
		this.bookshelf2.position.z -= 2;

		this.desk.rotation.y = 270 * Math.PI/180;
		this.desk.position.x += 12.5;
		this.desk.position.z += 9;

		this.chair.position.z += 8;
		this.chair.rotation.y = 75 * Math.PI/180;
		this.chair.position.x += 10;
		this.chair.position.y -= 0.5
		

		this.robot.position.z -= 9;
		this.robot.position.y += 3;
		this.robot.position.x-= 10;
		this.robot.receiveShadow = true;
		this.robot.scale.x = 0.3;
		this.robot.scale.y = 0.3;
		this.robot.scale.z = 0.3;
		this.wall1.position.z -= 15;
		this.wall1.position.y += 7;
		this.wall2.rotation.y = 90 * Math.PI/180;
		this.wall2.position.x -= 15;
		this.wall2.position.y += 7;
		this.wall3.rotation.y = 90 * Math.PI/180;
		this.wall3.position.x += 15;
		this.wall3.position.y += 7;
		this.wall1.receiveShadow = true;
		this.wall2.receiveShadow = true;
		this.wall3.receiveShadow = true;

		this.lampLight.castShadow = true;
		this.lampLight.shadow.mapSize.width = 4096
		this.lampLight.shadow.mapSize.height = 4096
		this.lampLight.shadow.camera.near = 0.5
		this.lampLight.shadow.camera.far = 1000
		this.lampLight.position.set(0, 12, 0)



		//add to object
		this.add(this.poster1)
		this.add(this.poster2)
		this.add(this.poster3)
		this.add(this.poster4)
		this.add(this.poster5)
		this.add(this.rug);
		this.add(this.door);
		this.add(this.window1);
		this.add(this.window2);
		this.add(this.floor); 
		this.add(this.wall1);
		this.add(this.wall2);
		this.add(this.wall3);
		this.add(this.ceiling);
		this.add(this.lamp);	
		this.add(this.bed);
		this.add(this.robot);
		this.add(this.dresser);
		this.add(this.nightstand);
		this.add(this.bookshelf);
		this.add(this.bookshelf2);
		this.add(this.chest);
		this.add(this.desk);
		this.add(this.chair);
		// this.add(this.fishtank);
		this.add(this.lampLight);
	}

	getLampLight() {
		return this.lampLight;
	}

	getRobot() {
		return this.robot;
	}
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
// const bgTexture = new THREE.TextureLoader().load("../pictures/clouds.jpg");
const bgTexture = new THREE.TextureLoader().load("../pictures/underwater.jpg");
scene.background = bgTexture;
bgTexture.minFilter = THREE.LinearFilter;


//camera
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.name = "DefaultCamera";
//DEFAULT CAMERA FOR ROOM POSITION
camera.position.set(0,20,130);
//camera.position.set(0,2,6);
var renderCamera = camera;
const controlsDefault = new OrbitControls(renderCamera, renderer.domElement );

//lights
var ambientLight = new THREE.AmbientLight( 0x333333, 0.5);
var dirLight = new THREE.DirectionalLight(0xFFFFFF, 0.2);
//var lampLight = new THREE.PointLight(0xFFA500, 100, 1000, 2);
//var lampLight = new THREE.PointLight(0xDDDDDD, 300 , 1000, 2);
const redSpotlight = new THREE.SpotLight(0xFFFFFF);



//const pointLightHelper = new THREE.PointLightHelper(lampLight, 1);
//scene.add(pointLightHelper);	

//overhead spotlight
redSpotlight.position.set(0, 10, 1);
redSpotlight.angle = 45 * Math.PI/180;
redSpotlight.intensity = 100;
redSpotlight.castShadow = true;
redSpotlight.visible = false;
redSpotlight.distance = 50;

dirLight.position.set(0, 1, 10);
dirLight.castShadow = true;
dirLight.visible = true;


//objects
const room = new Room();
const robot = room.getRobot();
const tank = new Tank(15, 16, 82.5);

//transformations
room.position.z += 60;
room.scale.x = 3;
room.scale.y = 3;
room.scale.z = 3;

tank.position.z -= 60;

//add to scene
scene.add(dirLight);
scene.add(ambientLight);
scene.add(redSpotlight);

scene.add(room);
scene.add(tank);

//TODO Decorations - chair, desklamp, led lights around ceiling
//TODO fish tank camera
//TODO include our robots in the fish tank / world as easter eggs

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
// robotFolder.open();
// headFolder.open();
// leftArmFolder.open()
// rightArmFolder.open();
// lightFolder.open();
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

	
var lampLight = room.getLampLight();
//toggle buttons
headFolder.add(leftEye.material, 'wireframe').name("Wireframe Eyes");
lightFolder.add(ambientLight, 'visible').name("Toggle Ambient Light");
lightFolder.add(dirLight, 'visible').name("Toggle Directional Light");
lightFolder.add(redSpotlight, 'visible').name("Toggle Spotlight");
lightFolder.add(lampLight, 'visible').name("Toggle Lamplight");
lightFolder.add(lampLight, 'intensity', 500, 8000).name("Light Intensity");
const colorParams = {
	color: lampLight.color.getHex()
};
lightFolder.addColor(colorParams, 'color')
.onChange((value) =>  lampLight.color.set(value)).name("Light Color");


//animations variables 
var isPov = false;

/*
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
*/

animate();

function animate() {
	requestAnimationFrame(animate);

	// sink nemo
	if (!tank.getNemo().shouldFloat) tank.getNemo().position.y -= 0.05;

	tank.sandOscillation();

	// tank boundary assurance
	boundaryAssurance();

	robotHead.getSpotLight().target.updateMatrixWorld();
	controlsDefault.update();
	onWindowResize();
	
	/*
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
	*/

	renderer.render( scene, renderCamera);
}

// assures that nemo cannot leave the fish tank
function boundaryAssurance() {
	let rad = tank.getNemoRadius();
	// x-boundary
	if (tank.getNemo().position.x < -tank.getWidth()/2+rad) {
		tank.getNemo().position.x = -tank.getWidth()/2+rad;
	}
	else if (tank.getNemo().position.x > tank.getWidth()/2-rad) {
		tank.getNemo().position.x = tank.getWidth()/2-rad;
	}

	// y-boundary
	if (tank.getNemo().position.y < -tank.getHeight()/2+1+rad) {
		tank.getNemo().position.y = -tank.getHeight()/2+1+rad;
	}
	else if (tank.getNemo().position.y > tank.getHeight()/2-2-rad) {
		tank.getNemo().position.y = tank.getHeight()/2-2-rad;
	}

	// z-boundary
	if (tank.getNemo().position.z < -tank.getDepth()/2+rad) {
		tank.getNemo().position.z = -tank.getDepth()/2+rad;
	}
	else if (tank.getNemo().position.z > tank.getDepth()/2-rad) {
		tank.getNemo().position.z = tank.getDepth()/2-rad;
	}
}

// keyboard controls
document.onkeydown = function() {
	const key = event.key;

	if (!isPov && key == 'w') {
		tank.getNemo().position.z -= 0.1;
	}
	else if (!isPov && key == 'a') {
		tank.getNemo().position.x -= 0.1;
	}
	else if (!isPov && key == 's') {
		tank.getNemo().position.z += 0.1;
	}
	else if (!isPov && key == 'd') {
		tank.getNemo().position.x += 0.1;
	}
	else if (!isPov && key == ' ') {
		tank.getNemo().shouldFloat = true;
		tank.getNemo().position.y += 0.1;
	}
}

document.onkeyup = function() {
	tank.getNemo().shouldFloat = false;
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


