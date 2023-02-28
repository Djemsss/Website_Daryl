import { Vectors } from "./modules/Vectors.js";

// Assets
var anim_frames_a = [
  [
    "img/character_a/idle/tile000.png",
    "img/character_a/idle/tile001.png",
    "img/character_a/idle/tile002.png",
    "img/character_a/idle/tile003.png",
  ],
  [
    "img/character_a/run/tile004.png",
    "img/character_a/run/tile005.png",
    "img/character_a/run/tile006.png",
    "img/character_a/run/tile007.png",
    "img/character_a/run/tile008.png",
    "img/character_a/run/tile009.png",
  ],
  [
    "img/character_a/runLow/tile017.png",
    "img/character_a/runLow/tile018.png",
    "img/character_a/runLow/tile019.png",
    "img/character_a/runLow/tile020.png",
    "img/character_a/runLow/tile021.png",
    "img/character_a/runLow/tile022.png",
    "img/character_a/runLow/tile023.png",
  ],
  [
    "img/character_a/kick/tile010.png",
    "img/character_a/kick/tile011.png",
    "img/character_a/kick/tile012.png",
    "img/character_a/kick/tile013.png",
  ],
];

var anim_frames_b = [
  [
    "img/character_b/idle/tile000.png",
    "img/character_b/idle/tile001.png",
    "img/character_b/idle/tile002.png",
    "img/character_b/idle/tile003.png",
  ],
  [
    "img/character_b/run/tile004.png",
    "img/character_b/run/tile005.png",
    "img/character_b/run/tile006.png",
    "img/character_b/run/tile007.png",
    "img/character_b/run/tile008.png",
    "img/character_b/run/tile009.png",
  ],
  [
    "img/character_b/runLow/tile017.png",
    "img/character_b/runLow/tile018.png",
    "img/character_b/runLow/tile019.png",
    "img/character_b/runLow/tile020.png",
    "img/character_b/runLow/tile021.png",
    "img/character_b/runLow/tile022.png",
    "img/character_b/runLow/tile023.png",
  ],
  [
    "img/character_b/kick/tile010.png",
    "img/character_b/kick/tile011.png",
    "img/character_b/kick/tile012.png",
    "img/character_b/kick/tile013.png",
  ],
];

function preloadImages() {
  anim_frames_a.forEach((images) => {
    for (let i = 0; i < images.length; i++) {
      const img = new Image();
      img.src = images[i];
    }
  });
  anim_frames_b.forEach((images) => {
    for (let i = 0; i < images.length; i++) {
      const img = new Image();
      img.src = images[i];
    }
  });
}
preloadImages();

var game_mode = false;
var paintWidth = 12;

var characters = [];
var obstacles = [];

// Classes
class dino {
  constructor(charNum) {
    characters.push(this);
    this.charNum = charNum;
    this.sprite_set = charNum;
    this.last_time = 0;
    this.kicking = false;
    this.facingDir = 1;
    if (charNum == 0) {
      this.sprite = document.getElementById("character_a");
      this.color = "blue";
      this.frames = anim_frames_a;
      this.ctx = document.getElementById("canvas").getContext("2d");
      this.nameTag = document.getElementById("character_a_tag");

      this.friendSprite = document.getElementById("character_b");
    } else {
      this.sprite = document.getElementById("character_b");
      this.color = "green";
      this.frames = anim_frames_b;
      this.ctx = document.getElementById("canvas2").getContext("2d");
      this.nameTag = document.getElementById("character_b_tag");

      this.friendSprite = document.getElementById("character_a");
    }
    this.current_animation = 0;
    this.current_frame = 0;
    this.pressed_keys = [];
    this.char_speed = 16;
    this.position = new Vectors.Vector2(0, 0 + charNum * 50);
    this.last_position = new Vectors.Vector2(0, 0 + charNum * 50);
  }
  reset() {
    this.position = new Vectors.Vector2(0, 0 + this.charNum * 50);
    this.last_position = new Vectors.Vector2(0, 0 + this.charNum * 50);
  }
  simulate() {
    if (game_mode == true) {
      let current_time = Date.now();
      let delta = current_time - this.last_time;

      // Handle name tag
      this.nameTag.style.left = this.position.x - 90 + "px";
      this.nameTag.style.top = this.position.y - 26 + "px";

      // Handle z index relative to second character only if first character
      if (this.charNum == 0) {
        if (
          this.sprite.getBoundingClientRect().y >
          this.friendSprite.getBoundingClientRect().y
        ) {
          this.sprite.style.zIndex = "6";
        } else {
          this.sprite.style.zIndex = "4";
        }
      }

      // Handle animation
      const FPS = 10;
      if (delta > (1 / FPS) * 1000) {
        this.last_time = current_time;

        if (
          this.current_frame + 1 >
          this.frames[this.current_animation].length - 1
        ) {
          if (this.kicking == true) {
            // Kick ended
            this.kicking = false;
            return;
          }
          this.current_frame = 0;
        } else {
          this.current_frame += 1;
        }
        this.sprite.src =
          this.frames[this.current_animation][this.current_frame];
      }

      if (this.kicking == true) {
        return;
      }

      // Handle character movement
      if (this.pressed_keys.length > 0) {
        if (this.pressed_keys.includes("kick")) {
          this.kicking = true;
          this.current_animation = 3;
          this.current_frame = 0;

          let hit = willCollide(
            this.sprite,
            new Vectors.Vector2(
              this.sprite.getBoundingClientRect().x + this.facingDir * 10,
              this.sprite.getBoundingClientRect().y
            )
          );

          if (hit[0] == true) {
            shakeElement(hit[1], 1, 200);
          }

          return;
        }

        this.current_animation = 1;
        let dir = new Vectors.Vector2(0, 0);

        if (this.pressed_keys.includes("run")) {
          this.char_speed = 24;
          this.current_animation = 2;
        } else {
          this.char_speed = 16;
          this.current_animation = 1;
        }

        if (this.pressed_keys.includes("W")) {
          dir.y -= 1;
        }
        if (this.pressed_keys.includes("A")) {
          dir.x -= 1;
          this.facingDir = -1;
          this.sprite.style.transform = "scaleX(-1)";
          this.sprite.style.filter =
            "drop-shadow(-4px -2px 3px rgba(0, 0, 0, 0.5))";
        }
        if (this.pressed_keys.includes("S")) {
          dir.y += 1;
        }
        if (this.pressed_keys.includes("D")) {
          dir.x += 1;
          this.facingDir = 1;
          this.sprite.style.transform = "scaleX(1)";
          this.sprite.style.filter =
            "drop-shadow(4px -2px 3px rgba(0, 0, 0, 0.5))";
        }

        let normalDir = dir.normalize();

        let collision = willCollide(
          this.sprite,
          new Vectors.Vector2(
            this.sprite.getBoundingClientRect().x +
              normalDir.x * this.char_speed * (delta / 1000),
            this.sprite.getBoundingClientRect().y +
              normalDir.y * this.char_speed * (delta / 1000)
          )
        );

        if (collision[0] == true) {
        } else {
          this.position.x += normalDir.x * this.char_speed * (delta / 1000);
          this.position.y += normalDir.y * this.char_speed * (delta / 1000);
        }
      } else {
        this.current_animation = 0;
      }
      // Handle screen bounds
      if (this.position.x > window.innerWidth + 5) {
        this.position.x = -25;
        this.last_position.x = -25;
      } else if (this.position.x < -25) {
        this.position.x = window.innerWidth + 5;
        this.last_position.x = this.position.x;
      }
      if (
        this.position.y >
        window.innerHeight +
          10 -
          document.getElementById("mainContainer").getBoundingClientRect().y
      ) {
        this.position.y = -180;
        this.last_position.y = -180;
      } else if (this.position.y < -180) {
        this.position.y =
          window.innerHeight +
          10 -
          document.getElementById("mainContainer").getBoundingClientRect().y;
        this.last_position.y = this.position.y;
      }

      // Handle canvas painting
      this.ctx.strokeStyle = this.color;
      this.ctx.lineWidth = paintWidth;

      this.ctx.moveTo(
        this.last_position.x + 10,
        this.last_position.y +
          document.getElementById("mainContainer").getBoundingClientRect().y +
          20
      );

      this.ctx.lineTo(
        this.position.x + 10,
        this.position.y +
          document.getElementById("mainContainer").getBoundingClientRect().y +
          20
      );
      this.ctx.lineCap = "round";
      this.ctx.stroke();

      // Finally, set element position and check for collisions
      this.sprite.style.left = this.position.x + "px";
      this.sprite.style.top = this.position.y + "px";

      this.last_position = this.position;
    }
  }
}

window.addEventListener("resize", (ev) => {
  if (window.innerWidth > 2000) {
    document.getElementById("character_a").style.scale = "4";
    paintWidth = 24;
  } else {
    document.getElementById("character_a").style.scale = "2";
    paintWidth = 12;
  }
});

window.addEventListener("load", (event) => {
  document
    .getElementById("dinoButton")
    .addEventListener("pointerdown", prepare_dino_game, false);
  document
    .getElementById("submitButton")
    .addEventListener("pointerdown", start_dino_game, false);

  obstacles = document.querySelectorAll(".obstacle");

  new dino(0);
  new dino(1);

  document.addEventListener("keydown", function (event) {
    // Character a key downs
    if (characters[0]) {
      if (event.code === "KeyW") {
        if (!characters[0].pressed_keys.includes("W")) {
          characters[0].pressed_keys.push("W");
        }
      }
      if (event.code === "KeyA") {
        if (!characters[0].pressed_keys.includes("A")) {
          characters[0].pressed_keys.push("A");
        }
      }
      if (event.code === "KeyS") {
        if (!characters[0].pressed_keys.includes("S")) {
          characters[0].pressed_keys.push("S");
        }
      }
      if (event.code === "KeyD") {
        if (!characters[0].pressed_keys.includes("D")) {
          characters[0].pressed_keys.push("D");
        }
      }
      if (event.code === "KeyV") {
        if (!characters[0].pressed_keys.includes("run")) {
          characters[0].pressed_keys.push("run");
        }
      }
      if (event.code === "KeyB") {
        if (!characters[0].pressed_keys.includes("kick")) {
          characters[0].pressed_keys.push("kick");
        }
      }
    }
    // Character b key downs
    if (characters[1]) {
      if (event.code === "ArrowUp") {
        if (!characters[1].pressed_keys.includes("W")) {
          characters[1].pressed_keys.push("W");
        }
      }
      if (event.code === "ArrowLeft") {
        if (!characters[1].pressed_keys.includes("A")) {
          characters[1].pressed_keys.push("A");
        }
      }
      if (event.code === "ArrowDown") {
        if (!characters[1].pressed_keys.includes("S")) {
          characters[1].pressed_keys.push("S");
        }
      }
      if (event.code === "ArrowRight") {
        if (!characters[1].pressed_keys.includes("D")) {
          characters[1].pressed_keys.push("D");
        }
      }
      if (event.code === "Comma") {
        if (!characters[1].pressed_keys.includes("run")) {
          characters[1].pressed_keys.push("run");
        }
      }
      if (event.code === "Period") {
        if (!characters[1].pressed_keys.includes("kick")) {
          characters[1].pressed_keys.push("kick");
        }
      }
    }
  });

  document.addEventListener("keyup", (event) => {
    // Character a key ups
    if (characters[0]) {
      if (event.code === "KeyW") {
        if (characters[0].pressed_keys.includes("W")) {
          let index = characters[0].pressed_keys.indexOf("W");
          if (index > -1) {
            characters[0].pressed_keys.splice(index, 1);
          }
        }
      }
      if (event.code === "KeyA") {
        if (characters[0].pressed_keys.includes("A")) {
          let index = characters[0].pressed_keys.indexOf("A");
          if (index > -1) {
            characters[0].pressed_keys.splice(index, 1);
          }
        }
      }
      if (event.code === "KeyS") {
        if (characters[0].pressed_keys.includes("S")) {
          let index = characters[0].pressed_keys.indexOf("S");
          if (index > -1) {
            characters[0].pressed_keys.splice(index, 1);
          }
        }
      }
      if (event.code === "KeyD") {
        if (characters[0].pressed_keys.includes("D")) {
          let index = characters[0].pressed_keys.indexOf("D");
          if (index > -1) {
            characters[0].pressed_keys.splice(index, 1);
          }
        }
      }
      if (event.code === "KeyV") {
        if (characters[0].pressed_keys.includes("run")) {
          let index = characters[0].pressed_keys.indexOf("run");
          if (index > -1) {
            characters[0].pressed_keys.splice(index, 1);
          }
        }
      }
      if (event.code === "KeyB") {
        if (characters[0].pressed_keys.includes("kick")) {
          let index = characters[0].pressed_keys.indexOf("kick");
          if (index > -1) {
            characters[0].pressed_keys.splice(index, 1);
          }
        }
      }
    }
    // Character b key ups
    if (characters[1]) {
      if (event.code === "ArrowUp") {
        if (characters[1].pressed_keys.includes("W")) {
          let index = characters[1].pressed_keys.indexOf("W");
          if (index > -1) {
            characters[1].pressed_keys.splice(index, 1);
          }
        }
      }
      if (event.code === "ArrowLeft") {
        if (characters[1].pressed_keys.includes("A")) {
          let index = characters[1].pressed_keys.indexOf("A");
          if (index > -1) {
            characters[1].pressed_keys.splice(index, 1);
          }
        }
      }
      if (event.code === "ArrowDown") {
        if (characters[1].pressed_keys.includes("S")) {
          let index = characters[1].pressed_keys.indexOf("S");
          if (index > -1) {
            characters[1].pressed_keys.splice(index, 1);
          }
        }
      }
      if (event.code === "ArrowRight") {
        if (characters[1].pressed_keys.includes("D")) {
          let index = characters[1].pressed_keys.indexOf("D");
          if (index > -1) {
            characters[1].pressed_keys.splice(index, 1);
          }
        }
      }
      if (event.code === "Comma") {
        if (characters[1].pressed_keys.includes("run")) {
          let index = characters[1].pressed_keys.indexOf("run");
          if (index > -1) {
            characters[1].pressed_keys.splice(index, 1);
          }
        }
      }
      if (event.code === "Period") {
        if (characters[1].pressed_keys.includes("kick")) {
          let index = characters[1].pressed_keys.indexOf("kick");
          if (index > -1) {
            characters[1].pressed_keys.splice(index, 1);
          }
        }
      }
    }
  });
});

var intervalId = window.setInterval(function () {
  characters.forEach((character) => {
    character.simulate();
  });
}, 10);

function prepare_dino_game() {
  if (game_mode == true) {
    // Stop Game mode and reset all values
    game_mode = false;
    document.getElementById("character_a_tag").style.display = "none";
    document.getElementById("character_b_tag").style.display = "none";
    document.getElementById("character_a").style.display = "none";
    document.getElementById("character_b").style.display = "none";
    document.getElementById("dinoControlsBox").style.display = "none";

    characters.forEach((char) => {
      char.reset();
    });
    return;
  }
  document.getElementById("mainContainer").style.display = "none";
  document.getElementById("dinoButton").style.display = "none";
  document.getElementById("dinoOptions").style.display = "flex";
}

function start_dino_game() {
  const dinoName1 = document.getElementById("dinoName1").value;
  const dinoName2 = document.getElementById("dinoName2").value;

  document.getElementById("character_a_tag").textContent = dinoName1;
  document.getElementById("character_b_tag").textContent = dinoName2;

  document.getElementById("mainContainer").style.display = "flex";
  document.getElementById("dinoButton").style.display = "block";
  document.getElementById("dinoOptions").style.display = "none";

  document.getElementById("character_a_tag").style.display = "block";
  document.getElementById("character_b_tag").style.display = "block";
  document.getElementById("character_a").style.display = "block";
  document.getElementById("character_b").style.display = "block";
  document.getElementById("dinoControlsBox").style.display = "flex";

  game_mode = true;
}

function willCollide(element, futurePosition) {
  // Get the bounding rectangle of the element at the future position
  const futureRect = element.getBoundingClientRect();
  futureRect.x = futurePosition.x;
  futureRect.y = futurePosition.y;

  let collision_margin = 14;

  // Loop through each obstacle element
  for (let i = 0; i < obstacles.length; i++) {
    const obstacle = obstacles[i];
    // Get the bounding rectangle of the obstacle
    const obstacleRect = obstacle.getBoundingClientRect();

    // Check if the element and obstacle are colliding at the future position
    if (
      futureRect.bottom >= obstacleRect.top + collision_margin &&
      futureRect.top <= obstacleRect.bottom - 36 &&
      futureRect.right >= obstacleRect.left + collision_margin &&
      futureRect.left <= obstacleRect.right - collision_margin
    ) {
      return [true, obstacle];
    }
  }

  // No collision detected
  return [false, null];
}

function shakeElement(element, amount, duration) {
  // Calculate the initial position of the element
  var x = parseInt(window.getComputedStyle(element).getPropertyValue("left"));
  var y = parseInt(window.getComputedStyle(element).getPropertyValue("top"));

  // Define the shake animation
  var keyframes = [
    { transform: "translateX(0)" },
    { transform: "translateX(" + amount + "px)" },
    { transform: "translateX(-" + amount + "px)" },
    { transform: "translateX(0)" },
  ];
  var options = {
    duration: duration,
    iterations: Infinity,
    easing: "ease-in-out",
  };

  // Apply the shake animation to the element
  var animation = element.animate(keyframes, options);

  // Stop the animation and reset the element to its original position after the specified duration
  setTimeout(function () {
    animation.cancel();
    element.style.left = x + "px";
    element.style.top = y + "px";
  }, duration);
}
