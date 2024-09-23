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

import CoffeeShop from './scenes/247_cyberpunk_store_lowres.glb';
import { BasicCharacterController } from '/utils/characters.module.js';


class paramaters{
    IsAboutMePage = false;

    APP_ = null;
    SCENECONTROLS_ = null;
    previousRAF_ = null;

    DEFAULT_MASS = 10;
    DEFALUT_CAM_POS = new THREE.Vector3(0, 2, 0);
    CAM_START_POS = new THREE.Vector3(60, 2, -20);
    TARGET_START_POS = new THREE.Vector3(60, 35, -22);

    BLOOM_SCENE = 1;
    bloomLayer = new THREE.Layers();


    darkMaterial = new THREE.MeshBasicMaterial({ color:  0x000000 });
    materials = {};

    scene = new THREE.Scene();
    loadingManager = new THREE.LoadingManager();
    hiResLoader = new THREE.LoadingManager();

    renderer = new THREE.WebGLRenderer({});

    topText = null;
    textBottom = null;  

    primaryColor = '#B6DBF2';
    primaryColorDark = '#10403B';
    secondaryColor = '#8AA6A3';
    tertiaryColor = '#10403B';
    constructor(){
        this.bloomLayer.set(this.BLOOM_SCENE);
        console.log("bloom layer", this.bloomLayer)
    }
}

export class techStack{    
    constructor(){
        this.params = new paramaters();
        //this._Init();
    }
    
    async _Init(){
        window.addEventListener('resize', () => {
            if(this.params.SCENECONTROLS_ === null) return;
            this.params.SCENECONTROLS_.camera.aspect = window.innerWidth / window.innerHeight;
            this.params.SCENECONTROLS_.camera.updateProjectionMatrix();
            this.params.renderer.setSize(window.innerWidth , window.innerHeight);
            this.params.SCENECONTROLS_.composer.setSize(window.innerWidth , window.innerHeight);
            this.params.SCENECONTROLS_.finalComposer.setSize(window.innerWidth , window.innerHeight);
        }), false;

        const canvas = document.querySelector('#tech-stack');
    
        this.params.renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
          });
        this.params.renderer.setPixelRatio(window.devicePixelRatio);
        this.params.renderer.setSize( window.innerWidth , window.innerHeight );
        this.params.renderer.shadowMap.enabled = true;
        this.params.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.params.renderer.toneMapping = THREE.CineionToneMapping;
        this.params.renderer.toneMappingExposure = 1.5;
        this.params.renderer.outputEncoding = THREE.sRGBEncoding;
        
        const progressBar = document.getElementById('progress-bar');
        if(progressBar !== null){
            console.log(this.params.loadingManager);   
            this.params.loadingManager.onProgress = function(url, loaded, total){
                progressBar.value = (loaded / total) * 100;
            }
        }
    
    
        const progressBarContainer = document.querySelector('.progress-bar-container');
        this.params.loadingManager.onLoad = this.loadingManagerFunction(this.params, progressBarContainer, () => { return  this.flickerStack} );
    };


    
    nonBloomed(obj, test){
        console.log("nonBloom", test);
        if((obj.isMesh || obj.isPoints) && this.params.bloomLayer.test(obj.layers) === false){
            materials[obj.uuid] = obj.material;
            obj.material = darkMaterial;
        }
    }
    
    restoreMaterial(obj){
        if(materials[obj.uuid]){
            obj.material = materials[obj.uuid];
            delete materials[obj.uuid];
        }
    }

    async triggerTechStack(){
        this.params.IsAboutMePage = document.querySelector('.home-bg') !== null;
        this.params.APP_ = new MyWorld(this.params);
        this.params.SCENECONTROLS_ = new SceneControls(this.params);
        this.animate();
        if(this.params.IsAboutMePage){
            document.addEventListener('scroll', this.scrollEventFunction(this.params) );
        }
        
        let updateAssetBtn = document.querySelector('.release-the-moster');
        if(updateAssetBtn !== null){
            updateAssetBtn.addEventListener('click', this.releaseMosterFunction(this.params, updateAssetBtn));
        }
    }

    releaseMosterFunction(params, buttonElement){
        return function(){
            // params.APP_._LoadAnimatedModel();
            params.APP_._myCharacter.ReleaseMonster();
            buttonElement.style.display = 'none';
        }
    }

    scrollEventFunction(params){
        return function(){
            const offset = new THREE.Vector3();
            const distance = 20;
            offset.x = distance * Math.sin( window.scrollY * 0.001 );
            offset.z = distance * Math.cos( window.scrollY * 0.001 );
            offset.y = 20;
        
            params.SCENECONTROLS_.camera.position.copy( params.CAM_START_POS).add( offset );
            params.SCENECONTROLS_.camera.lookAt( params.TARGET_START_POS );
        }
    }

    loadingManagerFunction(params, progressBarContainer, flickerFunction){
        return function () {
            if(progressBarContainer !== null){
                progressBarContainer.style.opacity = 0;
                setTimeout(() => {
                    if(!params.IsAboutMePage) params.SCENECONTROLS_.centerCamera(10); else flickerFunction;
                    progressBarContainer.style.display = 'none';
                }, 1000);
            } else{
                flickerFunction();
            }
    
    
            // const storeHiRes = new GLTFLoader(this.params.hiResLoader); 
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
    
            if(params.IsAboutMePage){
                params.APP_._LoadAnimatedModel();
            }else{
                // this.params.hiResLoader.onLoad = function(){
                //     this.params.scene.remove(scene.children.find((child) => child.name === 'coffeeShop_lores'));
                // }
            }
        }

    }
    
    animate(){
        requestAnimationFrame((t) => {
            if (this.params.previousRAF_ === null) {
                this.params.previousRAF_ = t;
            }
    
            this.params.scene.traverse((e) => {
                if((e.isMesh || e.isPoints) && this.params.bloomLayer.test(e.layers) === false){
                    this.params.materials[e.uuid] = e.material;
                    e.material = this.params.darkMaterial;
                }
            });
    
            if(!this.params.IsAboutMePage){
                this.params.scene.traverse((object) => {
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
    
    
            this.params.APP_.step_(t - this.params.previousRAF_);
            this.params.SCENECONTROLS_.composer.render();
            // this.params.scene.traverse(this.restoreMaterial);
            this.params.scene.traverse((o) => {
                if(this.params.materials[o.uuid]){
                    o.material = this.params.materials[o.uuid];
                    delete this.params.materials[o.uuid];
                }
            });
            this.params.SCENECONTROLS_.finalComposer.render();
            this.params.SCENECONTROLS_.handHeldCameraEffect();
            this.animate();
            this.params.previousRAF_ = t;
          });
    }

    clamp = (val, min, max) => Math.min(Math.max(val, min), max)

}




export class MyWorld{
    constructor(prams){
        this.initialize_(prams);
    }
    initialize_(prams){
        this._mixers = [];
        this.prams = prams;

        // SET ENVIRONMENT
        const store = new GLTFLoader(this.prams.loadingManager); store.load(CoffeeShop, function( gltf ) {
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
          prams.scene.add( gltf.scene);
          }, undefined, function ( error ) { console.error(error); });

        /// SET GROUND
        const groundGeometry = new THREE.BoxGeometry(400, 1, 200);
        const groundMaterial = new THREE.MeshStandardMaterial( {color: 'black', roughness: 1, metalness: .2} );
        const plane = new THREE.Mesh( groundGeometry, groundMaterial );
        plane.receiveShadow = true;
        this.prams.scene.add( plane );

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
             prams.scene.add(rainDrop)
          
          }
        
        if(!this.prams.IsAboutMePage){
            Array(500).fill().forEach(addRain);
        } else{
            this.prams.CAM_START_POS = new THREE.Vector3(0, 0, 80);
            this.prams.TARGET_START_POS = new THREE.Vector3(0, 20, 0);  
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
                const loader = new FontLoader(this.prams.loadingManager);
                const font = loader.load('/Tilt Neon_Regular.json');
                loader.load('/Tilt Neon_Regular.json', function(font){
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
                    const textMaterial = new THREE.MeshStandardMaterial({color: prams.secondaryColor, roughness: 1, metalness: 0.05});
                    const text = new THREE.Mesh(textGeometry, textMaterial);
                    text.castShadow = true;
                    text.receiveShadow = true;
                    text.position.set(techXPos, techYPos, -12);
                    text.quaternion.set(0, 0, 0, 1);
                    text.name = 'text';

                    prams.scene.add(text);
                });
            }
        }
        const logoSize = 7;
        const logoPositionX = 50;
        const logoPositionZ = -10;
        const logoPositionY = 25;
        const loader = new FontLoader(this.prams.loadingManager);
        const font = loader.load('/Michroma_Regular.json');
        loader.load('/Michroma_Regular.json', function(font){
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
                new THREE.MeshPhongMaterial( { color: prams.primaryColor, flatShading: false, specular: prams.primaryColor, shininess: 100 } ), // front
                new THREE.MeshPhongMaterial( { color: prams.primaryColorDark } ) // side
            ];
            prams.topText = new THREE.Mesh(textGeometryTop, textMaterial);
            prams.textBottom = new THREE.Mesh(textGeometryBottom, textMaterial);
            prams.textBottom.castShadow = true;
            prams.textBottom.position.y = logoPositionY;
            prams.textBottom.position.x = logoPositionX;
            prams.textBottom.position.z = logoPositionZ;
            prams.textBottom.name = 'textBottom';
            prams.scene.add(prams.textBottom);
            prams.topText.castShadow = true;
            prams.topText.position.y = logoPositionY + logoSize;
            prams.topText.position.x = logoPositionX;
            prams.topText.position.z = logoPositionZ;
            prams.topText.name = 'topText';
            prams.scene.add(prams.topText);
            console.log('LOGO', prams.scene);

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
        if(this.prams.APP_._myCharacter){
            this.prams.APP_._myCharacter.Update(timeElapsedS);
        }

        if(this.prams.SCENECONTROLS_.fpsCamera_ !== undefined){
            this.prams.SCENECONTROLS_.fpsCamera_.update(timeElapsedS);
        }
    }

    _LoadAnimatedModel() {
        const params = {
            camera: this.prams.SCENECONTROLS_.camera,
            scene: this.prams.scene
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
            this.prams.scene.add(fbx);
        });
    }
    
}

export class SceneControls{
    constructor(params){
        this.initialize_(params);
    }

    initialize_(params){
        this.params = params;

        this.handheldEffectActive = true;
        this.handheldEffectLoop = 0;
        this.handheldEffectIncreaseX = true;
        this.handheldEffectIncreaseY = true;
        this.handheldEffectXBoundary = 0.1;
        this.handheldEffectYBoundary = 0.5;

        this.camera = new THREE.PerspectiveCamera( 80, window.innerWidth  / window.innerHeight, 1, 1000 );
        this.camera.position.copy(params.CAM_START_POS);

        this.controls = new OrbitControls(this.camera, params.renderer.domElement);
        if(params.IsAboutMePage){
            this.controls.enabled = false;
            this.handheldEffectActive = false;
        }

        
        this.controls.minDistance = 1;
        this.controls.maxDistance = 1000;
        this.controls.minPolarAngle = 1;
        this.controls.maxPolarAngle = Math.PI / 2;
        this.controls.target = params.TARGET_START_POS;
        this.controls.update();
        
        this.renderScene = new RenderPass(params.scene, this.camera);
        this.composer = new EffectComposer(params.renderer);
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
    
        this.finalComposer = new EffectComposer(params.renderer);
    
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
        
        params.scene.fog = new THREE.Fog( 0x000000, 25, 200 );

        params.scene.add(light, ambientLight);
    }

    async centerCamera(seconds){
        this.handheldEffectActive = false;
        const ms = seconds * 1000;
        setTimeout(() => {
            this.setScene(this.params.CAM_START_POS.x, this.params.CAM_START_POS.y, this.params.CAM_START_POS.z + 40, 25, this.params.TARGET_START_POS.y, this.params.TARGET_START_POS.z, seconds * 0.4); 
        }, 0);
        setTimeout(() => {
            this.setScene(-10, 20, 5, -5, 20, -2, seconds * 0.2);
        }, (ms * .4) - 500);
        setTimeout(() => {
            this.setScene(0, 18, window.innerWidth > 600 ? 30 : 75, 0, 18, 0, seconds * 0.4);
        }, (ms * .6) - 500);
        setTimeout(() => {
            this.flickerStack();
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

    flickerStack(){
        let stack = this.params.scene.children.filter((child) => child.name === 'text');
        console.log('Stack', stack);
        for(let i = 0; i < 7; i++){
            setTimeout(() => {
                stack.forEach((text) => {
                    text.layers.toggle(this.params.BLOOM_SCENE);
                });
            }, 700/Math.pow(2, i));
        }
    
    }
}
export class FirstPersonCamera {
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