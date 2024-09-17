//import '../css/model.css'

import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Mesh } from 'three';
import gsap from "gsap";

import { Chart } from 'chart.js';


export class oilProjectGraphics{
    constructor(){
        this._init();
    };

    _init(){
        const scene = new THREE.Scene();
        var focusPipe;
        var blueGroup = new THREE.Group();
        blueGroup.name = "blueGroup";
        var redGroup = new THREE.Group();
        redGroup.name = "redGroup";
        var greenGroup = new THREE.Group();
        greenGroup.name = "greenGroup";
        var yellowGroup = new THREE.Group();
        yellowGroup.name = "yellowGroup";
        
        var focusGroup = new THREE.Group();
        focusGroup.name = 'focusGroup';
        
        const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
        camera.lookAt(0,0,0);
        
        const renderer = new THREE.WebGLRenderer({
          canvas: document.querySelector('#bg'),
        });
        
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
        camera.position.setZ(0);
        camera.position.setY(30);
        camera.position.setX(30);
        
        const light = new THREE.DirectionalLight(0xffffff, 1, 100);
        light.position.set( -100, 50, 100 )
        light.castShadow = true;
        light.shadow.mapSize.width = 512; // default
        light.shadow.mapSize.height = 512; // default
        light.shadow.camera.near = 0.5; // default
        light.shadow.camera.far = 500; // default
        
        const ambientLight = new THREE.AmbientLight(0xffffff);
        scene.add(light, ambientLight);
        
        const lightHelper = new THREE.PointLightHelper(light, 3, 0x00FF51)
        const gridHelper = new THREE.GridHelper(200, 50, 'red', 'blue');
        scene.add(lightHelper, gridHelper)
        
        const controls = new OrbitControls( camera, renderer.domElement);
        
        const loadingManager = new THREE.LoadingManager();
        
        const progressBar = document.getElementById('progress-bar');
        loadingManager.onProgress = function(url, loaded, total){
          progressBar.value = (loaded / total) * 100;
        }
        
        const progressBarContainer = document.querySelector('.progress-bar-container');
        loadingManager.onLoad = function(){
           progressBarContainer.style.display = 'none';
           centerCamera(2);
         }
        
        const oilWellLoader = new GLTFLoader(loadingManager); oilWellLoader.load('../assets/scenes/oil_pump_jack/scene.gltf', function( gltf ) {
          gltf.scene.position.x = -2.35;
          gltf.scene.position.y = 0;
          gltf.scene.position.z = 0;
          gltf.scene.rotation.y = -1.57;
          gltf.scene.name = "OilWell";
          gltf.scene.traverse( function( node ) {
        
            //  node.castShadow = true; 
            //  node.receiveShadow = true;
        
        } );
        scene.add( gltf.scene);
        }, undefined, function ( error ) { console.error(error); });
        
        
        function addStar() {
          const geometry = new THREE.SphereGeometry(0.25, 24, 24);
          const material = new THREE.MeshStandardMaterial( { color: 0xffffff})
          const star = new THREE.Mesh( geometry, material );
        
          const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread( 500 ) );
          star.position.set(x, y, z )
          scene.add(star)
        
        }
        
        Array(200).fill().forEach(addStar);
        
        
        const moonTexture = new THREE.TextureLoader(loadingManager).load('../assets/scenes/moon.jpeg');
        const normalTexture = new THREE.TextureLoader(loadingManager).load('../assets/scenes/moonTexture.jpeg');
        
        const moon = new THREE.Mesh(
          new THREE.SphereGeometry(8, 32, 32),
          new THREE.MeshStandardMaterial( {
            map: moonTexture,
            normalMap: normalTexture
          })
        );
        moon.position.y = 75;
        moon.position.x = 150;
        moon.position.z = -200;
        // moon.castShadow = false;
        // moon.receiveShadow = true;
        moon.name = "Moon";
        scene.add(moon);
        
        
        
        const well = new THREE.Mesh(
          new THREE.ConeGeometry(2, 3),
          new THREE.MeshStandardMaterial( {
            color: 0x4A95E5,
            // receiveShadow: true,
            // castShadow: true
            //normalMap: normalTexture
          })
        );
        well.position.y = 1.7;
        
        function addPipe(pipeDataList){
          const pipeHeight = 1.1;
          const position = pipeHeight*pipeDataList.pipeNumber;
          const geometry = new THREE.CylinderGeometry(0.1, 0.1, pipeHeight, 15, 25, true );
          geometry.computeBoundingBox();
          const material = new THREE.MeshBasicMaterial( {  
            color: pipeDataList.pipeColor,
          wireframe: true});
          const pipe = new THREE.Mesh( geometry, material );
        
          pipe.position.y = .5 - position;
          pipe.name = "PipeNumber"+pipeDataList.pipeNumber;
          ///scene.add(pipe)
          switch(pipeDataList.pipeColor){
            case 'red':
              redGroup.add(pipe);
              break;
            case 'blue':
              blueGroup.add(pipe);
              break;
            case 'green':
              greenGroup.add(pipe);
              break;
            case 'yellow':
              yellowGroup.add(pipe);
              break;
            default:
            break
          }
          scene.add(redGroup);
          scene.add(blueGroup);
          scene.add(greenGroup);
          scene.add(yellowGroup);
          // TEXT
          const textLoader = new FontLoader(loadingManager);
          const subTextLoader = new FontLoader(loadingManager);
          const font = textLoader.load(
            '../assets/fonts/Heebo Black_Regular.json',
          );
          textLoader.load('../assets/fonts/Heebo Black_Regular.json', function ( font ){
            const geometryText = new TextGeometry( 'Pipe #'+ pipeDataList.pipeNumber, {
              font: font,
              size: .12,
              depth: .00125,
              curveSegments: .01,
              bevelEnabled: true,
              bevelThickness: .0022,
              bevelSize: .001,
              bevelOffset: 0,
              bevelSegments: 1
            } );
            var materialText = new THREE.MeshBasicMaterial({ color: 0xC3DBF5 });
        
            var geoText = new Mesh(geometryText, materialText);
            geoText.position.y = .7 - position
            geoText.position.x = .2
            scene.add(geoText)
          });
        
          subTextLoader.load('../assets/fonts/Heebo Black_Regular.json', function ( font ){
            const geometrySubText = new TextGeometry( 
              `Overall Grade:  ${pipeDataList.overallGrade} \nPitting: ${pipeDataList.pittingGrade} \nRodwear: ${pipeDataList.rodwearGrade} \nDepth: ${pipeDataList.pipeNumber + 100}  ft`
              , {
              font: font,
              size: .05,
              depth: .0005,
              curveSegments: .01,
              bevelEnabled: true,
              bevelThickness: .0022,
              bevelSize: .001,
              bevelOffset: 0,
              bevelSegments: 1
            } );
            var materialText = new THREE.MeshBasicMaterial({ color: 0xC3DBF5 });
        
            var geoSubText = new Mesh(geometrySubText, materialText);
            geoSubText.position.y = .5 - position
            geoSubText.position.x = .2
            scene.add(geoSubText)
          });
        }
        // pipeDataList.forEach(addPipe);
        
        var wellScaleX = .002;
        var wellPositionY = .005;
        
        function animate(){
          requestAnimationFrame( animate );
        
          well.rotation.y += 0.02;
        
          var roundNumber = Math.round((well.scale.x + Number.EPSILON) * 100) / 100;
        
          if(roundNumber === 1){
            wellScaleX = -.002;
            wellPositionY = -.005;
          }
          if(roundNumber === .8){
            wellScaleX = .002;
            wellPositionY = .005;
          }
          
          well.scale.x += wellScaleX;
          well.scale.y += wellScaleX;
          well.scale.z += wellScaleX;
          well.position.y += wellPositionY;
        
          if(typeof focusPipe !== 'undefined'){
            focusPipe.rotation.y += 0.005;
          }
        
          controls.update();
        
          renderer.render( scene, camera );
        
          if(moveup){
            camera.position.y += ArrowUpVar;
            controls.target.y += ArrowUpVar;
          }
          if(moveright){
            camera.position.z += ArrowDownVar;
            controls.target.z += ArrowDownVar;
          }
          if(movedown){
            camera.position.y += ArrowDownVar;
            controls.target.y += ArrowDownVar;
          }
          if(moveleft){
            camera.position.z += ArrowUpVar;
            controls.target.z += ArrowUpVar;
          }
          if(moveforward){
        
          }
          if(moveback){
            
          }
        
        }
        
        animate()
        
        
        function centerCamera(seconds){
          gsap.to(camera.position, {
            x: 0,
            y: 2,
            z: 30,
            duration: seconds,
            onUpdate: function(){
              camera.lookAt(0,0,0);
              controls.target.set(0,0,0);
            }
          });
        }
        
        function focusPipeAnimation(pipeNumber){
          let cameraZ = 1;
        
          if (pipeNumber.toLowerCase() == "moon"){
            cameraZ = -225;
            focusPipe = scene.getObjectByName("Moon");
          }
          else{
            focusPipe = scene.getObjectByName("PipeNumber"+pipeNumber);
          }
          gsap.to(camera.position, {
            x: focusPipe.position.x,
            y: focusPipe.position.y,
            z: cameraZ,
        
            duration: 2,
            onUpdate: function(){
              camera.lookAt(focusPipe.position.x + .25, focusPipe.position.y, focusPipe.position.z + 30);
              controls.target.set(focusPipe.position.x + .25, focusPipe.position.y, focusPipe.position.z);
            }
          });
        
          if(typeof focusPipe !== 'undefined' && pipeNumber !== "moon"){
            replacePipe(pipeNumber);
            bringPipeForward(focusPipe, cameraZ);
          }
        }
        
        function bringPipeForward(pipe){
          gsap.fromTo(pipe.position, {
            x: 0,
          }, {
            x: -.25,
            duration: 2,
            ease: "none"
          })
        }
        
        function replacePipe(currPipeNumber){
          var previousPipeNumber = document.getElementById("previousPipeNumber");
        
          if(previousPipeNumber.value != 0){
            var pipe = scene.getObjectByName("PipeNumber" + previousPipeNumber.value);
            gsap.fromTo(pipe.position, {
              x: -.25,
            }, {
              x: 0,
              duration: 2,
              ease: "none"
            })
          }
          previousPipeNumber.value = currPipeNumber;
        }
        
        document.getElementById("pipeGroups").addEventListener("click", function(){
          var pipeGroupColor = document.getElementById("pipeGroupInput").value;
          groupColors(pipeGroupColor);
        })
        
        function groupColors(color){
          focusGroup.clear();
          var pipeGroup = scene.getObjectByName(color + "Group");
          var positionX = -5;
          var positionY = -1;
          var positionZ = 0;
          var textPositionX = -4.7;
          var textPositionY = -1;
          var textPositionZ = 0;
          pipeGroup.children.forEach(element => {
        
            var clone = element.clone();
            clone.position.y = positionY;
            clone.position.x = positionX;
            clone.position.z = positionZ;
            clone.scale.x = .5;
            clone.scale.y = .5;
            clone.scale.z = .5;
            focusGroup.add(clone);
        
            const textLoader = new FontLoader(loadingManager);
            const font = textLoader.load(
              '../assets/fonts/Heebo Black_Regular.json',
          
              function (font){
                console.log(font);
              },
              function ( xhr ) {
                console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
              },
              function (err){
                console.log('An error happened');
              }
            );
            textLoader.load('../assets/fonts/Heebo Black_Regular.json', function ( font ){
              const geometryText = new TextGeometry( clone.name, {
                font: font,
                size: .1,
                depth: .00125,
                curveSegments: .01,
                bevelEnabled: true,
                bevelThickness: .0022,
                bevelSize: .001,
                bevelOffset: 0,
                bevelSegments: 1
              } );
              var materialText = new THREE.MeshBasicMaterial({ color: 0xC3DBF5 });
          
              var geoText = new Mesh(geometryText, materialText);
              geoText.position.y = textPositionY;
              geoText.position.x = textPositionX;
              geoText.position.z = textPositionZ;
              focusGroup.add(geoText)
              textPositionY = textPositionY - .7;
        
            });
        
            positionY = positionY - .7;
        
          });
        
          scene.add(focusGroup);
          gsap.to(camera.position, {
            x: focusGroup.children[0].positionX,
            y: focusGroup.children[0].positionY,
            z: 1,
            duration: 1,
            onUpdate: function(){
              camera.lookAt(focusGroup.children[0].positionX + 5, focusGroup.children[0].positionY, focusGroup.children[0].positionZ + 5);
              controls.target.set(focusGroup.children[0].positionX + 5, focusGroup.children[0].positionX, focusGroup.children[0].positionX);
            }
          });
        }
        
        var ArrowUpVar = 0.5;
        var ArrowDownVar =  -0.5;
        document.onkeydown = checkKeyDown;
        document.onkeyup = checkKeyUp;
        
        var moveup = false;
        var moveleft = false;
        var movedown = false;
        var moveright = false;
        var moveforward = false;
        var moveback = false
        
        document.addEventListener("keyup", function(){ArrowUpVar = 0.5; ArrowDownVar = -0.5});
        function checkKeyUp(e) {
        
            e = e || window.event;
            var spaceMan = scene.getObjectByName("SpaceMan");
        
            if (e.keyCode == '38' || e.keyCode == '87') {
              // up arrow
              moveup = false;
              //camera.position.y += ArrowUpVar;
              //controls.target.y += ArrowUpVar;
              //ArrowUpVar = ArrowUpVar + 0.1;
          }
          if (e.keyCode == '40' || e.keyCode == '83') {
              // down arrow
              movedown = false;
              //camera.position.y += ArrowDownVar;
              //controls.target.y += ArrowDownVar;
              //ArrowDownVar = ArrowDownVar + -0.1;
          }
          if (e.keyCode == '37' || e.keyCode == '65') {
             // left arrow
             moveleft = false;
             //camera.position.z += ArrowUpVar;
             //controls.target.z += ArrowUpVar;
             //ArrowUpVar = ArrowUpVar + 0.1;
          }
          if (e.keyCode == '39' || e.keyCode == '68') {
             // right arrow
             moveright = false;
             //camera.position.z += ArrowDownVar;
             //controls.target.z += ArrowDownVar;
             //ArrowDownVar = ArrowDownVar + -0.1;
          }
          }
        function checkKeyDown(e) {
        
            e = e || window.event;
            var spaceMan = scene.getObjectByName("SpaceMan");
        
            if (e.keyCode == '38' || e.keyCode == '87') {
                // up arrow
                moveup = true;
                //camera.position.y += ArrowUpVar;
                //controls.target.y += ArrowUpVar;
                //ArrowUpVar = ArrowUpVar + 0.1;
            }
            if (e.keyCode == '40' || e.keyCode == '83') {
                // down arrow
                movedown = true;
                //camera.position.y += ArrowDownVar;
                //controls.target.y += ArrowDownVar;
                //ArrowDownVar = ArrowDownVar + -0.1;
            }
            if (e.keyCode == '37' || e.keyCode == '65') {
               // left arrow
               moveleft = true;
               //camera.position.z += ArrowUpVar;
               //controls.target.z += ArrowUpVar;
               //ArrowUpVar = ArrowUpVar + 0.1;
            }
            if (e.keyCode == '39' || e.keyCode == '68') {
               // right arrow
               moveright = true;
               //camera.position.z += ArrowDownVar;
               //controls.target.z += ArrowDownVar;
               //ArrowDownVar = ArrowDownVar + -0.1;
            }
          }
        
        function onWindowResize(){
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        
            var graph = document.getElementById("rodChart");
            var graphTopMargin = window.innerHeight - 750;
            graph.style.marginTop = graphTopMargin + "px" ;
          }
          
          window.addEventListener('resize', onWindowResize, false);
          
          document.getElementById("rodChart").addEventListener("click", function(evt) {
            var activePoints = rodChart.getElementsAtEvent(evt);
            if (activePoints[0]) {
              var chartData = activePoints[0]['_chart'].config.data;
              var idx = activePoints[0]['_index'];
        
              var label = chartData.labels[idx];
              var value = chartData.datasets[0].data[idx];
        
              focusPipeAnimation(label);
            }
          });
        
          document.getElementById("recenterBtn").addEventListener("click", function(){
            centerCamera(1.5);
          });
          
          document.getElementById("pipeFocus").addEventListener("click", function(){
            var pipeNumber = document.getElementById("pipeNumberInput").value;  
          
            focusPipeAnimation(pipeNumber);
          });
        
        
          /// Data Fetching
        
        
          var pipeDataList = [];
          var xRod = [];
          var yRod = [];
          var rodColors = [];
          var rodChart;
        
          console.log("fetching data");
          fetch("../api/threeChart.txt")
              .then((res) => res.text())
              .then((text) => {
                  var chartData = JSON.parse(text);
                  xRod = chartData.overallX;
                  yRod = chartData.overallY;
                  rodColors = chartData.overallColor;
        
                  setChart();
              })
          .catch((e) => console.error(e));
        
          fetch("../api/three.txt")
              .then((res) => res.text())
              .then((text) => {
                  pipeDataList = JSON.parse(text);
                  pipeDataList.forEach(addPipe);
                })
              .catch((e) => console.error(e));
          
        
        
          function setChart(){
              rodChart = new Chart("rodChart", {
              type: "bar",
              data: {
                  labels: xRod,
                  datasets: [{
                  backgroundColor: rodColors,
                  data: yRod,
                  pointHoverRadius: 5,
                  pointHoverBackgroundColor: 'white',
                  barThickness: 6,
                  }]
              },
              options: {
                  legend: {display: false},
                  title: {
                  display: true,
                  text: "Click on a chart value to see details"
                  },
                  scales: {
                      yAxes: [{
                          ticks: {
                                  beginAtZero: true
                          },
                          gridLines:{
                          color: "gray",
                          lineWidth:1,
                          }
                      }]
                  }
              }
              });
          }
    }
    
    
}

