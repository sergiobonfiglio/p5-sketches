let resolution = 20;
let grid;
let rows, cols;

let brain;
let memorizedGrids = [];

function gridToBipolarVector(matrix) {
  return [].concat(...matrix).map(x => x > 0 ? x : -1);
}

function setup() {

  createCanvas(resolution * 10 + 1, resolution * 20 + 1);

  rows = floor(width / resolution);
  cols = rows;

  grid = new Array(rows).fill().map(() => Array(cols).fill(0));

  brain = new HopfieldNetwork(rows * cols);
  console.log("max capacity: " + (brain.size * 0.138));

  //train button
  createButton('train').mousePressed(function () {
    memorizedGrids.push(grid.slice());

    let vector = gridToBipolarVector(grid);

    brain.train(vector);
    clearFn();
  });

  //train with storkey rule
  createButton('trainStorkey').mousePressed(function () {

    memorizedGrids.push(grid.slice());

    let vector = gridToBipolarVector(grid);

    brain.trainStorkey(vector);
    clearFn();
  });

  //recall button
  createButton('recall').mousePressed(function () {
    let vector = [].concat(...grid).map(x => x > 0 ? x : -1);
    let recalled = brain.recall(vector);


    grid = recalled.reduce((rowsArr, key, index) => (index % rows === 0 ? rowsArr.push([key])
      : rowsArr[rowsArr.length - 1].push(key)) && rowsArr, []).map(r => r.map(x => x > 0 ? 1 : 0));

    for (let i = 0; i < memorizedGrids.length; i++) {
      let found = true;
      for (let r = 0; r < memorizedGrids[i].length; r++) {
        for (let c = 0; c < memorizedGrids[i][r].length; c++) {
          found = found && memorizedGrids[i][r][c] === grid[r][c];
        }
      }
      if (found) {
        console.log("recall correct! Pattern " + (i + 1));
      }
    }
  });

  //clear button
  let clearFn = function () {
    grid = new Array(rows).fill().map(() => Array(cols).fill(0));
  };
  createButton('clear').mousePressed(clearFn);

  //randomize button
  createButton('randomize').mousePressed(function () {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        grid[i][j] = random(0, 1) > 0.7 ? 1 : 0;
      }
    }
  });
}


function draw() {

  background(255);

  for (let x = 0; x < rows; x++) {
    for (let y = 0; y < cols; y++) {
      fill(255 - 255 * grid[x][y]);
      rect(x * resolution, y * resolution, resolution, resolution);
    }
  }


  let minRes = resolution / 5;
  let startY = cols * resolution;
  let startX = 0;
  for (let i = 0; i < memorizedGrids.length; i++) {
    for (let x = 0; x < rows; x++) {
      for (let y = 0; y < cols; y++) {
        fill(255 - 255 * memorizedGrids[i][x][y]);
        rect(startX + x * minRes, startY + y * minRes, minRes, minRes);
      }
    }
    startX += cols * minRes + 2;
    if ((i + 1) % 4 === 0) {
      startY += rows * minRes + 2;
      startX = 0;
    }
  }


}

function mouseDragged() {

  let row = floor(mouseX / resolution);
  let col = floor(mouseY / resolution);

  if (row < rows && col < cols) {
    grid[row][col] = 1;
  }

}

function mousePressed() {

  let row = floor(mouseX / resolution);
  let col = floor(mouseY / resolution);

  if (row < rows && col < cols) {
    grid[row][col] = 1 - grid[row][col];
  }

}

