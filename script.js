// Home page script

const myHobbies = ["Computers", "Electronics", "Coding", "Music", "Photography", "Games", "Arduino", "3D        rendering", "Space", "Engineering", "Godot Engine", "3D Printing", "Animation", "Travelling", "Building things", "Instruments", "3D Modeling", "Science"]
var currentLike = 0

const colors = [
    'rgb(255, 99, 71)',   // tomato
    'rgb(255, 215, 0)',   // gold
    'rgb(138, 43, 226)',  // blue violet
    'rgb(0, 191, 255)',   // deep sky blue
    'rgb(255, 140, 0)',   // dark orange
    'rgb(0, 255, 255)',   // cyan
    'rgb(255, 20, 147)',  // deep pink
    'rgb(30, 144, 255)',  // dodger blue
    'rgb(154, 205, 50)',  // yellow green
    'rgb(255, 165, 0)',   // orange
]

const projects = ["Orbits", "World Map"]

var selectorTarget = null
var selector_x = 0
var selector_y = 0
var ropes = []

var pageReady = false

function cycleWords() {
    if (pageReady == false || !document.getElementById('iLike')){
        return
    }
    const wordElement = document.getElementById('iLike');
    wordElement.style.opacity = 0;
    setTimeout(() => {
        if (currentLike + 1 >= myHobbies.length){
            currentLike = 0;
        }
        else{
            currentLike += 1
        }
        
        wordElement.style.color = colors[Math.floor(Math.random() * colors.length)];
      
        wordElement.style.opacity = 1;
        morphText(myHobbies[currentLike], wordElement, 100)
    }, 500);
  }
  
setInterval(cycleWords, 4000);

function displayProjects(){
    var tags = document.querySelectorAll(".projectTag");

    tags.forEach((element, index) => {
        setTimeout(() => {
            element.style.opacity = 1
            element.style.pointerEvents = "all"

            let text = element.firstChild.innerHTML

            let chars = "#%&"
            let str = ""
            let thisChar = ""
            let lastChar = ""
            for (let index = 0; index < myHobbies[currentLike].length; index++) {
                while (thisChar == lastChar){
                    thisChar = chars.charAt(Math.floor(Math.random() * chars.length))
                }
                lastChar = thisChar
                str += thisChar
            }
            element.firstChild.innerHTML = str;
            morphText(text, element.firstChild, 150)

          }, index * 1200);
        
    });
}

window.addEventListener("resize", (ev) => {
    // adjust canvas to screen
    document.getElementById("canvas").width = window.innerWidth;
    document.getElementById("canvas").height = window.innerHeight;

    document.getElementById("canvas2").width = window.innerWidth;
    document.getElementById("canvas2").height = window.innerHeight;

    document.getElementById("canvasRopes").width = window.innerWidth;
    document.getElementById("canvasRopes").height = window.innerHeight;

    if (window.innerWidth > 2000){
        document.getElementById("character_a").style.scale = "4"
        paintWidth = 24
    }
    else {
        document.getElementById("character_a").style.scale = "2"
        paintWidth = 12
    }
    
});

// Run when window is loaded
window.addEventListener('load', (eevent) => {
    console.log("window loaded")

    // Set canvas size
    document.getElementById("canvas").width = window.innerWidth;
    document.getElementById("canvas").height = window.innerHeight;

    document.getElementById("canvas2").width = window.innerWidth;
    document.getElementById("canvas2").height = window.innerHeight;

    document.getElementById("canvasRopes").width = window.innerWidth;
    document.getElementById("canvasRopes").height = window.innerHeight;

    // Set selector position
    selector_x = document.getElementById("tagSelector").getBoundingClientRect().x
    selector_y = document.getElementById("tagSelector").getBoundingClientRect().y - document.getElementById("mainContainer").getBoundingClientRect().y + 3

    document.getElementById("character_a").style.left = 0 + "px"
    document.getElementById("character_a").style.top = 0 + "px"

    document.getElementById("character_b").style.left = 0 + "px"
    document.getElementById("character_b").style.top = 50 + "px"

    // "Decode" displays
    let helloModule = document.getElementById("helloModule")
    morphText(helloModule.innerHTML, helloModule, 120)

    let aboutMe = document.querySelectorAll(".legend")
    aboutMe.forEach(element => {
        morphText(element.innerHTML, element, 300)
    });

    document.getElementById("infoText").style.display = "none"

    document.addEventListener("mousemove", eventHandler, false)
    document.addEventListener("touchmove", eventHandler, false)
    document.addEventListener("touchend", eventHandler, false)
    document.addEventListener("touchstart", eventHandler, false)

    // let newRope = new Rope(500, 500, 100, [-Math.PI, Math.PI])
    // ropes.push(newRope)

    setTimeout(function(){
        // Delay after page loads
        document.getElementById("infoText").style.display = "block"
        displayText(document.getElementById("infoText"), document.getElementById("infoText").textContent)
        
    }, 1500); 

    setTimeout(function(){
        // Longer delay after page loads
        const tags = document.querySelectorAll(".projectTag");
        tags.forEach(element => {
            element.addEventListener("mouseenter", (event) => {
                pos = element.getBoundingClientRect();
                selectorTarget = pos
                tagSelector.style.opacity = 1
            })
            element.addEventListener("mouseleave", (event) => {
                selectorTarget = null
            })
        });
        pageReady = true
        displayProjects()
        
}, 4000); 
})

var eventHandler = function (event) {
    let header = document.getElementById("Header")
    let wave = document.getElementsByClassName("wave")
    if (!header) {
        return
    }
    let mouseX = 0
    let mouseY = 0
    switch (event.type){
        case "touchstart":
        case "touchend":
            mouseX = 0
            mouseY = window.innerHeight
            break
        case "touchmove":
            mouseX = event.touches[0].clientX
            mouseY = event.touches[0].clientY
            break
        case "mousemove":
            mouseX = event.clientX
            mouseY = event.clientY
            break

            

    }
    wave_to(mouseX, mouseY)
};

function wave_to(mouseX, mouseY){
    let screenWidth = window.innerWidth
    let percent = Math.floor((mouseX / screenWidth) * 100)
    let height = remap(mouseY, 0, window.innerHeight, 100, 20)

    let center = percent.toString() + "% " + height + "%, "
    let left = Math.max(percent - 20, 0).toString() + "% 60%, "
    let right = Math.min(percent + 20, 100).toString() + "% 60%, "
    let poly = "polygon(0 0, 100% 0, 100% 60%, " + left + center + right + "0 60%);"

    let styleSheet = document.styleSheets[0]
        
    const rules = styleSheet.cssRules

    // To do - delete previously created clip-path rule if necessary
    let index = styleSheet.cssRules.length;
    styleSheet.insertRule('.wave::before { clip-path: ' + poly + "}", index);
}

function morphText(endText, element, speed) {

    let chars = "#%&$£*"
    let str = ""
    let thisChar = ""
    let lastChar = ""
    for (let index = 0; index < endText.length; index++) {
        while (thisChar == lastChar){
           thisChar = chars.charAt(Math.floor(Math.random() * chars.length))
        }
        lastChar = thisChar
        str += thisChar
    }

    element.innerHTML = str;
    let initialText = element.innerHTML

    // Remove any extra characters from the initial text
    initialText = initialText.substring(0, endText.length);
  
    // Set the initial text of the element
    let text = initialText;
  
    // Define an array of indices that represent the order in which the characters should be replaced
    const indices = Array.from({length: endText.length}, (_, i) => i);
    shuffleArray(indices);
  
    // Define a variable to keep track of the current position in the strings
    let position = 0;
  
    // Define the interval function to update the text of the element
    const interval = setInterval(() => {
      // Get the current character in the end text
      const endChar = endText[indices[position]];
  
      // If the current character in the initial text is the same as the end character, do nothing
      if (text[indices[position]] === endChar) {
        position++;
        if (position === endText.length) {
          clearInterval(interval);
        }
        return;
      }
  
      // Replace the current character in the initial text with the end character
      text = text.substring(0, indices[position]) + endChar + text.substring(indices[position] + 1);
  
      // Update the text of the element
      element.textContent = text;
  
      // Move to the next position in the strings
      position++;
  
      // If we have reached the end of the strings, stop the interval
      if (position === endText.length) {
        clearInterval(interval);
      }
    }, speed);
}

function displayText(element, text) {
    const len = text.length;
    let i = 0;
  
    function displayNext() {
      if (i < len) {
        // If the remaining text is less than 5 characters, randomize them all
        const numRandomChars = Math.min(5, len - i);
        const randomChars = Array.from({length: numRandomChars}, () => String.fromCharCode(97 + Math.floor(Math.random() * 26)));
        
        // Build the current text
        const currentText = text.slice(0, i) + randomChars.join('');
  
        // Display the current text
        element.textContent = currentText;
  
        // Schedule the next display step
        setTimeout(displayNext, 60);
  
        i += numRandomChars;
      } else {
        // Call the callback function after the last display step is scheduled
        element.textContent = text
        element.innerHTML += '<span id="iLike" >Computers</span>';
      }
    }
  
    // Start with an empty element
    element.textContent = '';
  
    // Schedule the first display step
    setTimeout(displayNext, 1000);
  }

function animate() {
  let canvas = document.getElementById("canvasRopes")
  let context = canvas.getContext("2d")
  context.clearRect(0, 0, canvas.width, canvas.height);
  ropes.forEach(rope => {
   rope.update(undefined, undefined, 0);
   rope.draw(context, 10);
  });  
}
  
var intervalId = window.setInterval(function(){
    animate();
    if (pageReady == false){
        return
    }
    // Handle tag selector animation
    const tagSelector = document.getElementById("tagSelector")
    if (selectorTarget != null){
        let selectorPos = tagSelector.getBoundingClientRect()
        tagSelector.style.left = selectorTarget.x - (16 * window.innerWidth / 1440) + "px"

        if (Math.abs(selectorPos.y - selectorTarget.y) < 5){
            tagSelector.style.top = selectorTarget.y - document.getElementById("mainContainer").getBoundingClientRect().y + "px"
        }

        else if (selectorPos.y > selectorTarget.y){
            selector_y -= 8
            tagSelector.style.top = selector_y + "px"
        }
        else {
            selector_y += 8
            tagSelector.style.top = selector_y + "px"
        }

    }
    else{
        tagSelector.style.opacity = 0
    }
}, 10);

class Rope {
    constructor(x, y, length, angleRange) {
      this.fixedPoint = { x: x, y: y };
      this.targetPoint = { x: x + length, y: y };
      this.length = length;
      this.angleRange = angleRange;
      this.speed = 5;
      this.gravity = 9.81;
      this.points = this.getPoints();
    }
  
    getPoints() {
      const points = [this.fixedPoint];
  
      const dx = this.targetPoint.x - this.fixedPoint.x;
      const dy = this.targetPoint.y - this.fixedPoint.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
  
      let prevPoint = this.fixedPoint;
      for (let i = 1; i < distance; i++) {
        const angle = Math.atan2(dy, dx) + (Math.random() * (this.angleRange[1] - this.angleRange[0]) + this.angleRange[0]);
        const x = this.fixedPoint.x + Math.cos(angle) * i;
        const y = this.fixedPoint.y + Math.sin(angle) * i;
        const point = { x: x, y: y };
        points.push(point);
        prevPoint = point;
      }
      points.push(this.targetPoint);
      return points;
    }
  
    update(targetX, targetY, delta) {
      if (targetX !== undefined && targetY !== undefined) {
        const dx = targetX - this.targetPoint.x;
        const dy = targetY - this.targetPoint.y;
  
        this.targetPoint.x += dx * this.speed * delta;
        this.targetPoint.y += dy * this.speed * delta;
      } else {
        this.targetPoint.y += this.gravity * delta;
      }
  
      const dx = this.targetPoint.x - this.fixedPoint.x;
      const dy = this.targetPoint.y - this.fixedPoint.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
  
      if (distance > this.length) {
        const ratio = this.length / distance;
        this.targetPoint.x = this.fixedPoint.x + dx * ratio;
        this.targetPoint.y = this.fixedPoint.y + dy * ratio;
      }
  
      this.points = this.getPoints();
    }
  
    draw(context, lineWidth) {
      context.beginPath();
      context.moveTo(this.points[0].x, this.points[0].y);
      for (let i = 1; i < this.points.length; i++) {
        context.lineTo(this.points[i].x, this.points[i].y);
      }
      context.lineWidth = lineWidth;
      context.strokeStyle = "black";
      context.stroke();
    }
  }

function lerp(start, end, t) {
    return (1 - t) * start + t * end;
}

function waitForElement(id, callback){
    var poops = setInterval(function(){
        if(document.getElementById(id)){
            clearInterval(poops);
            callback();
        }
    }, 100);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
}

function remap(value, inMin, inMax, outMin, outMax) {
    return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}