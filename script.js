// Home page script

const myHobbies = ["Computers", "Electronics", "Coding", "Music", "Photography", "Games", "Arduino", "3D        rendering", "Space", "Engineering", "Godot", "3D Printing", "Animation", "Travelling", "Building things", "Instruments", "3D Modeling", "Science"]
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

// Run when window is loaded
window.addEventListener('load', (eevent) => {
    console.log("window loaded")

    // Set selector position
    selector_x = document.getElementById("tagSelector").getBoundingClientRect().x
    selector_y = document.getElementById("tagSelector").getBoundingClientRect().y - 97

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

    setTimeout(function(){
        document.getElementById("infoText").style.display = "block"
        displayText(document.getElementById("infoText"), document.getElementById("infoText").textContent)
        
    }, 1500); 

    setTimeout(function(){
        const tags = document.querySelectorAll(".projectTag");
        tags.forEach(element => {
            element.addEventListener("mouseenter", (event) => {
                pos = element.getBoundingClientRect();
                selectorTarget = pos
                tagSelector.style.opacity = 1
                console.log(selector_y)
                
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
            mouseY = 2000
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
    // console.log(mouseX, mouseY)
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
    initialText = element.innerHTML

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


var intervalId = window.setInterval(function(){
    if (pageReady == false){
        return
    }
    const tagSelector = document.getElementById("tagSelector")
    if (selectorTarget != null){
        let selectorPos = tagSelector.getBoundingClientRect()
        tagSelector.style.left = selectorTarget.x - 14 + "px"

        if (Math.abs(selectorPos.y - selectorTarget.y) < 5){
            tagSelector.style.top = selectorTarget.y - 97 + "px"
        }

        else if (selectorPos.y > selectorTarget.y){
            selector_y -= 10
            tagSelector.style.top = selector_y + "px"
        }
        else {
            selector_y += 10
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
};

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

function remap(value, inMin, inMax, outMin, outMax) {
    return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}