// Home page script

const myHobbies = ["Computers", "Electronics", "Arduino", "Music", "Photography", "Games", "Coding", "3D rendering", 
                "Space", "Engineering", "3D Modeling", "3D Printing", "Animation", "Travelling", "Building things", "Instruments",
                "Godot"]
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
        wordElement.innerHTML = myHobbies[currentLike];
      
        wordElement.style.opacity = 1;
    }, 500);
  }
  
setInterval(cycleWords, 3000);

function displayProjects(){
    var tags = document.querySelectorAll(".projectTag");

    tags.forEach((element, index) => {
        setTimeout(() => {
            element.style.opacity = 1
            element.style.pointerEvents = "all"
          }, index * 1200); // delay each iteration by index * 2 seconds
        
    });
}
// Run when window is loaded
window.addEventListener('load', (eevent) => {
    console.log("window loaded")
    selector_x = document.getElementById("tagSelector").getBoundingClientRect().x
    selector_y = document.getElementById("tagSelector").getBoundingClientRect().y
    console.log(selector_x, selector_y)

    // Preset Randomized Text
    document.getElementById("helloModule").innerHTML = "%*&(&%(**%&((&%("
    morphText("Hello! I'm Daryl", document.getElementById("helloModule"), 120)
    document.getElementById("infoText").style.display = "none"

    setTimeout(function(){
        document.getElementById("infoText").style.display = "block"
        displayText(document.getElementById("infoText"), document.getElementById("infoText").textContent)
        
    }, 1500); 

    setTimeout(function(){
        const tags = document.querySelectorAll(".projectTag");
        console.log("TimeoutDone")
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

function morphText(endText, element, speed) {
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
        tagSelector.style.left = selectorTarget.x - 24 + "px"

        if (Math.abs(selectorPos.y - selectorTarget.y) < 5){
            tagSelector.style.top = selectorTarget.y - 97
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