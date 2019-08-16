/* eslint-disable no-use-before-define */
/* global document, window, data */

import data from './timeLine-data.js';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let raf;

const layerWidth = 15;
const layerSpacing = 5;

const canvasOffSet = {
  x: 0,
  y: 0,
};

const canvasSize = {
  width: 1280,
  height: 720,
};

const eventList = [];

const startYearInput = document.getElementById('startYearInput');
const endYearInput = document.getElementById('endYearInput');
let startYear = startYearInput.value;
let endYear = endYearInput.value;

//
// Defining objects
//

class TimeLineEvent {
  constructor(eventData) {
    this.startTime = eventData.s;
    this.endTime = eventData.e;
    this.info = eventData.i;
    this.layer = eventData.l || 1;
    this.hidden = eventData.h || true;
    this.colour = eventData.c || 'black';
  }

  draw() {
    drawLine(this.startTime, this.endTime, this.colour, layerToPixle(this.layer), layerWidth);
  }

  drawText() {
    const x = yearToPixle(this.startTime) + 5;
    const y = layerToPixle(this.layer);
    ctx.font = '10px Arial';
    ctx.fillText(this.info, x, y + layerWidth - 2);
  }

  // Finds out if mouse is within box boundaries
  inBoundary(mouseCoordinates) {
    const x = yearToPixle(this.startTime);
    const y = layerToPixle(this.layer);
    const width = yearToPixle(this.endTime) - x;
    const height = layerWidth;
    if (x <= mouseCoordinates.x && y <= mouseCoordinates.y) {
      const boxEdgeX = x + width;
      const boxEdgeY = y + height;
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

function layerToPixle(layer) {
  const axisCentre = canvasSize.height / 2 + canvasOffSet.y;
  let pixleY;
  if (layer % 2) {
    pixleY = axisCentre + layerSpacing + (layerWidth) * layer;
  } else {
    pixleY = axisCentre - layerSpacing - (layerWidth) * layer;
  }
  return pixleY;
}

function yearToPixle(inputTime) {
  const startTime = startYear;
  const endTime = endYear;

  const relativePosition = (inputTime - startTime) / (endTime - startTime);
  const pixlePosition = relativePosition * canvasSize.width;

  return pixlePosition;
}

function drawLine(startTime, endTime, colour, y = (canvasSize.height / 2), height = 2) {
  ctx.fillStyle = colour;
  const startPixle = yearToPixle(startTime);
  const endPixle = yearToPixle(endTime);
  ctx.fillRect(startPixle, y, endPixle - startPixle, height);
}

function drawTimeAxis() {
  const startTime = startYear;
  const endTime = endYear;

  drawLine(startTime, endTime, 'rgba(100,100,100,1)');
}

function loadData() {
  data.forEach((eventData) => {
    eventList.push(new TimeLineEvent(eventData));
  });
}

function drawData() {
  eventList.forEach((event) => {
    event.draw();
  });
}

function sortByKey(array, key) {
  return array.sort((a, b) => {
    const x = a[key];
    const y = b[key];
    // eslint-disable-next-line no-nested-ternary
    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
  });
}

//
// Main draw function
//

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawTimeAxis();

  drawData();
}

function setUpPage() {
  ctx.canvas.width = canvasSize.width;
  ctx.canvas.height = canvasSize.height;

  loadData();

  draw();
}


setUpPage();

//
//  Handeling events
//

function handleScroll(event) {
  startYear = +startYear + event.deltaX * 0.03;
  endYear = +endYear + event.deltaX * 0.03;

  startYear -= event.deltaY * 0.01;
  endYear += event.deltaY * 0.01;

  startYearInput.value = Math.round(startYear);
  endYearInput.value = Math.round(endYear);

  draw();

  return event.preventDefault() && false;
}

function getMousePos(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
}

canvas.addEventListener('click', (event) => {
  console.log(getMousePos(event));

  console.log(eventList);
  console.log(sortByKey(eventList, 'startTime'));
});

canvas.addEventListener('mousemove', (event) => {
  const mouseCoords = getMousePos(event);
  eventList.forEach((eventItem) => {
    if (eventItem.inBoundary(mouseCoords)) {
      eventItem.drawText();
    }
  });
});

canvas.addEventListener('DOMMouseScroll', handleScroll, false);
canvas.addEventListener('mousewheel', handleScroll, false);


startYearInput.addEventListener('change', draw);
endYearInput.addEventListener('change', draw);
