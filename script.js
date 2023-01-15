
class bubble_emitter {
    constructor (){
        this.posX = 0;
        this.posY = 0;
    
        this.canvas = document.getElementById("canvas").getContext("2d");

        this.bubbles = [];

        for (let i = 0; i<20;i++){
            var bub = new bubble(0, 0, 500, 0);
            this.bubbles.push(bub)
        }
        

    }
    static create(){
        return new bubble_emitter();
    }

    run(){
        //this.canvas.clearRect(0, 0, document.getElementById("canvas").offsetWidth, document.getElementById("canvas").offsetHeight)
        //cutCircle(this.canvas, this.posX, this.posY, 5);
        //this.canvas.fillStyle = "#FFFFFF";
        //this.canvas.arc(this.posX - 10, this.posY - 10, 20, 0, 2 * Math.PI);
        //this.canvas.fill();
        //console.log(this.posX + ", " + this.posY);

    }
}

class bubble {
    constructor (VelX, VelY, PosX, PosY){
        this.color = "#FF0000";
        
        this.posX = PosX;
        this.posY = PosY;

        this.velX = VelX;
        this.velY = VelY;

        this.canvas = document.getElementById("canvas").getContext("2d");
    }

    simulate(){
        this.velY += 1;
        this.posX += this.velX
        this.posY += this.velY
        
        this.canvas.fillStyle(this.color);
        this.canvas.fillRect(this.posX - 15, this.posY - 15, 30, 30);
    }

}

var cutCircle = function(context, x, y, radius){
    context.globalCompositeOperation = 'destination-out'
    context.arc(x, y, radius, 0, Math.PI*2, true);
    context.fill();
}

// Animation loop
var deg = 0;

// Runs 30 times a second
var intervalId = window.setInterval(function(){
    deg += 3;
    document.getElementById("orbit").style.transform = "rotate(" + deg + "deg)"
  }, 33);


waitForElement("pointer", function(){
    console.log("Pointer is LOADED!")
});

// Run when window is loaded
window.addEventListener('load', (eevent) => {
    console.log("Document loaded")

    list = document.getElementsByClassName("projectPreview");
    for (var i = 0; i < list.length; i++) {
        list[i].addEventListener("mouseenter", function(e) {
            e.target.style.boxShadow = '0px 0px 20px 5px rgba(255,255,255,0.4)';
        });
        list[i].addEventListener("mouseleave", function(e) {
            e.target.style.boxShadow = '0px 0px 10px 10px rgba(255,255,255,0)';
        });


    // adjust canvas to screen
    document.getElementById("canvas").width = document.width;
    document.getElementById("canvas").height = document.height;
};

});

function waitForElement(id, callback){
    var poops = setInterval(function(){
        if(document.getElementById(id)){
            clearInterval(poops);
            callback();
        }
    }, 100);
};


