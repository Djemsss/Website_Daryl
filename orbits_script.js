import * as THREE from './three/build/three.module.js';

var dir = new THREE.Vector2();

const GRAVITY = 0.001
var planets = [];
var planet_positions = [];
var satellites = [];

var placing = "Planets"

class planet {
    constructor (x, y, MASS){
        this.color = 

        this.mass = MASS;
        this.pos = new THREE.Vector2(x, y);
    
        this.canvas = document.getElementById("canvas").getContext("2d");
        
        this.sprite = document.createElement("img");
        this.sprite.src = "img/dot.png";
        this.sprite.classList.add("planet");
        this.sprite.style.scale = 0.3;
        document.getElementById("orbitsWindow").appendChild(this.sprite);
        this.sprite.style.top = this.pos.y - 200 + "px";
        this.sprite.style.left = this.pos.x - 100 + "px";

        planets.push(this);
        planet_positions.push(new THREE.Vector2(this.pos.x, this.pos.y))
        console.log("Created planet");
    }
}

class satellite {
    constructor (PosX, PosY, VelX, VelY, MASS){
        this.color = "#FFFFFF";
        this.mass = 100;
        this.pos = new THREE.Vector2(PosX, PosY);
        this.vel = new THREE.Vector2(VelX, VelY);
        this.canvas = document.getElementById("canvas").getContext("2d");
        
        this.sprite = document.createElement("img");
        this.sprite.src = "img/dot.png";
        this.sprite.classList.add("satellite")
        this.sprite.style.scale = 0.05;
        document.getElementById("orbitsWindow").appendChild(this.sprite);
        this.sprite.style.top = this.pos.y - 200 + "px";
        this.sprite.style.left = this.pos.x - 100 + "px";

        satellites.push(this);
        console.log("Created satellite");
    }

    simulate(){
        for (let x = 0; x < planets.length;x++){
            if (this.pos.distanceTo(planets[x].pos) < 40){
                return;
            } 
            let gravDir = (new THREE.Vector2().copy(planets[x].pos).sub(this.pos)).normalize()
            
            let gravForce = (GRAVITY * 100 * planets[x].mass) / (this.pos.distanceToSquared(planets[x].pos))
            this.vel.add(new THREE.Vector2().copy(gravDir).multiplyScalar(gravForce))
            
        }
        
        this.pos.add(this.vel);
        this.sprite.style.top = this.pos.y - 200 + "px";
        this.sprite.style.left = this.pos.x - 100 + "px";  
    }
}

// Animation loop
var deg = 0;

// Runs 30 times a second
var intervalId = window.setInterval(function(){
    deg += 3;
    document.getElementById("orbit").style.transform = "rotate(" + deg + "deg)"
    for (let x = 0; x<satellites.length; x++){
        satellites[x].simulate();
    }
  }, 33);

// Button listeners
document.getElementById("planetButton").addEventListener("click", (ev) => {
    placing = "Planets";

});

document.getElementById("satButton").addEventListener("click", (ev) => {
    placing = "Satellites";
    
});

document.getElementById("clearButton").addEventListener("click", (ev) => {
    

    for (let x = 0; x < planets.length; x++) {
        planets[x].sprite.parentNode.removeChild(planets[x].sprite);
      }
    for (let x = 0; x < satellites.length; x++) {
        satellites[x].sprite.remove();
      }
    
    planets = []
    satellites = []
});


var drag_start = new THREE.Vector2(0, 0)
var dragging = false

// Window click listener
document.getElementById("orbitsWindow").addEventListener("click", (ev) => {
    switch (placing) {
        case "Planets":
            var newPlanet = new planet(ev.clientX, ev.clientY, 100000);
            break;
        
        case "Satellites":
            break;
    }
    
});

document.getElementById("orbitsWindow").addEventListener("pointerdown", (ev) => {
    switch (placing) {
        case "Planets":
            break;
        
        case "Satellites":
            drag_start.x = ev.clientX;
            drag_start.y = ev.clientY;
            dragging = true;
            break;
    }
    
});

document.getElementById("orbitsWindow").addEventListener("pointerup", (ev) => {
    switch (placing) {
        case "Planets":
            break;
        
        case "Satellites":
            let drag_end = new THREE.Vector2(ev.clientX, ev.clientY);
            let dir = (new THREE.Vector2().copy(drag_end).sub(drag_start)).normalize().negate();
            let force = drag_start.distanceTo(new THREE.Vector2().copy(drag_end)) / 30
            var impulse = new THREE.Vector2().copy(dir).multiplyScalar(force);

            console.log(dir, force, impulse)

            var newSat = new satellite(drag_start.x, drag_start.y, impulse.x, impulse.y, 100);
            break;
    }
    
});

waitForElement("pointer", function(){
    console.log("Pointer is LOADED!")
});

// Run when window is loaded
window.addEventListener('load', (eevent) => {
    console.log("Document loaded")
    
    var coll = document.getElementsByClassName("infoCollapsible");
    var i;

    for (i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", function() {
            this.classList.toggle("active");
            var content = this.previousElementSibling;
            if (content.style.maxHeight){
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    }
});

function waitForElement(id, callback){
    var poops = setInterval(function(){
        if(document.getElementById(id)){
            clearInterval(poops);
            callback();
        }
    }, 100);
};

function arrayRemove(arr, value) { 
    return arr.filter(function(ele){ 
        return ele != value; 
    });
}

