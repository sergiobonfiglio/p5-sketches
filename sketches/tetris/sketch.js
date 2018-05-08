let rows = 20;
let cols = 10;

let grid;
let cellW;
let cellH;
let fallRate = 15;
let score;

function setup() {
  let res = 30;
  createCanvas(cols * res, rows * res);

  cellW = width / cols;
  cellH = height / rows;
  grid = new TetrisGrid(rows, cols, cellW, cellH);

  score = createP("SCORE: " + grid.score);
}


function keyPressed() {

  if (keyCode === LEFT_ARROW) {
    grid.moveHorizStart(-1);
  } else if (keyCode === RIGHT_ARROW) {
    grid.moveHorizStart(1);
  } else if (keyCode === UP_ARROW) {
    grid.rotate();
  } else if (keyCode === DOWN_ARROW) {
    grid.moveDownStart();
  } else if (key === ' ') {
    grid.rotate();
  }

}

function keyReleased() {
  if (keyCode === LEFT_ARROW) {
    grid.moveHorizEnd();
  } else if (keyCode === RIGHT_ARROW) {
    grid.moveHorizEnd();
  } else if (keyCode === DOWN_ARROW) {
    grid.moveDownEnd();
  }
}


function draw() {

  score.html("SCORE: " + grid.score);
  if (frameCount % fallRate === 0) {
    grid.nextStep();
  }

  background(0);

  grid.draw();
}


