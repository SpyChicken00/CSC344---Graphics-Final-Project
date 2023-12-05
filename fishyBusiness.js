import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';

// Camera setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 10;
camera.position.x = 10;

// Scene setup
const scene = new THREE.Scene();

// Renderer setup
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Stats setup
const stats = new Stats();
document.body.appendChild(stats.dom);

// OrbitControls setup
const controls = new OrbitControls(camera, renderer.domElement);

// Material setup

const material1 = new THREE.MeshPhongMaterial({ color: 0xFFB406, flatShading: false });
const material2 = new THREE.MeshPhongMaterial({ color: 0xFFFFFF, flatShading: false });
const material3 = new THREE.MeshPhongMaterial({ color: 0x000000, flatShading: false });
const material4 = new THREE.MeshPhongMaterial({ color: 0xBE4321, flatShading: false });
const material5 = new THREE.MeshPhongMaterial({ color: 0xBE4321, flatShading: false });
const material6 = new THREE.MeshPhongMaterial({ color: 0x9B9B9B, flatShading: false });
const material7 = new THREE.MeshPhongMaterial({ color: 0x2F8899, transparent: true, opacity: 0.5, flatShading: false, side: THREE.DoubleSide });
const material8 = new THREE.MeshPhongMaterial({ color: 0x7CEAFF, transparent: true, opacity: .95, flatShading: false, side: THREE.DoubleSide });
const material9 = new THREE.MeshPhongMaterial({ color: 0x585858, flatShading: false });
const material10 = new THREE.MeshPhongMaterial({ color: 0xCCCCCC, flatShading: false });
const material11 = new THREE.MeshPhongMaterial({ color: 0x6F4521, flatShading: false });
const material12 = new THREE.MeshPhongMaterial({ color: 0x6C6C6C, flatShading: false });
const material13 = new THREE.MeshPhongMaterial({ color: 0xD0C347, flatShading: false });
const material14 = new THREE.MeshPhongMaterial({ color: 0x61729C, flatShading: false });
const material15 = new THREE.MeshPhongMaterial({ color: 0x8FB1ED, flatShading: false });
const material16 = new THREE.MeshPhongMaterial({ color: 0xAC762D, flatShading: false });
const material17 = new THREE.MeshPhongMaterial({ color: 0xAF650E, flatShading: false });
const material18 = new THREE.MeshPhongMaterial({ color: 0xB60000, flatShading: false });

const textureLoader1 = new THREE.TextureLoader();
const redScalesTexture = textureLoader1.load('redScales.jpeg');
const redScalesMaterial = new THREE.MeshBasicMaterial({ map: redScalesTexture });

const textureLoader2 = new THREE.TextureLoader();
const blueGemTexture = textureLoader2.load('blueGem.jpeg');
const blueGemMaterial = new THREE.MeshBasicMaterial({ map: blueGemTexture });

const textureLoader3 = new THREE.TextureLoader();
const rockTexture = textureLoader3.load('rockTxtr.png');
const rockMaterial = new THREE.MeshBasicMaterial({ map: rockTexture });

const textureLoader4 = new THREE.TextureLoader();
const squidHouseTexture = textureLoader4.load('squidwardTexture.png');
const squidHouseMaterial = new THREE.MeshBasicMaterial({ map: squidHouseTexture });




// Fish1 class
class Fish1 extends THREE.Object3D {
  constructor() {
    super();
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
    var tailFin1Mesh = new THREE.Mesh(tailFin1, material1);
    tailFin1Mesh.position.x = 7.4;
    this.add(tailFin1Mesh);

    var tailFin2 = new THREE.BoxGeometry(1,3.5,.2);
    var tailFin2Mesh = new THREE.Mesh(tailFin2, material1);
    tailFin2Mesh.position.x = 7.4;
    tailFin2Mesh.rotation.x = (90 * Math.PI) / 180;
    this.add(tailFin2Mesh);


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
    var handleMesh = new THREE.Mesh(handle, material6);
    handleMesh.position.y = 4;
    handleMesh.position.x = 3;
    this.add(handleMesh);

    }



    scene.add(this);
  }
}

class Fish2 extends THREE.Object3D{
  constructor(){
    super();
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

    var tailFin1 = new THREE.BoxGeometry(2,.8,.1);
    var tailFin1Mesh = new THREE.Mesh(tailFin1, blueGemMaterial);
    tailFin1Mesh.position.x = 6;
    tailFin1Mesh.position.y = .5;
    tailFin1Mesh.rotation.z = (45 * Math.PI) / 180;
    this.add(tailFin1Mesh);

    var tailFin2 = new THREE.BoxGeometry(2,.8,.1);
    var tailFinMesh2 = new THREE.Mesh(tailFin2, blueGemMaterial);
    tailFinMesh2.position.x = 6;
    tailFinMesh2.position.y = -.5;
    tailFinMesh2.rotation.z = (-45 * Math.PI) / 180;
    this.add(tailFinMesh2);

    var tailFin3 = new THREE.BoxGeometry(1,.4,.1);
    var tailFinMesh3 = new THREE.Mesh(tailFin3, blueGemMaterial);
    tailFinMesh3.position.x = 7;
    tailFinMesh3.position.y = -.65;
    tailFinMesh3.rotation.z = (45 * Math.PI) / 180;
    this.add(tailFinMesh3);

    var tailFin4 = new THREE.BoxGeometry(1,.8,.1);
    var tailFinMesh4 = new THREE.Mesh(tailFin4, blueGemMaterial);
    tailFinMesh4.position.x = 7;
    tailFinMesh4.position.y = 1.1;
    this.add(tailFinMesh4);

    }

    scene.add(this);
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
      var body1Mesh = new THREE.Mesh( body1, material7 );
      this.add(body1Mesh);

      var body2 = new THREE.SphereGeometry( 1.5, 32, 16, phiStart, phiEnd, thetaStart, thetaEnd );
      var body2Mesh = new THREE.Mesh(body2, material8 );
      this.add(body2Mesh);
      }
      //arms
      {
        var arm1 = new THREE.BoxGeometry(1.3,1.5,1.3);
        var arm1Mesh = new THREE.Mesh(arm1, material7);
        this.add(arm1Mesh);

        var arm2 = new THREE.BoxGeometry(1,3,.01);
        var arm2Mesh = new THREE.Mesh(arm2, material7);
        this.add(arm2Mesh);

        var arm3 = new THREE.BoxGeometry(1,3,.01);
        var arm3Mesh = new THREE.Mesh(arm3, material7);
        arm3Mesh.rotation.y = (90 * Math.PI) / 180;
        this.add(arm3Mesh);



      }
      scene.add(this);
    }
}

class JellyGroup extends THREE.Object3D{
  constructor(){
    super();

    var jelly1 = new Fish3;
    this.add(jelly1);

    var jelly2 = new Fish3;
    jelly2.position.x = 2;
    jelly2.position.y = 3;
    this.add(jelly2);

    var jelly3 = new Fish3;
    jelly3.position.x = 4;
    jelly3.position.z = 3;
    this.add(jelly3);

    var jelly4 = new Fish3;
    jelly4.position.x = -2;
    jelly4.position.y = -2;
    jelly4.position.z = -3;
    this.add(jelly4);

    var jelly5 = new Fish3;
    jelly5.position.x = -4;
    this.add(jelly5);


    scene.add(this);
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

    var stick1 = new THREE.CylinderGeometry(.05, .05, 1, 32);
    var stick1Mesh = new THREE.Mesh(stick1, material13);
    stick1Mesh.position.y = 2;
    stick1Mesh.position.x = -.2;
    this.add(stick1Mesh);

    var stick2 = new THREE.CylinderGeometry(.05, .05, 1, 32);
    var stick2Mesh = new THREE.Mesh(stick2, material13);
    stick2Mesh.position.y = 2.5;
    stick2Mesh.position.x = -.2;
    stick2Mesh.rotation.z = (90 * Math.PI) / 180;
    this.add(stick2Mesh);

    var stick3 = new THREE.CylinderGeometry(.05, .05, .3, 32);
    var stick3Mesh = new THREE.Mesh(stick3, material13);
    stick3Mesh.position.y = 2.5;
    stick3Mesh.position.x = -.65;
    stick3Mesh.position.z = .1;
    stick3Mesh.rotation.z = (90 * Math.PI) / 180;
    stick3Mesh.rotation.y = (-45 * Math.PI) / 180;
    this.add(stick3Mesh);

    var stick4 = new THREE.CylinderGeometry(.05, .05, .3, 32);
    var stick4Mesh = new THREE.Mesh(stick4, material13);
    stick4Mesh.position.y = 2.5;
    stick4Mesh.position.x = -.65;
    stick4Mesh.position.z = -.1;
    stick4Mesh.rotation.z = (90 * Math.PI) / 180;
    stick4Mesh.rotation.y = (45 * Math.PI) / 180;
    this.add(stick4Mesh);

    var stick5 = new THREE.CylinderGeometry(.05, .05, .4, 32);
    var stick5Mesh = new THREE.Mesh(stick5, material13);
    stick5Mesh.position.y = 2.5;
    stick5Mesh.position.x = .23;
    stick5Mesh.rotation.z = (90 * Math.PI) / 180;
    stick5Mesh.rotation.y = (90 * Math.PI) / 180;
    this.add(stick5Mesh);

    var stick6 = new THREE.CylinderGeometry(.05, .05, .4, 32);
    var stick6Mesh = new THREE.Mesh(stick6, material13);
    stick6Mesh.position.y = 2.5;
    stick6Mesh.position.x = .1;
    stick6Mesh.rotation.z = (90 * Math.PI) / 180;
    stick6Mesh.rotation.y = (90 * Math.PI) / 180;
    this.add(stick6Mesh);



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

    var mainBodySphere1 = new THREE.SphereGeometry(.75,32,32);
    var mainBodySphere1Mesh = new THREE.Mesh(mainBodySphere1, material17);
    mainBodySphere1Mesh.position.y = 3;
    this.add(mainBodySphere1Mesh);

    var leftJaw = new THREE.BoxGeometry(.3,1,.3);
    var leftJawMesh = new THREE.Mesh(leftJaw, material2);
    leftJawMesh.position.y = 4;
    leftJawMesh.position.x = .5;
    leftJawMesh.rotation.z = (-20 * Math.PI) / 180;
    this.add(leftJawMesh);


    var leftJaw2 = new THREE.BoxGeometry(.3,1,.3);
    var leftJaw2Mesh = new THREE.Mesh(leftJaw2, material2);
    leftJaw2Mesh.position.y = 4.8;
    leftJaw2Mesh.position.x = .5;
    leftJaw2Mesh.rotation.z = (20 * Math.PI) / 180;
    this.add(leftJaw2Mesh)

    var rightJaw = new THREE.BoxGeometry(.3,1,.3);
    var rightJawMesh = new THREE.Mesh(rightJaw, material2);
    rightJawMesh.position.y = 4;
    rightJawMesh.position.x = -.5;
    rightJawMesh.rotation.z = (20 * Math.PI) / 180;
    this.add(rightJawMesh);


    var rightJaw2 = new THREE.BoxGeometry(.3,1,.3);
    var rightJaw2Mesh = new THREE.Mesh(rightJaw2, material2);
    rightJaw2Mesh.position.y = 4.8;
    rightJaw2Mesh.position.x = -.5;
    rightJaw2Mesh.rotation.z = (-20 * Math.PI) / 180;
    this.add(rightJaw2Mesh)

    var leftEye = new THREE.SphereGeometry(.2, 32, 32);
    var leftEyeMesh = new THREE.Mesh(leftEye, material18);
    leftEyeMesh.position.y = 3.3;
    leftEyeMesh.position.z = .45;
    leftEyeMesh.position.x = -.5;
    this.add(leftEyeMesh);

    var rightEye = new THREE.SphereGeometry(.2, 32, 32);
    var rightEyeMesh = new THREE.Mesh(rightEye, material18);
    rightEyeMesh.position.y = 3.3;
    rightEyeMesh.position.z = .45;
    rightEyeMesh.position.x = .5;
    this.add(rightEyeMesh);



    var mainBodySphere2 = new THREE.SphereGeometry(.75,32,32);
    var mainBodySphere2Mesh = new THREE.Mesh(mainBodySphere2, material17);
    mainBodySphere2Mesh.position.y = 2;
    this.add(mainBodySphere2Mesh);

    scene.add(this);

  }
}

class Submarine extends THREE.Object3D{
  constructor(){
    super();
    var mainBody = new THREE.CylinderGeometry(1.3,1.3,4,32);
    var mainBodyMesh = new THREE.Mesh(mainBody, material13);
    mainBodyMesh.rotation.z = (90 * Math.PI) / 180;
    this.add(mainBodyMesh);

    var frontCap = new THREE.SphereGeometry(1.3, 32, 32);
    var frontCapMesh = new THREE.Mesh(frontCap, material13);
    frontCapMesh.position.x = -2;
    this.add(frontCapMesh);

    var backCap = new THREE.SphereGeometry(1.3,32,32);
    var backCapMesh = new THREE.Mesh(backCap, material13);
    backCapMesh.position.x = 2;
    this.add(backCapMesh);

    var prop1 = new THREE.CylinderGeometry(.1,.1,.5,32);
    var prop1Mesh = new THREE.Mesh(prop1, material12);
    prop1Mesh.position.x = 3.5;
    prop1Mesh.rotation.z = (90 * Math.PI) / 180;
    this.add(prop1Mesh);

    var blade1 = new THREE.BoxGeometry(.1,.2,1);
    var blade1Mesh = new THREE.Mesh(blade1, material12);
    blade1Mesh.position.x = 3.8;
    this.add(blade1Mesh);

    var blade2 = new THREE.BoxGeometry(.1,.2,1);
    var blade2Mesh = new THREE.Mesh(blade2, material12);
    blade2Mesh.position.x = 3.8;
    blade2Mesh.rotation.x = (90 * Math.PI) / 180;
    this.add(blade2Mesh);

    var pariscope1 = new THREE.CylinderGeometry(.2,.2,1,32);
    var pariscope1Mesh = new THREE.Mesh(pariscope1, material12);
    pariscope1Mesh.position.y = 1.5;
    pariscope1Mesh.position.x = -1;
    this.add(pariscope1Mesh);

    var pariscope2 = new THREE.SphereGeometry(.2,32,32);
    var pariscope2Mesh = new THREE.Mesh(pariscope2, material12);
    pariscope2Mesh.position.y = 2;
    pariscope2Mesh.position.x = -1;
    this.add(pariscope2Mesh);

    var pariscope3 = new THREE.CylinderGeometry(.2,.2,.5,32);
    var pariscope3Mesh = new THREE.Mesh(pariscope3, material12);
    pariscope3Mesh.position.y = 2;
    pariscope3Mesh.position.x = -1.3;
    pariscope3Mesh.rotation.z = (90 * Math.PI) / 180;
    this.add(pariscope3Mesh);

    var frontWindows = new THREE.CylinderGeometry(.6,.6,2.7,32);
    var frontWindowsMesh = new THREE.Mesh(frontWindows, material12);
    frontWindowsMesh.rotation.x = (90 * Math.PI) / 180;
    frontWindowsMesh.position.x = -1;
    this.add(frontWindowsMesh);

    var backWindows = new THREE.CylinderGeometry(.6,.6,2.7,32);
    var backWindowsMesh = new THREE.Mesh(backWindows, material12);
    backWindowsMesh.rotation.x = (90 * Math.PI) / 180;
    backWindowsMesh.position.x = 1;
    this.add(backWindowsMesh);

    scene.add(this);
  }
}

class Squid extends THREE.Object3D{
  constructor(){
    super();
    var mainBody = new THREE.CylinderGeometry(1,1,4,32);
    var mainBodyMesh = new THREE.Mesh(mainBody, material5);
    this.add(mainBodyMesh);



    scene.add(this);
  }
}

//Lighting
{
// Additional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 4);
directionalLight.position.set(1, 1, 1).normalize();
scene.add(directionalLight);

// Lighting setup
const ambientLight = new THREE.AmbientLight(0x404040,10); // Set the color of the ambient light
scene.add(ambientLight);
}

//initializations
{
  /*
var fish1 = new Fish1();

var fish2 = new Fish2();
fish2.position.x = 15;

var fish3 = new JellyGroup();
fish3.position.x = -10;

var swordStone = new SwordStone();
swordStone.position.z = 10;
*/

var patrickHouse = new PatrickHouse();
//patrickHouse.position.z = -7;
//patrickHouse.position.x = -3;

//.var squidwardHouse = new SquidwardHouse();

//var antLion = new AntLion();

//var submarine = new Submarine();
//var squid = new Squid();
}

function animate() {
  // Update controls
  controls.update();

  // Update stats
  stats.update();

  // Render the scene
  renderer.render(scene, camera);

  // Call animate again
  requestAnimationFrame(animate);
}


animate();
