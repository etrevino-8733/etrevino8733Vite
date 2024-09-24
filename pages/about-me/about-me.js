import { techStack, welcomeMessage } from "/utils";
import * as TopNav from "/utils/TopNav/topNav.module";
import * as TopNavStyle from "/utils/TopNav/topNavStyle.module";

document.querySelector('#app').innerHTML = `
  <div>
       <div class="home-bg">
        <canvas id="tech-stack"></canvas>
        <div class="progress-bar-container">
            <div id="welcome-message"></div>
            <label for="progress-bar">Loading Textures... </label>
            <div class="spinner"></div>
            <progress id="progress-bar" value="0" max="100"></progress>
        </div>
    </div>
    <header class="header">
        <et-top-nav nav-items='[{"name": "Home", "link": "/index.html"}, {"name": "About Me", "link": "/pages/about-me/about-me.html"},{"name": "Projects", "link": "#projects"}]'>
        </et-top-nav>
    </header>
    <span class="scroll-icon">
        <span class="scroll-icon__wheel-outer">
          <span class="scroll-icon__wheel-inner"></span>
        </span>
    </span>
    <section class="info-section" style="height: 100vh;">
    </section>
    <section class="info-section left">
        <h1>About Me</h1>
        <div class="card glow-on-hover">
            <p>Hi, my name is Emmanuel Trevino.
                I am a software devoloper who specializes in the development of software solutions for big data companies.  In my experience, I have worked on a variety of projects that have allowed me to develop my skills in programming, data analysis, and machine learning.
                I have a passion for technology and I am always looking for new ways to improve my skills. I am currently working on a project that involves the development of a software solution for the oil and gas industry. 
                I am excited to see where this project takes me and I am looking forward to sharing my progress with you.
            </p>
        </div>
    </section>
    <section id="projects" class="info-section right">
        <div class="card glow-on-hover">
            <p>This is a feature from the software software I build for an oil company that specializes in scanning and inspecting pipes used in oil wells.  
                My software helped the client manage and share detaild data of the pitting and rodware for each pipe they scaned at each location. 
                The software also allowed my client to share the scan data with their customers. Each of their customers had an account on the web application where they could request scan jobs, view invoices through an integration with Quickbooks, and generate reports for each of their well locations.</p>
            <a class="project-btn" href="./oilProject.html">View Feature</a>
        </div>
        <h1>Projects</h1>
    </section>
    <section class="info-section left">
        <h1>Tech Stack</h1>
        <div class="stack-container">
            <div class="stack-card glow-on-hover">
                <h2>Frontend</h2>
                <ul>
                    <li class="stack-element">HTML</li>
                    <li class="stack-element">Sass</li>
                    <li class="stack-element">JavaScript</li>
                    <li class="stack-element">TypeScript</li>
                    <li class="stack-element">Angular</li>
                    <li class="stack-element">Web Components</li>
                    <li class="stack-element">RxJS</li>
                    <li class="stack-element">jQuery</li>
                    <li class="stack-element">AJAX</li>
                    <li class="stack-element">NX</li>
                </ul>
            </div>
            <div class="stack-card glow-on-hover">
                <h2>Backend</h2>
                <ul>
                    <li class="stack-element">C#</li>
                    <li class="stack-element">Node.js</li>
                    <li class="stack-element">.Net 8</li>
                    <li class="stack-element">Docker</li>
                    <li class="stack-element">Microservices</li>
                    <li class="stack-element">REST APIs</li>
                    <li class="stack-element">Swagger / Open API</li>
                    <li class="stack-element">Entity Framework</li>
                    <li class="stack-element">Azure</li>
                </ul>
            </div>
            <div class="stack-card glow-on-hover">
                <h2>Database</h2>
                <ul>
                    <li class="stack-element">SQL</li>
                    <li class="stack-element">MongoDB</li>
                </ul>
            </div>
        </div>
    </section>

    <section class="info-section">
        <button style="font-size: xx-large;" class="release-the-moster danger-button">
            DO NOT CLICK!
        </button>
    </section>

    <script type="text/javascript">


        document.addEventListener('DOMContentLoaded', () => {
            let stackItems = document.querySelectorAll('.stack-element');
            let stackItemsCoor = new Object();
            setItems(stackItems, stackItemsCoor);
            let stackCards = document.querySelector('.stack-card');
            let stackItemTop = stackCards.getBoundingClientRect().top;
            document.querySelector('.scroll-icon').style.opacity = '1';

            function trickleStackEventListener(event, callback){
                const wrapper = e => {
                        callback(e, () => document.removeEventListener(event, wrapper));
                    }
                document.addEventListener(event, wrapper);
            }

            document.querySelector('.danger-button').addEventListener('mouseover', (e) => {
                console.log('hover');
                e.target.innerHTML = "DON'T DO IT!";
            });
            document.querySelector('.danger-button').addEventListener('mouseout', (e) => {
                e.target.innerHTML = "DO NOT CLICK!";
            });

            
            trickleStackEventListener('scroll', (e, closeListener) => {
                let stackItemTop = stackItems[0].getBoundingClientRect().top;
                let windowBottom = window.innerHeight;

                if(window.scrollY > 20) {
                    let scrollIcon = document.querySelector('.scroll-icon');
                    scrollIcon.style.opacity = '0';
                };

                if(windowBottom > stackItemTop){
                    for(let key in stackItemsCoor){
                        moveItems(stackItemsCoor[key]);
                    }
                    let stackContainer = document.querySelector('.stack-container');
                    stackContainer.style.height = 'auto';
                    closeListener();
                }

                if(windowBottom < stackItemTop){
                    setItems(stackItems, stackItemsCoor);
                }
            });
        });

        function moveItems(item){
            let transitionSeconds = Math.floor(Math.random() * (1 - 1.5) + 1.5);
            item.element.style.transition = 'transform '+ transitionSeconds + 's';
            item.element.style.transitionTimingFunction = 'ease-out';
            item.element.style.transform = 'translate(' + 0 + 'px, ' + 0 + 'px)';            
        }

        async function setItems(stackItems, stackItemsCoor){
            let bodyRect = document.body.getBoundingClientRect();
            let stackContainer = document.querySelector('.stack-container');
            stackContainer.style.height = stackContainer.getBoundingClientRect().height + 'px';

            for(let i = 0; i < stackItems.length; i++){
                let item = stackItems[i];
                let xtrans = Math.floor(Math.random() * (-5000 - -window.innerWidth) +  -window.innerWidth);
                // let xtrans = Math.floor(Math.random() * (-window.innerWidth - -1000) +  -1000);

                stackItemsCoor[item.textContent] = {
                    element: item,
                }
                stackItemsCoor[item.textContent].element.style.transition = 'transform 0s';
                stackItemsCoor[item.textContent].element.style.transform = 'translate(' + xtrans + 'px, ' + 0 + 'px)';
            }
        }
    </script>
    <script defer id="vertexshader" type="vertex">
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }
    </script>
    <script defer id="fragmentshader" type="fragment">
        uniform sampler2D baseTexture;
        uniform sampler2D bloomTexture;
        varying vec2 vUv;
        void main() {
            gl_FragColor = (texture2D( baseTexture, vUv ) + vec4( 1.0 ) * texture2D( bloomTexture, vUv ));
        }
    </script>
`

window.onload = async () => {
    welcomeMessage();
    var scene = new techStack();
    scene._Init();
    await scene.triggerTechStack();
}