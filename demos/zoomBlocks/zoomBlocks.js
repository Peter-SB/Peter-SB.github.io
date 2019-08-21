const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let raf;

let mouseDown = false;
let counter = 0;

let noNewBox = true;

let drawList = [];

//
// Defining objects
//

class Box {
  constructor(x, y, width, height, growSpeed, colour = 'rgb(0,0,0)') {
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
    this.colour = colour;
    this.growSpeed = growSpeed;
  }

  draw() {
    this.doDrawCalculations();
    drawBoxFromCentre(this.x, this.y, this.width, this.height, this.colour);
    this.removeIfBiggerThanScreen();
  }

  doDrawCalculations() {
    this.width = this.width ** (this.growSpeed)+1;
    this.height = this.height ** (this.growSpeed)+1;
  }

  removeIfBiggerThanScreen() {
    const wider = this.width > ctx.canvas.width;
    const heigher = this.height > ctx.canvas.height;

    if( wider && heigher ) {
      const index = drawList.indexOf(this);
      drawList.splice(index, 1);
      const colour = getRandomColor();
      const box = new Box(0, 0, 2, 2, 1.01, colour);
      drawList.push(box);
    }
  }

  delete() {
    ctx.clearRect(this.x, this.y, this.width, this.height);
  }
}

//
// Helper Functions
//

function generateWorld() {
  for (let i = 0; i < 1000; i++) {
    let minx = 0;
    let maxx = ctx.canvas.width - 100;
    let randomx = Math.floor(Math.random() * (+maxx - +minx)) + +minx;
    let miny = 0;
    let maxy = ctx.canvas.height - 100;
    let randomy = Math.floor(Math.random() * (+maxy - +miny)) + +miny;
    drawList.push(new Box(randomx, randomy, 100, 100, `rgb(${100 * (i / 1500)},${255 * (i / 1500)},${100 * (i / 1500)}`));
    console.log(`rgb(50*(${i / 1500}),200*(${i / 1500}),50*(${i / 1500})`);
  }
}

function drawBoxFromCentre(offsetX, offsetY, width, height, colour) {
  ctx.fillStyle = colour;

  const x = ctx.canvas.width / 2 + offsetX - width / 2;
  const y = ctx.canvas.height / 2 + offsetY - height / 2;

  ctx.fillRect(x, y, width, height);
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

//
// Main draw function
//

function draw() {
  drawList.forEach((drawItem) => {
    drawItem.draw();
  })

  if (counter > 30 && noNewBox) {
    drawList.push(new Box(0, 0, 2, 2, 1.01, getRandomColor()));
    noNewBox = false;
  }

  counter += 1;
  raf = window.requestAnimationFrame(draw);
}

ctx.canvas.width = window.innerWidth - 40;
ctx.canvas.height = window.innerHeight - 30;


drawList.push(new Box(0, 0, 2, 2, 1.01, getRandomColor()));


draw();


//
//  Handeling events
//
function getMousePos(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
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
  const tempDrawList = [...drawList];
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

  drawList = [...tempDrawList.reverse()];

  /*if(!itemDeleted) {
    drawList.push(new Box(
      getMousePos(event).x-50,
      getMousePos(event).y-50,
      100,
      100,
      'rgb(50,200,50'
    ));
  } */
});

canvas.addEventListener('mousedown', () => {
  mouseDown = true;
});
canvas.addEventListener('mouseup', () => {
  mouseDown = false;
});

canvas.addEventListener('mousemove', (event) => {
  if ((counter >= 3 && mouseDown === true)) {
    console.log('1');
    counter = 0;

    let itemDeleted = false;
    const tempDrawList = [...drawList];
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

    drawList = [...tempDrawList.reverse()];
  }
});
