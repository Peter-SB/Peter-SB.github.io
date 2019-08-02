/* global document, window */
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let raf;

let drawList = [];

//
// Defining objects
//

class Shape {
  constructor(x, y, colour) {
    this.x = x;
    this.y = y;
    this.colour = colour;
    console.log(x);
  }
}

class Box extends Shape {
  constructor(x, y, height, width, colour = 'rgb(0,0,0)') {
    super(x, y, colour);
    this.height = height;
    this.width = width;
  }

  draw() {
    ctx.fillStyle = this.colour;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = 'rgb(0,0,0)';
    ctx.strokeRect(this.x, this.y, this.width, this.height);
  }

  // Finds out if mouse is within box boundaries
  inBoundary(mouseCoordinates) {
    if (this.x <= mouseCoordinates.x && this.y <= mouseCoordinates.y) {
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

//
// Main draw function
//
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawList.forEach((shape) => {
    shape.draw();
  });
  raf = window.requestAnimationFrame(draw);
}

ctx.canvas.width = window.innerWidth - 20;
ctx.canvas.height = window.innerHeight - 20;
drawList.push(new Box(100, 100, 100, 100));

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
        itemDeleted = true;
      }
    }
  });

  drawList = [...tempDrawList.reverse()];

  if (!itemDeleted) {
    drawList.push(new Box(
      getMousePos(event).x - 50,
      getMousePos(event).y - 50,
      100,
      100,
      'rgb(50,200,50',
    ));
  }
});
