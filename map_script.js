// Script for the Map project

// Rest Countries API -> https://restcountries.com/v3.1/name/peru

var countries = []
var selected_country = null
var hovered_country = null

var airplane_mode = true

var mapWidth = 70
var mapScale = 1
var dragging = false

var map_pos_x = 0
var map_pos_y = 0

var drag_start_x = 0
var drag_start_y = 0

var mouse_x = 0
var mouse_y = 0

var country_base_color = "#428d90"
var country_hover_color = "aquamarine"
var country_select_color = "mediumspringgreen"


// Run when document is loaded
window.addEventListener('load', (eevent) => {
    console.log("Document loaded")
    let start_pos_x = (window.innerWidth / 2) - (document.getElementById("fullMap").getBoundingClientRect().width / 2)
    let start_pos_y = (window.innerHeight / 2.5) - (document.getElementById("fullMap").getBoundingClientRect().height / 2)
    
    map_pos_x = start_pos_x
    map_pos_y = start_pos_y
    
    // canvas stretching for aditional drawing
    document.getElementById("canvas").width = window.innerWidth;
    document.getElementById("canvas").height = window.innerHeight;
    document.getElementById("canvas2").width = window.innerWidth;
    document.getElementById("canvas2").height = window.innerHeight;
    
    var world = document.getElementById("fullMap")
    
    world.style.left = map_pos_x + "px"
    world.style.top = map_pos_y + "px"
    var doc = world.getSVGDocument();
    var svgMap = doc.childNodes[1]

    // Mouse handling
    doc.addEventListener("mousemove", function(e){

        mouse_x = e.clientX
        mouse_y = e.clientY
        if (dragging == true){
            document.getElementById("countryNameHover").innerHTML = ""
            let worldMap = document.getElementById("fullMap")
    
            map_pos_x -= (drag_start_x - mouse_x)
            map_pos_y -= (drag_start_y - mouse_y)
    
            worldMap.style.left = map_pos_x + "px"
            worldMap.style.top = map_pos_y + "px"
    
            
        }
    });

    // Zoom handling
    doc.addEventListener("wheel", function (event) {
        const mouseX = event.clientX;
        const mouseY = event.clientY;

        const rect = world.getBoundingClientRect();
        
        // Calculate the current mouse position relative to the map element
        const mouseXRelative = mouseX
        const mouseYRelative = mouseY
        
        // Calculate the zoom factor
        const delta = event.deltaY < 0 ? 1.1 : 0.9;

        if ((mapWidth * 1.1 >= 1000 && delta > 1) || (mapWidth * 0.9 <= 70) && delta < 1){
            console.log(mapWidth)
            return
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
        dragging = true
        drag_start_x = mouse_x
        drag_start_y = mouse_y
    });
    doc.addEventListener("pointerup", function (e) {
        dragging = false
        
    });
    
    document.getElementById("mapProject").addEventListener("pointerdown", function (e) {
        dragging = true
        drag_start_x = mouse_x
        drag_start_y = mouse_y
    });
    document.getElementById("mapProject").addEventListener("pointerup", function (e) {
        dragging = false
    });
    
    



    // Populate countries array
    doc.childNodes[1].querySelector("g").childNodes.forEach(element => {
        if (element.nodeName == "path"){
            countries.push(element)
        }
        
    });
    console.log("Number of Countries: ", countries.length)


    // Hover clear handling
    doc.addEventListener("mouseout", function(event){
        if (hovered_country != null && hovered_country != selected_country){
            hovered_country.style.fill = country_base_color;
            hovered_country.style.stroke = "black"
        }
        document.getElementById("countryNameHover").innerHTML = ""
    });

    // Hover event listener for countries
    doc.addEventListener("mousemove", function (e) {
        if (dragging == true){
            return
        }
        var target = e.target;

        if (target) {
            if (target.nodeName != "svg"){
                if (hovered_country != null && hovered_country != selected_country){
                    hovered_country.style.fill = country_base_color;
                    hovered_country.style.stroke = "black"
                    document.getElementById("countryNameHover").innerHTML = ""
                }
                if (target != selected_country){
                    target.style.fill = country_hover_color
                }
                
                target.style.stroke = "black";
                document.getElementById("countryNameHover").innerHTML = target.getAttribute("title")
                document.getElementById("countryNameHover").style.left = e.clientX + map_pos_x - 200 + "px"
                document.getElementById("countryNameHover").style.top = e.clientY + map_pos_y - 20 + "px"
                hovered_country = target
            } 
          
        }
    });

    // Click event listener for countries
    doc.addEventListener("click", function (e) {
        if (dragging == true){
            return
        }
        var target = e.target;

        if (target) {
            if (target.nodeName != "svg"){
                if (selected_country != null){
                    selected_country.style.fill = country_base_color;
                }
                var country_name = target.getAttribute("title")
                target.style.fill = country_select_color;
                selected_country = target
                document.getElementById("countryData").style.display = "flex"

                // API call test
                let link = "https://restcountries.com/v3.1/name/" + country_name
                fetch(link)
                .then((response) => response.json())
                .then((fullData) => {
                    // Check if country contains multiple territories
                    let data = fullData
                    let ownerCountry = null
                    let ownerPop = 0
                    if (data.length > 1){
                        for (let i = 0; i < data.length; i++) {
                            const element = data[i];
                            if (typeof element.capital != "undefined"){
                                if (ownerCountry != null){
                                    if (element.population > ownerPop){
                                        ownerPop = element.population
                                        ownerCountry = element
                                    }
                                }
                                else{
                                    if (typeof element.capital != "undefined"){
                                        ownerPop = element.population
                                        ownerCountry = element
                                    }
                                }
                            }                     
                        }
                        data = ownerCountry
                    }
                    else{
                        data = data[0]
                    }
                    console.log(data)
                    document.getElementById("countryName").innerHTML = data.name.common
                    document.getElementById("countryFlag").innerHTML = data.flag

                    document.getElementById("countryArea").innerHTML = "Area: " + addCommas(data.area) + " km&sup2";
                    document.getElementById("countryCapital").innerHTML = "Capital: " + data.capital

                    let currencies = ""
                    var keys = Object.keys(data.currencies)

                    keys.forEach(key => {
                        if (currencies != ""){
                            currencies += ", "
                        }
                        currencies += data.currencies[key].name + " "
                    });
                    document.getElementById("countryCurrency").innerHTML = "Currency: " + currencies

                    let languages = ""
                    var keys = Object.keys(data.languages)
                    keys.forEach(key => {
                        if (languages != ""){
                            languages += ", "
                        }
                        languages += data.languages[key] + " "
                    });

                    document.getElementById("countryLanguage").innerHTML = "Languages: " + languages
                    document.getElementById("countryPopulation").innerHTML = "Population: " + addCommas(data.population)
                    
                })
            } 
          
        }
    });

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
// Animation loop
var deg = 0;

// Runs 30 times a second
var intervalId = window.setInterval(function(){
    // Animate logo
    deg += 3;
    document.getElementById("orbit").style.transform = "rotate(" + deg + "deg)"
    
    // let world = document.getElementById("fullMap")
    // let outOfBounds = isOutOfViewport(world)
    // if (mapWidth < 90){
    //     if (outOfBounds.top == true){
    //         map_pos_y += 5
    //         console.log(map_pos_y)
    //         console.log("Out of Top")
    //     }
    //     if (outOfBounds.bottom == true){
    //         map_pos_y -= 5
    //     }
    //     if (outOfBounds.left == true){
    //         map_pos_x += 5
    //     }
    //     if (outOfBounds.right == true){
    //         map_pos_x -= 5
    //     }
    //     world.style.left = map_pos_x + "px"
    //     world.style.top = map_pos_y + "px"
    // }

    

  }, 33);


  function remap(value, inMin, inMax, outMin, outMax) {
    return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

var isOutOfViewport = function (elem) {

	// Get element's bounding
	var bounding = elem.getBoundingClientRect();

	// Check if it's out of the viewport on each side
	var out = {};
	out.top = bounding.top < 0;
	out.left = bounding.left < 0;
	out.bottom = bounding.bottom > (window.innerHeight || document.documentElement.clientHeight);
	out.right = bounding.right > (window.innerWidth || document.documentElement.clientWidth);
	out.any = out.top || out.left || out.bottom || out.right;
	out.all = out.top && out.left && out.bottom && out.right;

	return out;

};

function addCommas(nStr) {
    nStr += '';
    const x = nStr.split('.');
    let x1 = x[0];
    const x2 = x.length > 1 ? '.' + x[1] : '';
    const rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
  }
