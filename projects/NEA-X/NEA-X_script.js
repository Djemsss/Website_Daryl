var asteroid_min = null
var asteroid_max = null
var asteroid_mid = null
var personContainer = null
var eiffelContainer = null
var personSVG = null
var eiffelSVG = null

var personPath = null
var eiffelPath = null

var global_scale = 1


window.addEventListener("resize", (ev) => {
    // adjust canvas to screen
    document.getElementById("canvas").width = window.innerWidth;
    document.getElementById("canvas").height = window.innerHeight;
    document.getElementById("canvas2").width = window.innerWidth;
    document.getElementById("canvas2").height = window.innerHeight;

    global_scale = window.innerWidth / 1440
    if (eiffelSVG){
      eiffelSVG.style.width = (320 * global_scale) + "px"
      eiffelSVG.style.height = (320 * global_scale) + "px"
    }
    
});

// Run when window is loaded
window.addEventListener('load', (event) => {
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

    document.getElementById("loadAstButton").addEventListener("pointerdown", load_asteroid, false)

    // Set svg vars
    asteroid_min = document.getElementById("asteroid_min")
    asteroid_max = document.getElementById("asteroid_max")
    asteroid_mid = document.getElementById("asteroid_mid")

    personContainer = document.getElementById("personSVG")
    eiffelContainer = document.getElementById("eiffelSVG")

    personSVG = personContainer.contentDocument.querySelector("svg")
    eiffelSVG = eiffelContainer.contentDocument.querySelector("svg")

    personPath = personSVG.querySelector("g").querySelector("path")
    eiffelPath = eiffelSVG.querySelector("path")

    personContainer.style.position = "absolute"
    personSVG.style.transformOrigin = "bottom"
    personSVG.style.transition = "all 0.5s"
    personSVG.style.scale = (0.5 * 0.0049)

    eiffelContainer.style.position = "absolute"
    eiffelSVG.style.transformOrigin = "bottom"
    eiffelSVG.style.transition = "all 0.5s"
    eiffelSVG.style.scale = "0.25"

    global_scale = window.innerWidth / 1440
    eiffelSVG.style.width = (320 * global_scale) + "px"
    eiffelSVG.style.height = (320 * global_scale) + "px"

    load_asteroid()
    
});

function load_asteroid(){
  // Display loading icon
  document.getElementById("loadAstButton").classList.add("loading")
  document.getElementById("loadAstButton").textContent = ""

  let randPage = Math.floor(Math.random() * 1598)
  let randObject = Math.floor(Math.random() * 20)
  // let link = "https://api.nasa.gov/neo/rest/v1/neo/3542519?api_key=XvnPh0wz7AMphlOLFEPqSJBE2cjj0ZTf3xZlFqUv"
  let link = "http://api.nasa.gov/neo/rest/v1/neo/browse?page=" + randPage + "&size=20&api_key=XvnPh0wz7AMphlOLFEPqSJBE2cjj0ZTf3xZlFqUv"

  fetch(link)
  .then((response) => response.json())
  .then((fullData) => {
      // let data = fullData
      let data = fullData.near_earth_objects[randObject]
      let id = data.id
      let designation = data.designation
      let name = data.name
      let magnitude = data.absolute_magnitude_h
      let diameter_min = data.estimated_diameter.meters.estimated_diameter_min
      let diameter_max = data.estimated_diameter.meters.estimated_diameter_max
      let diameter_mid = (diameter_min + diameter_max) / 2

      let scaleElementSize = 160
      if (diameter_mid > 2000){
        // Scale down eiffel tower a lot
        scaleElementSize = 40
        eiffelSVG.style.scale = "0.0625"
        personSVG.style.scale = (0.0625 * 0.01).toString()
      }
      else if (diameter_mid > 600) {
        // Scale down eiffel tower
        scaleElementSize = 80
        eiffelSVG.style.scale = "0.125"
        personSVG.style.scale = (0.125 * 0.01).toString()
      }
      else if (diameter_mid > 200){
        scaleElementSize = 320
        eiffelSVG.style.scale = "0.5"
        personSVG.style.scale = (0.5 * 0.01).toString()
      }
      else{
        // Scale up eiffel tower
        scaleElementSize = 620
        eiffelSVG.style.scale = "1"
        personSVG.style.scale = (1 * 0.01).toString()
      }

      

      let hazardous = data.is_potentially_hazardous_asteroid

      // Orbit details
      let aphelion = data.orbital_data.aphelion_distance
      let perihelion = data.orbital_data.perihelion_distance
      let scale = remap(aphelion, 1, 5, 80, 20)
      
      let eccentricity = data.orbital_data.eccentricity
      let inclination = data.orbital_data.inclination
      let asc_node = data.orbital_data.ascending_node_longitude
      let orbital_period = data.orbital_data.orbital_period

      set_right_display(id, designation, name, magnitude, diameter_min, diameter_max, diameter_mid, hazardous, aphelion, perihelion, eccentricity, inclination, orbital_period)

      set_asteroid_size(diameter_min, diameter_max, diameter_mid, scaleElementSize)

      // Clear canvas and redraw orbits
      const context = document.getElementById("canvas").getContext("2d");
      context.clearRect(0, 0, canvas.width, canvas.height);

      drawOrbit(document.getElementById("canvas"), perihelion , aphelion, eccentricity, inclination, asc_node, scale, "rgba(255, 0, 0, 255)")
      drawOrbit(document.getElementById("canvas"), 0.983, 1.016, 0.0167, 7, 175, scale, "rgba(0, 0, 255, 255)")

      // Hide loading icon
      document.getElementById("loadAstButton").classList.remove("loading")
      document.getElementById("loadAstButton").textContent = "New Asteroid"
  });
}

function set_asteroid_size(diameter_min, diameter_max, diameter_mid, scaleElementSize = 160){
    let ratio = 330 / scaleElementSize * global_scale

    let diameter_min_pixels = (diameter_min / ratio) * global_scale
    let diameter_max_pixels = (diameter_max / ratio) * global_scale
    let diameter_mid_pixels = (diameter_mid / ratio) * global_scale

    // Set asteroid sizes
    if (true){
        asteroid_mid.style.minWidth = diameter_mid_pixels + "px"
        asteroid_min.style.minWidth = diameter_min_pixels + "px"
        asteroid_max.style.minWidth = diameter_max_pixels + "px"

        asteroid_mid.style.minHeight = diameter_mid_pixels + "px"
        asteroid_min.style.minHeight = diameter_min_pixels + "px"
        asteroid_max.style.minHeight = diameter_max_pixels + "px"

        asteroid_mid.style.maxWidth = diameter_mid_pixels + "px"
        asteroid_min.style.maxWidth = diameter_min_pixels + "px"
        asteroid_max.style.maxWidth = diameter_max_pixels + "px"

        asteroid_mid.style.maxHeight = diameter_mid_pixels + "px"
        asteroid_min.style.maxHeight = diameter_min_pixels + "px"
        asteroid_max.style.maxHeight = diameter_max_pixels + "px"
    }
    
    // Set legends
    document.getElementById("minDiaLegend").textContent = "Min est. diameter: " + Math.floor(diameter_min) + " meters"
    document.getElementById("maxDiaLegend").textContent = "Max est. diameter: " + Math.floor(diameter_max) + " meters"
    document.getElementById("midDiaLegend").textContent = "Mean est. diameter: " + Math.floor(diameter_mid) + " meters"
    

}

function set_right_display(id, designation, name, magnitude, diameter_min, diameter_max, diameter_mid, hazardous, aphelion, perihelion, eccentricity, inclination, orbital_period){
    document.getElementById("asteroidID").textContent = id
    document.getElementById("asteroidDesignation").textContent = designation
    document.getElementById("asteroidName").textContent = name
    document.getElementById("asteroidMagnitude").textContent = magnitude
    document.getElementById("asteroidDiaMin").textContent = Math.floor(diameter_min) + " meters"
    document.getElementById("asteroidDiaMax").textContent = Math.floor(diameter_max) + " meters"
    document.getElementById("asteroidDiaMid").textContent = Math.floor(diameter_mid) + " meters"
    document.getElementById("asteroidHazardous").textContent = hazardous
    document.getElementById("asteroidApo").textContent = parseFloat(aphelion).toFixed(3) + " A.U."
    document.getElementById("asteroidPeri").textContent = parseFloat(perihelion).toFixed(3) + " A.U."
    document.getElementById("asteroidEccentricity").textContent = parseFloat(eccentricity).toFixed(3)
    document.getElementById("asteroidInclination").textContent = parseFloat(inclination).toFixed(3) + "°"
    document.getElementById("asteroidPeriod").textContent = parseFloat(orbital_period).toFixed(3) + " days"
}

function drawOrbit(canvas, perigee, apogee, eccentricity, inclination, ascendingNode, scale = 80, color) {
  console.log(global_scale)
  const context = canvas.getContext("2d");
  const sun = document.getElementById("sun");
  const sunX = (sun.offsetLeft + sun.offsetWidth / 2) + document.getElementById("graphicsBox").getBoundingClientRect().x;
  console.log(document.getElementById("mainContainer"))
  const sunY = (sun.offsetTop + sun.offsetHeight / 2) + document.getElementById("mainContainer").getBoundingClientRect().y;
  const semiMajorAxis = (perigee * scale * global_scale + apogee * scale * global_scale) / 2;
  const semiMinorAxis = semiMajorAxis * Math.sqrt(1 - eccentricity ** 2);
  const centerOffset = semiMajorAxis * eccentricity;
  const centerX = sunX + centerOffset * Math.cos(ascendingNode * Math.PI / 180);
  const centerY = sunY + centerOffset * Math.sin(ascendingNode * Math.PI / 180) * Math.cos(inclination * Math.PI / 180);
  
  let sunScale = scale * 10 / 80
  document.getElementById("sun").style.width = sunScale + "px"
  document.getElementById("sun").style.height = sunScale + "px"


  context.beginPath();
  context.lineWidth = 2 * global_scale;
  context.ellipse(centerX, centerY, semiMajorAxis, semiMinorAxis, ascendingNode * Math.PI / 180, 0, 2 * Math.PI);
  context.strokeStyle = color;
  context.stroke();
}

function remap(value, inMin, inMax, outMin, outMax) {
  return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}