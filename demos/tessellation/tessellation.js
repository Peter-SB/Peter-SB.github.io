const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let raf;

let mouseDown = false;
let counter = 0;

let drawList = [];

let pixleMap;

//
// Defining objects
//

class Shape {
  constructor(x, y, colour){
    this.x = x;
    this.y = y;
    this.colour = colour;
  }
}

class Circle extends Shape{
  constructor(x, y, radius, colour = 'rgb(0,0,0)'){
    super(x, y, colour);
    this.radius = radius;
    //console.log(x,y,radius)
    this.generate();
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this. radius, 0, 2 * Math.PI);
    ctx.strokeStyle = this.colour;
    ctx.stroke();
  }

  getDistanceToPoint(A, B){
    return((B[0]-A[0])**2 + (B[1]-A[1])**2)**0.5
  }

  generate(){
    console.log("gen:");    
    if (pixleMap[this.x][this.y] != 0){
      //console.log("point check failed");    
      //console.log(this.x, this.y, pixleMap[this.x][this.y])
      return false;
    }

    // Checks 8 points on radius of circle for overlap (should speed up checks)
    let radiusChecks = 8
    for (let i = 0; i < radiusChecks; i++) {
      let xCheck = this.x + Math.round(this.radius * Math.cos(i*(2*Math.PI)/radiusChecks));
      let yCheck = this.y + Math.round(this.radius * Math.sin(i*(2*Math.PI)/radiusChecks));
      if((0<xCheck && xCheck<ctx.canvas.width) && (0<yCheck && yCheck<ctx.canvas.height)){
        if (pixleMap[xCheck][yCheck] != 0){
          //console.log("8 point check failed");
          //ctx.fillRect(xCheck, yCheck, 2, 2);
          let distToClash = this.getDistanceToPoint([this.x, this.y],[xCheck, yCheck])
          if(distToClash>3){ newCircle(this.x, this.y, distToClash-1) }
          else{
            console.log(xCheck, yCheck, 2)
            ctx.fillStyle = "rgba(0,255,0)";
          }
          return false;
        }
      }
    }

    let newPixleMap = JSON.parse(JSON.stringify(pixleMap));
    let radiusSquared = this.radius ** 2;

    let minX = this.x-this.radius;
    let minY = this.y-this.radius;
    for (let tempX = minX; tempX < minX + this.radius*2; tempX++){
      for (let tempY = minY; tempY < minY + this.radius*2; tempY++){
          let dx = tempX - this.x;
          let dy = tempY - this.y;
          let distanceSquared = dx * dx + dy * dy;
          if((0<tempX && tempX<ctx.canvas.width) && (0<tempY && tempY<ctx.canvas.height)){
            if (distanceSquared <= radiusSquared){
              if (newPixleMap[tempX][tempY] == 0){
                newPixleMap[tempX][tempY] += 1;
              }
              else {
                console.log("all point check failed");
                //ctx.fillStyle = "rgba(0,0,255)";
                //ctx.fillRect( tempX, tempY, 2, 2);
                let distToClash = this.getDistanceToPoint([this.x, this.y],[tempX, tempY])
                if(distToClash>3){ newCircle(this.x, this.y, distToClash-1) }
                return false;
              }
            }
          }
      }
    }
    console.log(this.x, this.y);
    pixleMap = JSON.parse(JSON.stringify(newPixleMap));
    drawList.push(this);
    return true;
  }
}

class Box extends Shape {
  constructor(x, y, height, width, colour = 'rgb(0,0,0)'){
    super(x, y, colour);
    this.height = height;
    this.width = width ;
  }

  draw() {
    ctx.fillStyle = this.colour;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = 'rgb(0,0,0)';
    ctx.strokeRect(this.x, this.y, this.width, this.height);

  }

  // Finds out if mouse is within box boundaries
  inBoundary(mouseCoordinates){
    if (this.x <= mouseCoordinates.x && this.y<=mouseCoordinates.y) {
      const boxEdgeX = this.x + this.width;
      const boxEdgeY = this.y + this.height;
      if (mouseCoordinates.x <= boxEdgeX && mouseCoordinates.y <= boxEdgeY) {
        return true;
      }
    }
    return false;
  }

  delete() {
    ctx.clearRect(this.x, this.y, this.width, this.height);
  }
}

//
// Helper Functions
//

function newCircle(x,y,radius){
  var minx = 0;
  var maxx = ctx.canvas.width;
  var miny = 0;
  var maxy = ctx.canvas.height;
  var randomx = Math.floor(Math.random() * (+maxx - +minx)) + +minx;
  var randomy = Math.floor(Math.random() * (+maxy - +miny)) + +miny;
  while(pixleMap[randomx][randomy] != 0){
    var randomx = Math.floor(Math.random() * (+maxx - +minx)) + +minx;
    var randomy = Math.floor(Math.random() * (+maxy - +miny)) + +miny;
  }

  //ctx.fillStyle = "rgba(255,0,0)";
  //ctx.fillRect( randomx, randomy, 2, 2);
  console.log(randomx, randomy, pixleMap[randomx][randomy])
  new Circle(randomx, randomy, Math.floor(Math.random() * (250)));  
}

async function generateWorld() {
    for (let i = 0; i < 20; i++) {
        var minx = 0;
        var maxx = ctx.canvas.width;
        var randomx = Math.floor(Math.random() * (+maxx - +minx)) +minx;
        var miny = 0;
        var maxy = ctx.canvas.height;
        var randomy = Math.floor(Math.random() * (+maxy - +miny)) + +miny;
        newCircle(randomx, randomy, 250-(i*5));
        //drawList.push(new Box(randomx, randomy, 100, 100, `rgb(${100 * (i / 1500)},${255 * (i / 1500)},${100 * (i / 1500)}`));
        //console.log(`rgb(50*(${i / 1500}),200*(${i / 1500}),50*(${i / 1500})`);
    }
    //await console.log(pixleMap);
}

function zeroArray(dimensions) {
  var array = [];

  for (var i = 0; i < dimensions[0]; ++i) {
      array.push(dimensions.length == 1 ? 0 : zeroArray(dimensions.slice(1)));
  }

  return array;
}

function drawPixleMap(){
  for( let i=0; i<ctx.canvas.width; i++){
    for( let j=0; j<ctx.canvas.height; j++){
      if (pixleMap[i][j] != 0){
        ctx.fillStyle = "rgba(255,0,0)";
        ctx.fillRect( i, j, 1, 1 );
      }
    }
  }
}

//
// Main draw function
//

async function draw() {
  ctx.clearRect(0,0, canvas.width, canvas.height);
  //drawPixleMap();
  drawList.forEach((shape) => {
    shape.draw();
  });

  if (counter>1){
    newCircle();
    counter =0;
  }
  counter += 1;
  raf = window.requestAnimationFrame(draw);
}

ctx.canvas.width  = window.innerWidth-40;
ctx.canvas.height = window.innerHeight-30;

//console.log(ctx.canvas.width, ctx.canvas.height)

pixleMap = zeroArray([ctx.canvas.width, ctx.canvas.height]);
console.log([ pixleMap.length, pixleMap[0].length ]);

generateWorld();

//console.log(pixleMap);

draw();



//
//  Handeling events
//
/*
function getMousePos(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };
}

canvas.addEventListener('mouseover', () => {
  raf = window.requestAnimationFrame(draw);
});

canvas.addEventListener('mouseout', () => {
  window.cancelAnimationFrame(raf);
});

canvas.addEventListener('click', (event) => {
  let itemDeleted = false;
  const tempDrawList = [...drawList]
  tempDrawList.reverse().forEach((shape, index) =>{
    if (!itemDeleted){
      if (shape.inBoundary(getMousePos(event)) === true){
        shape.delete();
        tempDrawList.splice(index,1);
        console.log('shape deleted');
        itemDeleted = true;
      }
    }
  });

  drawList = [...tempDrawList.reverse()]

  /*if(!itemDeleted) {
    drawList.push(new Box(
      getMousePos(event).x-50,
      getMousePos(event).y-50,
      100,
      100,
      'rgb(50,200,50'
    ));
  }*/
/*})

canvas.addEventListener('mousedown', () => {
    mouseDown = true;
})
canvas.addEventListener('mouseup', () => {
    mouseDown = false;
})

canvas.addEventListener('mousemove', (event) => {
    
    if ((counter >= 3 && mouseDown === true)) {
        console.log('1');
        counter = 0

        let itemDeleted = false;
        const tempDrawList = [...drawList]
        tempDrawList.reverse().forEach((shape, index) => {
            if (!itemDeleted) {
                if (shape.inBoundary(getMousePos(event)) === true) {
                    shape.delete();
                    tempDrawList.splice(index, 1);
                    console.log('shape deleted');
                    itemDeleted = true;
                }
            }
        });

        drawList = [...tempDrawList.reverse()]
    }


})*/
