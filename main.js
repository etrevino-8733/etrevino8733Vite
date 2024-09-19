// import { welcomeMessage } from './scripts/welcome-message.js'
// import './libraries/TopNav/TopNav.js'
// import './scripts/tech-stack.js'
// import { loadTechstack } from './scripts/tech-stack.js'

import { TestModule, techStack, welcomeMessage, BasicCharacterController } from "./utils";

document.querySelector('#app').innerHTML = `
  <div id="tech-stack-container" tabindex="1">
      <canvas id="tech-stack"></canvas>
      <div class="progress-bar-container">
          <div id="welcome-message"></div>
          <label for="progress-bar">Loading Textures... </label>
          <div class="spinner"></div>
          <progress id="progress-bar" value="0" max="100"></progress>
      </div>
  </div>
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
window.onload = () => {
    welcomeMessage();
    new techStack();  
    // init.loadTechstack();  
}