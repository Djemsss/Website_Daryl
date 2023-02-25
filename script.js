// Home page script

const myHobbies = [
  "Computers",
  "Electronics",
  "Coding",
  "Music",
  "Photography",
  "Games",
  "Arduino",
  "3D rendering",
  "Space",
  "Engineering",
  "Godot Engine",
  "3D Printing",
  "Animation",
  "Travelling",
  "Building things",
  "Instruments",
  "3D Modeling",
  "Science",
];
var currentLike = 0;

const colors = [
  "rgb(255, 99, 71)", // tomato
  "rgb(255, 215, 0)", // gold
  "rgb(138, 43, 226)", // blue violet
  "rgb(0, 191, 255)", // deep sky blue
  "rgb(255, 140, 0)", // dark orange
  "rgb(0, 255, 255)", // cyan
  "rgb(255, 20, 147)", // deep pink
  "rgb(30, 144, 255)", // dodger blue
  "rgb(154, 205, 50)", // yellow green
  "rgb(255, 165, 0)", // orange
];

const projects = ["Orbits", "World Map"];

var selectorTarget = null;
var selector_x = 0;
var selector_y = 0;
var ropes = [];

var pageReady = false;

function cycleWords() {
  if (pageReady == false || !document.getElementById("iLike")) {
    return;
  }
  const wordElement = document.getElementById("iLike");
  wordElement.style.opacity = 0;
  setTimeout(() => {
    if (currentLike + 1 >= myHobbies.length) {
      currentLike = 0;
    } else {
      currentLike += 1;
    }

    wordElement.style.color = colors[Math.floor(Math.random() * colors.length)];

    wordElement.style.opacity = 1;
    morphText(myHobbies[currentLike], wordElement, 100);
  }, 500);
}

setInterval(cycleWords, 4000);

function displayProjects() {
  var tags = document.querySelectorAll(".projectTag");

  tags.forEach((element, index) => {
    setTimeout(() => {
      element.style.opacity = 1;
      element.style.pointerEvents = "all";

      let text = element.firstChild.innerHTML;

      let chars = "#%&";
      let str = "";
      let thisChar = "";
      let lastChar = "";
      for (let index = 0; index < myHobbies[currentLike].length; index++) {
        while (thisChar == lastChar) {
          thisChar = chars.charAt(Math.floor(Math.random() * chars.length));
        }
        lastChar = thisChar;
        str += thisChar;
      }
      element.firstChild.innerHTML = str;
      morphText(text, element.firstChild, 150);
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

  if (window.innerWidth > 2000) {
    document.getElementById("character_a").style.scale = "4";
    paintWidth = 24;
  } else {
    document.getElementById("character_a").style.scale = "2";
    paintWidth = 12;
  }
});

// Run when window is loaded
window.addEventListener("load", (eevent) => {
  console.log("window loaded");

  // Set canvas size
  document.getElementById("canvas").width = window.innerWidth;
  document.getElementById("canvas").height = window.innerHeight;

  document.getElementById("canvas2").width = window.innerWidth;
  document.getElementById("canvas2").height = window.innerHeight;

  document.getElementById("canvasRopes").width = window.innerWidth;
  document.getElementById("canvasRopes").height = window.innerHeight;

  // Set selector position
  selector_x = document.getElementById("tagSelector").getBoundingClientRect().x;
  selector_y =
    document.getElementById("tagSelector").getBoundingClientRect().y -
    document.getElementById("mainContainer").getBoundingClientRect().y +
    3;

  document.getElementById("character_a").style.left = 0 + "px";
  document.getElementById("character_a").style.top = 0 + "px";

  document.getElementById("character_b").style.left = 0 + "px";
  document.getElementById("character_b").style.top = 50 + "px";

  // "Decode" displays
  let helloModule = document.getElementById("helloModule");
  morphText(helloModule.innerHTML, helloModule, 120);

  let aboutMe = document.querySelectorAll(".legend");
  aboutMe.forEach((element) => {
    morphText(element.innerHTML, element, 300);
  });

  document.getElementById("infoText").style.display = "none";

  document.addEventListener("mousemove", eventHandler, false);
  document.addEventListener("touchmove", eventHandler, false);
  document.addEventListener("touchend", eventHandler, false);
  document.addEventListener("touchstart", eventHandler, false);

  const canvas = document.getElementById("canvasRopes");
  // for (let index = 0; index < 20; index++) {
  //   let x = (window.innerWidth / 20) * index;
  //   const rope = new Rope(
  //     canvas,
  //     2,
  //     2,
  //     10,
  //     3,
  //     9.81,
  //     30,
  //     0.1,
  //     0.8,
  //     x,
  //     window.innerHeight - 200,
  //     10
  //   );
  //   ropes.push(rope);
  //   rope.simulate();
  // }

  setTimeout(function () {
    // Delay after page loads
    document.getElementById("infoText").style.display = "block";
    displayText(
      document.getElementById("infoText"),
      document.getElementById("infoText").textContent
    );
  }, 1500);

  setTimeout(function () {
    // Longer delay after page loads
    const tags = document.querySelectorAll(".projectTag");
    tags.forEach((element) => {
      element.addEventListener("mouseenter", (event) => {
        let pos = element.getBoundingClientRect();
        selectorTarget = pos;
        tagSelector.style.opacity = 1;
      });
      element.addEventListener("mouseleave", (event) => {
        selectorTarget = null;
      });
    });
    pageReady = true;
    displayProjects();
  }, 4000);
});

window.addEventListener("beforeunload", (event) => {
  set(ref(database, "users/" + networkID), null);
});

var eventHandler = function (event) {
  let header = document.getElementById("Header");
  let wave = document.getElementsByClassName("wave");
  if (!header) {
    return;
  }
  let mouseX = 0;
  let mouseY = 0;
  switch (event.type) {
    case "touchstart":
    case "touchend":
      mouseX = 0;
      mouseY = window.innerHeight;
      break;
    case "touchmove":
      mouseX = event.touches[0].clientX;
      mouseY = event.touches[0].clientY;
      break;
    case "mousemove":
      mouseX = event.clientX;
      mouseY = event.clientY;
      break;
  }
  wave_to(mouseX, mouseY);
  // ropes.forEach(rope => {
  //   rope.targetX = mouseX;
  //   rope.targetY = mouseY;
  // })
};

function wave_to(mouseX, mouseY) {
  let screenWidth = window.innerWidth;
  let percent = Math.floor((mouseX / screenWidth) * 100);
  let height = remap(mouseY, 0, window.innerHeight, 100, 20);

  let center = percent.toString() + "% " + height + "%, ";
  let left = Math.max(percent - 20, 0).toString() + "% 60%, ";
  let right = Math.min(percent + 20, 100).toString() + "% 60%, ";
  let poly =
    "polygon(0 0, 100% 0, 100% 60%, " + left + center + right + "0 60%);";

  let styleSheet = document.styleSheets[0];

  const rules = styleSheet.cssRules;

  // To do - delete previously created clip-path rule if necessary
  let index = styleSheet.cssRules.length;
  styleSheet.insertRule(".wave::before { clip-path: " + poly + "}", index);
}

function morphText(endText, element, speed) {
  let chars = "#%&$£*";
  let str = "";
  let thisChar = "";
  let lastChar = "";
  for (let index = 0; index < endText.length; index++) {
    while (thisChar == lastChar) {
      thisChar = chars.charAt(Math.floor(Math.random() * chars.length));
    }
    lastChar = thisChar;
    str += thisChar;
  }

  element.innerHTML = str;
  let initialText = element.innerHTML;

  // Remove any extra characters from the initial text
  initialText = initialText.substring(0, endText.length);

  // Set the initial text of the element
  let text = initialText;

  // Define an array of indices that represent the order in which the characters should be replaced
  const indices = Array.from({ length: endText.length }, (_, i) => i);
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
    text =
      text.substring(0, indices[position]) +
      endChar +
      text.substring(indices[position] + 1);

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
      const randomChars = Array.from({ length: numRandomChars }, () =>
        String.fromCharCode(97 + Math.floor(Math.random() * 26))
      );

      // Build the current text
      const currentText = text.slice(0, i) + randomChars.join("");

      // Display the current text
      element.textContent = currentText;

      // Schedule the next display step
      setTimeout(displayNext, 60);

      i += numRandomChars;
    } else {
      // Call the callback function after the last display step is scheduled
      element.textContent = text;
      element.innerHTML += '<span id="iLike" >Computers</span>';
    }
  }

  // Start with an empty element
  element.textContent = "";

  // Schedule the first display step
  setTimeout(displayNext, 1000);
}

function animate() {
  let context = document.getElementById("canvasRopes").getContext("2d");
  context.clearRect(0, 0, canvas.width, canvas.height);
  ropes.forEach((rope) => {
    rope.simulate();
  });
}

var intervalId = window.setInterval(function () {
  animate();
  if (pageReady == false) {
    return;
  }
  // Handle tag selector animation
  const tagSelector = document.getElementById("tagSelector");
  if (selectorTarget != null) {
    let selectorPos = tagSelector.getBoundingClientRect();
    tagSelector.style.left =
      selectorTarget.x - (16 * window.innerWidth) / 1440 + "px";

    if (Math.abs(selectorPos.y - selectorTarget.y) < 5) {
      tagSelector.style.top =
        selectorTarget.y -
        document.getElementById("mainContainer").getBoundingClientRect().y +
        "px";
    } else if (selectorPos.y > selectorTarget.y) {
      selector_y -= 8;
      tagSelector.style.top = selector_y + "px";
    } else {
      selector_y += 8;
      tagSelector.style.top = selector_y + "px";
    }
  } else {
    tagSelector.style.opacity = 0;
  }
}, 10);

class Rope {
  constructor(
    canvas,
    ropeLength,
    numPoints,
    pointMass,
    pointRadius,
    gravity,
    maxDist,
    stiffness,
    relaxation,
    startX,
    startY,
    targetMaxDist
  ) {
    // Initialize canvas
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");

    // Define rope parameters
    this.ropeLength = ropeLength;
    this.numPoints = numPoints;
    this.pointMass = pointMass;
    this.pointRadius = pointRadius;
    this.gravity = gravity;
    this.maxDist = maxDist;
    this.stiffness = stiffness;
    this.relaxation = relaxation;
    this.fixedX = startX;
    this.fixedY = startY;
    this.targetMaxDist = targetMaxDist;

    // Initialize rope points
    this.points = [];
    for (let i = 0; i < this.numPoints; i++) {
      this.points.push({
        x: i * (this.ropeLength / (this.numPoints - 1)),
        y: 100,
        prevX: i * (this.ropeLength / (this.numPoints - 1)),
        prevY: 100,
        mass: this.pointMass,
      });
    }
    // Fix first point in place
    this.points[0].x = startX;
    this.points[0].y = startY;
    this.points[0].prevX = startX;
    this.points[0].prevY = startY;

    this.targetX = null;
    this.targetY = null;
  }

  // Verlet integration function
  verletIntegrate(dt) {
    // Update fixed point
    this.points[0].x = this.fixedX;
    this.points[0].y = this.fixedY;

    // Update remaining points
    for (let i = 1; i < this.points.length; i++) {
      const point = this.points[i];

      const tempX = point.x;
      const tempY = point.y;

      point.x += point.x - point.prevX;
      point.y += point.y - point.prevY;
      point.y += point.mass * this.gravity * dt ** 2;

      // Move point towards target position (if specified)
      if (
        this.targetX !== null &&
        this.targetY !== null &&
        i === this.points.length - 1
      ) {
        const dx = this.targetX - point.x;
        const dy = this.targetY - point.y;
        const dist = Math.sqrt(dx ** 2 + dy ** 2);
        const maxMove = Math.min(dist / 10, this.targetMaxDist);
        if (maxMove > 1) {
          point.x += (dx / dist) * maxMove;
          point.y += (dy / dist) * maxMove;
        } else {
          // this.targetX = null;
          // this.targetY = null;
        }
      }

      point.prevX = tempX;
      point.prevY = tempY;

      // Apply constraint
      const dx = point.x - this.points[i - 1].x;
      const dy = point.y - this.points[i - 1].y;
      const dist = Math.sqrt(dx ** 2 + dy ** 2);
      if (dist > this.maxDist) {
        const offset = (dist - this.maxDist) / dist;
        const ddx = dx * offset * this.stiffness;
        const ddy = dy * offset * this.stiffness;
        point.x -= ddx * this.relaxation;
        point.y -= ddy * this.relaxation;
        this.points[i - 1].x += ddx * this.relaxation;
        this.points[i - 1].y += ddy * this.relaxation;
      }
    }
  }

  // Simulate rope function
  simulate() {
    // Clear canvas

    // Simulate rope
    const dt = 0.01;
    for (let i = 0; i < 10; i++) {
      this.verletIntegrate(dt);
    }

    // Draw rope
    this.ctx.beginPath();
    this.ctx.moveTo(this.points[0].x, this.points[0].y);
    for (let i = 1; i < this.points.length; i++) {
      this.ctx.lineTo(this.points[i].x, this.points[i].y);
    }
    this.ctx.lineWidth = this.pointRadius * 2;
    this.ctx.strokeStyle = "#000";
    this.ctx.stroke();

    // Draw rope points
    // for (let i = 0; i < this.points.length; i++) {
    //   this.ctx.beginPath();
    //   this.ctx.arc(this.points[i].x, this.points[i].y, this.pointRadius, 0, Math.PI * 2);
    //   this.ctx.fillStyle = "#fff";
    //   this.ctx.fill();
    //   this.ctx.strokeStyle = "#000";
    //   this.ctx.stroke();
    // }

    // Request next frame
    // requestAnimationFrame(() => this.simulate());
  }
}

function lerp(start, end, t) {
  return (1 - t) * start + t * end;
}

function waitForElement(id, callback) {
  var poops = setInterval(function () {
    if (document.getElementById(id)) {
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
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}
