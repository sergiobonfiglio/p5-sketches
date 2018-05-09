let rows = 20;
let cols = 10;

let grid;
let cellW;
let cellH;
let fallRate = 15;
let score;

let population;
let boards;
let bestScore = 0;
let generation = 0;
let bestBoard = null;
let showBestButton;

function setup() {
  let res = 30;
  createCanvas(cols * res, rows * res);

  cellW = width / cols;
  cellH = height / rows;
  // grid = new TetrisGrid(rows, cols, cellW, cellH);

  score = createP("MAX SCORE: ");
  showBestButton = createCheckbox("Show best");

  let inputs = rows * cols;
  population = [];
  boards = [];
  for (let i = 0; i < 100; i++) {
    boards[i] = new TetrisGrid(rows, cols, cellW, cellH);
    population[i] = new NeuralNetwork(inputs, [floor(inputs / 2)], 3);
  }

  bestBoard = boards[0];

}

//
// function keyPressed() {
//
//   if (keyCode === LEFT_ARROW) {
//     grid.moveHorizStart(-1);
//   } else if (keyCode === RIGHT_ARROW) {
//     grid.moveHorizStart(1);
//   } else if (keyCode === UP_ARROW) {
//     grid.rotate();
//   } else if (keyCode === DOWN_ARROW) {
//     grid.moveDownStart();
//   } else if (key === ' ') {
//     grid.rotate();
//   }
//
// }
//
// function keyReleased() {
//   if (keyCode === LEFT_ARROW) {
//     grid.moveHorizEnd();
//   } else if (keyCode === RIGHT_ARROW) {
//     grid.moveHorizEnd();
//   } else if (keyCode === DOWN_ARROW) {
//     grid.moveDownEnd();
//   }
// }

let drawingBoardIx = 0;
let drawingBoard = null;

function draw() {
  background(0);

  if (showBestButton.checked()) {
    drawingBoard = bestBoard;
  } else if (frameCount % 120 === 0) {
    drawingBoardIx = (drawingBoardIx + 1) % boards.length;
    drawingBoard = boards[drawingBoardIx];
  }

  if (drawingBoard) {
    drawingBoard.draw();

    score.html("MAX SCORE: " + bestScore +
      "<br>current: " + drawingBoardIx + " = " + drawingBoard.score +
      "<br>generation " + generation);
  }


  // if (frameCount % fallRate === 0) {
  for (let i = 0; i < boards.length; i++) {
    boards[i].nextStep();
  }
  // }


//neuro evolution
  let areGamesRunning = false;
  for (let i = 0; i < population.length; i++) {
    let agent = population[i];
    if (!boards[i].gameover) {
      areGamesRunning |= true;

      //guess and select move
      let input = [].concat(...boards[i].board);
      let guess = agent.feedForward(input);

      let maxI = 0;
      for (let j = 1; j < guess.length; j++) {
        if (guess[j][0] > guess[maxI][0]) {
          maxI = j;
        }
      }
      let move = maxI;
      if (move === 0) {
        boards[i].moveH(-1);
      } else if (move === 1) {
        boards[i].moveH(1);
      } else if (move === 2) {
        boards[i].rotate();
      }

      //update best score
      if (boards[i].score > bestScore) {
        bestScore = boards[i].score;
        bestBoard = boards[i];
      }
    }
  }

  if (!areGamesRunning) {
    //create new generation
    generation++;
    console.log("new generation: " + generation);

    //normalizeFitness
    normalizeFitness(boards, population);
    //generate new brains
    population = generatePopulation(boards, population);


    //reset game
    for (let i = 0; i < boards.length; i++) {
      boards[i] = new TetrisGrid(rows, cols, cellW, cellH);
    }
  }


}

function generatePopulation(boards, population) {

  let tickets = [];
  for (let i = 0; i < population.length; i++) {
    let chance = (population[i].fitness + random(0.01, 0.1)) * 10;
    for (let j = 0; j < chance; j++) {
      tickets.push(i);
    }
  }

  let newPop = [];
  for (let i = 0; i < population.length; i++) {
    let r = floor(random(0, tickets.length));
    let selectedAgent = population[tickets[r]].copy();
    selectedAgent.mutate(mutate);
    newPop.push(selectedAgent);
  }

  return newPop;
}

function normalizeFitness(boards, population) {
  let sum = 0;
  for (let i = 0; i < boards.length; i++) {
    population[i].fitness = Math.pow(2, boards[i].score);
    sum += population[i].fitness;
  }

  for (let i = 0; i < population.length; i++) {
    population[i].fitness = population[i].fitness / sum;
  }

}

function mutate(x) {
  if (random(1) < 0.1) {
    let offset = randomGaussian() * 0.5;
    let newx = x + offset;
    return newx;
  } else {
    return x;
  }
}


