import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import gsap from "gsap";

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';

import {BasicCharacterController} from '../scripts/characters.js';


let IsAboutMePage = false;

let APP_ = null;
let SCENECONTROLS_ = null;
let previousRAF_ = null;

const DEFAULT_MASS = 10;
const DEFALUT_CAM_POS = new THREE.Vector3(0, 2, 0);
let CAM_START_POS = new THREE.Vector3(60, 2, -20);
let TARGET_START_POS = new THREE.Vector3(60, 35, -22);

const BLOOM_SCENE = 1;
const bloomLayer = new THREE.Layers();
bloomLayer.set(BLOOM_SCENE);
const darkMaterial = new THREE.MeshBasicMaterial({ color:  0x000000 });
const materials = {};

const scene = new THREE.Scene();
const loadingManager = new THREE.LoadingManager();
const hiResLoader = new THREE.LoadingManager();

let renderer = new THREE.WebGLRenderer({});

function nonBloomed(obj){
    if((obj.isMesh || obj.isPoints) && bloomLayer.test(obj.layers) === false){
        materials[obj.uuid] = obj.material;
        obj.material = darkMaterial;
    }
}

function restoreMaterial(obj){
    if(materials[obj.uuid]){
        obj.material = materials[obj.uuid];
        delete materials[obj.uuid];
    }
}


let topText = null;
let textBottom = null;  

const primaryColor = '#B6DBF2';
const primaryColorDark = '#10403B';
const secondaryColor = '#8AA6A3';
const tertiaryColor = '#10403B';

window.addEventListener('resize', onWindowResize, false);

export function loadTechstack() {
    const canvas = document.querySelector('#tech-stack');

    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
      });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize( window.innerWidth , window.innerHeight );
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.CineionToneMapping;
    renderer.toneMappingExposure = 1.5;
    renderer.outputEncoding = THREE.sRGBEncoding;

    console.log('Tech Stack Loaded');

    const progressBar = document.getElementById('progress-bar');
    if(progressBar !== null){
        console.log('Progress Bar Found');
        loadingManager.onProgress = function(url, loaded, total){
            progressBar.value = (loaded / total) * 100;
        }
    }


    const progressBarContainer = document.querySelector('.progress-bar-container');
    loadingManager.onLoad = function(){
        if(progressBarContainer !== null){
            progressBarContainer.style.opacity = 0;
            setTimeout(() => {
                if(!IsAboutMePage) SCENECONTROLS_.centerCamera(10); else flickerStack();
                progressBarContainer.style.display = 'none';
            }, 1000);
        } else{
            flickerStack();
        }


        const storeHiRes = new GLTFLoader(hiResLoader); 
        // storeHiRes.load('../assets/scenes/247_cyberpunk_store.glb', function( gltf ) {
        //     gltf.scene.position.x = 0;
        //     gltf.scene.position.y = 2;
        //     gltf.scene.position.z = -20;
        //     gltf.scene.rotation.y = -1.87;
        //     gltf.scene.scale.set(10, 10, 10);
        //     gltf.scene.name = "coffeeShop";
        //     gltf.scene.traverse( function( node ) {
        
        //     node.castShadow = true; 
        //     node.receiveShadow = true;
        
        // });
        
        // scene.add( gltf.scene);
        // }, undefined, function ( error ) { console.error(error); });

        if(IsAboutMePage){
            APP_._LoadAnimatedModel();
        }else{
            hiResLoader.onLoad = function(){
                scene.remove(scene.children.find((child) => child.name === 'coffeeShop_lores'));
            }
        }

    }

    IsAboutMePage = document.querySelector('.home-bg') !== null;
        APP_ = new MyWorld();
        SCENECONTROLS_ = new SceneControls();
        animate();
        if(IsAboutMePage){
            const offset = new THREE.Vector3();
            const distance = 20;
    
            document.addEventListener('scroll', function(){
                offset.x = distance * Math.sin( window.scrollY * 0.001 );
                offset.z = distance * Math.cos( window.scrollY * 0.001 );
                offset.y = 20;
            
                SCENECONTROLS_.camera.position.copy( CAM_START_POS).add( offset );
                SCENECONTROLS_.camera.lookAt( TARGET_START_POS );
        });
        }
    
        let updateAssetBtn = document.querySelector('.release-the-moster');
        if(updateAssetBtn !== null){
            console.log(updateAssetBtn);
            updateAssetBtn.addEventListener('click', function(){
                //APP_._LoadAnimatedModel();
                APP_._myCharacter.ReleaseMonster();
                updateAssetBtn.style.display = 'none';
            });
        }
};

function animate(){
    requestAnimationFrame((t) => {
        if (previousRAF_ === null) {
          previousRAF_ = t;
        }

        scene.traverse(nonBloomed);

        if(!IsAboutMePage){
            scene.traverse((object) => {
                if (object.isPoints && object.name === 'rain') {
                    object.velocity -= 0.1 * Math.random() * 1;
                    object.position.y += object.velocity;
                    if (object.position.y < 1) {
                        object.position.y = 100;
                        object.velocity = 0;
                        object.position.x = Math.random() * 200 - 100;
                    }
                }
            });
        }


        APP_.step_(t - previousRAF_);
        SCENECONTROLS_.composer.render();
        scene.traverse(restoreMaterial);
        SCENECONTROLS_.finalComposer.render();
        SCENECONTROLS_.handHeldCameraEffect();
        animate();
        previousRAF_ = t;
      });
}

function onWindowResize(){
    if(SCENECONTROLS_ === null) return;
    SCENECONTROLS_.camera.aspect = window.innerWidth / window.innerHeight;
    SCENECONTROLS_.camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth , window.innerHeight);
    SCENECONTROLS_.composer.setSize(window.innerWidth , window.innerHeight);
    SCENECONTROLS_.finalComposer.setSize(window.innerWidth , window.innerHeight);
}


class MyWorld{
    constructor(){
        this.initialize_();
    }
    initialize_(){
        this._mixers = [];

        // SET ENVIRONMENT
        const store = new GLTFLoader(loadingManager); store.load('../assets/scenes/247_cyberpunk_store_lowres.glb', function( gltf ) {
            gltf.scene.position.x = 0;
            gltf.scene.position.y = 2;
            gltf.scene.position.z = -20;
            gltf.scene.rotation.y = -1.87;
            gltf.scene.scale.set(10, 10, 10);
            gltf.scene.name = "coffeeShop_lores";
            gltf.scene.traverse( function( node ) {
          
               node.castShadow = true; 
               node.receiveShadow = true;
          
          } );
          scene.add( gltf.scene);
          }, undefined, function ( error ) { console.error(error); });

        /// SET GROUND
        const groundGeometry = new THREE.BoxGeometry(400, 1, 200);
        const groundMaterial = new THREE.MeshStandardMaterial( {color: 'black', roughness: 1, metalness: .2} );
        const plane = new THREE.Mesh( groundGeometry, groundMaterial );
        plane.receiveShadow = true;
        scene.add( plane );

        function addRain() {
            const geometry = new THREE.SphereGeometry(.05, 10, 10);
            const material = new THREE.PointsMaterial( { color: 0xaaaaaa, size: 0.1, transparent: true})
            const rainDrop = new THREE.Points( geometry, material );
          
            const [x, z] = Array(2).fill().map(() => THREE.MathUtils.randFloatSpread( 100 ) );
            const y = THREE.MathUtils.randFloat( 0, 200 ) ;
            rainDrop.position.set(
                Math.random() * 200 - 100,
                Math.random() * 400 - 200,
                Math.random() * 200 - 100
             );
             rainDrop.velocity = {};
             rainDrop.velocity = 0;
             rainDrop.name = 'rain';
            scene.add(rainDrop)
          
          }
        
        if(!IsAboutMePage){
            Array(500).fill().forEach(addRain);
        } else{
            CAM_START_POS = new THREE.Vector3(0, 0, 80);
            TARGET_START_POS = new THREE.Vector3(0, 20, 0);  
        }
        const stack = [
            {"tech": ["SQL Server", "Mongo DB","Azure", "Docker"]},
            {"tech": [".Net Core", "asp.net", "Angular", "NX"]},            
            {"tech": ["TypeScript", "JavaScript", "HTML", "CSS", "SASS", "C#"]},
        ];
        let height = 1.5;
        let startXPos = -7;
        let longestTech = 0;
        for (let x = 0; x < stack.length; x++){
            startXPos = startXPos + (longestTech * height) - height;
            longestTech = 0;
            for (let i = 0; i < stack[x].tech.length; i++){
                const techYPos = i * height + 15;

                const tech = stack[x].tech[i];
                const techXPos = startXPos;

                if (tech.length > longestTech){
                    longestTech = tech.length;
                }
                const loader = new FontLoader(loadingManager);
                const font = loader.load('../assets/fonts/Tilt Neon_Regular.json');
                loader.load('../assets/fonts/Tilt Neon_Regular.json', function(font){
                    const textGeometry = new TextGeometry(tech, {
                        font: font,
                        size: height,
                        depth: .3,
                        curveSegments: .01,
                        bevelEnabled: true,
                        bevelThickness: .0022,
                        bevelSize: .001,
                        bevelOffset: 0,
                        bevelSegments: 1,
                        margin: 0.05
                    });
                    const textMaterial = new THREE.MeshStandardMaterial({color: secondaryColor, roughness: 1, metalness: 0.05});
                    const text = new THREE.Mesh(textGeometry, textMaterial);
                    text.castShadow = true;
                    text.receiveShadow = true;
                    text.position.set(techXPos, techYPos, -12);
                    text.quaternion.set(0, 0, 0, 1);
                    text.name = 'text';

                    scene.add(text);
                });
            }
        }
        const logoSize = 7;
        const logoPositionX = 50;
        const logoPositionZ = -10;
        const logoPositionY = 25;
        const loader = new FontLoader(loadingManager);
        loader.load('../assets/fonts/Michroma_Regular.json', function(font){
            const textGeometryTop = new TextGeometry('ET', {
                font: font,
                size: logoSize,
                depth: 1,
                curveSegments: .01,
                bevelEnabled: true,
                bevelThickness: .0022,
                bevelSize: .001,
                bevelOffset: 0,
                bevelSegments: 1,
                mirror: true,
            });
            const textGeometryBottom = new TextGeometry('DEV', {
                font: font,
                size: logoSize,
                depth: 1,
                curveSegments: .01,
                bevelEnabled: true,
                bevelThickness: .0022,
                bevelSize: .001,
                bevelOffset: 0,
                bevelSegments: 1,
            });
            const textMaterial = [
                new THREE.MeshPhongMaterial( { color: primaryColor, flatShading: false, specular: primaryColor, shininess: 100 } ), // front
                new THREE.MeshPhongMaterial( { color: primaryColorDark } ) // side
            ];
            topText = new THREE.Mesh(textGeometryTop, textMaterial);
            textBottom = new THREE.Mesh(textGeometryBottom, textMaterial);
            textBottom.castShadow = true;
            textBottom.position.y = logoPositionY;
            textBottom.position.x = logoPositionX;
            textBottom.position.z = logoPositionZ;
            textBottom.name = 'textBottom';
            scene.add(textBottom);
            topText.castShadow = true;
            topText.position.y = logoPositionY + logoSize;
            topText.position.x = logoPositionX;
            topText.position.z = logoPositionZ;
            topText.name = 'topText';
            scene.add(topText);
        });


        this.countdown_ = 1.0;
        this.count_ = 0;
        this.previousRAF_ = null;         
         
    }

    step_(timeElapsed){
        const timeElapsedS = timeElapsed * 0.001;

        this.countdown_ -= timeElapsedS;

        if (this._mixers) {
            this._mixers.map(m => m.update(timeElapsedS));
          }
        if(APP_._myCharacter){
            APP_._myCharacter.Update(timeElapsedS);
        }

        if(SCENECONTROLS_.fpsCamera_ !== undefined){
            SCENECONTROLS_.fpsCamera_.update(timeElapsedS);
        }
    }

      _LoadAnimatedModel() {
        const params = {
          camera: SCENECONTROLS_.camera,
          scene: scene
        }
        this._myCharacter = new BasicCharacterController(params);
      }

      _LoadAnimatedModelAndPlay(path, modelFile, animFile, offset) {
        const loader = new FBXLoader();
        loader.setPath(path);
        loader.load(modelFile, (fbx) => {
          fbx.scale.setScalar(0.1);
          fbx.traverse(c => {
            c.castShadow = true;
          });
          fbx.position.copy(offset);
    
          const anim = new FBXLoader();
          anim.setPath(path);
          anim.load(animFile, (anim) => {
            const m = new THREE.AnimationMixer(fbx);
            this._mixers.push(m);
            const idle = m.clipAction(anim.animations[0]);
            idle.play();
          });
          scene.add(fbx);
        });
      }
    
}

class SceneControls{
    constructor(){
        this.initialize_();
    }

    initialize_(){
        this.handheldEffectActive = true;
        this.handheldEffectLoop = 0;
        this.handheldEffectIncreaseX = true;
        this.handheldEffectIncreaseY = true;
        this.handheldEffectXBoundary = 0.1;
        this.handheldEffectYBoundary = 0.5;

        this.camera = new THREE.PerspectiveCamera( 80, window.innerWidth  / window.innerHeight, 1, 1000 );
        this.camera.position.copy(CAM_START_POS);

        this.controls = new OrbitControls(this.camera, renderer.domElement);
        if(IsAboutMePage){
            this.controls.enabled = false;
            this.handheldEffectActive = false;
        }

        
        this.controls.minDistance = 1;
        this.controls.maxDistance = 1000;
        this.controls.minPolarAngle = 1;
        this.controls.maxPolarAngle = Math.PI / 2;
        this.controls.target = TARGET_START_POS;
        this.controls.update();
        
        this.renderScene = new RenderPass(scene, this.camera);
        this.composer = new EffectComposer(renderer);
        this.bloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth , window.innerHeight), 
            1.5, 
            0.005, 
            0.05
        );
        this.mixPass = new ShaderPass(
            new THREE.ShaderMaterial({
                uniforms: {
                    baseTexture: { value: null },
                    bloomTexture: { value: this.composer.renderTarget2.texture }
                },
                vertexShader: document.getElementById('vertexshader').textContent,
                fragmentShader: document.getElementById('fragmentshader').textContent,
            }), 'baseTexture'
        );
    
        this.finalComposer = new EffectComposer(renderer);
    
        this.outputPass = new OutputPass();
        


        
        this.composer.setSize(window.innerWidth , window.innerHeight);
        this.composer.addPass(this.renderScene);
        this.composer.addPass(this.bloomPass);
        this.composer.renderToScreen = false;

        //this.composer.addPass(this.outputPass);

        this.finalComposer.setSize(window.innerWidth , window.innerHeight);
        this.finalComposer.addPass(this.renderScene);
        this.finalComposer.addPass(this.mixPass);
        this.finalComposer.addPass(this.outputPass);


        //this.camera.position.copy(CAM_START_POS);
        
        const light = new THREE.DirectionalLight(0xffffff, 1, 100);
        light.position.set( -10, 200, 50 );
        light.castShadow = true;
        light.shadow.mapSize.width = 512; // default
        light.shadow.mapSize.height = 512; // default
        light.shadow.camera.near = .5; // default
        light.shadow.camera.far = 500; // default
        light.shadow.camera.left = -100;
        light.shadow.camera.right = 75;
        light.shadow.camera.top = 40;
        light.shadow.camera.bottom = -50;
        const ambientLight = new THREE.AmbientLight(0xffffff);
        
        scene.fog = new THREE.Fog( 0x000000, 25, 200 );

        scene.add(light, ambientLight);
    }

    async centerCamera(seconds){
        this.handheldEffectActive = false;
        const ms = seconds * 1000;
        setTimeout(() => {
            this.setScene(CAM_START_POS.x, CAM_START_POS.y, CAM_START_POS.z + 40, 25, TARGET_START_POS.y, TARGET_START_POS.z, seconds * 0.4); 
        }, 0);
        setTimeout(() => {
            this.setScene(-10, 20, 5, -5, 20, -2, seconds * 0.2);
        }, (ms * .4) - 500);
        setTimeout(() => {
            this.setScene(0, 18, window.innerWidth > 600 ? 30 : 75, 0, 18, 0, seconds * 0.4);
        }, (ms * .6) - 500);
        setTimeout(() => {
            flickerStack();
            this.handheldEffectActive = true;

            // NOT READY YET
            // this.controls.enabled = false;
            // canvas.addEventListener('click', async function(e){
            //     if (document.pointerLockElement === canvas) {
            //         SCENECONTROLS_.fpsCamera_.input_.controlsLock = false;
            //         SCENECONTROLS_.controls.enabled = true;
            //         await document.exitPointerLock();
            //     } else {
            //         await canvas.requestPointerLock({
            //             unadjustedMovment: true,
            //         });
            //         if(SCENECONTROLS_.fpsCamera_ === undefined){    
            //             await SCENECONTROLS_.setFpsCamera();
            //         }
            //         SCENECONTROLS_.controls.enabled = false;
            //         SCENECONTROLS_.fpsCamera_.input_.controlsLock = true;         
            //     }
            // });
        }, ms);
    }

    setScene(cx, cy, cz,tx ,ty ,tz, seconds, easeOption = "back.inOut(1)"){
        let controls = this.controls;
        gsap.to(this.controls.target, {
            x: tx,
            y: ty,
            z: tz,
            duration: seconds,
            onUpdate: function(){
                controls.update();
              }
        });
        gsap.to(this.camera.position, {
            x: cx,
            y: cy,
            z: cz,
            duration: seconds,
            ease: easeOption,
              onUpdate: function(){
              }
          });
    }

    handHeldCameraEffect(){
        if(this.handheldEffectActive === false) return;
        if(this.handheldEffectLoop > 1){
            this.handheldEffectIncrease = false;
        } else if(this.handheldEffectLoop < -1){
            this.handheldEffectIncrease = true;
        }

        if(this.handheldEffectIncrease){
            this.handheldEffectLoop += 0.01;
            this.handheldEffectIncrement = 0.000001;
        }else{
            this.handheldEffectLoop -= 0.01;
            this.handheldEffectIncrement = -0.000001;
        }

        let x = Math.sin(this.handheldEffectLoop) * .001;
        let y = Math.sin(this.handheldEffectLoop) * .001;
        let z = Math.sin(this.handheldEffectLoop) * .001;

        this.camera.position.x += ((Math.random(), 10) * x);
        this.camera.position.y += ((Math.random(), 10) * y);
        this.camera.position.z += ((Math.random(), 10) * z);
    }

    setFpsCamera(){
        this.fpsCamera_ = new FirstPersonCamera(this.camera);
    }
}
class FirstPersonCamera {
    constructor(camera){
        this.camera_ = camera;
        this.input_ = new InputController();
        this.rotation_ = new THREE.Quaternion();
        //this.translation_ = new THREE.Vector3(0, 18, 0);
        this.translation_ = new THREE.Vector3().copy(camera.position);
        this.phi_ = 0;
        this.phiSpeed_ = 4;
        this.theta_ = 0;
        this.thetaSpeed_ = 2.5;

        this.headBobActive_ = false;
        this.headBobTimer_ = 0;
    }

    update(timeElapsedS){
        if(!this.input_.controlsLock){
            return;
        }
        this.updateRotation_(timeElapsedS);
        this.updateCamera_(timeElapsedS);
        this.updateTranslation_(timeElapsedS);
        this.updateHeadBob_(timeElapsedS);
        this.input_.update(timeElapsedS)
    }

    updateCamera_(_){
        this.camera_.quaternion.copy(this.rotation_);
        this.camera_.position.copy(this.translation_);
        this.camera_.position.y += Math.sin(this.headBobTimer_ * 10) * .5;
    }

    updateHeadBob_(timeElapsedS){
        if (this.headBobActive_) {
            const wavelength = Math.PI;
            const nextStep = 1 + Math.floor(((this.headBobTimer_ + 0.000001) * 10) / wavelength);
            const nextStepTime = nextStep * wavelength / 10;
            this.headBobTimer_ = Math.min(this.headBobTimer_ + timeElapsedS, nextStepTime);
      
            if (this.headBobTimer_ == nextStepTime) {
              this.headBobActive_ = false;
            }
          }
    }

    updateTranslation_(timeElapsedS){
        const forwardVelocity = (this.input_.key(87) ? 1 : 0) + (this.input_.key(83) ? -1 : 0);
        const strafeVelocity = (this.input_.key(65) ? 1 : 0) + (this.input_.key(68) ? -1 : 0);

        const qx = new THREE.Quaternion();
        qx.setFromAxisAngle(new THREE.Vector3(0, 1, 0), this.phi_);
    
        const forward = new THREE.Vector3(0, 0, -1);
        forward.applyQuaternion(qx);
        forward.multiplyScalar(forwardVelocity * timeElapsedS * 10);
    
        const left = new THREE.Vector3(-1, 0, 0);
        left.applyQuaternion(qx);
        left.multiplyScalar(strafeVelocity * timeElapsedS * 10);
    
        this.translation_.add(forward);
        this.translation_.add(left);

        if(forwardVelocity != 0 || strafeVelocity != 0){
            this.headBobActive_ = true;
        }
    }

    updateRotation_(timeElapsedS){
        const xh = this.input_.current_.mouseXDelta / window.innerWidth;
        const yh = this.input_.current_.mouseYDelta / window.innerHeight;
        if(isNaN(xh) || isNaN(yh)){
            return;
        }
        this.phi_ += -xh * this.phiSpeed_;
        this.theta_ = clamp(this.theta_ + -yh * this.thetaSpeed_, -Math.PI / 3, Math.PI / 3);
    
        const qx = new THREE.Quaternion();
        qx.setFromAxisAngle(new THREE.Vector3(0, 1, 0), this.phi_);
        const qz = new THREE.Quaternion();
        qz.setFromAxisAngle(new THREE.Vector3(1, 0, 0), this.theta_);
    
        const q = new THREE.Quaternion();
        q.multiply(qx);
        q.multiply(qz);
    
        this.rotation_.copy(q);
    }
}

function flickerStack(){
    let stack = scene.children.filter((child) => child.name === 'text');
    console.log('Stack', stack);
    for(let i = 0; i < 7; i++){
        setTimeout(() => {
            stack.forEach((text) => {
                text.layers.toggle(BLOOM_SCENE);
            });
        }, 700/Math.pow(2, i));
    }

}
const clamp = (val, min, max) => Math.min(Math.max(val, min), max)
