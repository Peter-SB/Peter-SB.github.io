const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let raf;

//
// Defining objects
//


//
// Helper Functions
//

function generateAxis() {
    for (let i = 0; i < 1000; i++) {
        var minx = 0;
        var maxx = ctx.canvas.width - 100;
        var randomx = Math.floor(Math.random() * (+maxx - +minx)) + +minx;
        var miny = 0;
        var maxy = ctx.canvas.height - 100;
        var randomy = Math.floor(Math.random() * (+maxy - +miny)) + +miny;
        drawList.push(new Box(randomx, randomy, 100, 100, `rgb(${100 * (i / 1500)},${255 * (i / 1500)},${100 * (i / 1500)}`));
        console.log(`rgb(50*(${i / 1500}),200*(${i / 1500}),50*(${i / 1500})`);
    }
}

function plotx2() {
    x=0;
    y=0;
    for (let x = 0; x < ctx.canvas.width; x++) {
        y=(x**2)/50;
        ctx.fillStyle = "rgba(50,50,50,1)";
        ctx.fillRect( x, y, 5, 5 );
    }
}


//
// Main draw function
//

function draw() {
  ctx.clearRect(0,0, canvas.width, canvas.height);
  plotx2();
  console.log('1');
}

ctx.canvas.width  = window.innerWidth-40;
ctx.canvas.height = window.innerHeight-30;

//generateWorld();

draw();



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
})

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


})
