// Script for the Map project

var countries = [];
var countries_name = [];
var countries_code = [];
var selected_country = null;
var hovered_country = null;

var airplane_mode = true;

var mapWidth = 70;
var mapScale = 1;
var dragging = false;

var map_pos_x = 0;
var map_pos_y = 0;

var drag_start_x = 0;
var drag_start_y = 0;

var mouse_x = 0;
var mouse_y = 0;

var country_base_color = "#428d90";
var country_hover_color = "aquamarine";
var country_select_color = "rgb(0, 255, 100)";
var country_time_color = "red";

// Run when document is loaded
window.addEventListener("load", (eevent) => {
  console.log("Document loaded");
  let start_pos_x =
    window.innerWidth / 2 -
    document.getElementById("fullMap").getBoundingClientRect().width / 2;
  let start_pos_y =
    window.innerHeight / 2.5 -
    document.getElementById("fullMap").getBoundingClientRect().height / 2;

  map_pos_x = start_pos_x;
  map_pos_y = start_pos_y;

  // canvas stretching for aditional drawing
  document.getElementById("canvas").width = window.innerWidth;
  document.getElementById("canvas").height = window.innerHeight;
  document.getElementById("canvas2").width = window.innerWidth;
  document.getElementById("canvas2").height = window.innerHeight;

  var world = document.getElementById("fullMap");
  var doc = world.getSVGDocument();
  var svgMap = doc.childNodes[1];

  world.style.left = map_pos_x + "px";
  world.style.top = map_pos_y + "px";

  // Mouse handling
  doc.addEventListener("mousemove", function (e) {
    mouse_x = e.clientX;
    mouse_y = e.clientY;
    if (dragging == true) {
      document.getElementById("countryNameHover").innerHTML = "";
      let worldMap = document.getElementById("fullMap");

      map_pos_x -= drag_start_x - mouse_x;
      map_pos_y -= drag_start_y - mouse_y;

      worldMap.style.left = map_pos_x + "px";
      worldMap.style.top = map_pos_y + "px";
    }
  });

  // Zoom handling
  doc.addEventListener("wheel", function (event) {
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    const rect = world.getBoundingClientRect();

    // Calculate the current mouse position relative to the map element
    const mouseXRelative = mouseX;
    const mouseYRelative = mouseY;

    // Calculate the zoom factor
    const delta = event.deltaY < 0 ? 1.1 : 0.9;

    if (
      (mapWidth * 1.1 >= 1000 && delta > 1) ||
      (mapWidth * 0.9 <= 70 && delta < 1)
    ) {
      console.log(mapWidth);
      return;
    }

    mapWidth *= delta;
    mapWidth = Math.max(70, Math.min(1000, mapWidth));

    const newMouseXRelative = mouseXRelative * delta;
    const newMouseYRelative = mouseYRelative * delta;

    const diffX = mouseXRelative - newMouseXRelative;
    const diffY = mouseYRelative - newMouseYRelative;

    map_pos_x += diffX;
    map_pos_y += diffY;

    world.style.left = map_pos_x + "px";
    world.style.top = map_pos_y + "px";
    world.style.width = mapWidth + "%";
  });

  // Handle Dragging state
  doc.addEventListener("pointerdown", function (e) {
    dragging = true;
    drag_start_x = mouse_x;
    drag_start_y = mouse_y;
  });
  doc.addEventListener("pointerup", function (e) {
    dragging = false;
  });

  document
    .getElementById("mapProject")
    .addEventListener("pointerdown", function (e) {
      dragging = true;
      drag_start_x = mouse_x;
      drag_start_y = mouse_y;
    });
  document
    .getElementById("mapProject")
    .addEventListener("pointerup", function (e) {
      dragging = false;
    });

  // Populate countries array
  doc.childNodes[1].querySelector("g").childNodes.forEach((element) => {
    if (element.nodeName == "path") {
      countries.push(element);
      countries_code.push(element.getAttribute("id"));
      countries_name.push(element.getAttribute("title"));
    }
  });
  console.log("Number of Countries: ", countries.length);

  // Hover clear handling
  doc.addEventListener("mouseout", function (event) {
    if (hovered_country != null && hovered_country != selected_country) {
      hovered_country.style.fill = country_base_color;
      hovered_country.style.stroke = "black";
    }
    document.getElementById("countryNameHover").innerHTML = "";
  });

  // Hover event listener for countries
  doc.addEventListener("mousemove", function (e) {
    if (dragging == true) {
      return;
    }
    var target = e.target;

    if (target) {
      if (target.nodeName != "svg") {
        if (hovered_country != null && hovered_country != selected_country) {
          hovered_country.style.fill = country_base_color;
          hovered_country.style.stroke = "black";
          document.getElementById("countryNameHover").innerHTML = "";
        }
        if (target != selected_country) {
          target.style.fill = country_hover_color;
        }

        target.style.stroke = "black";
        document.getElementById("countryNameHover").innerHTML =
          target.getAttribute("title");
        document.getElementById("countryNameHover").style.left =
          e.clientX + map_pos_x - 200 + "px";
        document.getElementById("countryNameHover").style.top =
          e.clientY + map_pos_y - 20 + "px";
        hovered_country = target;
      }
    }
  });

  // Click event listener for countries
  doc.addEventListener("click", function (e) {
    if (dragging == true) {
      return;
    }
    var target = e.target;

    if (target) {
      if (target.nodeName != "svg") {
        if (selected_country != null) {
          selected_country.style.fill = country_base_color;
        }
        var country_name = target.getAttribute("title");
        target.style.fill = country_select_color;
        selected_country = target;
        document.getElementById("countryData").style.display = "flex";

        // API call test
        let link = "https://restcountries.com/v3.1/name/" + country_name;
        fetch(link)
          .then((response) => response.json())
          .then((fullData) => {
            // Check if country contains multiple territories
            let data = fullData;
            let ownerCountry = null;
            let ownerPop = 0;
            if (data.length > 1) {
              // api endpoint for the congo is broken, returns data for DR Congo and R Congo
              if (country_name == "Republic of the Congo") {
                data = data[1];
              } else {
                for (let i = 0; i < data.length; i++) {
                  const element = data[i];
                  if (typeof element.capital != "undefined") {
                    if (ownerCountry != null) {
                      if (element.population > ownerPop) {
                        ownerPop = element.population;
                        ownerCountry = element;
                      }
                    } else {
                      if (typeof element.capital != "undefined") {
                        ownerPop = element.population;
                        ownerCountry = element;
                      }
                    }
                  }
                }
                data = ownerCountry;
              }
            } else {
              data = data[0];
            }
            document.getElementById("countryName").innerHTML = data.name.common;

            // Country Flag
            document.getElementById("countryFlag").innerHTML = data.flag;

            document.getElementById("countryArea").innerHTML =
              "Area: " + addCommas(data.area) + " km&sup2";
            document.getElementById("countryCapital").innerHTML =
              "Capital: " + data.capital;

            let currencies = "";
            var keys = Object.keys(data.currencies);

            keys.forEach((key) => {
              if (currencies != "") {
                currencies += ", ";
              }
              currencies += data.currencies[key].name + " ";
            });
            document.getElementById("countryCurrency").innerHTML =
              "Currency: " + currencies;

            let languages = "";
            var keys = Object.keys(data.languages);
            keys.forEach((key) => {
              if (languages != "") {
                languages += ", ";
              }
              languages += data.languages[key] + " ";
            });

            document.getElementById("countryLanguage").innerHTML =
              "Languages: " + languages;
            document.getElementById("countryPopulation").innerHTML =
              "Population: " + addCommas(data.population);
          });
      }
    }
  });

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
});

// Runs 30 times a second
var intervalId = window.setInterval(function () {
  time_since_change += 1;
  if (time_since_change > 100) {
    time_since_change = 0;
    randomize_city();
  }
  display_time(current_city, current_utc);
}, 100);

const cities = [
  "Baker Island",
  "Pago Pago",
  "Honolulu",
  "Anchorage",
  "Los Angeles",
  "Denver",
  "Mexico City",
  "New York",
  "Sao Paulo",
  "Buenos Aires",
  "Fernando de Noronha",
  "Praia",
  "London",
  "Berlin",
  "Cairo",
  "Moscow",
  "Dubai",
  "Islamabad",
  "Dhaka",
  "Bangkok",
  "Beijing",
  "Tokyo",
  "Sydney",
  "Noumea",
  "Auckland",
];

const cityCountries = [
  "United States",
  "United States",
  "United States",
  "United States",
  "United States",
  "United States",
  "Mexico",
  "United States",
  "Brazil",
  "Argentina",
  "Brazil",
  "Cape Verde",
  "United Kingdom",
  "Germany",
  "Egypt",
  "Russia",
  "United Arab Emirates",
  "Pakistan",
  "Bangladesh",
  "Thailand",
  "China",
  "Japan",
  "Australia",
  "New Caledonia",
  "New Zealand",
];
const utcOffsets = [
  -12, -11, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8,
  9, 10, 11, 12,
];

var current_city = "Buenos Aires";
var current_index = 9;
var current_utc = -3;
var time_since_change = 0;
var previous_code = "";

function randomize_city() {
  const randomIndex = Math.floor(Math.random() * cities.length);
  if (randomIndex == current_index) {
    randomize_city;
  }
  // if  (current_index + 1 > cities.length){
  //     current_index = 0
  // }
  // else {
  //     current_index += 1
  // }
  current_index = randomIndex;
  current_city = cities[current_index];
  current_utc = utcOffsets[current_index];
  display_names(current_city);
}

function display_names(cityName) {
  morphText(current_city, document.getElementById("cityName"), 160);
  morphText(
    cityCountries[current_index],
    document.getElementById("cityCountry"),
    160
  );
}

function display_time(cityName, utc) {
  const now = new Date();
  const cityTime = new Date(now.getTime() + utc * 60 * 60 * 1000);
  const hours = cityTime.getUTCHours().toString().padStart(2, "0");
  const minutes = cityTime.getUTCMinutes().toString().padStart(2, "0");
  const seconds = cityTime.getUTCSeconds().toString().padStart(2, "0");

  document.getElementById("cityTime").textContent =
    hours + ":" + minutes + ":" + seconds;

  var countryCode;
  if (countries_name.includes(cityCountries[current_index])) {
    let i = countries_name.indexOf(cityCountries[current_index]);
    countryCode = countries_code[i];
  }

  if (countryCode) {
    var world = document.getElementById("fullMap");
    var doc = world.getSVGDocument();
    var svgMap = doc.childNodes[1];

    if (previous_code != "") {
      let target = doc.getElementById(previous_code);
      target.style.fill = country_base_color;
    }

    let target = doc.getElementById(countryCode);
    target.style.fill = country_time_color;
    previous_code = countryCode;
  }
}

function remap(value, inMin, inMax, outMin, outMax) {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

function addCommas(nStr) {
  nStr += "";
  const x = nStr.split(".");
  let x1 = x[0];
  const x2 = x.length > 1 ? "." + x[1] : "";
  const rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, "$1" + "," + "$2");
  }
  return x1 + x2;
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

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
