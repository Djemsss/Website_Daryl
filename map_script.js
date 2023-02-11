// Script for the Map project

var countries = []
var selected_country = null
var hovered_country = null

var mapWidth = 70
var dragging = false

var map_pos_x = 0
var map_pos_y = 0

var drag_start_x = 0
var drag_start_y = 0

var mouse_x = 0
var mouse_y = 0

var country_base_color = "#CDFDEE"
var country_hover_color = "#22AE9A"
var country_select_color = "#108575"

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

    // Mouse handling
    doc.addEventListener("mousemove", function(e){

        mouse_x = e.clientX
        mouse_y = e.clientY
        if (dragging == true){

            let worldMap = document.getElementById("fullMap")
    
            map_pos_x -= (drag_start_x - mouse_x)
            map_pos_y -= (drag_start_y - mouse_y)
    
            worldMap.style.left = map_pos_x + "px"
            worldMap.style.top = map_pos_y + "px"
    
            
        }
    });

    // Zoom handling
    doc.addEventListener("wheel", function (event) {
        if (event.deltaY > 0){
            // Zoom out
            let val = 3 + remap(mapWidth, 0, 200, 0, 10)
            if (mapWidth - val > 70){
                mapWidth -= val
            }
                
        }   
        else{
            // Zoom in
            let val = 3 + remap(mapWidth, 0, 200, 0, 10)
            if (mapWidth + val < 500){
                mapWidth += val
            }
            
        }

        // Calculate the new left and top based on the mouse position and the new width and height
        const x = (event.clientX / world.offsetWidth) * mapWidth - event.clientX;
        const y = (event.clientY / world.offsetHeight) * mapWidth * 0.58 - event.clientY;
        const newLeft = world.offsetLeft - x;
        const newTop = world.offsetTop - y;

        world.style.width = String(mapWidth) + "%"
        world.style.left = newLeft
        world.style.top = newTop
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
            hovered_country.style.strokeWidth = "0.5"
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
                    hovered_country.style.strokeWidth = "0.5"
                    hovered_country.style.stroke = "black"
                    document.getElementById("countryNameHover").innerHTML = ""
                }
                if (target != selected_country){
                    target.style.fill = country_hover_color
                }
                
                target.style.stroke = "black";
                target.style.strokeWidth = "0.5"
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
                target.style.fill = country_select_color;
                document.getElementById("countryName").innerHTML = target.getAttribute("title")
                selected_country = target
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