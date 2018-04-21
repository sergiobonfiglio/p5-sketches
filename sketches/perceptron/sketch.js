let perceptron;
let dataPoints = new Array(100);
let ptSize = 16;
let bias = 1;

function f(x) {
    // return 0;
    return - x + 0.5;
    // return x;
}

function setup() {
    createCanvas(600, 600);


    for (let i = 0; i < dataPoints.length; i++) {

        let x = random(-1, 1);
        let y = random(-1, 1);
        let label = y >= f(x) ? 1 : -1;

        let point = new Point([x, y, bias], label);
        dataPoints[i] = point;
    }

    perceptron = new Perceptron(3);
    frameRate(10)
}

function draw() {
    background(255);
    stroke(0);
    fill(0);

    let pd1 = new Point([-1, f(-1)]);
    let pd2 = new Point([1, f(1)]);

    line(pd1.toCanvas().inputs[0], pd1.toCanvas().inputs[1], pd2.toCanvas().inputs[0], pd2.toCanvas().inputs[1]);

    for (let i = 0; i < dataPoints.length; i++) {
        let pt = dataPoints[i];
        if (pt.label === 1) {
            fill(0, 0, 0, 200);
        } else {
            fill(0, 128, 128, 200);
        }

        let ptCanv = pt.toCanvas();
        ellipse(ptCanv.inputs[0], ptCanv.inputs[1], ptSize);
    }

    for (let i = 0; i < dataPoints.length; i++) {
        let pt = dataPoints[i];
        let guess = perceptron.guess(pt.inputs);

        fill(255, 255, 255, 0);
        if (guess === pt.label) {
            stroke(0, 255, 0);
        } else {
            stroke(255, 0, 0);
        }
        let ptCanv = pt.toCanvas();
        rect(ptCanv.inputs[0] - ptSize / 2, ptCanv.inputs[1] - ptSize / 2, ptSize, ptSize);
    }


    if (!areWeightsEquals()) {
        lastWeights = [perceptron.weights[0], perceptron.weights[1], perceptron.weights[2]];
        for (let i = 0; i < dataPoints.length; i++) {
            perceptron.train(dataPoints[i].inputs, dataPoints[i].label);
        }
        iterations++;
        console.log('trained', iterations, perceptron.weights);
        // console.log(0, perceptron.guessY(0), 1, perceptron.guessY(1));
    }
    stroke(0, 0, 255);
    // strokeWeight(3);
    let pt1 = new Point([-1, perceptron.guessY(-1)]);
    let pt2 = new Point([1, perceptron.guessY(1)]);
    line(pt1.toCanvas().inputs[0], pt1.toCanvas().inputs[1], pt2.toCanvas().inputs[0], pt2.toCanvas().inputs[1]);
    strokeWeight(1);


}

let lastWeights;
let trainIndex = 0;
let iterations = 0;

function areWeightsEquals() {
    if (lastWeights == null) {
        return false;
    } else {

        let equals = true;
        for (let i = 0; i < perceptron.weights.length; i++) {
            let w = perceptron.weights[i];
            equals = equals && (w === lastWeights[i]);
        }
        return equals;
    }

}


function Perceptron(numInputs) {

    this.learningRate = 0.1;
    this.weights = new Array(numInputs);

    for (let i = 0; i < this.weights.length; i++) {
        this.weights[i] = random(-1, 1);
    }


    this.activation = function (input) {
        return input >= 0 ? 1 : -1;
    };

    this.guess = function (input) {

        let sum = 0;
        for (let i = 0; i < input.length; i++) {
            sum += input[i] * this.weights[i];
        }
        return this.activation(sum);
    };

    this.guessY = function (x) {

        let m = -this.weights[0] / this.weights[1];
        let b = -this.weights[2] / this.weights[1];
        return m * x + b;
    };


    this.train = function (input, label) {

        let guess = this.guess(input);
        let error = label - guess;

        if (error !== 0) {
            for (let i = 0; i < this.weights.length; i++) {
                this.weights[i] += input[i] * error * this.learningRate;
            }
        }

        return error !== 0
    }

}

function Point(inputs, label) {

    this.inputs = inputs;
    this.label = label;

    this.toCanvas = function () {
        return new Point([map(this.inputs[0], -1, 1, 0, width), map(this.inputs[1], -1, 1, 0, height)])
    };

}