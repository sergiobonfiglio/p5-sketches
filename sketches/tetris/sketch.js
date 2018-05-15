let rows = 12;
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

let agentSlider;

function setup() {
  let res = 30;
  createCanvas(cols * res, rows * res);

  cellW = width / cols;
  cellH = height / rows;
  // grid = new TetrisGrid(rows, cols, cellW, cellH);


  tf.setBackend('cpu');

  let inputs = rows * cols;
  population = [];
  boards = [];
  for (let i = 0; i < 500; i++) {
    boards[i] = new TetrisGrid(rows, cols, cellW, cellH);
    population[i] = new NeuralNetwork(inputs, [inputs, floor(inputs / 2)], 4);
  }

  bestBoard = boards[0];

  score = createP("MAX SCORE: ");
  showBestButton = createCheckbox("Show best");
  showBestButton.checked(true);

  agentSlider = createSlider(0, population.length - 1, 0, 1);
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
let bestBoardIx = 0;
let drawingBoard = null;

let lastGeneration = new Date();

function draw() {
  background(0);

  if (showBestButton.checked()) {
    drawingBoard = bestBoard;
    drawingBoardIx = bestBoardIx;
    agentSlider.value(drawingBoardIx);
  } else {
    drawingBoardIx = agentSlider.value();
    drawingBoard = boards[drawingBoardIx];
  }


  // if (frameCount % fallRate === 0) {
  for (let i = 0; i < boards.length; i++) {
    boards[i].nextStep();
  }
  // }

//neuro evolution
  let runningGames = 0;
  for (let i = 0; i < population.length; i++) {
    let agent = population[i];
    if (!boards[i].gameover) {
      runningGames++;

      //guess and select move
      let board = [];
      for (let r = 0; r < boards[i].board.length; r++) {
        board[r] = boards[i].board[r].slice();
      }

      let p = boards[i].pieces[0];
      for (let rp = 0; rp < p.box.length; rp++) {
        for (let cp = 0; cp < p.box[0].length; cp++) {
          let gridR = p.r + rp;
          let gridC = p.c + cp;
          board[gridR][gridC] = p.box[rp][cp] > 0 ? 2 : 0;
        }
      }

      let input = [].concat(...board);
      let guess = agent.feedForward(input);

      let maxI = 0;
      for (let j = 1; j < guess.length; j++) {
        if (guess[j] > guess[maxI]) {
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
      } else if (move === 3) {
        //do nothing
      }

      //update best score
      if (boards[i].score > bestScore) {
        bestScore = boards[i].score;
        bestBoard = boards[i];
        bestBoardIx = i;
      }
    }
  }

  drawingBoard.draw();

  score.html("MAX SCORE: " + bestScore +
    "<br>current: " + drawingBoardIx + " = " + drawingBoard.score +
    "<br>generation " + generation +
    "<br>running: " + runningGames
  );


  if (runningGames === 0) {
    //create new generation
    generation++;
    let runtime = new Date() - lastGeneration;
    lastGeneration = new Date();

    //normalizeFitness
    normalizeFitness(boards, population);
    //generate new brains
    population = generatePopulation(boards, population);

    //reset games
    let scoreSum = 0;
    for (let i = 0; i < boards.length; i++) {
      scoreSum += boards[i].score;
      boards[i] = new TetrisGrid(rows, cols, cellW, cellH);
    }
    bestBoard = boards[0];
    bestBoardIx = 0;

    let initTime = new Date() - lastGeneration;
    lastGeneration = new Date();


    console.log(
      "new generation: " + generation +
      ", meanScore: " + (scoreSum / boards.length) +
      ", runtime: " + (runtime / 1000) + "s" +
      ", initTime: " + (initTime / 1000) + "s");
  }


}

function generatePopulation(boards, population) {

  let tickets = [];
  for (let i = 0; i < population.length; i++) {
    let chance = (population[i].fitness + random(-0.05, 0.05)) * 50;
    for (let j = 0; j < chance; j++) {
      tickets.push(i);
    }
  }

  let newPop = [];
  for (let i = 0; i < population.length; i++) {
    let r = floor(random(0, tickets.length));
    let selectedAgent = population[tickets[r]].copy();
    selectedAgent.mutateNormal(0, 0.25);
    newPop.push(selectedAgent);
  }

  for (let i = 0; i < population.length; i++) {
    population[i].dispose();
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



