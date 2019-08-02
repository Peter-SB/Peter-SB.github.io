const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let raf;

const keysDown = { };
let drawList = [];
let linkList = [];
const selectedItems = []; 

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

class Box extends Shape {
  constructor(x, y, height, width, colour = 'rgb(0,0,0)'){
    super(x, y, colour);
    this.height = height;
    this.width = width ;
  }

  draw() {
    ctx.fillStyle = this.colour;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.strokeStyle = 'rgb(50,50,50)';
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
    // deletes this shape from draw list
    drawList.forEach((shape, index) => {
      if(shape === this){
        drawList.splice(index,1);
      }
    });

    // deletes any asociated links
    const deleteLinkList = [];
    linkList.forEach( (link) => {
      if ((link.shape1 === this) || (link.shape2 === this)){
        deleteLinkList.push(link);
      }
    });
    linkList = linkList.filter( ( deleteLink ) => !deleteLinkList.includes( deleteLink ) );

  }
}

class Link extends Shape {
  constructor(shape1, shape2, width = 5, colour = 'rgb(0,0,0)'){
    super(0, 0, colour);
    this.width = width ;
    this.shape1 = shape1;
    this.shape2 = shape2;
  }

  draw() {
    const shape1X = this.shape1.x + this.shape1.width/2;
    const shape1Y = this.shape1.y + this.shape1.height/2;

    const shape2X = this.shape2.x + this.shape2.width/2;
    const shape2Y = this.shape2.y + this.shape2.height/2;
    
    ctx.strokeStyle = 'rgb(0, 0, 0)';
    ctx.beginPath();
    ctx.moveTo(shape1X, shape1Y);
    ctx.lineTo(shape2X, shape2Y);

    ctx.stroke();
  }

  delete() {
    linkList.forEach((link, index) => {
      if(link === this){
        linkList.splice(index,1);
      }
    });
  }
}

//
// Main draw function
//
function draw() {
  ctx.clearRect(0,0, canvas.width, canvas.height);
  linkList.forEach((link) => {
    link.draw();
  });
  drawList.forEach((shape) => {
    shape.draw();
  });
  drawSelections();
  raf = window.requestAnimationFrame(draw);
}

ctx.canvas.width  = window.innerWidth-20;
ctx.canvas.height = window.innerHeight-20;

drawList.push(new Box(100,100,100,100));
drawList.push(new Box(500,300,100,100));

linkList.push(new Link(drawList[0], drawList[1]));

drawList.push(new Box(300,700,50,50));
drawList.push(new Box(600,500,50,50));

linkList.push(new Link(drawList[2], drawList[3]));

draw()

//
// Helper Functions
//

function addRemoveItem(event) {
  if (keysDown.a) {
    let itemDeleted = false;
    const tempDrawList = [...drawList]
    // reverse drawlist so when you select you get the top item
    tempDrawList.reverse().forEach((shape, index) =>{
      if (!itemDeleted){
        if (shape.inBoundary(getMousePos(event)) === true){
          shape.delete();
          tempDrawList.splice(index,1);
          itemDeleted = true;
        }
      }
    });

    drawList = [...tempDrawList.reverse()]


    if (!itemDeleted) {
      console.log(itemDeleted)
      drawList.push(new Box(
        getMousePos(event).x-25,
        getMousePos(event).y-25,
        50,
        50,
        'rgb(50,200,50'
      ));
    }
  }
}

function moveNode(event){
  if (keysDown.mouseDown === true) {
    const tempDrawList = [...drawList]
    tempDrawList.reverse().forEach((shape, index) =>{
      if (shape.inBoundary(getMousePos(event)) === true){
        shape.x = getMousePos(event).x-shape.width/2;
        shape.y = getMousePos(event).y-shape.height/2;

      }
    });
  }
}

function addLink(shape1, shape2){
  linkList.push(new Link(shape1, shape2))
}

function addRemoveLink(event){
  if (keysDown.n && selectedItems.length > 1){
    const selectedItemsLength = selectedItems.length;
    addLink(selectedItems[selectedItemsLength-2], selectedItems[selectedItemsLength-1]);
  }
}

function drawSelections() {
  selectedItems.forEach((shape) => {
    ctx.strokeStyle = 'rgb(255, 164, 54)';
    ctx.strokeRect(shape.x-5, shape.y-5, shape.width+10, shape.height+10);
  })
}

function selectItemHandler(event) {
  if (!keysDown.a) {
    hasSelectedItem = false;
    const tempDrawList = [...drawList]
    tempDrawList.reverse().forEach((shape, index) =>{
      if (shape.inBoundary(getMousePos(event)) === true){
        if (!selectedItems.includes(shape)) {
          selectedItems.push(shape);
          
          // puts the shape at the begging of the array so is drawn on top
          tempDrawList.splice(index,1);
          tempDrawList.unshift(shape);
        } else {
          selectedItems.splice(selectedItems.indexOf(shape),1);
        }
        hasSelectedItem = true;
      }
    });

    if (!hasSelectedItem) { selectedItems.length = 0; }

    drawList = [...tempDrawList.reverse()]
  }
}

//
//  Handeling events
//
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
  addRemoveItem(event);
  addRemoveLink(event);
});

canvas.addEventListener('mousedown', () => {
  selectItemHandler(event);
  keysDown.mouseDown = true;
});

canvas.addEventListener('mouseup', () => {
  keysDown.mouseDown = false;
});

canvas.addEventListener('mousemove', (event) =>{
  moveNode(event);
});

document.addEventListener('keypress', (event) => {
  keysDown[event.key] = true;
});

document.addEventListener('keyup', (event) => {
  keysDown[event.key] = false;
  console.log(keysDown)
});
