import './style.css'
import './libraries/TopNav/TopNav.js'
import './oilProject.css'
import { oilProjectGraphics } from './scripts/oilProjectGraphics.js'

document.querySelector('#app').innerHTML = `
    <main>
      <canvas id="bg"></canvas>
      <section>
        <div style="color: white;">
          <et-top-nav nav-items='[{"name": "Home", "link": "../index.html"}, {"name": "About Me", "link": "../about-me.html"},{"name": "Projects", "link": "../about-me.html#projects"}]'>
          </et-top-nav>
        </div>
        <div class="controls">
          <div>
            <button class="glow-on-hover toggle-graph" id="showGraphBtn">Show Graph</button>
            <button class="glow-on-hover" id="recenterBtn">Re-center</button>
          </div>
          <div class="control-inputs">
            <div style="display: flex; gap: 4px; width: 100%; height: 25px;">
              <input type="text" id="pipeNumberInput" style="flex: 1 1 auto;">
              <button class="glow-on-hover" style="height: inherit" id="pipeFocus">View Pipe</button>
              <input type="hidden" id="previousPipeNumber">
            </div>
            <div style="display: flex; gap: 4px; width: 100%; height: 25px;">
              <select id="pipeGroupInput" style="flex: 1 1 auto" >
                <option value="">Select One</option>
                <option value="red">Red</option>
                <option value="blue">Blue</option>
                <option value="green">Green</option>
                <option value="yellow">Yellow</option>
              </select>
              <button class="glow-on-hover" style="height: inherit"  id="pipeGroups">View Grade Group</button>  
            </div>
          </div>
        </div>

      </section>
      <div id="graph">
        <div style="position: absolute; top: 0; right: 0; padding: 2px">
          <button class="toggle-graph" style="background-color: inherit; border: 2px solid gray; color: white; border-radius: 50px; aspect-ratio: 1/1;">X</button>
        </div>
        <canvas id="rodChart" ></canvas>
      </div>
      <div style="position: fixed; top: 95%; width: 98%; text-align: right; font-size: 10px;"><span>Pump jack model based on <a target="_blank" href="https://sketchfab.com/3d-models/oil-pump-jack-08f0fc1d37d74831912c7b9c59c84d5a">"Oil Pump Jack"</a> <br/> by <a target="_blank" href="https://sketchfab.com/_._bespalov_._">_._bespalov_._</a> licensed under <a target="_blank" href="http://creativecommons.org/licenses/by/4.0/"> CC-BY-4.0 </a> </span></div>

      <div class="progress-bar-container">
          <label for="progress-bar">Loading... </label>
          <div class="spinner"></div>
          <progress id="progress-bar" value="0" max="100"></progress>
      </div>
    </main>
`

window.onload = () => {
    var graphics = new oilProjectGraphics();
    var toggleGraphBtn = document.querySelectorAll('.toggle-graph');
    
    for( var i = 0; i < toggleGraphBtn.length; i++ ) {
      toggleGraphBtn[i].addEventListener('click', function(){
        var x = document.getElementById("graph");
        var chart = document.getElementById('rodChart');
        if (!x.classList.contains('active')) {
          x.classList.add('active');
          document.getElementById("showGraphBtn").innerText = "Hide Graph"
        } else {
          x.classList.remove('active');
          document.getElementById("showGraphBtn").innerText = "Show Graph"
        }
      });
    }
}