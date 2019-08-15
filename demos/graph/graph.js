/* global document, window */
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let raf;

const offset = { x: 150, y: 150 };
const zoom = 10;

const canvasSize = {
  width: 300,
  height: 300,
};

const boundarys = {
  xMin: -3,
  xMax: 3,
  yMin: -3,
  yMax: 3,
};

//
// Defining objects
//

class ComplexNumber {
  constructor(r, im) {
    this.r = r;
    this.im = im;
  }

  squared() {
    // (a+bi)^2 = (a^2+b^2)+2(ab)i
    const newR = (this.r ** 2) - (this.im ** 2);
    const newIm = 2 * this.r * this.im;

    this.r = newR;
    this.im = newIm;
  }

  add(num2) {
    this.r = this.r + num2.r;
    this.im = this.im + num2.im;
  }

  magnitude() {
    return Math.sqrt(this.r ** 2 + this.im ** 2);
  }
}


//
// Math Functions
//

function itterate(z, c) {
  // f(z) = z^2 + c
  z.squared();
  z.add(c);
}

// gets the number of itteration needed to make a complex number diverge
function getItterationsToDivergence(constant, maxItterations) {
  let itteration = 1;
  const number = new ComplexNumber(0, 0);
  while (number.magnitude() < 2 && itteration <= maxItterations) {
    itterate(number, constant);
    itteration++;
  }
  console.log(`${number.r} + ${number.im}i`);
  return itteration;
}

//
// Helper Functions
//

//
function pixleToAxis() {
  const xAxis = [];
  for (let xPixle = 0; xPixle < canvasSize.width; xPixle++) {
    const axisWidth = boundarys.xMax - boundarys.xMin;
    xAxis.push((axisWidth / canvasSize.width) * (xPixle + 1) + boundarys.xMin);
  }
  return { xAxis };
}

function axisPointToPixle() {

}

function convertCoords(xRelative, yRelative) {
  const xAbsolute = xRelative + offset.x;
  const yAbsolute = -yRelative + offset.y;
  return {
    x: xAbsolute,
    y: yAbsolute,
  };
}

function drawAxis() {
  ctx.fillStyle = 'rgba(100,100,100,1)';
  // draw x axis
  ctx.fillRect(0, offset.y, ctx.canvas.width, 1);
  // draw y axis
  ctx.fillRect(offset.x, 0, 1, ctx.canvas.height);
}

function drawPoint(complexPoint, itterations) {
  const coordinates = convertCoords(complexPoint.r, complexPoint.im);
  const i = itterations / 10;
  ctx.fillStyle = `rgb(${255 * (i)},${215 * (i)},${0 * (i)}`;
  ctx.fillRect(coordinates.x, coordinates.y, 2, 2);
}

function calculateMandelbrot() {
  let x;
  let y;
  for (x = -4; x < 4; x++) {
    for (y = -4; y < 4; x++) {
      const itterations = getItterationsToDivergence(new ComplexNumber(x, y), 10);
      drawPoint([x, y], itterations);
    }
  }
}

function drawx() {
  pixleToAxis().xAxis.forEach((xPoint, index) => {
    ctx.fillStyle = 'rgba(100,100,100,1)';
    // draw x axis
    ctx.fillRect(xPoint, xPoint, 1, 1);
  });
}

//
// Main draw function
//

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawAxis();
  // calculateMandelbrot();
}

ctx.canvas.width = canvasSize.width;
ctx.canvas.height = canvasSize.height;

offset.x = ctx.canvas.width / 2;
offset.y = ctx.canvas.height / 2;

const num1 = new ComplexNumber(5, 3);
console.log(`${num1.r} + ${num1.im}i`);

num1.squared();
console.log(`${num1.r} + ${num1.im}i`);

console.log(`${num1.magnitude()}`);
pixleToAxis();
// getItterationsToDivergence(new ComplexNumber(-1, 0), 10);
// getItterationsToDivergence(new ComplexNumber(1, 0), 10);

draw();


//
//  Handeling events
//
