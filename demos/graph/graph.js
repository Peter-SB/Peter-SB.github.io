const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let raf;

const offset = { x: 150, y: 150};

//
// Defining objects
//

class ComplexNumber{
  constructor(r, im){
    this.r = r;
    this.im = im;
  }
}


//
// Math Functions
//

function innerate(z,c)

//
// Helper Functions
//

function convertCoords(xRelative, yRelative) {
  const xAbsolute = xRelative + offset.x;
  const yAbsolute = - yRelative + offset.y;
  return {
    x: xAbsolute,
    y: yAbsolute,
  }
}

function drawAxis() {
  ctx.fillStyle = "rgba(100,100,100,1)";
  // draw x axis
  ctx.fillRect( 0, offset.y, ctx.canvas.width, 2 );
  // draw y axis
  ctx.fillRect( offset.x, 0, 2, ctx.canvas.height );
}

function plotx2() {
  x=0;
  y=0;
  for (let x = 0; x < ctx.canvas.width; x++) {
    y=(x**2)/50;
    const coordinates = convertCoords(x,y);
    ctx.fillStyle = "rgba(50,50,50,1)";
    ctx.fillRect( coordinates.x, coordinates.y, 2, 2 );
  }
}


//
// Main draw function
//

function draw() {
  ctx.clearRect(0,0, canvas.width, canvas.height);
  drawAxis();
  plotx2();
  console.log('1');
}

ctx.canvas.width  = window.innerWidth-40;
ctx.canvas.height = window.innerHeight-30;

offset.x = ctx.canvas.width/2;
offset.y = ctx.canvas.height/2;

draw();



//
//  Handeling events
//

