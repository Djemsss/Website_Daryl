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
    document.getElementById("dinoButton").addEventListener("pointerdown", prepare_dino_game, false)
    document.getElementById("submitButton").addEventListener("pointerdown", start_dino_game, false)

    document.addEventListener('keydown', function(event) {
        
        // Character a key downs
        if (event.code === 'KeyW') {
          if (!pressed_keys_a.includes("W")){
            pressed_keys_a.push("W")
          }
        }
        if (event.code === 'KeyA') {
            if (!pressed_keys_a.includes("A")){
                pressed_keys_a.push("A")
            }
        }
        if (event.code === 'KeyS') {
            if (!pressed_keys_a.includes("S")){
                pressed_keys_a.push("S")
            }
        }
        if (event.code === 'KeyD') {
            if (!pressed_keys_a.includes("D")){
                pressed_keys_a.push("D")
            }
        }
        // Character b key downs
        if (event.code === 'ArrowUp') {
            if (!pressed_keys_b.includes("W")){
                pressed_keys_b.push("W")
            }
          }
          if (event.code === 'ArrowLeft') {
              if (!pressed_keys_b.includes("A")){
                pressed_keys_b.push("A")
              }
          }
          if (event.code === 'ArrowDown') {
              if (!pressed_keys_b.includes("S")){
                pressed_keys_b.push("S")
              }
          }
          if (event.code === 'ArrowRight') {
              if (!pressed_keys_b.includes("D")){
                pressed_keys_b.push("D")
              }
          }
      });

      document.addEventListener("keyup", (event) =>{
        // Character a key ups
        if (event.code === 'KeyW') {
            if (pressed_keys_a.includes("W")){
                let index = pressed_keys_a.indexOf("W")
                if (index > -1){
                    pressed_keys_a.splice(index, 1)
                }
            }
        }
        if (event.code === 'KeyA') {
            if (pressed_keys_a.includes("A")){
                let index = pressed_keys_a.indexOf("A")
                if (index > -1){
                    pressed_keys_a.splice(index, 1)
                }
            }
        }
        if (event.code === 'KeyS') {
            if (pressed_keys_a.includes("S")){
                let index = pressed_keys_a.indexOf("S")
                if (index > -1){
                    pressed_keys_a.splice(index, 1)
                }
            }
        }
        if (event.code === 'KeyD') {
            if (pressed_keys_a.includes("D")){
                let index = pressed_keys_a.indexOf("D")
                if (index > -1){
                    pressed_keys_a.splice(index, 1)
                }
            }
        }
        // Character b key ups
        if (event.code === 'ArrowUp') {
            if (pressed_keys_b.includes("W")){
                let index = pressed_keys_b.indexOf("W")
                if (index > -1){
                    pressed_keys_b.splice(index, 1)
                }
            }
        }
        if (event.code === 'ArrowLeft') {
            if (pressed_keys_b.includes("A")){
                let index = pressed_keys_b.indexOf("A")
                if (index > -1){
                    pressed_keys_b.splice(index, 1)
                }
            }
        }
        if (event.code === 'ArrowDown') {
            if (pressed_keys_b.includes("S")){
                let index = pressed_keys_b.indexOf("S")
                if (index > -1){
                    pressed_keys_b.splice(index, 1)
                }
            }
        }
        if (event.code === 'ArrowRight') {
            if (pressed_keys_b.includes("D")){
                let index = pressed_keys_b.indexOf("D")
                if (index > -1){
                    pressed_keys_b.splice(index, 1)
                }
            }
        }



      })
      

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

var anim_frames_a = [["img/character_a/idle/tile000.png", "img/character_a/idle/tile001.png", "img/character_a/idle/tile002.png", "img/character_a/idle/tile003.png"], ["img/character_a/run/tile004.png", "img/character_a/run/tile005.png", "img/character_a/run/tile006.png", "img/character_a/run/tile007.png", "img/character_a/run/tile008.png", "img/character_a/run/tile009.png"]]

var anim_frames_b = [["img/character_b/idle/tile000.png", "img/character_b/idle/tile001.png", "img/character_b/idle/tile002.png", "img/character_b/idle/tile003.png"], ["img/character_b/run/tile004.png", "img/character_b/run/tile005.png", "img/character_b/run/tile006.png", "img/character_b/run/tile007.png", "img/character_b/run/tile008.png", "img/character_b/run/tile009.png"]]

var game_mode = false
var last_time = 0
var paintWidth = 12

// Character 1
var current_animation_a = 0
var current_frame_a = 0

var pressed_keys_a = []

var char_speed_a = 20
var charX_a = 0
var charY_a= 0
var last_pos_x_a = 0
var last_pos_y_a = 0

// Character 2
var current_animation_b = 0
var current_frame_b = 0

var pressed_keys_b = []

var char_speed_b = 20
var charX_b = 0
var charY_b= 50
var last_pos_x_b = 0
var last_pos_y_b = 0

function prepare_dino_game(){
    if (game_mode == true) {
        // Stop Game mode and reset all values
        game_mode = false
        document.getElementById("character_a_tag").style.display = "none"
        document.getElementById("character_b_tag").style.display = "none"
        document.getElementById("character_a").style.display = "none"
        document.getElementById("character_b").style.display = "none"
        document.getElementById("dinoControlsBox").style.display = "none"

        charX_a = 0
        charX_b = 0
        charY_a = 0
        charY_b = 50
        document.getElementById("character_a").style.left = 0 + "px"
        document.getElementById("character_a").style.top = 0 + "px"

        document.getElementById("character_b").style.left = 0 + "px"
        document.getElementById("character_b").style.top = 50 + "px"
        return
    }
    document.getElementById("mainContainer").style.display = "none"
    document.getElementById("dinoButton").style.display = "none"
    document.getElementById("dinoOptions").style.display = "flex"
}

function start_dino_game(){
    const dinoName1 = document.getElementById("dinoName1").value;
    const dinoName2 = document.getElementById("dinoName2").value;

    document.getElementById("character_a_tag").textContent = dinoName1
    document.getElementById("character_b_tag").textContent = dinoName2

    document.getElementById("mainContainer").style.display = "flex"
    document.getElementById("dinoButton").style.display = "block"
    document.getElementById("dinoOptions").style.display = "none"

    game_mode = true
    document.getElementById("character_a_tag").style.display = "block"
    document.getElementById("character_b_tag").style.display = "block"
    document.getElementById("character_a").style.display = "block"
    document.getElementById("character_b").style.display = "block"
    document.getElementById("dinoControlsBox").style.display = "flex"

}

var intervalId = window.setInterval(function(){
    if (pageReady == false){
        return
    }

    // Handle game mode
    if (game_mode == true){
        let character_a = document.getElementById("character_a")
        let character_b = document.getElementById("character_b")
        let current_time = Date.now()
        let delta = current_time - last_time

        let ctx = document.getElementById("canvas").getContext("2d")
        let ctx2 = document.getElementById("canvas2").getContext("2d")

        // Move name tags
        document.getElementById("character_a_tag").style.left = charX_a - 90 + "px"
        document.getElementById("character_a_tag").style.top = charY_a - 26 + "px"

        document.getElementById("character_b_tag").style.left = charX_b - 90 + "px"
        document.getElementById("character_b_tag").style.top = charY_b - 26 + "px"

        // Handle z index
        if (character_a.getBoundingClientRect().y > character_b.getBoundingClientRect().y) {
            character_a.style.zIndex = "5"
            character_b.style.zIndex = "4"
        }
        else{
            character_a.style.zIndex = "4"
            character_b.style.zIndex = "5"
        }
        // Handle character animation
        if (delta > 100){
            last_time = current_time

            // Character a
            if (current_frame_a + 1 > anim_frames_a[current_animation_a].length - 1){
                current_frame_a = 0
            }
            else{
                current_frame_a += 1
            }
            character_a.src = anim_frames_a[current_animation_a][current_frame_a]

            // Character b
            if (current_frame_b + 1 > anim_frames_b[current_animation_b].length - 1){
                current_frame_b = 0
            }
            else{
                current_frame_b += 1
            }
            character_b.src = anim_frames_b[current_animation_b][current_frame_b]
            
        }

        // Handle character movement
        // Character a
        if (pressed_keys_a.length > 0){
            current_animation_a = 1
            let dirX = 0
            let dirY = 0

            if (pressed_keys_a.includes("W")){
                dirY -= 1
            }
            if (pressed_keys_a.includes("A")){
                character_a.style.transform = "scaleX(-1)"
                character_a.style.filter = "drop-shadow(-4px -2px 3px rgba(0, 0, 0, 0.5))"
                dirX -= 1
            }
            if (pressed_keys_a.includes("S")){
                dirY += 1
            }
            if (pressed_keys_a.includes("D")){
                character_a.style.transform = "scaleX(1)"
                character_a.style.filter = "drop-shadow(4px -2px 3px rgba(0, 0, 0, 0.5))"
                dirX += 1
            }
            charX_a += dirX * char_speed_a * (delta / 1000)
            charY_a += dirY * char_speed_a * (delta / 1000)

            // Out of bounds wrapping
            if (charX_a > window.innerWidth - 10){
                charX_a = 0 - 10
                last_pos_x_a = charX_a
            }
            else if (charX_a < 0 - 10){
                charX_a = window.innerWidth - 10
                last_pos_x_a = charX_a
            }

            if (charY_a > window.innerHeight - 20 - 100){
                charY_a = 0 - 20
                last_pos_y_a = charY_a
            }
            else if (charY_a < 0 - 20){
                charY_a = window.innerHeight - 20 - 100
                last_pos_y_a = charY_a
            }

            ctx.globalAlpha = 0.1;
            ctx.strokeStyle = "blue"
            ctx.lineWidth = paintWidth

            ctx.moveTo(last_pos_x_a + 10, last_pos_y_a + document.getElementById("mainContainer").getBoundingClientRect().y + 20)
            ctx.lineTo(charX_a + 10, charY_a + document.getElementById("mainContainer").getBoundingClientRect().y + 20)
            ctx.lineCap = 'round';
            ctx.stroke()
            last_pos_x_a = charX_a
            last_pos_y_a = charY_a

            character_a.style.top = charY_a + "px"
            character_a.style.left = charX_a + "px"
            
        }
        else {
            current_animation_a = 0
        }

        // Character b
        if (pressed_keys_b.length > 0){
            current_animation_b = 1
            let dirX = 0
            let dirY = 0

            if (pressed_keys_b.includes("W")){
                dirY -= 1
            }
            if (pressed_keys_b.includes("A")){
                character_b.style.transform = "scaleX(-1)"
                character_b.style.filter = "drop-shadow(-4px -2px 3px rgba(0, 0, 0, 0.5))"
                dirX -= 1
            }
            if (pressed_keys_b.includes("S")){
                dirY += 1
            }
            if (pressed_keys_b.includes("D")){
                character_b.style.transform = "scaleX(1)"
                character_b.style.filter = "drop-shadow(4px -2px 3px rgba(0, 0, 0, 0.5))"
                dirX += 1
            }
            charX_b += dirX * char_speed_b * (delta / 1000)
            charY_b += dirY * char_speed_b * (delta / 1000)

            // Out of bounds wrapping
            if (charX_b > window.innerWidth - 10){
                charX_b = 0 - 10
                last_pos_x_b = charX_b
            }
            else if (charX_b < 0 - 10){
                charX_b = window.innerWidth - 10
                last_pos_x_b = charX_b
            }

            if (charY_b > window.innerHeight - 20 - 100){
                charY_b = 0 - 20
                last_pos_y_b = charY_b
            }
            else if (charY_b < 0 - 20){
                charY_b = window.innerHeight - 20 - 100
                last_pos_y_b = charY_b
            }

            ctx2.globalAlpha = 0.01;
            ctx2.strokeStyle = "green"
            ctx2.lineWidth = paintWidth

            ctx2.moveTo(last_pos_x_b + 10, last_pos_y_b + document.getElementById("mainContainer").getBoundingClientRect().y + 20)
            ctx2.lineTo(charX_b + 10, charY_b + document.getElementById("mainContainer").getBoundingClientRect().y + 20)
            ctx2.lineCap = 'round';
            ctx2.stroke()
            last_pos_x_b = charX_b
            last_pos_y_b = charY_b

            character_b.style.top = charY_b + "px"
            character_b.style.left = charX_b + "px"
        }
        else {
            current_animation_b = 0
        }

    }

    // Handle tag selector animation
    const tagSelector = document.getElementById("tagSelector")
    if (selectorTarget != null){
        let selectorPos = tagSelector.getBoundingClientRect()
        tagSelector.style.left = selectorTarget.x - (14 * window.innerWidth / 1440) + "px"

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