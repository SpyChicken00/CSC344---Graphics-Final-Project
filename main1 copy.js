import * as THREE from '../modules/three.module.js';
import { OrbitControls } from '../modules/OrbitControls.js';
import { GUI } from '../modules/dat.gui.module.js';
import { GLTFLoader } from '../modules/GLTFLoader.js';

//TODO Decorations - desklamp, led lights around ceiling
//TODO include our robots in the fish tank / world as easter eggs
//Ian needs to add images from fish + add fish + add tank decorations

// creates the tank class
class Tank extends THREE.Object3D {
	//tank light 
	tanklight = new THREE.PointLight(0xffffff, 40, 100);

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
		const waterM = new THREE.MeshLambertMaterial({
			//color: 0xACEBFF, 
			// light: 0xCFF4FF 
			// medium: 0xACEBFF
			// darker: 0x91E5FF 
			color: 0xC00f4FF,
			opacity: 0.3, 
			transparent: true,
			side: THREE.DoubleSide
		})
		const water = new THREE.Mesh(waterG, waterM);
		water.position.y -= 1;
		this.add(water);

		// positions the tank
		this.position.set(x, y, z);

		// creates the camera fish (nemo)
		this.nemo = new Fish1();
		this.nemo.scale.set(0.1, 0.1, 0.1);
		this.add(this.nemo);

		// tells if nemo is supposed to be floating
		this.nemo.shouldFloat = false;

		// tells if nemo is floating at the same position vertically
		this.nemo.stationaryY = false;

		// tells if nemo's tail should be animated
		this.nemo.shouldTailMove = false;

		// makes the sand for the fish tank
		this.sand = new Sand(this.depth/0.05-2, this.width/0.04-2);
		this.sand.position.set(0, -this.height/2 + 0.04, 0);
		this.add(this.sand);

		// adds a point light
		let dirLight = new THREE.DirectionalLight(0xFFFFFF, 0.5);
		dirLight.position.set(0, 4, 0);
		this.add(dirLight);

		// makes fish1
		this.fish1 = new Fish1();
		this.fish1.scale.set(0.1, 0.1, 0.1);
		this.fish1.position.set(0, -2, 3);
		this.add(this.fish1);

		// makes fish2 #0
		this.fish2 = new Fish2();
		this.fish2.scale.set(0.1, 0.15, 0.15);
		this.fish2.position.set(0, -2, 4);
		this.add(this.fish2);

		// makes fish2 #1
		this.fish21 = new Fish2();
		this.fish21.scale.set(0.1, 0.15, 0.15);
		this.fish21.position.set(0, -3, 2);
		this.add(this.fish21);

		// makes fish2 #2
		this.fish22 = new Fish2();
		this.fish22.scale.set(0.1, 0.15, 0.15);
		this.fish22.position.set(0, -2, 1);
		this.add(this.fish22);

		// makes fish2 #3
		this.fish23 = new Fish2();
		this.fish23.scale.set(0.1, 0.15, 0.15);
		this.fish23.position.set(0, -1, 2);
		this.add(this.fish23);

		// makes a group of jellyfish
		this.jellyGroup = new JellyGroup();
		this.jellyGroup.scale.set(0.25, 0.25, 0.25);
		this.jellyGroup.position.set(-4, -1, -3);
		this.add(this.jellyGroup);
		

		//antlion
		this.antLion = new AntLion();
		this.antLion.scale.set(0.5, 0.5, 0.5);
		this.antLion.position.set(-4.5, -4.5, -3);
		this.add(this.antLion);

		//tank light
		this.tanklight.position.set(0, 0, 0);
		this.add(this.tanklight);

		//sword
		this.swordStone = new SwordStone();
		this.swordStone.scale.set(0.5, 0.5, 0.5);
		this.swordStone.position.set(-5.5, -4.2, 0);
		this.swordStone.rotation.y = -45*Math.PI/180;
		this.add(this.swordStone);

		// makes Patrick's house
		this.patrickHouse = new PatrickHouse();
		this.patrickHouse.scale.set(0.5, 0.5, 0.5);
		this.patrickHouse.position.set(4.5, -4.4, -2);
		this.add(this.patrickHouse);

		// makes Squidward's house
		this.squidwardHouse = new SquidwardHouse();
		this.squidwardHouse.scale.set(0.5, 0.5, 0.5);
		this.squidwardHouse.position.set(6.5, -3.4, -1);
		this.squidwardHouse.rotation.y = -20*Math.PI/180;
		this.add(this.squidwardHouse);


		this.vent = new Vent();
		this.vent.scale.set(0.5, 0.5, 0.5)
		this.vent.position.y -= 3.7;
		this.vent.position.x -= 2.8;
		this.add(this.vent);

		this.vent2 = new Vent();
		this.vent2.scale.set(0.7, 0.7, 0.7)
		this.vent2.position.y -= 3.9;
		this.vent2.position.x += 8;
		this.vent2.position.z += 3;
		this.add(this.vent2);

		this.vent3 = new Vent();
		this.vent3.scale.set(0.4, 0.4, 0.4)
		this.vent3.position.y -= 2.5;
		this.vent3.position.x -= 0;
		this.vent3.position.z -= 4;
		this.add(this.vent3);


		//"Coral" (https://sketchfab.com/3d-models/coral-c26e47859f0945d69a4e2944ee80b995) by Sandra_s
		const loader = new GLTFLoader();
		loader.load('../3dModels/coral.gltf', function (gltf) {
			var coral = gltf.scene;
			coral.position.set(8.4, 11.5, 20);
			coral.scale.set(0.25, 0.25, 0.25);
			scene.add(coral);
		}, undefined, function(error) {
			console.error(error);
		});

		//"수조 인테리어 돌 어항 바위 / Fish tank Rock" 
		//(https://sketchfab.com/3d-models/fish-tank-rock-84d48cabb7f8441a9c8121b31a3da73d) by Spark Studio
		loader.load('../3dModels/rock.glb', function (gltf) {
			var rock = gltf.scene;
			rock.position.set(-59, -46.5, -32);
			rock.scale.set(20, 20, 20);
			var rockGroup = new THREE.Group();
			rockGroup.add(rock);
			//rockGroup.rotation.y += -45 * Math.PI/180;
			//rock.rotation.y += 45 * Math.PI/180;

			scene.add(rockGroup);
		}, undefined, function(error) {
			console.error(error);
		});

		//"수조 인테리어 돌 어항 바위 / Fish tank Rock" 
		//(https://sketchfab.com/3d-models/fish-tank-rock-84d48cabb7f8441a9c8121b31a3da73d) by Spark Studio
		loader.load('../3dModels/rock.glb', function (gltf) {
			var rock2 = gltf.scene;
			rock2.scale.set(25, 25, 30); //25
			rock2.position.set(106, -61, 93);// 81
			rock2.rotation.y += 180*Math.PI/180;
			scene.add(rock2)
		}, undefined, function(error) {
			console.error(error);
		});

		//"Corals by Rayaa" (https://sketchfab.com/3d-models/corals-by-rayaa-8e1e9eec16094494967b9a6d731cde3b) by Rayaa
		loader.load('../3dModels/scene.gltf', function (gltf) {
			var coral2 = gltf.scene;
			//rocks.position.set(15, 11.5, 20);
			//rocks.scale.set(0.25, 0.25, 0.25);
			coral2.position.set(18, 11.5, 25)
			//rocks.material = rockMaterial;
			coral2.scale.set(10, 10, 10);
			scene.add(coral2);
		}, undefined, function(error) {
			console.error(error);
		});

		//seaweed2
		//https://sketchfab.com/3d-models/seaweed-2-93840cff90094924a6383448e8528375 by lyningsknallis
		loader.load('../3dModels/seaweed_2.glb', function (gltf) {
			var seaweed = gltf.scene;
			//rock2.scale.set(25, 25, 30); //25
			//rock2.position.set(106, -61, 93);// 81
			seaweed.scale.set(0.025, 0.025, 0.025)
			seaweed.position.set(22, 11.5,20.5)
			scene.add(seaweed)	
			
		}, undefined, function(error) {
			console.error(error);
		});

		//seaweed2
		//https://sketchfab.com/3d-models/seaweed-2-93840cff90094924a6383448e8528375 by lyningsknallis
		loader.load('../3dModels/seaweed_2.glb', function (gltf) {
			var seaweed = gltf.scene;
			//rock2.scale.set(25, 25, 30); //25
			//rock2.position.set(106, -61, 93);// 81
			seaweed.scale.set(0.010, 0.010, 0.010)
			seaweed.position.set(14, 10.8,27)
			scene.add(seaweed)	
			
		}, undefined, function(error) {
			console.error(error);
		});

		
		//seaweed2
		//https://sketchfab.com/3d-models/seaweed-2-93840cff90094924a6383448e8528375 by lyningsknallis
		loader.load('../3dModels/seaweed_2.glb', function (gltf) {
			var seaweed = gltf.scene;
			//rock2.scale.set(25, 25, 30); //25
			//rock2.position.set(106, -61, 93);// 81
			seaweed.scale.set(0.010, 0.010, 0.010)
			seaweed.position.set(17.2, 11,24)
			scene.add(seaweed)	
			
		}, undefined, function(error) {
			console.error(error);
		});

		//seaweed2
		//https://sketchfab.com/3d-models/seaweed-2-93840cff90094924a6383448e8528375 by lyningsknallis
		loader.load('../3dModels/seaweed_2.glb', function (gltf) {
			var seaweed = gltf.scene;
			//rock2.scale.set(25, 25, 30); //25
			//rock2.position.set(106, -61, 93);// 81
			seaweed.scale.set(0.010, 0.010, 0.010)
			seaweed.position.set(19.1, 10.9,26.5)
			scene.add(seaweed)	
			
		}, undefined, function(error) {
			console.error(error);
		});

		//seaweed2
		//https://sketchfab.com/3d-models/seaweed-2-93840cff90094924a6383448e8528375 by lyningsknallis
		loader.load('../3dModels/seaweed_2.glb', function (gltf) {
			var seaweed = gltf.scene;
			//rock2.scale.set(25, 25, 30); //25
			//rock2.position.set(106, -61, 93);// 81
			seaweed.scale.set(0.010, 0.010, 0.010)
			seaweed.position.set(10, 11.1,26)
			scene.add(seaweed)	
			
		}, undefined, function(error) {
			console.error(error);
		});

		//TODO 2 more seaweed 2's (different sizes)

		//purple seaweed
		//https://sketchfab.com/3d-models/seaweed-asset-5444487c06d647dfab90960142b9edc2   by mehgap
		loader.load('../3dModels/seaweed_asset.glb', function (gltf) {
			var seaweed = gltf.scene;
			//rock2.scale.set(25, 25, 30); //25
			//rock2.position.set(106, -61, 93);// 81
			seaweed.scale.set(4, 2, 4)
			seaweed.position.set (8, 13.4, 25)
			scene.add(seaweed)	
		}, undefined, function(error) {
			console.error(error);
		});


		//pineapple
		//https://sketchfab.com/3d-models/pineapple-3debe241ac7e401aa36ae944daa1708e by Lassi Kaukonen
		loader.load('../3dModels/pineapple.glb', function (gltf) {
			var pineapple = gltf.scene;
			pineapple.scale.set(1, 1, 1)
			pineapple.position.set(23,11,23)
			scene.add(pineapple)	
		}, undefined, function(error) {
			console.error(error);
		});



		//more seaweed
		//https://sketchfab.com/3d-models/seaweed-dec5b256a37f40acb63b0bf30b45d756   by OwenCalingasan
		loader.load('../3dModels/sea_weed.glb', function (gltf) {
			var seaweed = gltf.scene;
			seaweed.scale.set(0.8, 0.8, 0.8)
			seaweed.position.set(15.2, 11.3, 24)
			scene.add(seaweed)	
		}, undefined, function(error) {
			console.error(error);
		});

		//more seaweed
		//https://sketchfab.com/3d-models/seaweed-dec5b256a37f40acb63b0bf30b45d756   by OwenCalingasan
		loader.load('../3dModels/sea_weed.glb', function (gltf) {
			var seaweed = gltf.scene;
			seaweed.scale.set(0.8, 0.8, 0.8)
			seaweed.position.set(12.4, 11.4, 27)
			scene.add(seaweed)	
		}, undefined, function(error) {
			console.error(error);
		});

		//more seaweed
		//https://sketchfab.com/3d-models/seaweed-dec5b256a37f40acb63b0bf30b45d756   by OwenCalingasan
		loader.load('../3dModels/sea_weed.glb', function (gltf) {
			var seaweed = gltf.scene;
			seaweed.scale.set(0.7, 0.7, 0.7)
			seaweed.position.set(17.1, 11.2, 27)
			scene.add(seaweed)	
		}, undefined, function(error) {
			console.error(error);
		});

		//more seaweed
		//https://sketchfab.com/3d-models/seaweed-dec5b256a37f40acb63b0bf30b45d756   by OwenCalingasan
		loader.load('../3dModels/sea_weed.glb', function (gltf) {
			var seaweed = gltf.scene;
			seaweed.scale.set(0.6, 0.6, 0.6)
			seaweed.position.set(19.6, 11, 24.5)
			seaweed.rotation.y += 90*Math.PI/180;
			scene.add(seaweed)	
			var mixer = new THREE.AnimationMixer(gltf.scene);
			gltf.animations.forEach( (clip) => {
				mixer.clipAction(clip).play();
			});
			}, undefined, function(error) {
			console.error(error);
			});


		
		//sunken ship
		//https://sketchfab.com/3d-models/sunken-shipwreck-2326266a1f3f4b4db76da807f824f76e by DogOnAKeyboard
		loader.load('../3dModels/sunken_shipwreck.glb', function (gltf) {
			var seaweed = gltf.scene;
			seaweed.scale.set(0.009, 0.009, 0.009)
			//seaweed.position.set(19.6, 11, 24.5)
			seaweed.position.y += 11.3;
			seaweed.position.z += 26.5
			seaweed.position.x += 21;
			seaweed.rotation.y += 160*Math.PI/180;
			scene.add(seaweed)	
		}, undefined, function(error) {
			console.error(error);
		});




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

	getAntLion() {
		return this.antLion;
	}

	getNemoSize() {
		return new THREE.Box3().setFromObject(this.nemo).getSize(new THREE.Vector3());
	}

	sandOscillation() {
		this.sand.oscillation();
	}

	patrickAnimation() {
		this.patrickHouse.animation();
	}

	fishMovement() {
		this.fish2.movement();
		this.fish21.movement();
		this.fish22.movement();
		this.fish23.movement();
		this.fish1.movement();
		this.jellyGroup.movement();
	}

	getTankLight() {
		return this.tanklight;
	}

	getVent() {
		return this.vent;
	}

	getVent2() {
		return this.vent2;
	}

	getVent3() {	
		return this.vent3;
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

		// constructs the sand
		this.oscillation();
	}

	oscillation() {
		// makes a position array
		const positions = [];

		// makes a color array
		const colors = [];

		// makes the sand material
		const sandM = new THREE.PointsMaterial({
			color: 0xe8d17e,
			size: 0.1,
		})
		
		// push all the pixels with the oscillating drape on the top
		// then straight surfaces on the sides and bottom
		for (let ix = -this.AMOUNTX/2; ix < this.AMOUNTX/2; ix++) {
			for (let iz = 0; iz < this.AMOUNTZ; iz++) { 
				let x = ix * 0.05;
				let y = (Math.cos((iz + this.count) * 0.075) * 0.1) + 0.1;
				let z = -(iz * 0.04 - ((this.AMOUNTZ * 0.04) / 2));

				// calculates the coordinates for the top drape
				// and adds them to the array
				positions.push(x);
				positions.push(y);
				positions.push(z);

				// sides
				if (ix == -this.AMOUNTX/2 || ix == this.AMOUNTX/2-1 || iz == 0 || iz == this.AMOUNTZ-1) {
					for (let iy = y - 0.05; iy >= 0; iy -= 0.05) {
						positions.push(x);
						positions.push(iy);
						positions.push(z);
					}
				}

				// bottom
				positions.push(x);
				positions.push(0);
				positions.push(z);

				for (let i = 0; i < 3; i++) {
					colors.push(Math.floor((Math.random() * 105) + 150), Math.floor((Math.random() * 105) + 150), Math.floor((Math.random() * 105) + 150));
				}
			}
		}

		// replaces the sand geometry every time
		this.clear();

		// creates a particle system 
		const sandG = new THREE.BufferGeometry();
		sandG.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
		sandG.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
		this.sand = new THREE.Points(sandG, sandM);
		this.sand.rotation.y = 90 * Math.PI/180;
		this.add(this.sand);

		// increases the count to make the oscillation work
		this.count += 1;
	}
}

const material1 = new THREE.MeshPhongMaterial({ color: 0xFFB406, flatShading: false });
const material2 = new THREE.MeshPhongMaterial({ color: 0xFFFFFF, flatShading: false });
const material3 = new THREE.MeshPhongMaterial({ color: 0x000000, flatShading: false });
const material4 = new THREE.MeshPhongMaterial({ color: 0xBE4321, flatShading: false });
const material5 = new THREE.MeshPhongMaterial({ color: 0xBE4321, flatShading: false });
const material6 = new THREE.MeshPhongMaterial({ color: 0x9B9B9B, flatShading: false });
const material7 = new THREE.MeshPhongMaterial({ color: 0x2F8899, transparent: true, opacity: 0.5, flatShading: false, side: THREE.DoubleSide });
const material8 = new THREE.MeshPhongMaterial({ color: 0x7CEAFF, transparent: false, opacity: .95, flatShading: false, side: THREE.DoubleSide });
const material9 = new THREE.MeshPhongMaterial({ color: 0x585858, flatShading: false });
const material10 = new THREE.MeshPhongMaterial({ color: 0xCCCCCC, flatShading: false });
const material11 = new THREE.MeshPhongMaterial({ color: 0x6F4521, flatShading: false });
const material12 = new THREE.MeshPhongMaterial({ color: 0x6C6C6C, flatShading: false });
const material13 = new THREE.MeshPhongMaterial({ color: 0xD0C347, emissive: 0xe8d17e, flatShading: false });
const material14 = new THREE.MeshPhongMaterial({ color: 0x61729C, flatShading: false });
const material15 = new THREE.MeshPhongMaterial({ color: 0x8FB1ED, flatShading: false });
const material16 = new THREE.MeshPhongMaterial({ color: 0xAC762D, flatShading: false });
const material17 = new THREE.MeshPhongMaterial({ color: 0xAF650E, flatShading: false });
const material18 = new THREE.MeshPhongMaterial({ color: 0xB60000, flatShading: false });
const material19 = new THREE.MeshPhongMaterial({ color: 0xC7EBFC, transparent: true, opacity: .35, flatShading: false, side: THREE.DoubleSide   });

const textureLoader1 = new THREE.TextureLoader();
const redScalesTexture = textureLoader1.load('../pictures/redScales.jpeg');
const redScalesMaterial = new THREE.MeshBasicMaterial({color: 0x999999,map: redScalesTexture });

const textureLoader2 = new THREE.TextureLoader();
const blueGemTexture = textureLoader2.load('../pictures/blueGem.jpeg');
const blueGemMaterial = new THREE.MeshBasicMaterial({color: 0x999999, map: blueGemTexture });

const textureLoader3 = new THREE.TextureLoader();
const rockTexture = textureLoader2.load('../pictures/rockTxtr.png');
const rockMaterial = new THREE.MeshBasicMaterial({color: 0x7777777, map: rockTexture });

const textureLoader4 = new THREE.TextureLoader();
const squidHouseTexture = textureLoader4.load('../pictures/squidwardTexture.png');
const squidHouseMaterial = new THREE.MeshBasicMaterial({ 
	color: 0x29599c,
	map: squidHouseTexture 
});

const textureLoader5 = new THREE.TextureLoader();
const pSoupTexture = textureLoader5.load('../pictures/primordialSoup.jpeg');
const pSoupMaterial = new THREE.MeshBasicMaterial({ map: pSoupTexture });

class Fish1 extends THREE.Object3D {
	constructor() {
	  super();

	  // holds if the fish should be moving forwards from its original direction
	  this.moveForward = Math.random() < 0.5;

	  // holds if the tail should rotate in the positive direction or not
	  this.tailRPos = this.moveForward;

	  // holds what the fish should be rotated to
	  if (this.moveForward == true) this.desiredRotation = 0;
	  else this.desiredRotation = Math.PI;
	
	  // holds the speed the fish should move at
	  this.speed = Math.random() * 0.015 + 0.03;

	  //head
	  {
	  var mainHead = new THREE.CylinderGeometry(2, 2.5, 2, 32);
	  var mainHeadMesh = new THREE.Mesh(mainHead, material1);
	  mainHeadMesh.rotation.z =  Math.PI / 2;
	  this.add(mainHeadMesh);
  
	  var frontHead = new THREE.SphereGeometry(2,32,32);
	  var frontHeadMesh = new THREE.Mesh(frontHead, material1);
	  frontHeadMesh.position.x = -.75;
	  this.add(frontHeadMesh);
	  }
	  //eyes
	  {
	  var eye1 = new THREE.SphereGeometry(.5,32,32);
	  var eye1Mesh = new THREE.Mesh(eye1, material3);
	  eye1Mesh.position.x = -2.3;
	  eye1Mesh.position.z = -1
	  eye1Mesh.position.y = .5;
	  this.add(eye1Mesh);
  
	  var eye2 = new THREE.SphereGeometry(.5,32,32);
	  var eye2Mesh = new THREE.Mesh(eye1, material3);
	  eye2Mesh.position.x = -2.3;
	  eye2Mesh.position.z = 1
	  eye2Mesh.position.y = .5;
	  this.add(eye2Mesh);
	  }
	  //mouth
	  {
	  var mouth = new THREE.BoxGeometry(1,.1,1);
	  var mouthMesh = new THREE.Mesh(mouth, material3);
	  mouthMesh.position.x = -2.25;
	  this.add(mouthMesh);
	  }
	  //body
	  {
	  var body1 = new THREE.CylinderGeometry(2.5,2.5, 1, 32);
	  var body1Mesh = new THREE.Mesh(body1, material2);
	  body1Mesh.rotation.z = Math.PI / 2;
	  body1Mesh.position.x = 1.5;
	  this.add(body1Mesh);
  
	  var body2 = new THREE.CylinderGeometry(2.5,2.5, 1.5, 32);
	  var body2Mesh = new THREE.Mesh(body2, material1);
	  body2Mesh.rotation.z = Math.PI / 2;
	  body2Mesh.position.x = 2.75;
	  this.add(body2Mesh);
  
	  var body3 = new THREE.CylinderGeometry(2.5,2.5, 1, 32);
	  var body3Mesh = new THREE.Mesh(body3, material2);
	  body3Mesh.rotation.z = Math.PI / 2;
	  body3Mesh.position.x = 4;
	  this.add(body3Mesh);
  
	  var body4 = new THREE.CylinderGeometry(2.5, 1, 2, 32);
	  var body4Mesh = new THREE.Mesh(body4, material1);
	  body4Mesh.rotation.z = Math.PI / 2;
	  body4Mesh.position.x = 5.5;
	  this.add(body4Mesh);
  
	  //fins
	  var topFin = new THREE.BoxGeometry(2,2,.2);
	  var topFinMesh = new THREE.Mesh(topFin, material1);
	  topFinMesh.position.y = 2;
	  topFinMesh.position.x = 0;
	  topFinMesh.rotation.z = (15 * Math.PI) / 180;
	  this.add(topFinMesh);
  
	  var leftFin = new THREE.BoxGeometry(1,.3,1.5);
	  var leftFinMesh = new THREE.Mesh(leftFin, material1);
	  leftFinMesh.position.z = 2.70;
	  leftFinMesh.rotation.x = (15 * Math.PI) / 180;
	  this.add(leftFinMesh);
  
	  var rightFin = new THREE.BoxGeometry(1,.3,1.5);
	  var rightFinMesh = new THREE.Mesh(leftFin, material1);
	  rightFinMesh.position.z = -2.70;
	  rightFinMesh.rotation.x = (-15 * Math.PI) / 180;
	  this.add(rightFinMesh);
  
	  var tailFin1 = new THREE.BoxGeometry(1,3.5,.2);
	  this.tailFin1Mesh = new THREE.Mesh(tailFin1, material1);
	  this.tailFin1Mesh.position.x = 7.4;
	  this.add(this.tailFin1Mesh);
  
	  var tailFin2 = new THREE.BoxGeometry(1,3.5,.2);
	  this.tailFin2Mesh = new THREE.Mesh(tailFin2, material1);
	  this.tailFin2Mesh.position.x = 7.4;
	  this.tailFin2Mesh.rotation.x = (90 * Math.PI) / 180;
	  this.add(this.tailFin2Mesh);
  
  
	  var jet = new THREE.CylinderGeometry(.2, .2, 2, 32);
	  var jetMesh = new THREE.Mesh(jet, material6);
	  jetMesh.position.y = -.02;
	  jetMesh.position.x = 7;
	  jetMesh.rotation.z = (90 * Math.PI) / 180;
	  this.add(jetMesh);
  
	  var windUp = new THREE.CylinderGeometry(.2, .2, 2, 32);
	  var windUpMesh = new THREE.Mesh(windUp, material6);
	  windUpMesh.position.y = 3.5;
	  windUpMesh.position.x = 3;
	  this.add(windUpMesh);
  
	  var handle = new THREE.BoxGeometry(1.5,1,.1);
	  this.handleMesh = new THREE.Mesh(handle, material6);
	  this.handleMesh.position.y = 4;
	  this.handleMesh.position.x = 3;
	  this.add(this.handleMesh);
  
	  }
	}

	movement() {
		// makes the tail swing back and forth
		this.tailAnimation();

		// checks if its at one of the sides of the tank
		if (this.position.x < -tank.getWidth()/2 + 1) {
			this.moveForward = false;
			this.desiredRotation = Math.PI;
		}
		else if (this.position.x > tank.getWidth()/2 - 1) {
			this.moveForward = true;
			this.desiredRotation = 0;
		}

		// once it reaches one side of the tank, turns 180 degrees
		this.turn();

		// repeatedly moves to the other side of the tank then back
		if (this.moveForward) {
			this.position.x -= this.speed;
		}
		else {
			this.position.x += this.speed;
		}
	}

	turn() {
		// rotates until it reaches its desired rotation
		if (this.rotation.y < this.desiredRotation - 5*Math.PI/180) {
			this.rotation.y += 20*Math.PI/180;
		}
		else if (this.rotation.y > this.desiredRotation + 5*Math.PI/180) {
			this.rotation.y -= 20*Math.PI/180;
		}
	}

	propellerAnimation(amount) {
		this.handleMesh.rotation.y += amount*Math.PI/180;
	}

	tailAnimation() {
		this.tailFin1Mesh.rotation.x += 10*Math.PI/180;
		this.tailFin2Mesh.rotation.x += 10*Math.PI/180;
	}
  }


class Fish2 extends THREE.Object3D{
	constructor(){
	  super();

	  // holds if the fish should be moving forwards from its original direction
	  this.moveForward = Math.random() < 0.5;

	  // holds if the tail should rotate in the positive direction or not
	  this.tailRPos = this.moveForward;

	  // holds what the fish should be rotated to
	  if (this.moveForward == true) this.desiredRotation = 0;
	  else this.desiredRotation = Math.PI;
	
	  // holds the speed the fish should move at
	  this.speed = Math.random() * 0.015 + 0.03;

	  //body
	  {
	  var topBody = new THREE.CylinderGeometry(1, 1, 8, 32);
	  var topBodyMesh = new THREE.Mesh(topBody, redScalesMaterial);
	  topBodyMesh.rotation.z = (90 * Math.PI) / 180;
	  topBodyMesh.position.x = 1;
	  this.add(topBodyMesh);
  
	  var midBody = new THREE.BoxGeometry(6,1,2);
	  var midBodyMesh = new THREE.Mesh(midBody, redScalesMaterial);
	  midBodyMesh.position.y = -.5;
	  this.add(midBodyMesh);
  
	  var backBody = new THREE.CylinderGeometry(1, 1, 2.5, 32);
	  var backBodyMesh = new THREE.Mesh(backBody, redScalesMaterial);
	  backBodyMesh.rotation.z = (105 * Math.PI) / 180;
	  backBodyMesh.position.x = 4;
	  backBodyMesh.position.y = -.65;
  
	  this.add(backBodyMesh);
  
	  var bottomBody = new THREE.CylinderGeometry(1, 1, 6, 32);
	  var bottomBodyMesh = new THREE.Mesh(bottomBody, redScalesMaterial);
	  bottomBodyMesh.position.y = -1;
	  bottomBodyMesh.rotation.z = (90 * Math.PI) / 180;
	  this.add(bottomBodyMesh);
  
	  var backSphere = new THREE.SphereGeometry(1, 32, 32);
	  var backSphereMesh = new THREE.Mesh(backSphere, redScalesMaterial);
	  backSphereMesh.position.x = 5;
	  backSphereMesh.position.y = -.2;
	  this.add(backSphereMesh);
	  }
	  //head
	  {
	  var topHead = new THREE.CylinderGeometry(.75, .96, 2, 32);
	  var topHeadMesh = new THREE.Mesh(topHead, redScalesMaterial);
	  topHeadMesh.position.x = -3.6;
	  topHeadMesh.position.y = -.1;
	  topHeadMesh.rotation.z = (100 * Math.PI) / 180;
	  this.add(topHeadMesh);
  
	  var bottomHead = new THREE.CylinderGeometry(.75, .96, 2, 32);
	  var bottomHeadMesh = new THREE.Mesh(bottomHead, redScalesMaterial);
	  bottomHeadMesh.position.x = -3.6;
	  bottomHeadMesh.position.y = -.9;
	  bottomHeadMesh.rotation.z = (80 * Math.PI) / 180;
	  this.add(bottomHeadMesh);
  
	  var midHead = new THREE.CylinderGeometry(.90, 1, 2, 32);
	  var midHeadMesh = new THREE.Mesh(midHead, redScalesMaterial);
	  midHeadMesh.position.x = -3.6;
	  midHeadMesh.rotation.z = (90 * Math.PI) / 180;
	  midHeadMesh.position.y = -.5;
	  this.add(midHeadMesh);
  
	  var headSphere = new THREE.SphereGeometry(.90,32,32);
	  var headSphereMesh = new THREE.Mesh(headSphere, redScalesMaterial);
	  headSphereMesh.position.x = -4.6;
	  headSphereMesh.position.y = -.5;
	  this.add(headSphereMesh);
	  }
	  //eye
	  {
	  var leftEye = new THREE.SphereGeometry(.15, 32, 32);
	  var leftEyeMesh = new THREE.Mesh(leftEye, material3);
	  leftEyeMesh.position.x = -5;
	  leftEyeMesh.position.z = -.7;
	  this.add(leftEyeMesh);
  
	  var rightEye = new THREE.SphereGeometry(.15, 32, 32);
	  var rightEyeMesh = new THREE.Mesh(rightEye, material3);
	  rightEyeMesh.position.x = -5;
	  rightEyeMesh.position.z = .7;
	  this.add(rightEyeMesh);
  
	  var mouth = new THREE.SphereGeometry(.15, 32, 32);
	  var mouthMesh = new THREE.Mesh(mouth, material3);
	  mouthMesh.position.x = -5.38;
	  mouthMesh.position.y = -.5;
	  this.add(mouthMesh);
	  }
	  //fins
	  {
	  var topFinFront = new THREE.BoxGeometry(2,2,.1);
	  var topFinFrontMesh = new THREE.Mesh(topFinFront, blueGemMaterial);
	  topFinFrontMesh.position.x = -1;
	  topFinFrontMesh.position.y = 1;
	  topFinFrontMesh.rotation.z = (45 * Math.PI) / 180;
	  this.add(topFinFrontMesh);
  
	  var leftFin1 = new THREE.BoxGeometry(1,.1,1);
	  var leftFin1Mesh = new THREE.Mesh(leftFin1, blueGemMaterial);
	  leftFin1Mesh.position.z = 1.1;
	  leftFin1Mesh.position.y = -.5;
	  leftFin1Mesh.position.x = -2;
	  leftFin1Mesh.rotation.y = (45 * Math.PI) / 180;
	  leftFin1Mesh.rotation.x = (45 * Math.PI) / 180;
	  this.add(leftFin1Mesh);
  
	  var rightFin1 = new THREE.BoxGeometry(1,.1,1);
	  var rightFin1Mesh = new THREE.Mesh(rightFin1, blueGemMaterial);
	  rightFin1Mesh.position.z = -1.1;
	  rightFin1Mesh.position.y = -.5;
	  rightFin1Mesh.position.x = -2;
	  rightFin1Mesh.rotation.y = (-45 * Math.PI) / 180;
	  rightFin1Mesh.rotation.x = (-45 * Math.PI) / 180;
	  this.add(rightFin1Mesh);
  
	  var leftFin2 = new THREE.BoxGeometry(3,.1,3);
	  var leftFin2Mesh = new THREE.Mesh(leftFin2, blueGemMaterial);
	  leftFin2Mesh.position.z = 1.1;
	  leftFin2Mesh.position.y = -.2;
	  leftFin2Mesh.position.x = -1;
	  leftFin2Mesh.rotation.y = (45 * Math.PI) / 180;
	  leftFin2Mesh.rotation.x = (-20 * Math.PI) / 180;
	  this.add(leftFin2Mesh);
  
	  var rightFin2 = new THREE.BoxGeometry(3,.1, 3);
	  var rightFin2Mesh = new THREE.Mesh(rightFin2, blueGemMaterial);
	  rightFin2Mesh.position.z = -1.1;
	  rightFin2Mesh.position.y = -.2;
	  rightFin2Mesh.position.x = -1;
	  rightFin2Mesh.rotation.y = (-45 * Math.PI) / 180;
	  rightFin2Mesh.rotation.x = (20 * Math.PI) / 180;
	  this.add(rightFin2Mesh);
  
	  var leftFin3 = new THREE.BoxGeometry(1,.1,1);
	  var leftFin3Mesh = new THREE.Mesh(leftFin3, blueGemMaterial);
	  leftFin3Mesh.position.z = 1.1;
	  leftFin3Mesh.position.y = -.5;
	  leftFin3Mesh.position.x = 0;
	  leftFin3Mesh.rotation.y = (45 * Math.PI) / 180;
	  leftFin3Mesh.rotation.x = (45 * Math.PI) / 180;
	  this.add(leftFin3Mesh);
  
	  var rightFin3 = new THREE.BoxGeometry(1,.1,1);
	  var rightFin3Mesh = new THREE.Mesh(rightFin3, blueGemMaterial);
	  rightFin3Mesh.position.z = -1.1;
	  rightFin3Mesh.position.y = -.5;
	  rightFin3Mesh.position.x = 0;
	  rightFin3Mesh.rotation.y = (-45 * Math.PI) / 180;
	  rightFin3Mesh.rotation.x = (-45 * Math.PI) / 180;
	  this.add(rightFin3Mesh);

	  this.tail = new THREE.Object3D();
  
	  var tailFin1 = new THREE.BoxGeometry(2,.8,.1);
	  var tailFin1Mesh = new THREE.Mesh(tailFin1, blueGemMaterial);
	  tailFin1Mesh.position.y = .5;
	  tailFin1Mesh.rotation.z = (45 * Math.PI) / 180;
	  this.tail.add(tailFin1Mesh);
  
	  var tailFin2 = new THREE.BoxGeometry(2,.8,.1);
	  var tailFinMesh2 = new THREE.Mesh(tailFin2, blueGemMaterial);
	  tailFinMesh2.position.y = -.5;
	  tailFinMesh2.rotation.z = (-45 * Math.PI) / 180;
	  this.tail.add(tailFinMesh2);
  
	  var tailFin3 = new THREE.BoxGeometry(1,.4,.1);
	  var tailFinMesh3 = new THREE.Mesh(tailFin3, blueGemMaterial);
	  tailFinMesh3.position.x = 1;
	  tailFinMesh3.position.y = -.65;
	  tailFinMesh3.rotation.z = (45 * Math.PI) / 180;
	  this.tail.add(tailFinMesh3);
  
	  var tailFin4 = new THREE.BoxGeometry(1,.8,.1);
	  var tailFinMesh4 = new THREE.Mesh(tailFin4, blueGemMaterial);
	  tailFinMesh4.position.x = 1;
	  tailFinMesh4.position.y = 1.1;
	  this.tail.add(tailFinMesh4);

	  this.tail.position.x = 6;
	  this.add(this.tail);
	  }
	}

	movement() {
		// makes the tail swing back and forth
		this.animateTail();

		// checks if its at one of the sides of the tank
		if (this.position.x < -tank.getWidth()/2 + 1) {
			this.moveForward = false;
			this.desiredRotation = Math.PI;
		}
		else if (this.position.x > tank.getWidth()/2 - 1) {
			this.moveForward = true;
			this.desiredRotation = 0;
		}

		// once it reaches one side of the tank, turns 180 degrees
		this.turn();

		// repeatedly moves to the other side of the tank then back
		if (this.moveForward) {
			this.position.x -= this.speed;
		}
		else {
			this.position.x += this.speed;
		}
	}

	turn() {
		// rotates until it reaches its desired rotation
		if (this.rotation.y < this.desiredRotation - 5*Math.PI/180) {
			this.rotation.y += 20*Math.PI/180;
		}
		else if (this.rotation.y > this.desiredRotation + 5*Math.PI/180) {
			this.rotation.y -= 20*Math.PI/180;
		}
	}

	animateTail() {
		// tells if the tail should start rotating in the other direction
		if (this.tail.rotation.y > 30*Math.PI/180) {
			this.tailRPos = false;
		}
		else if (this.tail.rotation.y < -30*Math.PI/180) {
			this.tailRPos = true;
		}

		// makes the tail rotate
		if (this.tailRPos) {
			this.tail.rotation.y += 5*Math.PI/180;
		}
		else {
			this.tail.rotation.y -= 5*Math.PI/180;
		}
	}
  }
  
class Fish3 extends THREE.Object3D{
	  constructor(){
		super();
		//body
		{
		var phiStart = 0;
		var phiEnd = Math.PI * 2;
		var thetaStart = 0;
		var thetaEnd = Math.PI / 2;
  
		var body1 = new THREE.SphereGeometry( 2, 32, 16, phiStart, phiEnd, thetaStart, thetaEnd );
		this.body1Mesh = new THREE.Mesh( body1, material7 );
		this.add(this.body1Mesh);
  
		var body2 = new THREE.SphereGeometry( 1.5, 32, 16, phiStart, phiEnd, thetaStart, thetaEnd );
		var body2Mesh = new THREE.Mesh(body2, material8 );
		this.add(body2Mesh);
		}
		//arms
		{
		  var arm1 = new THREE.BoxGeometry(1.3,1.5,1.3);
		  this.arm1Mesh = new THREE.Mesh(arm1, material7);
		  this.add(this.arm1Mesh);
  
		  var arm2 = new THREE.BoxGeometry(1,3,.01);
		  this.arm2Mesh = new THREE.Mesh(arm2, material7);
		  this.add(this.arm2Mesh);
  
		  var arm3 = new THREE.BoxGeometry(1,3,.01);
		  this.arm3Mesh = new THREE.Mesh(arm3, material7);
		  this.arm3Mesh.rotation.y = (90 * Math.PI) / 180;
		  this.add(this.arm3Mesh);
		}
	  }

	  transparent() {
		this.body1Mesh.material.transparent = true;
		this.arm1Mesh.material.transparent = true;
		this.arm2Mesh.material.transparent = true;
		this.arm3Mesh.material.transparent = true;

		this.body1Mesh.material.opacity = 0.5;
		this.arm1Mesh.material.opacity = 0.5;
		this.arm2Mesh.material.opacity = 0.5;
		this.arm3Mesh.material.opacity = 0.5;
	  }

	  untransparent() {
		this.body1Mesh.material.transparent = false;
		this.arm1Mesh.material.transparent = false;
		this.arm2Mesh.material.transparent = false;
		this.arm3Mesh.material.transparent = false;

		this.body1Mesh.material.opacity = 1;
		this.arm1Mesh.material.opacity = 1;
		this.arm2Mesh.material.opacity = 1;
		this.arm3Mesh.material.opacity = 1;
	  }
  }
  
class JellyGroup extends THREE.Object3D{
	constructor(){
	  super();

	  // tells if the jellyfish should move up
	  this.moveUp = true;
  
	  this.jelly1 = new Fish3;
	  this.add(this.jelly1);
  
	  this.jelly2 = new Fish3;
	  this.jelly2.position.x = 2;
	  this.jelly2.position.y = 3;
	  this.add(this.jelly2);
  
	  this.jelly3 = new Fish3;
	  this.jelly3.position.x = 4;
	  this.jelly3.position.z = 3;
	  this.add(this.jelly3);
  
	  this.jelly4 = new Fish3;
	  this.jelly4.position.x = -2;
	  this.jelly4.position.y = -2;
	  this.jelly4.position.z = -3;
	  this.add(this.jelly4);
  
	  this.jelly5 = new Fish3;
	  this.jelly5.position.x = -4;
	  this.add(this.jelly5);
	}
  
	movement() {
		if (this.position.y > 1) {
			this.moveUp = false;
		}
		else if (this.position.y < -1) {
			this.moveUp = true;
		}

		if (this.moveUp) {
			this.position.y += 0.005;
		}
		else {
			this.position.y -= 0.005;
		}
	}
  
	transparent() {
		this.jelly1.transparent();
		this.jelly2.transparent();
		this.jelly3.transparent();
		this.jelly4.transparent();
		this.jelly5.transparent();
	}

	untransparent() {
		this.jelly1.untransparent();
		this.jelly2.untransparent();
		this.jelly3.untransparent();
		this.jelly4.untransparent();
		this.jelly5.untransparent();
	}
  }
  
class SwordStone extends THREE.Object3D{
	constructor(){
	  super();
  
	  var stone1 = new THREE.BoxGeometry(3,1,3);
	  var stone1Mesh = new THREE.Mesh(stone1, material9);
	  this.add(stone1Mesh);
  
	  var stone2 = new THREE.BoxGeometry(2,1,2);
	  var stone2Mesh = new THREE.Mesh(stone2, material9);
	  stone2Mesh.position.y = .5;
	  this.add(stone2Mesh);
  
	  var sword = new THREE.BoxGeometry(.2,4,.5);
	  var swordMesh = new THREE.Mesh(sword, material10);
	  swordMesh.position.y = 2;
	  this.add(swordMesh);
  
	  var sword2 = new THREE.BoxGeometry(.3,4,.1);
	  var sword2Mesh = new THREE.Mesh(sword2, material12);
	  sword2Mesh.position.y = 2;
	  this.add(sword2Mesh);
  
	  var handle = new THREE.BoxGeometry(.5,.3,1.5);
	  var handleMesh = new THREE.Mesh(handle, material11);
	  handleMesh.position.y = 4;
	  this.add(handleMesh);
  
	  var handle2 = new THREE.BoxGeometry(.3,.75,.3);
	  var handle2Mesh = new THREE.Mesh(handle2, material11);
	  handle2Mesh.position.y = 4.5;
	  this.add(handle2Mesh);
  
	  scene.add(this);
	}
  }
  
class PatrickHouse extends THREE.Object3D{
	constructor(){
	  super();
  
	  var phiStart = 0;
	  var phiEnd = Math.PI * 2;
	  var thetaStart = 0;
	  var thetaEnd = Math.PI / 2;
  
	  var hill = new THREE.SphereGeometry( 2, 32, 16, phiStart, phiEnd, thetaStart, thetaEnd );
	  var hillMesh = new THREE.Mesh( hill, rockMaterial );
	  this.add(hillMesh);

	  this.sticks = new THREE.Object3D();
  
	  var stick1 = new THREE.CylinderGeometry(.05, .05, 1, 32);
	  var stick1Mesh = new THREE.Mesh(stick1, material13);
	  stick1Mesh.position.y = 2;
	  this.sticks.add(stick1Mesh);
  
	  var stick2 = new THREE.CylinderGeometry(.05, .05, 1, 32);
	  var stick2Mesh = new THREE.Mesh(stick2, material13);
	  stick2Mesh.position.y = 2.5;
	  stick2Mesh.rotation.z = (90 * Math.PI) / 180;
	  this.sticks.add(stick2Mesh);
  
	  var stick3 = new THREE.CylinderGeometry(.05, .05, .3, 32);
	  var stick3Mesh = new THREE.Mesh(stick3, material13);
	  stick3Mesh.position.y = 2.5;
	  stick3Mesh.position.x = -.45;
	  stick3Mesh.position.z = .1;
	  stick3Mesh.rotation.z = (90 * Math.PI) / 180;
	  stick3Mesh.rotation.y = (-45 * Math.PI) / 180;
	  this.sticks.add(stick3Mesh);
  
	  var stick4 = new THREE.CylinderGeometry(.05, .05, .3, 32);
	  var stick4Mesh = new THREE.Mesh(stick4, material13);
	  stick4Mesh.position.y = 2.5;
	  stick4Mesh.position.x = -.45;
	  stick4Mesh.position.z = -.1;
	  stick4Mesh.rotation.z = (90 * Math.PI) / 180;
	  stick4Mesh.rotation.y = (45 * Math.PI) / 180;
	  this.sticks.add(stick4Mesh);
  
	  var stick5 = new THREE.CylinderGeometry(.05, .05, .4, 32);
	  var stick5Mesh = new THREE.Mesh(stick5, material13);
	  stick5Mesh.position.y = 2.5;
	  stick5Mesh.position.x = .43;
	  stick5Mesh.rotation.z = (90 * Math.PI) / 180;
	  stick5Mesh.rotation.y = (90 * Math.PI) / 180;
	  this.sticks.add(stick5Mesh);
  
	  var stick6 = new THREE.CylinderGeometry(.05, .05, .4, 32);
	  var stick6Mesh = new THREE.Mesh(stick6, material13);
	  stick6Mesh.position.y = 2.5;
	  stick6Mesh.position.x = .3;
	  stick6Mesh.rotation.z = (90 * Math.PI) / 180;
	  stick6Mesh.rotation.y = (90 * Math.PI) / 180;
	  this.sticks.add(stick6Mesh);

	  this.sticks.position.x = -0.2;
	  this.add(this.sticks);
	}

	animation() {
		this.sticks.rotation.y += 5*Math.PI/180;
	}
  }
  


  class Vent extends THREE.Object3D{
	constructor(){
	  super();
	  var mainBody = new THREE.CylinderGeometry(.5,1,1.3,32);
	  var mainBodyMesh = new THREE.Mesh(mainBody, pSoupMaterial);
	  this.add(mainBodyMesh);
  
	  var blackCyl = new THREE.CylinderGeometry(.5,.5,1.31,32);
	  var blackCylMesh = new THREE.Mesh(blackCyl, material3);
	  this.add(blackCylMesh);
  
	  this.bubble1 = new Bubble();
	  this.bubble1.position.y = 2;
	  this.add(this.bubble1);
  
	  this.bubble2 = new Bubble();
	  this.bubble2.position.y = 0;
	  this.bubble2.position.x = .3;
	  this.bubble2.position.z = .1;
	  this.add(this.bubble2);
  
	  this.bubble3 = new Bubble();
	  this.bubble3.position.y = -1;
	  this.bubble3.position.x = -.3;
	  this.bubble3.position.z = -.1;
	  this.add(this.bubble2);
  
	  scene.add(this);
	}
  }
  
  class Bubble extends THREE.Object3D{
	constructor(){
	  super();
	  var bubble = new THREE.SphereGeometry(.2,32,32);
	  var bubbleMesh = new THREE.Mesh(bubble, material19);
	  this.add(bubbleMesh);
  
	  scene.add(this);
	}
  }


class SquidwardHouse extends THREE.Object3D{
	constructor(){
	  super();
	  var houseBase = new THREE.CylinderGeometry(1,1.3,4,32);
	  var houseBaseMesh = new THREE.Mesh(houseBase, squidHouseMaterial);
	  this.add(houseBaseMesh);
  
	  var ear1 = new THREE.BoxGeometry(1,1,.6);
	  var ear1Mesh = new THREE.Mesh(ear1, squidHouseMaterial);
	  ear1Mesh.position.x = 1;
	  this.add(ear1Mesh);
  
	  var ear2 = new THREE.BoxGeometry(1,1,.6);
	  var ear2Mesh = new THREE.Mesh(ear2, squidHouseMaterial);
	  ear2Mesh.position.x = -1;
	  this.add(ear2Mesh);
  
	  var nose = new THREE.BoxGeometry(.50,1,1);
	  var noseMesh = new THREE.Mesh(nose, squidHouseMaterial);
	  noseMesh.position.z = .90;
	  this.add(noseMesh);
  
	  var eyebrow = new THREE.BoxGeometry(1.65,.5,1);
	  var eyebrowMesh = new THREE.Mesh(eyebrow, squidHouseMaterial);
	  eyebrowMesh.position.z = 1;
	  eyebrowMesh.position.y = .75;
	  this.add(eyebrowMesh);
	  scene.add(this);
  
	  var rightEye = new THREE.CylinderGeometry(.35,.35,1,32);
	  var rightEyeMesh = new THREE.Mesh(rightEye, material14);
	  rightEyeMesh.rotation.x = (90 * Math.PI) / 180;
	  rightEyeMesh.position.x = .66;
	  rightEyeMesh.position.y = .10;
	  rightEyeMesh.position.z = .75;
	  this.add(rightEyeMesh);
  
	  var rightEye2 = new THREE.CylinderGeometry(.25,.25,1.1,32);
	  var rightEye2Mesh = new THREE.Mesh(rightEye2, material15);
	  rightEye2Mesh.rotation.x = (90 * Math.PI) / 180;
	  rightEye2Mesh.position.x = .66;
	  rightEye2Mesh.position.y = .10;
	  rightEye2Mesh.position.z = .75;
	  this.add(rightEye2Mesh);
  
	  var leftEye = new THREE.CylinderGeometry(.35,.35,1,32);
	  var leftEyeMesh = new THREE.Mesh(leftEye, material14);
	  leftEyeMesh.rotation.x = (90 * Math.PI) / 180;
	  leftEyeMesh.position.x = -.66;
	  leftEyeMesh.position.y = .10;
	  leftEyeMesh.position.z = .75;
	  this.add(leftEyeMesh);
  
	  var leftEye2 = new THREE.CylinderGeometry(.25,.25,1.1,32);
	  var leftEye2Mesh = new THREE.Mesh(leftEye2, material15);
	  leftEye2Mesh.rotation.x = (90 * Math.PI) / 180;
	  leftEye2Mesh.position.x = -.66;
	  leftEye2Mesh.position.y = .10;
	  leftEye2Mesh.position.z = .75;
	  this.add(leftEye2Mesh);
  
	  var door = new THREE.CylinderGeometry(.35, .35, 1, 32);
	  var doorMesh = new THREE.Mesh(door, material16);
	  doorMesh.position.z = .80;
	  doorMesh.rotation.x = (90 * Math.PI) / 180;
	  doorMesh.position.y = -1.2;
	  this.add(doorMesh);
  
	  var door1 = new THREE.BoxGeometry(.75,1,.75);
	  var door1Mesh = new THREE.Mesh(door1, material16);
	  door1Mesh.position.z = .80;
	  door1Mesh.rotation.x = (90 * Math.PI) / 180;
	  door1Mesh.position.y = -1.6;
	  this.add(door1Mesh);
	}
  }
  
class AntLion extends THREE.Object3D{
	constructor(){
	  super();
  
	  var phiStart = 0;
	  var phiEnd = Math.PI * 2;
	  var thetaStart = 0;
	  var thetaEnd = Math.PI / 2;
  
	  var hill = new THREE.SphereGeometry( 2, 32, 16, phiStart, phiEnd, thetaStart, thetaEnd );
	  var hillMesh = new THREE.Mesh( hill, material13 );
	  this.add(hillMesh);

	  this.body = new THREE.Object3D();
  
	  var mainBodySphere1 = new THREE.SphereGeometry(.75,32,32);
	  var mainBodySphere1Mesh = new THREE.Mesh(mainBodySphere1, material17);
	  mainBodySphere1Mesh.position.y = 0;
	  this.body.add(mainBodySphere1Mesh);
  
	  var leftJaw = new THREE.BoxGeometry(.3,1,.3);
	  var leftJawMesh = new THREE.Mesh(leftJaw, material2);
	  leftJawMesh.position.y = 1;
	  leftJawMesh.position.x = .5;
	  leftJawMesh.rotation.z = (-20 * Math.PI) / 180;
	  this.body.add(leftJawMesh);
  
  
	  var leftJaw2 = new THREE.BoxGeometry(.3,1,.3);
	  var leftJaw2Mesh = new THREE.Mesh(leftJaw2, material2);
	  leftJaw2Mesh.position.y = 1.8;
	  leftJaw2Mesh.position.x = .5;
	  leftJaw2Mesh.rotation.z = (20 * Math.PI) / 180;
	  this.body.add(leftJaw2Mesh)
  
	  var rightJaw = new THREE.BoxGeometry(.3,1,.3);
	  var rightJawMesh = new THREE.Mesh(rightJaw, material2);
	  rightJawMesh.position.y = 1;
	  rightJawMesh.position.x = -.5;
	  rightJawMesh.rotation.z = (20 * Math.PI) / 180;
	  this.body.add(rightJawMesh);
  
  
	  var rightJaw2 = new THREE.BoxGeometry(.3,1,.3);
	  var rightJaw2Mesh = new THREE.Mesh(rightJaw2, material2);
	  rightJaw2Mesh.position.y = 1.8;
	  rightJaw2Mesh.position.x = -.5;
	  rightJaw2Mesh.rotation.z = (-20 * Math.PI) / 180;
	  this.body.add(rightJaw2Mesh)
  
	  var leftEye = new THREE.SphereGeometry(.2, 32, 32);
	  var leftEyeMesh = new THREE.Mesh(leftEye, material18);
	  leftEyeMesh.position.y = 0.3;
	  leftEyeMesh.position.z = .45;
	  leftEyeMesh.position.x = -.5;
	  this.body.add(leftEyeMesh);
  
	  var rightEye = new THREE.SphereGeometry(.2, 32, 32);
	  var rightEyeMesh = new THREE.Mesh(rightEye, material18);
	  rightEyeMesh.position.y = 0.3;
	  rightEyeMesh.position.z = .45;
	  rightEyeMesh.position.x = .5;
	  this.body.add(rightEyeMesh);
  
	  var mainBodySphere2 = new THREE.SphereGeometry(.75,32,32);
	  var mainBodySphere2Mesh = new THREE.Mesh(mainBodySphere2, material17);
	  mainBodySphere2Mesh.position.y = -1;
	  this.body.add(mainBodySphere2Mesh);

	  this.body.position.y = -1;
	  this.add(this.body);
	}

	animateUp() {
		if (this.body.position.y < 3) {
			this.body.position.y += 0.1;
		}
	}

	animateDown() {
		if (this.body.position.y > -1) {
			this.body.position.y -= 0.1;
		}
	}
}

class Squid extends THREE.Object3D{
	constructor(){
	  super();
	  var mainBody = new THREE.CylinderGeometry(1,1,4,32);
	  var mainBodyMesh = new THREE.Mesh(mainBody, material5);
	  this.add(mainBodyMesh);
	}
 }

 class CraneMainBody extends THREE.Object3D{

	constructor(){
		super();
	//crane body -------------------------
	//crane base
		var craneBase = new THREE.BoxGeometry( 7.5, 1.5, 4 );
		const craneBaseMesh = new THREE.Mesh(craneBase , material2 );


		//craneDome
		var craneDome = new THREE.BoxGeometry(3, 3, 2);
		const craneDomeMesh = new THREE.Mesh(craneDome , material2 );
		craneDomeMesh.position.y = 1;
		craneDomeMesh.position.x = -2.25;
		craneDomeMesh.position.z = 1;

		//craneDomeWindowSide
		var craneDomeWindowSide = new THREE.BoxGeometry(2, 1.5, 2.5);
		const craneDomeWindowSideMesh = new THREE.Mesh(craneDomeWindowSide, material4);
		craneDomeWindowSideMesh.position.y = 1.5;
		craneDomeWindowSideMesh.position.x = -2.35;
		craneDomeWindowSideMesh.position.z = .9;

		//armPart1
		var armPart1 = new THREE.CylinderGeometry(1, 1, 3, 10);
		const armPart1Mesh = new THREE.Mesh(armPart1, material1);
		armPart1Mesh.position.x = 2;
		armPart1Mesh.position.y = 1;


		//armPart2
		var armPart2 = new THREE.CylinderGeometry(.75, .75, 5, 10)
		const armPart2Mesh = new THREE.Mesh(armPart2, material1);
		armPart2Mesh.position.x = 2;
		armPart2Mesh.position.y= 3;

		//frontWheels
		var frontWheels = new THREE.CylinderGeometry(.75, .75, 4.5, 10);
		const frontWheelsMesh = new THREE.Mesh(frontWheels, material3);
		frontWheelsMesh.rotation.x = Math.PI / 2;
		frontWheelsMesh.position.x = -2.5;
		frontWheelsMesh.position.y = -.5;

		//frontWheelsHub
		var frontWheelsHub = new THREE.CylinderGeometry(.50, .50, 4.7, 10);
		const frontWheelsHubMesh = new THREE.Mesh(frontWheelsHub, material1);
		frontWheelsHubMesh.rotation.x = Math.PI / 2;
		frontWheelsHubMesh.position.x = -2.5;
		frontWheelsHubMesh.position.y = -.5;


		//backWheels
		var backWheels = new THREE.CylinderGeometry(.75, .75, 4.5, 10);
		const backWheelsMesh = new THREE.Mesh(backWheels, material3);
		backWheelsMesh.rotation.x = Math.PI / 2;
		backWheelsMesh.position.x = 2.5;
		backWheelsMesh.position.y = -.5;

		//backWheelsHub
		var backWheelsHub = new THREE.CylinderGeometry(.50, .50, 4.7, 10);
		const backWheelsHubMesh = new THREE.Mesh(backWheelsHub, material1);
		backWheelsHubMesh.rotation.x = Math.PI / 2;
		backWheelsHubMesh.position.x = 2.5;
		backWheelsHubMesh.position.y = -.5;

		var parkingArm = new ParkArm();
		var hinge = new THREE.Object3D();
		hinge.add(parkingArm);
		this.add(hinge);


		//circle
		this.add(craneBaseMesh);
		this.add(craneDomeMesh);
		this.add(armPart1Mesh);
		this.add(armPart2Mesh);
		this.add(frontWheelsMesh);
		this.add(frontWheelsHubMesh);
		this.add(backWheelsMesh);
		this.add(backWheelsHubMesh);
		this.add(craneDomeWindowSideMesh);
		scene.add(this);
	}
}

class Gripper extends THREE.Object3D{
	constructor(){
		super();
		const textureLoader = new THREE.TextureLoader();
		//const texture = textureLoader.load('../pictures/spiral.png');
		//const materialDrill = new THREE.MeshBasicMaterial({ color: 0x777777});

		var thumb = new THREE.ConeGeometry(1,4,32);

		const thumbMesh = new THREE.Mesh(thumb, material1);

		this.add(thumbMesh);

	}
}

class CraneArmExtention extends THREE.Object3D{
	constructor(){
		super();
		var armExtention = new THREE.BoxGeometry(5,1,1);
		const armExtentionMesh = new THREE.Mesh(armExtention, material1);
		armExtentionMesh.position.x = -3;
		var pivot = new THREE.Object3D();

		var thumb = new Gripper();
		thumb.position.x = 0;
		var turningPoint = new THREE.Object3D();
		turningPoint.position.x = -6;
		turningPoint.position.y = 0;


		turningPoint.add(thumb);
		this.add(turningPoint);

		pivot.add(armExtentionMesh);
		scene.add(pivot);
		this.add(pivot);

	}
}

class CraneArm extends THREE.Object3D {
  constructor() {
    super();
    var armSegment1 = new THREE.BoxGeometry(5, 1, 1);
    const armSegment1Mesh = new THREE.Mesh(armSegment1, material1);

		var armExtention = new CraneArmExtention();

		armSegment1Mesh.position.x = -2;

    // Create an Object3D to act as the pivot point
    var pivot = new THREE.Object3D();
    pivot.add(armSegment1Mesh);

    // Position the pivot point
    pivot.position.x = 4;
    pivot.position.y = -1;



		var endOfArm = new THREE.Object3D();
		endOfArm.position.x = -4;
		endOfArm.position.y = 0;

		//endOfArm.position.x = armSegment1Mesh.position.x + 1;
    //endOfArm.position.y = armSegment1Mesh.position.y;

		pivot.add(endOfArm);
		endOfArm.add(armExtention);
    this.add(pivot);
		scene.add(this);
		//---------------------------------------------
  }

}

class ParkArm extends THREE.Object3D {
	constructor(){
		super();
		var arm = new THREE.BoxGeometry(3,.5,.5);
		var spike = new THREE.BoxGeometry(.2,1,.2);
		const spikeMesh = new THREE.Mesh(spike, material1);
		const armMesh = new THREE.Mesh(arm, material1);
		spikeMesh.position.x = 5.4;
		spikeMesh.position.y = -.5;
		armMesh.position.x = 4;

		var headlight = new THREE.PointLight(0xFFFFFF, 100.0);
		this.headlight = headlight;

		headlight.position.x = 3;
		//this.add(headlight);
		this.add(armMesh);
		this.add(spikeMesh);

//______________________________________________FINISH
		this.firstPersonCamera = new THREE.PerspectiveCamera(75, window.innerWidth/ window.innerHeight, 0.1, 10000);
		this.firstPersonCamera.position.set(0,0,0);
		this.firstPersonCamera.rotateY(Math.PI);
		this.add(this.firstPersonCamera);
	}

	toggleHeadlight() {
        this.headlight.visible = !this.headlight.visible;
    }
}

class Crane extends THREE.Object3D{
	constructor(){
		super();

		this.positionControl = { x: 0, y: 0, z: 0 };

		// Assign instances to properties
	    this.CRM = new CraneMainBody();
	    this.CA = new CraneArm();

	    // Set positions for clarity
	    this.CA.position.y = 6;
	    this.CA.position.x = -2;

	    // Add instances to the crane object
	    this.add(this.CRM);
	    this.add(this.CA);
	    scene.add(this);
	}
	updatePosition() {
        this.position.set(this.positionControl.x, this.positionControl.y, this.positionControl.z);
    }

	getArm(){
		return this.CA;
	}
}



 let cubeRenderTarget, cubeCamera;
 class JoshRobot extends THREE.Object3D {
	
	constructor(x, y, z) {

		super();



		this.shouldWave = false;

		this.walk = false;

		this.sidestep = false;



		// makes a texture based on what cameras positioned around the scene see

		cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256);



		// creates 6 cameras that render to cubeRenderTarget

		cubeCamera = new THREE.CubeCamera(1, 1000, cubeRenderTarget)



		const material = new THREE.MeshPhongMaterial({

			color: 0xFFD06B,

			//envMap: cubeRenderTarget.texture
			map: new THREE.TextureLoader().load('pictures/shiny.jpg')

		});



		this.head = new Head(material);

		this.head.position.set(0, 3.4, 0);

		this.add(this.head);



		this.body = new Body(material);

		this.add(this.body);



		this.leftArmContainer = new THREE.Object3D();

		this.leftArm = new Arm(material);

		this.leftArm.position.set(0, -2.65, 0);

		this.leftArm.rotation.y = 180*Math.PI/180;

		this.leftArmContainer.add(this.leftArm);

		this.leftArmContainer.position.set(2, 1.7, 0);

		this.add(this.leftArmContainer);



		this.rightArmContainer = new THREE.Object3D();

		this.rightArm = new Arm(material);

		this.rightArm.position.set(0, -2.65, 0);

		this.rightArmContainer.add(this.rightArm);

		this.rightArmContainer.position.set(-2, 1.7, 0);

		this.add(this.rightArmContainer);



		this.leftLeg = new Leg(material);

		this.leftLeg.position.set(-0.75, -2, 0);

		this.add(this.leftLeg);



		this.rightLeg = new Leg(material);

		this.rightLeg.position.set(0.75, -2, 0);

		this.add(this.rightLeg);

		this.rightLeg.moveUp = false;

		this.rightLeg.rotation.y = 180*Math.PI/180;



		this.position.set(x, y, z);

	}



	getHead() {

		return this.head;

	}



	getRightArm() {

		return this.rightArmContainer;

	}



	getLeftArm() {

		return this.leftArmContainer;

	}



	getLeftArmBelowElbow() {

		return this.leftArm.belowElbow;

	}



	getLeftHand() {

		return this.leftArm.hand;

	}



	hideFacialFeatures() {

		this.head.leftEye.visible = false;

		this.head.rightEye.visible = false;

		this.head.mouth.visible = false;

	}



	showFacialFeatures() {

		this.head.leftEye.visible = true;

		this.head.rightEye.visible = true;

		this.head.mouth.visible = true;

	}



	wave() {

		if (this.rightArmContainer.rotation.x > -180*Math.PI/180) {

			this.rightArmContainer.rotation.x -= 2*Math.PI/180;

		}

		else {

			this.rightArm.wave();

		}

	}



	unwave() {

		if (this.rightArm.belowElbow.rotation.z < -1*Math.PI/180) {

			this.rightArm.belowElbow.rotation.z += 1*Math.PI/180;

		}

		else if (this.rightArm.belowElbow.rotation.z > 1*Math.PI/180) {

			this.rightArm.belowElbow.rotation.z -= 1*Math.PI/180;

		}

		else if (this.rightArmContainer.rotation.x < 0) {

			this.rightArmContainer.rotation.x += 1*Math.PI/180;

		}

		else if (this.rightArmContainer.rotation.x > 0) {

			this.rightArmContainer.rotation.x = 0;

		}

		else if (this.rightArm.hand.rotation.z < -1*Math.PI/180) {

			this.rightArm.hand.rotation.z += 1*Math.PI/180;

		}

		else if (this.rightArm.hand.rotation.z > 1*Math.PI/180) {

			this.rightArm.hand.rotation.z -= 1*Math.PI/180;

		}

	}

}



// makes the Robot's head

class Head extends THREE.Object3D {

	constructor(material) {

		super();



		const headG = new THREE.CapsuleGeometry(1, 0.9, 4, 32);

		const head = new THREE.Mesh(headG, material);

		this.add(head);



		const bMaterial = new THREE.MeshBasicMaterial({

			color: 0x000000

		});

		const eyeG = new THREE.SphereGeometry(0.12, 32, 16);



		this.leftEye = new THREE.Mesh(eyeG, bMaterial);

		this.leftEye.position.set(-0.3, 0.3, 1);

		this.add(this.leftEye);



		this.rightEye = new THREE.Mesh(eyeG, bMaterial);

		this.rightEye.position.set(0.3, 0.3, 1);

		this.add(this.rightEye);



		const mouthG = new THREE.BoxGeometry(0.4, 0.1, 0.1);

		this.mouth = new THREE.Mesh(mouthG, bMaterial);

		this.mouth.position.set(0, -0.2, 1);

		this.add(this.mouth);

	}

}



// makes the Robot's body

class Body extends THREE.Object3D {

	constructor(material) {

		super();



		const bodyG = new THREE.CylinderGeometry(2, 1.25, 4, 64);

		const body = new THREE.Mesh(bodyG, material);

		body.scale.z = 0.5;

		this.add(body);



		const shoulderG = new THREE.SphereGeometry(0.75);

		

		const leftShoulder = new THREE.Mesh(shoulderG, material);

		leftShoulder.position.set(-1.9, 1.7, 0);

		this.add(leftShoulder);



		const rightShoulder = new THREE.Mesh(shoulderG, material);

		rightShoulder.position.set(1.9, 1.7, 0);

		this.add(rightShoulder);

	}

}



// makes the Robot's arm

class Arm extends THREE.Object3D {

	constructor(material) {

		super();



		this.armRotUp = true;



		const bicepG = new THREE.CylinderGeometry(0.5, 0.5, 2, 64);

		const bicep = new THREE.Mesh(bicepG, material);

		bicep.position.set(0, 1.4, 0);

		this.add(bicep);



		const elbowG = new THREE.SphereGeometry(0.65);

		const elbow = new THREE.Mesh(elbowG, material);

		this.add(elbow);



		this.belowElbow = new THREE.Object3D();



		const forearmG = new THREE.CylinderGeometry(0.5, 0.5, 1.5, 64);

		this.forearm = new THREE.Mesh(forearmG, material);

		this.forearm.position.set(0, -1.1, 0);

		this.belowElbow.add(this.forearm);



		// creates the container that groups everything in the hand

		this.hand = new THREE.Object3D();

		this.hand.position.set(0, -2.2, 0);

		this.belowElbow.add(this.hand);



		// creates the palm

		const palmG = new THREE.SphereGeometry(0.65);

		this.palm = new THREE.Mesh(palmG, material);

		this.palm.position.set(0, 0, 0);

		this.hand.add(this.palm);



		// creates the geometry that will be repeated for the fingers

		const fingerG = new THREE.CapsuleGeometry(0.15, 0.3, 4, 8);



		// creates the thumb

		this.thumb = new THREE.Mesh(fingerG, material);

		this.thumb.position.set(-0.525, -0.4, 0);

		this.hand.add(this.thumb);



		// creates the pointer finger

		this.pf = new THREE.Mesh(fingerG, material);

		this.pf.position.set(-0.2, -0.75, 0);

		this.hand.add(this.pf);



		// creates the middle finger

		this.mf = new THREE.Mesh(fingerG, material);

		this.mf.position.set(0.125, -0.8, 0);

		this.hand.add(this.mf);



		// creates the pinky finger

		this.pinky = new THREE.Mesh(fingerG, material);

		this.pinky.position.set(0.45, -0.5, 0);

		this.hand.add(this.pinky);



		this.add(this.belowElbow);



		this.waveBERight = true;

		this.waveHRight = true;

	}



	getBelowElbow() {

		return this.belowElbow;

	}



	wave() {

		// waves everything from the elbow down back and forth

		if (this.belowElbow.rotation.z >= 30*Math.PI/180) {

			this.waveBERight = false;

		}

		else if (this.belowElbow.rotation.z <= -30*Math.PI/180) {

			this.waveBERight = true;

		}

		if (this.waveBERight) {

			this.belowElbow.rotation.z += 2*Math.PI/180;

		}

		else {

			this.belowElbow.rotation.z -= 2*Math.PI/180;

		}



		// waves the hand back and forth as well

		if (this.hand.rotation.z >= 30*Math.PI/180) {

			this.waveHRight = false;

		}

		else if (this.hand.rotation.z <= -30*Math.PI/180) {

			this.waveHRight = true;

		}

		if (this.waveHRight) {

			this.hand.rotation.z += 2*Math.PI/180;

		}

		else {

			this.hand.rotation.z -= 2*Math.PI/180;

		}

	}

}



// makes the Robot's leg

class Leg extends THREE.Object3D {

	constructor(material) {

		super();



		const thighG = new THREE.CylinderGeometry(0.5, 0.5, 2, 64);

		const thigh = new THREE.Mesh(thighG, material);

		thigh.position.set(0, -1, 0);

		this.add(thigh);



		const kneeG = new THREE.SphereGeometry(0.65);

		const knee = new THREE.Mesh(kneeG, material);

		knee.position.set(0, -2.35, 0);

		this.add(knee);



		const calfG = new THREE.CylinderGeometry(0.5, 0.5, 2, 64);

		const calf = new THREE.Mesh(calfG, material);

		calf.position.set(0, -3.7, 0);

		this.add(calf);



		const footG = new THREE.SphereGeometry(0.65);

		const foot = new THREE.Mesh(footG, material);

		foot.position.set(0, -4.7, 0);

		this.add(foot);



		this.moveUp = true;

		this.moveRight = true;

	}



	walk() {

		if (this.rotation.x >= 30*Math.PI/180) {

			this.moveUp = false;

		}

		else if (this.rotation.x <= -30*Math.PI/180) {

			this.moveUp = true;

		}

		if (this.moveUp) {

			this.rotation.x += 2*Math.PI/180;

		}

		else {

			this.rotation.x -= 2*Math.PI/180;

		}

	}



	unwalk() {

		if (this.rotation.x < -1*Math.PI/180) {

			this.rotation.x += 1*Math.PI/180;

		}

		else if (this.rotation.x > 1*Math.PI/180) {

			this.rotation.x -= 1*Math.PI/180;

		}

	}



	sidestep() {

		if (this.rotation.z >= 0*Math.PI/180) {

			this.moveRight = false;

		}

		else if (this.rotation.z <= -10*Math.PI/180) {

			this.moveRight = true;

		}

		if (this.moveRight) {

			this.rotation.z += 1*Math.PI/180;

		}

		else {

			this.rotation.z -= 1*Math.PI/180;

		}

	}



	unsidestep() {

		if (this.rotation.z < -1*Math.PI/180) {

			this.rotation.z += 1*Math.PI/180;

		}

		else if (this.rotation.z > 1*Math.PI/180) {

			this.rotation.z -= 1*Math.PI/180;

		}

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
	robotCamera= new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
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
		this.spotLight.intensity = 50000;
		this.spotLight.angle = 30* Math.PI/180;
		this.spotLight.distance = 15;

		this.spotLight.target.position.set(0, -200, 100);
		this.spotLight.target.updateMatrixWorld();
		
		this.spotLight.target.angle = 30 * Math.PI/180;
		this.spotLight.target.updateMatrixWorld();
		this.add(this.spotLight);
		this.add(this.spotLight.target);
		this.spotLight.visible = false;		

		//this.robotCamera.position.z += 0.5;
		this.robotCamera.position.z += 0.3;
		this.robotCamera.position.x -= 0.4;
		this.cameraTarget.position.z += 10;
		this.cameraTarget.position.y -= 10;
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
	leg = new THREE.Group();
	lowerLegGroup = new THREE.Group();

	gridHelper = new THREE.GridHelper( 100, 100 );
	
	constructor() {
		super();
		//transformations
		this.upperLeg.position.y += 2.5;

		this.lowerLeg.position.y -= 3.5;
		this.foot.position.y -= 3.5;
		this.lowerLeg.position.z += 0.6;
		this.foot.position.z += 0.6;
		this.upperLeg.position.y -= 3.5;
		this.upperLeg.position.z += 0.6;
		
		//assign to group to set center of rotation?
		
		//this.leg.add(this.foot)
		//this.leg.add(this.lowerLeg);

		this.lowerLegGroup.add(this.foot);
		this.lowerLegGroup.add(this.lowerLeg);
		this.leg.add(this.lowerLegGroup);
		this.leg.add(this.upperLeg);
		this.leg.position.y -= 2.1;
		this.leg.position.z += 0.1;
		this.add(this.leg);
		//this.add(this.gridHelper)
	}

	getLowerLeg() {
		return this.lowerLegGroup;
	}
}

class Robot extends THREE.Object3D {
	robotHead = new RobotHead();
	robotBody = new RobotBody();
	robotArmRight = new RobotArm();
	robotArmLeft = new RobotArm();
	robotLegLeft = new RobotLeg();
	robotLegRight = new RobotLeg();
	upperBody = new THREE.Group();

	gridHelper = new THREE.GridHelper( 100, 100 );

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

		this.robotHead.position.y += 1.8;
		this.robotArmLeft.position.y += 1.8;
		this.robotArmRight.position.y += 1.8;
		this.robotBody.position.y += 1.8;
		this.robotLegLeft.position.y += 2;
		this.robotLegRight.position.y += 2;

		this.robotLegLeft.position.y += 1.3;
		this.robotLegLeft.position.z -= 0.5;
		this.robotLegRight.position.y += 1.3;
		this.robotLegRight.position.z -= 0.5;

		this.robotLegLeft.position.y += 0.8;
		this.robotLegRight.position.y += 0.8;
		
		this.upperBody.add(this.robotHead);
		this.upperBody.add(this.robotBody);
		this.upperBody.add(this.robotArmRight);
		this.upperBody.add(this.robotArmLeft);

		//this.upperBody.rotation.x = 45 * Math.PI/180;
		//this.upperBody.position.y += 1.8;


		//TODO get robot's quaterion value for sitting and standing, then use keyframes to animate between the two

		
		

		// this.add(this.robotHead);
		// this.add(this.robotBody);
		// this.add(this.robotArmRight);
		// this.add(this.robotArmLeft);
		
		//this.add(this.gridHelper)
		this.add(this.upperBody);
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

	getUpperBody() {
		return this.upperBody;
	}

	getRobotLegL() {
		return this.robotLegLeft;
	}

	getRobotLegR() {
		return this.robotLegRight;
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

	getShadeMaterial() {
		return this.shade.material;
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
	// red = new THREE.MeshPhongMaterial( {color: 0x7dc0f1});
	red = new THREE.MeshPhongMaterial( {color: 0x31ab7d});
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
	joshrobot = new JoshRobot();
	ianrobot = new Crane();

	originalQuat = new THREE.Quaternion();
	newQuat = new THREE.Quaternion();
	

	//lights
	//lampLight = new THREE.PointLight(0xDDDDDD, 300 , 1000, 2);  -- scale 1 intensity
	lampLight = new THREE.PointLight(0xDDDDDD, 2800, 1000, 2); 
	

	constructor() {
		super()

		//Original Robot Quaternion =  [0,0,0, 1]
		this.originalQuat = this.robot.quaternion;
		//console.log(this.originalQuat.toJSON());

 

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
		this.dresser.scale.z = 1.4
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
		

		// this.robot.position.z -= 9;
		this.robot.position.y += 1;
		// this.robot.position.x-= 10;
		// this.robot.receiveShadow = true;
		// this.robot.scale.x = 0.3;
		// this.robot.scale.y = 0.3;
		// this.robot.scale.z = 0.3;
		this.robot.scale.x = 1.5;
		this.robot.scale.y = 1.5;
		this.robot.scale.z = 1.5;

		this.joshrobot.scale.set(0.25, 0.25, 0.25);
		this.joshrobot.rotation.y = -45 * Math.PI/180;
		this.joshrobot.position.set(13, 5, 5)

		this.ianrobot.scale.set(0.3, 0.3, 0.3);
		this.ianrobot.position.y += 11.5;
		this.ianrobot.position.x += 13;
		this.ianrobot.position.z -= 3;
		this.ianrobot.rotation.y = -90 * Math.PI/180;

		


		//sitting on bed, comment out to stand in middle 
		this.robot.position.x -= 8;
		this.robot.position.y += 1;
		this.robot.position.z -= 3;
		this.robot.getRobotLegL().getLowerLeg().rotation.x = 90 * Math.PI/180;
		this.robot.getRobotLegR().getLowerLeg().rotation.x = 90 * Math.PI/180;
		this.robot.getUpperBody().rotation.x = 90 * Math.PI/180;
		this.robot.rotation.x = 270 * Math.PI/180;
		this.robot.rotation.z = 90 * Math.PI/180;

		
		this.robot.traverse( function( child ) { 
			if ( child.type == 'Mesh') {
				child.castShadow = true;
				child.receiveShadow = true;
			}
		} );
		this.chest.traverse( function( child ) { 
			if ( child.type == 'Mesh') {
				child.castShadow = true;
				child.receiveShadow = true;
			}
		} );
		this.chair.traverse( function( child ) { 
			if ( child.type == 'Mesh') {
				child.castShadow = true;
				child.receiveShadow = true;
			}
		} );
		this.desk.traverse( function( child ) {
			if ( child.type == 'Mesh') {
				child.castShadow = true;
				child.receiveShadow = true;
			}
		} );
		this.dresser.traverse( function( child ) { 
			if ( child.type == 'Mesh') {
				child.castShadow = true;
				child.receiveShadow = true;
			}
		} );
		this.nightstand.traverse( function( child ) { 
			if ( child.type == 'Mesh') {
				child.castShadow = true;
				child.receiveShadow = true;
			}
		} );
		this.bookshelf.traverse( function( child ) { 
			if ( child.type == 'Mesh') {
				child.castShadow = true;
				child.receiveShadow = true;
			}
		} );
		this.bookshelf2.traverse( function( child ) { 
			if ( child.type == 'Mesh') {
				child.castShadow = true;
				child.receiveShadow = true;
			}
		} );


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
		this.lampLight.shadow.mapSize.width = 1024
		this.lampLight.shadow.mapSize.height = 1024
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
		this.add(this.joshrobot);
		this.add(this.ianrobot);
	}

	getLampLight() {
		return this.lampLight;
	}

	getRobot() {
		return this.robot;
	}

	getOriginal() {
		return this.originalQuat;
	}

	getNew() {
		return this.newQuat;
	}

	getLamp() {
		return this.lamp;
	}
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//renderer
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.sortObjects = false;
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
const fishCamera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
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

enableShadows(tank);

//transformations
room.position.z += 60;
room.scale.x = 3;
room.scale.y = 3;
room.scale.z = 3;

tank.position.z -= 60;
tank.position.y -= 0.2

//add to scene
scene.add(dirLight);
scene.add(ambientLight);
scene.add(redSpotlight);

scene.add(room);
scene.add(tank);

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
const upperBody = robot.getUpperBody();
const robotLegLeft = robot.getRobotLegL();
const robotLegRight = robot.getRobotLegR();
const robotLowerLegLeft = robotLegLeft.getLowerLeg();
const robotLowerLegRight = robotLegRight.getLowerLeg();
const robotCamera = robotHead.getRobotCamera();
const tankLight = tank.getTankLight();
let nemo = tank.getNemo();


//gui
const gui = new GUI();
gui.getSaveObject();
//folders
const interactionFolder = gui.addFolder("Interaction");
const robotFolder = interactionFolder.addFolder("Robot");
const nemoFolder = interactionFolder.addFolder("Nemo");
const lightFolder = interactionFolder.addFolder("Lights");
const cameraFolder = interactionFolder.addFolder("Camera");
const headFolder = robotFolder.addFolder("Head");
const upperBodyFolder = robotFolder.addFolder("Upper Body");
const leftArmFolder = robotFolder.addFolder("Left Arm");
const rightArmFolder = robotFolder.addFolder("Right Arm");
const leftLegFolder = robotFolder.addFolder("Left Leg");
const rightLegFolder = robotFolder.addFolder("Right Leg");
const animationFolder = interactionFolder.addFolder("Robot Animations");



// robotFolder.open();
// headFolder.open();
// leftArmFolder.open()
// rightArmFolder.open();
// lightFolder.open();
//nemoFolder.open();
//interactionFolder.open();
cameraFolder.open();
animationFolder.open();
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
upperBodyFolder.add(upperBody.rotation, 'x', Math.PI * -1, Math.PI * 1).name("Rotate Upper Body");
leftLegFolder.add(robotLegLeft.rotation, 'x', Math.PI * -2, Math.PI * 2).name("Rotate Left Leg");
leftLegFolder.add(robotLowerLegLeft.rotation, 'x', Math.PI * -2, Math.PI * 2).name("Rotate Lower Left Leg");
rightLegFolder.add(robotLegRight.rotation, 'x', Math.PI * -2, Math.PI * 2).name("Rotate Right Leg");
rightLegFolder.add(robotLowerLegRight.rotation, 'x', Math.PI * -2, Math.PI * 2).name("Rotate Lower Right Leg");

// gui to manipulate nemo's color and size
const nemoColor = {
	color: material1.color.getHex()
};
nemoFolder.addColor(nemoColor, 'color')
.onChange((value) =>  material1.color.set(value)).name("Color");
nemoFolder.add(tank.getNemo().scale, 'x', 0.025, 0.25).name("Scale Width");
nemoFolder.add(tank.getNemo().scale, 'y', 0.025, 0.25).name("Scale Height");
nemoFolder.add(tank.getNemo().scale, 'z', 0.025, 0.25).name("Scale Depth");
nemoFolder.add(nemo.rotation, 'x', Math.PI * -2, Math.PI * 2 ).name("Rotate Nemo");



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
lightFolder.add(lampLight, 'visible').name("Toggle Lamplight");
lightFolder.add(tankLight, 'visible').name("Toggle Tanklight");
lightFolder.add(lampLight, 'intensity', 500, 8000).name("Lamp Intensity");
lightFolder.add(tankLight, 'intensity', 10, 400).name("Tank Intensity");
const colorParams = {
	color: lampLight.color.getHex()
};
const tankColorParams = {
	color: tankLight.color.getHex()
};
lightFolder.addColor(colorParams, 'color')
.onChange((value) =>  lampLight.color.set(value)).name("Lamp Color");

lightFolder.addColor(tankColorParams, 'color')
.onChange((value) =>  tankLight.color.set(value)).name("Tank Color");
const settings = {
	'wave at fish': function() {
		animationValue1 = 0;
		//waveAtFish();
	},

	'spin head': function() {
		zValue = 0;
	},

	'robot camera' : function () {
		//X - toggle robot camera
		if ((renderCamera == camera)) {
			renderCamera = robotHead.getRobotCamera();
			renderCamera.lookAt(new THREE.Vector3(10000, 10, 10));
			lampLight.intensity -= 1500;
		}
		else if ((renderCamera == fishCamera)){
			renderCamera = robotHead.getRobotCamera();
			renderCamera.lookAt(new THREE.Vector3(10000, 10, 10));
			lampLight.intensity -= 1500;
		}
		else {
			renderCamera = camera;
			lampLight.intensity += 1500;
		}
		room.getLamp().getShadeMaterial.transparent = true;
	},

	'fish camera' : function () {
		//X - toggle fish camera
		if ((renderCamera == camera)) {
			renderCamera = fishCamera;
		}
		else if ((renderCamera == robotCamera)){
			renderCamera = fishCamera;
			lampLight.intensity += 1500;
		}
		else {
			renderCamera = camera;
		}
		room.getLamp().getShadeMaterial.transparent = false;
	},


	//camera.position.set(0,20,130);
	'room camera' : function () {
		if ((renderCamera == robotCamera)) {
			renderCamera = camera;
			renderCamera.position.set(0,20,130);
			lampLight.intensity += 1500;
			//renderCamera.lookAt(new THREE.Vector3(0, 0, 0));
		}
		else if ((renderCamera == fishCamera)){
			renderCamera = camera;
			renderCamera.position.set(0,20,130);
			//renderCamera.lookAt(new THREE.Vector3(0, 0, 0));
		}
		else {
			renderCamera = camera;
			renderCamera.position.set(0,20,130);
			//renderCamera.lookAt(new THREE.Vector3(0, 0, 0));
		}
		room.getLamp().getShadeMaterial.transparent = true;
	}
} 
animationFolder.add(settings, 'wave at fish').name("Wave at Fish");
animationFolder.add(settings, 'spin head').name("Spin Robot Head");
cameraFolder.add(settings, 'robot camera').name("Toggle Robot Camera");
cameraFolder.add(settings, 'fish camera').name("Toggle Fish Camera");
cameraFolder.add(settings, 'room camera').name("Toggle Room Camera");


let animationValue1 = 126;
let animationValue2 = 126;
let animationValue3 = 126;
let zValue = 126;
let yValue = 126;
let isPov = false;
//let pivotValue = 20;
let tiltDirection = -1;
function waveAtFish() {
	//raise arm
	if (animationValue1 == 44) {
		animationValue2 = 0;
		animationValue1 += 2;	
		clock.getElapsedTime(1);
		robotLowerArmR.rotation.x += 0.65 * Math.PI/180;
	}
	else if (animationValue1 < 46) {
		robotHead.rotation.y += 2 * Math.PI/180;
		robotArmR.rotation.x -= 4 * Math.PI/180;
		robotLowerArmR.rotation.x += 0.65 * Math.PI/180;
		animationValue1 += 2;
		clock.getElapsedTime(1);
	}

	//spin hand + wave
	if (animationValue2 == 96) {
		animationValue3 = 0;
		animationValue2 += 2;
		robotLowerArmR.rotation.y = 4 * Math.PI/180;
		nemo.rotation.x += 7.3 * Math.PI/180;
		clock.getElapsedTime(1)
	}
	else if (animationValue2 < 100) {
		robotHandR.rotation.y += 20 * Math.PI/180;
		robotLowerArmR.rotation.y += tiltDirection * 7 * Math.PI/180;
		nemo.rotation.x += 7.3 * Math.PI/180;

		if (robotLowerArmR.rotation.y > 20 * Math.PI/180) {
			tiltDirection = -1;
			robotLowerArmR.rotation.y = 2 * (20 * Math.PI/180) - robotLowerArmR.rotation.y;
		}
		else if (robotLowerArmR.rotation.y < -20 * Math.PI/180) {
			tiltDirection = 1;
			robotLowerArmR.rotation.y = 2 * (-20 * Math.PI/180) - robotLowerArmR.rotation.y;
		}
		animationValue2 += 2;
		clock.getElapsedTime(1);
	}

	//lower arm
	if (animationValue3 == 46) {
		animationValue3 += 126;
		robotLowerArmR.rotation.x -= 0.65 * Math.PI/180;
		nemo.rotation.x = 0 * Math.PI/180;
		clock.getDelta();
	}
	else if (animationValue3 < 44) {
		robotHead.rotation.y -= 2 * Math.PI/180;
		robotArmR.rotation.x += 4* Math.PI/180;
		robotLowerArmR.rotation.x -= 0.65 * Math.PI/180;
		animationValue3 += 2;
		clock.getDelta();
	}
}

function spinHead() {
	if (zValue == 60) {
		robotHead.rotation.z += 0.1	
		zValue += 2
		yValue = 0;
	} else if (zValue < 64) {
		robotHead.rotation.z += 0.2
		zValue += 2
		//clock.getElapsedTime(1);
		clock.getDelta();
	} 

	//spin
	if (yValue < 62) {
		robotHead.rotation.y += 0.2
		yValue += 2
		//clock.getElapsedTime(1);
		clock.getDelta();
	}
}

function ventBubbles(vent) {
	if(vent.bubble1.position.y < 5){
		vent.bubble1.position.y += .01;
	  }
	  if(vent.bubble1.position.y > 5){
		vent.bubble1.position.y = Math.floor(Math.random() * 2.3) - 1;;
	  }
	  if(vent.bubble2.position.y < 5){
		vent.bubble2.position.y += .01;
	  }
	  if(vent.bubble2.position.y > 5){
		vent.bubble2.position.y = Math.floor(Math.random() * 2.3) - 1;;
	  }
	  if(vent.bubble3.position.y < 5){
		vent.bubble3.position.y += .01;
	  }
	  if(vent.bubble3.position.y > 5){
		vent.bubble3.position.y = Math.floor(Math.random() * 2.3) - 1;;
	  }
}

const vent1 = tank.getVent();
const vent2 = tank.getVent2();
const vent3 = tank.getVent3();
var mixer;


animate();


function animate() {
	requestAnimationFrame(animate);
	let nemo = tank.getNemo();
	let antLion = tank.getAntLion();

	if (renderCamera.position.x > tank.position.x - tank.getWidth()/2 &&
		renderCamera.position.x < tank.position.x + tank.getWidth()/2 &&
		renderCamera.position.y > tank.position.y - tank.getHeight()/2 &&
		renderCamera.position.y < tank.position.y + tank.getHeight()/2 &&
		renderCamera.position.z > tank.position.z - tank.getDepth()/2 &&
		renderCamera.position.z < tank.position.z + tank.getDepth()/2) {
			tank.jellyGroup.transparent();
	}
	else {
		tank.jellyGroup.untransparent();
	}

	// if (nemo.position.x > antLion.position.x - 1.75 &&
	// 	nemo.position.x < antLion.position.x + 1.75 &&
	// 	nemo.position.z > antLion.position.z - 1.75 &&
	// 	nemo.position.z < antLion.position.z + 1.75) {
	// 	antLion.animateUp();
	// }
	// else {
	// 	antLion.animateDown();
	// }

	if (nemo.position.x > antLion.position.x - 2.25 &&
		nemo.position.x < antLion.position.x + 2.25 &&
		nemo.position.z > antLion.position.z - 2.25 &&
		nemo.position.z < antLion.position.z + 2.25) {
		antLion.animateUp();
	}
	else {
		antLion.animateDown();
	}


	// animate nemo
	nemo.propellerAnimation(10);
	if (nemo.shouldTailMove) nemo.tailAnimation();

	// animate Patrick's house
	tank.patrickAnimation();

	// moves fish2 around
	tank.fishMovement();

	// sink nemo
	if (!nemo.shouldFloat && !nemo.stationaryY) nemo.position.y -= 0.025;

	// make fish camera follow the fish
	let nemoWorldPosition = nemo.getWorldPosition(new THREE.Vector3());
	nemoWorldPosition.y -= tank.getNemoSize().y*0.5+0.3;
	fishCamera.position.copy(nemoWorldPosition);
	fishCamera.rotation.y = nemo.rotation.y + 90*Math.PI/180;

	// tank.sandOscillation();

	// tank boundary assurance
	boundaryAssurance();

	//robot animation
	waveAtFish();
	spinHead();
	ventBubbles(vent1);
	ventBubbles(vent2);
	ventBubbles(vent3);

	robotHead.getSpotLight().target.updateMatrixWorld();
	if (isPov) controlsDefault.enabled = false;
	else controlsDefault.enabled = true;
	controlsDefault.update();
	onWindowResize();
	var delta = clock.getDelta();
	if (mixer) mixer.update(delta);
	

	

	

	// you must do this every frame
	//	mixer.update(clock.getDelta());

	renderer.render( scene, renderCamera);
}

// assures that nemo cannot leave the fish tank
function boundaryAssurance() {
	let nemo = tank.getNemo();
	let size = tank.getNemoSize();
	let w = tank.getWidth();
	let h = tank.getHeight();
	let d = tank.getDepth();
	let buffer = 0.1;

	// x-boundary
	if (nemo.position.x < -w/2+size.x/2+buffer) {
		nemo.position.x = -w/2+size.x/2+buffer;
	}
	else if (nemo.position.x > w/2-size.x/2-buffer) {
		nemo.position.x = w/2-size.x/2-buffer;
	}

	// y-boundary
	if (nemo.position.y < -h/2+1+size.y/2+buffer) {
		nemo.position.y = -h/2+1+size.y/2+buffer;
	}
	else if (nemo.position.y > h/2-2-size.y/2-buffer) {
		nemo.position.y = h/2-2-size.y/2-buffer;
	}

	// z-boundary
	if (nemo.position.z < -d/2+size.x/2+buffer) {
		nemo.position.z = -d/2+size.x/2+buffer;
	}
	else if (nemo.position.z > d/2-size.x/2-buffer) {
		nemo.position.z = d/2-size.x/2-buffer;
	}
}



// keyboard controls
document.onkeydown = function() {
	const key = event.key;
	let nemo = tank.getNemo()

	// controls nemo's movements
	if (key == 'w' || key == 'W') {
		nemo.shouldTailMove = true;
		nemo.position.z -= 0.1*Math.cos(nemo.rotation.y + 90*Math.PI/180);
		nemo.position.x -= 0.1*Math.sin(nemo.rotation.y + 90*Math.PI/180);
	}
	else if (key == 'a' || key == 'A') {
		nemo.shouldTailMove = true;
		nemo.rotation.y += 2*Math.PI/180;
	}
	else if (key == 's' || key == 'S') {
		nemo.shouldTailMove = true;
		nemo.position.z += 0.1*Math.cos(nemo.rotation.y + 90*Math.PI/180);
		nemo.position.x += 0.1*Math.sin(nemo.rotation.y + 90*Math.PI/180);
	}
	else if (key == 'd' || key == 'D') {
		nemo.shouldTailMove = true;
		nemo.rotation.y -= 2*Math.PI/180;
	}
	// make nemo float upwards
	else if (key == ' ') {
		nemo.propellerAnimation(20);
		nemo.shouldFloat = true;
		nemo.position.y += 0.125;
	}
	else if (key == 'c') {
		if (nemo.stationaryY) nemo.stationaryY = false;
		else nemo.stationaryY = true;
	}
	// // change views
	// else if (!isPov && key == 'c') {
	// 	isPov = true;
	// 	renderCamera = fishCamera;
	// }
	// else if (isPov && key == 'c') {
	// 	isPov = false;
	// 	renderCamera = camera;
	// }
}

document.onkeyup = function() {
	let nemo = tank.getNemo();

	nemo.shouldFloat = false;
	nemo.shouldTailMove = false;
}

function enableShadows(object) {
	object.traverse( function( child ) { 
		if ( child.type == 'Mesh') {
			child.castShadow = true;
			child.receiveShadow = true;
		}
	} );
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



