let rows = 20;
let cols = 10;

let grid;
let cellW;
let cellH;
let fallRate = 15;
let score;

let population;
let boards;

function setup() {
    let res = 30;
    createCanvas(cols * res, rows * res);

    cellW = width / cols;
    cellH = height / rows;
    grid = new TetrisGrid(rows, cols, cellW, cellH);

    score = createP("SCORE: " + grid.score);

    let inputs = this.rows * this.cols;
    population = [];
    for (let i = 0; i < 100; i++) {
        boards[i] = new TetrisGrid(rows, cols, cellW, cellH);
        population[i] = new NeuralNetwork(inputs, [inputs * 2, inputs * 3, inputs * 2], 3);
    }


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

    //
    for (let i = 0; i < population.length; i++) {
        let agent = population[i];
        //get boards
        let input = [].concat(...boards[i].board);
        let guess = agent.feedForward(input);

        var move = guess.indexOf(Math.max(...guess));
        if (move === 0) {

        } else if (move === 1) {

        } else if (move === 2) {

        }

    }


    score.html("SCORE: " + grid.score);
    if (frameCount % fallRate === 0) {
        grid.nextStep();
    }

    background(0);

    grid.draw();
}


