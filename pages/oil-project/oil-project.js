import { oilProjectGraphics } from "/utils/oilProjectGraphics.module.js";
import * as TopNav from "/utils/TopNav/topNav.module";
import * as TopNavStyle from "/utils/TopNav/topNavStyle.module";

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