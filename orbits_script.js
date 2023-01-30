import * as THREE from './three/build/three.module.js';

var dir = new THREE.Vector2();

const GRAVITY = 0.001;
var planets = [];
var planet_positions = [];
var satellites = [];

var infoState = 0;

var placing = "Planets";

var autoOrbits = false;
var orbitEccentricity = 1;

function create_svg_circle(color, size){
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", size.toString());
    svg.setAttribute("height", size.toString());
    svg.style.position = "absolute";
  
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", (size/2).toString());
    circle.setAttribute("cy", (size/2).toString());
    circle.setAttribute("r", (size/2).toString());
    circle.setAttribute("fill", color);
  
    svg.appendChild(circle);
    document.getElementById("orbitsWindow").appendChild(svg);
    return svg;
}

class planet {
    constructor (x, y, MASS, size){
        var randomColor = Math.floor(Math.random()*16777215).toString(16);
        this.color = "#" + randomColor;

        this.size = size;
        this.mass = MASS;
        this.pos = new THREE.Vector2(x, y);
    
        this.canvas = document.getElementById("canvas").getContext("2d");
        
        this.sprite = create_svg_circle(this.color, size)
        this.sprite.classList.add("planet");
        document.getElementById("orbitsWindow").appendChild(this.sprite);
        this.sprite.style.top = this.pos.y - document.getElementById("Header").clientHeight - (this.size / 2) + "px";
        this.sprite.style.left = this.pos.x - (this.size / 2) + "px";

        planets.push(this);
        planet_positions.push(new THREE.Vector2(this.pos.x, this.pos.y))

        if (infoState == 0){
            infoState = 1;
            document.getElementById("textDisplay").innerHTML = "Now select the satellite button and try clicking and dragging your mouse to launch a satellite, the more you drag, the faster the satellite will get launched.";
        }

        console.log("Created planet");
    }
}

class satellite {
    constructor (PosX, PosY, VelX, VelY, MASS, size){
        var randomColor = Math.floor(Math.random()*16777215).toString(16);
        this.color = "#" + randomColor;
        
        this.mass = 100;
        this.pos = new THREE.Vector2(PosX, PosY);
        this.vel = new THREE.Vector2(VelX, VelY);
        this.orbitPoints = [];
        this.size = size;
        
        this.canvas = document.getElementById("canvas").getContext("2d");
        
        this.sprite = create_svg_circle(this.color, size)
        this.sprite.classList.add("satellite");
        document.getElementById("orbitsWindow").appendChild(this.sprite);
        this.sprite.style.top = this.pos.y - document.getElementById("Header").clientHeight - (this.size / 2) + "px";
        this.sprite.style.left = this.pos.x - (this.size / 2) + "px";

        satellites.push(this);

        if (infoState == 1){
            if (this.vel.length() < 1){
                document.getElementById("textDisplay").innerHTML = "Don't forget to drag the mouse while you hold the left mouse button pressed!";
            }

            else {
                infoState = 2;
                document.getElementById("textDisplay").innerHTML = "Have fun!";
            }            
        }

        if (infoState == 2) {
            if (satellites.length > 5){
                document.getElementById("textDisplay").innerHTML = "";
            } 
        }

        console.log("Created satellite");
    }

    simulate(){
        for (let x = 0; x < planets.length;x++){
            if (this.pos.distanceTo(planets[x].pos) < 30){
                this.sprite.remove();
                this.orbitPoints = []
                return
            } 
            let gravDir = (new THREE.Vector2().copy(planets[x].pos).sub(this.pos)).normalize()
            
            let gravForce = (GRAVITY * this.mass * planets[x].mass) / (this.pos.distanceToSquared(planets[x].pos))
            this.vel.add(new THREE.Vector2().copy(gravDir).multiplyScalar(gravForce))
        };

        // Handle drawing of trails
        this.orbitPoints.push(new THREE.Vector2().copy(this.pos))
        if (this.orbitPoints.length > 300){
            this.orbitPoints.shift();
          }

        if (this.orbitPoints.length > 0){
            this.canvas.beginPath();
            this.canvas.moveTo(this.orbitPoints[0].x, this.orbitPoints[0].y);
                
            this.orbitPoints.forEach(element => {
                this.canvas.lineTo(element.x, element.y);
            });
            
            this.canvas.globalAlp
            this.canvas.lineWidth = 1;
            let trail_color = changeColorAlpha(this.color, 0.4)
            this.canvas.strokeStyle = trail_color;
            this.canvas.stroke();
        }  
        this.pos.add(this.vel);
        this.sprite.style.top = this.pos.y - document.getElementById("Header").clientHeight - (this.size / 2) + "px";
        this.sprite.style.left = this.pos.x - (this.size / 2) + "px";
    }
}

// Animation loop
var deg = 0;

// Runs 30 times a second
var intervalId = window.setInterval(function(){
    
    deg += 3;
    document.getElementById("orbit").style.transform = "rotate(" + deg + "deg)"
    let c = document.getElementById("canvas");
    let ctx = c.getContext("2d");
    ctx.clearRect(0,0,c.width,c.height);
    for (let x = 0; x<satellites.length; x++){
        satellites[x].simulate();
    }
    
  }, 33);

// Button listeners
document.getElementById("planetButton").addEventListener("click", (ev) => {
    placing = "Planets";
    document.getElementById("planetButton").style.backgroundColor = "rgb(100, 100, 100)"
    document.getElementById("satButton").style.backgroundColor = "rgb(0, 0, 0)"

});

document.getElementById("satButton").addEventListener("click", (ev) => {
    placing = "Satellites";
    document.getElementById("planetButton").style.backgroundColor = "rgb(0, 0, 0)"
    document.getElementById("satButton").style.backgroundColor = "rgb(100, 100, 100)"
    
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
    let c = document.getElementById("canvas");
    let ctx = c.getContext("2d");
    ctx.clearRect(0,0,c.width,c.height);

    let c2 = document.getElementById("canvas2");
    let ctx2 = c2.getContext("2d");
    ctx2.clearRect(0,0,c2.width,c2.height);
});

document.getElementById("clearCanvasButton").addEventListener("click", (ev) => {
    let c = document.getElementById("canvas");
    let ctx = c.getContext("2d");
    ctx.clearRect(0,0,c.width,c.height);
    satellites.forEach(element => {
        element.orbitPoints = []
    });
});

document.getElementById("autoButton").addEventListener("click", (ev) => {
    if (autoOrbits == false){
        autoOrbits = true
        document.getElementById("autoButton").style.backgroundColor = "green"
        document.getElementById("orbitSettings").style.display = "Flex"
    }
    else {
        autoOrbits = false
        document.getElementById("autoButton").style.backgroundColor = "red"
        document.getElementById("orbitSettings").style.display = "None"
    }
    
});



var drag_start = new THREE.Vector2(0, 0);
let drag_end = new THREE.Vector2(0, 0);
var dragging = false;

// Window click listener
document.getElementById("orbitsWindow").addEventListener("click", (ev) => {
    switch (placing) {
        case "Planets":
            var newPlanet = new planet(ev.clientX, ev.clientY, 100000, 40);
            console.log("EV: ", ev.clientX, ev.clientY)
            console.log("Orbits window x pos", document.getElementById("orbitsWindow").getBoundingClientRect().top)
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
            if (autoOrbits == true){
                var launchVel = calculate_orbit(new THREE.Vector2(ev.clientX, ev.clientY))
                var newSat = new satellite(ev.clientX, ev.clientY, launchVel.x, launchVel.y, 100, 8);
                break;
            }
            else{
                drag_start.x = ev.clientX;
                drag_start.y = ev.clientY;
                dragging = true;
                break;
            }
            
    }
    
});

document.getElementById("orbitsWindow").addEventListener("pointerup", (ev) => {
    switch (placing) {
        case "Planets":
            break;
        
        case "Satellites":
            if (!dragging){
                break
            }
            drag_end = new THREE.Vector2(ev.clientX, ev.clientY);
            let dir = (new THREE.Vector2().copy(drag_end).sub(drag_start)).normalize().negate();
            let force = drag_start.distanceTo(new THREE.Vector2().copy(drag_end)) / 30
            var impulse = new THREE.Vector2().copy(dir).multiplyScalar(force);

            console.log(dir, force, impulse)

            var newSat = new satellite(drag_start.x, drag_start.y, impulse.x, impulse.y, 100, 8);
            dragging = false
            var c = document.getElementById("canvas2");
            var ctx = c.getContext("2d");
            ctx.clearRect(0,0,c.width,c.height);
            break;
    }
    
});

document.getElementById("orbitsWindow").addEventListener("pointermove", (ev) => {
    switch (placing) {
        case "Planets":
            break;
        
        case "Satellites":
            if (dragging){
                drag_end = new THREE.Vector2(ev.clientX, ev.clientY);
                var c = document.getElementById("canvas2");
                var ctx = c.getContext("2d");
                ctx.clearRect(0,0,c.width,c.height);
                drawLine(drag_start, drag_end);
                
            }
            
            break
    }
    
});

waitForElement("pointer", function(){
    console.log("Pointer is LOADED!")
});

window.addEventListener("resize", (ev) => {
    // adjust canvas to screen
    document.getElementById("canvas").width = window.innerWidth;
    document.getElementById("canvas").height = window.innerHeight;

    document.getElementById("canvas2").width = window.innerWidth;
    document.getElementById("canvas2").height = window.innerHeight;
});

// Run when window is loaded
window.addEventListener('load', (eevent) => {
    console.log("Document loaded")
    
    document.getElementById("canvas").width = window.innerWidth;
    document.getElementById("canvas").height = window.innerHeight;

    document.getElementById("canvas2").width = window.innerWidth;
    document.getElementById("canvas2").height = window.innerHeight;

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

function drawLine(from, to){
    var c = document.getElementById("canvas2");
    var ctx = c.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.stroke();
}

function calculate_orbit(pos){
    let closest_body = null
    for (let x = 0; x < planets.length; x++) {
        if (closest_body == null){
            closest_body = planets[x]
        }
        else{
            if (pos.distanceTo(planets[x].pos) < pos.distanceTo(closest_body.pos)){
                closest_body = planets[x]
            }
        }
    }
    if (closest_body){
        let newVel = calculate_launch_velocity(new THREE.Vector2().copy(pos), new THREE.Vector2().copy(closest_body.pos))
        
        return newVel
        
    }
}

function calculate_launch_velocity(satPos, planetPos, satMass = 100, planetMass = 100000){
    let gravDir = (new THREE.Vector2().copy(planetPos).sub(satPos)).normalize()
    let grav_force = (GRAVITY * satMass * planetMass) / satPos.distanceToSquared(planetPos)

    let newDir = new THREE.Vector2(gravDir.y, -gravDir.x)

    let orbitEccentricity = document.getElementById("eccSlider").value

    let launch_vel = Math.sqrt(((GRAVITY*satMass)*planetMass) / satPos.distanceTo(planetPos)) + (orbitEccentricity / 10)
    return (newDir.multiplyScalar(launch_vel))
}

function changeColorAlpha(color, opacity) 
{
    //if it has an alpha, remove it
    if (color.length > 7)
        color = color.substring(0, color.length - 2);

    // coerce values so ti is between 0 and 1.
    const _opacity = Math.round(Math.min(Math.max(opacity, 0), 1) * 255);
    let opacityHex = _opacity.toString(16).toUpperCase()

    // opacities near 0 need a trailing 0
    if (opacityHex.length == 1)
        opacityHex = "0" + opacityHex;

    return color + opacityHex;
}