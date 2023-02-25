import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  onValue,
  get,
  child,
} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAD6oiYrOw_UPr0uxFyIKVnqxZ8gZ2DCZc",
  authDomain: "test-36e98.firebaseapp.com",
  projectId: "test-36e98",
  storageBucket: "test-36e98.appspot.com",
  messagingSenderId: "288204002623",
  appId: "1:288204002623:web:e8f54061625254a329af8a",
  measurementId: "G-578PV7VH71",
  databaseURL:
    "https://test-36e98-default-rtdb.europe-west1.firebasedatabase.app",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const networkID = Math.floor(Math.random() * 99999999999);
var clientName = "Stranger";
var clientColor = "cyan";
console.log("My network ID: ", networkID);
var users = {};
var tiles = [];

var clicking = false;

function create_networkNameTag(text) {
  var newTag = document.createElement("div");
  newTag.textContent = text;
  newTag.classList.add("networkNameTag");
  newTag.style.pointerEvents = "none";
  document.body.appendChild(newTag);
  return newTag;
}

function create_networkColorTag(color) {
  var newTag = document.createElement("div");
  newTag.style.backgroundColor = color;
  newTag.classList.add("networkColorTag");
  newTag.style.pointerEvents = "none";
  document.body.appendChild(newTag);
  return newTag;
}

onValue(ref(database, "/tiles"), (values) => {
  let dbObject = values.val();
  if (dbObject == null || dbObject == undefined) {
    return;
  }
  let dbArray = Object.keys(dbObject);
  let currentIDs = Object.keys(users);

  dbArray.forEach((index) => {
    if (tiles.length > index) {
      tiles[index].style.backgroundColor = dbObject[index].color;
    }
  });
});

onValue(ref(database, "/users"), (values) => {
  let dbObject = values.val();
  if (dbObject == null || dbObject == undefined) {
    return;
  }

  let dbArray = Object.values(dbObject);
  let keys = Object.keys(dbObject);
  let currentIDs = Object.keys(users);

  for (let index = 0; index < keys.length; index++) {
    let user_id = keys[index];
    if (currentIDs.includes(user_id)) {
      // User already exists - update values

      users[user_id].name = dbArray[index].name;
      users[user_id].mouseX = dbArray[index].mouseX;
      users[user_id].mouseY = dbArray[index].mouseY;
      users[user_id].color = dbArray[index].color;

      // Update nameTag position
      users[user_id].nameTag.style.left = users[user_id].mouseX - 100 + "px";
      users[user_id].nameTag.style.top = users[user_id].mouseY - 50 + "px";

      // Update nameTag text
      users[user_id].nameTag.textContent = users[user_id].name;

      // Update colorTag position
      users[user_id].colorTag.style.left = users[user_id].mouseX - 10 + "px";
      users[user_id].colorTag.style.top = users[user_id].mouseY - 10 + "px";

      // Update colorTag color
      users[user_id].colorTag.style.backgroundColor = users[user_id].color;
    } else {
      // User doesnt exist in users list, add the user

      let user_name = dbArray[index].name;
      let user_color = dbArray[index].color;
      let user_mouseX = dbArray[index].mouseX;
      let user_mouseY = dbArray[index].mouseY;

      let newUser = {
        id: user_id,
        name: user_name,
        color: user_color,
        mouseX: user_mouseX,
        mouseY: user_mouseY,
        nameTag: create_networkNameTag(user_name.toString()),
        colorTag: create_networkColorTag(clientColor),
      };
      users[user_id] = newUser;
    }
  }
});

window.addEventListener("beforeunload", (event) => {
  set(ref(database, "users/" + networkID), null);
});

window.addEventListener("load", (eevent) => {
  document.getElementById("clearButton").addEventListener("click", (event) => {
    set(ref(database, "/tiles"), null);
    tiles.forEach((tile) => {
      tile.style.backgroundColor = "black";
    });
  });

  document.getElementById("nameInput").addEventListener("input", (event) => {
    clientName = event.target.value;
  });
  document.getElementById("colorInput").addEventListener("input", (event) => {
    clientColor = event.target.value;
  });

  // Set all elements to not be draggable to avoid bugs
  const elements = document.querySelectorAll("*");
  for (let i = 0; i < elements.length; i++) {
    elements[i].setAttribute("draggable", false);
  }

  // Setup info Collapsible
  var coll = document.getElementsByClassName("infoCollapsible");
  var i;
  for (i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function () {
      this.classList.toggle("active");
      var content = this.previousElementSibling;
      if (content.style.maxHeight) {
        content.style.maxHeight = null;
      } else {
        content.style.maxHeight = content.scrollHeight + "px";
      }
    });
  }
  document
    .getElementById("matrix")
    .addEventListener("mousedown", eventHandler, false);
  document.addEventListener("mouseup", eventHandler, false);
  document.addEventListener("mousemove", eventHandler, false);
  // Startup Grid

  // create a 4x4 grid
  createGrid(100, 50);
});

function createGrid(x, y) {
  const matrix = document.getElementById("matrix");
  const numRows = y;
  const numCols = x;

  matrix.style.gridTemplateRows = `repeat(${numRows}, 1fr)`;
  matrix.style.gridTemplateColumns = `repeat(${numCols}, 1fr)`;

  for (let i = 1; i <= numRows * numCols; i++) {
    const item = document.createElement("div");
    item.classList.add("grid-item");
    tiles.push(item);
    item.setAttribute("draggable", "false");
    matrix.appendChild(item);

    item.addEventListener("dragstart", (event) => {
      event.preventDefault();
    });

    item.addEventListener("click", (event) => {
      let tileIndex = getElementIndex(item);
      paint_tile(item, tileIndex);
    });
    item.addEventListener("mouseover", (event) => {
      if (clicking) {
        let tileIndex = getElementIndex(item);
        paint_tile(item, tileIndex);
      }
    });
  }
}

function getElementIndex(element) {
  const parent = element.parentElement;
  const children = parent.children;

  for (let i = 0; i < children.length; i++) {
    if (element.isSameNode(children[i])) {
      return i;
    }
  }

  return -1; // Element not found in parent
}

function paint_tile(tile, tile_index) {
  tile.style.backgroundColor = clientColor;
  set(ref(database, "tiles/" + tile_index), {
    color: clientColor,
  });
}

function eventHandler(event) {
  let mouseX = 0;
  let mouseY = 0;
  switch (event.type) {
    case "mousedown":
      clicking = true;
      break;
    case "mouseup":
      clicking = false;
      break;
    case "mousemove":
      mouseX = event.clientX;
      mouseY = event.clientY;
      set(ref(database, "users/" + networkID), {
        mouseX: mouseX,
        mouseY: mouseY,
        name: clientName,
        color: clientColor,
      });
      break;
  }
}
