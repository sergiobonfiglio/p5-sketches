let trainingData = [
  {inputs: [1, 0], targets: [1]},
  {inputs: [0, 1], targets: [1]},
  {inputs: [0, 0], targets: [0]},
  {inputs: [1, 1], targets: [0]},
  {inputs: [0.5, 0.5], targets: [0.5]},//fake
];

let nn;
let resolution = 10;

let lrSlider;

function setup() {
  createCanvas(500, 1000);

  lrSlider = createSlider(0.01, 1, 0.1, 0.001);
  nn = new NeuralNetwork(2, [4,2], 1);

  // for (let i = 0; i < 40000; i++) {
  //     let data = random(trainingData);
  //     nn.train(data.inputs, data.targets);
  // }
  //
  // console.log(nn.feedForward([1, 0])[0]);
  // console.log(nn.feedForward([0, 1])[0]);
  // console.log(nn.feedForward([1, 1])[0]);
  // console.log(nn.feedForward([0, 0])[0]);

  // frameRate(2)
}

function draw() {
  background(30);
  noStroke();

  // let data = random(trainingData);
  // nn.train(data.inputs, data.targets);
  for (let i = 0; i < 1000; i++) {
    let data = random(trainingData);
    nn.train(data.inputs, data.targets);
  }

  nn.learningRate = lrSlider.value();

  let cols = width / resolution;
  for (let x = 0; x < cols; x++) {
    let rows = cols;
    for (let y = 0; y < rows; y++) {
      let color = nn.feedForward([x / cols, y / rows])[0] * 255;
      fill(color);
      rect(x * resolution, y * resolution, resolution, resolution);
    }
  }

  for (let i = 0; i < nn.weights.length; i++) {
    //draw hidden layer
    drawLayer(nn.weights[i], i * (width / (nn.weights.length + 1)), height / 2, width / (nn.weights.length + 1), height / 2);
  }
  //draw output
  let layer = nn.weights.length;
  drawLayer({
    cols: 1,
    rows: 0,
    data: []
  }, layer * (width / (nn.weights.length + 1)), height / 2, width / (nn.weights.length + 1), height / 2)
}

function drawLayer(weights, x, y, w, h) {
  let numNeurons = weights.cols;
  let nextNeurons = new Array(weights.rows);

  let neuronSize = Math.min(w / 3, h / numNeurons);
  let maxStroke = Math.max(1, neuronSize / 4);

  let min;
  let max;
  for (let i = 0; i < weights.data.length; i++) {
    for (let j = 0; j < weights.data[i].length; j++) {
      if (!min || min > weights.data[i][j]) {
        min = weights.data[i][j];
      }
      if (!max || max < weights.data[i][j]) {
        max = weights.data[i][j];
      }
    }
  }

  for (let j = 0; j < nextNeurons.length; j++) {
    nextNeurons[j] = {xpos: x + w + (w / 2), ypos: y + h / (nextNeurons.length + 1) * (j + 1)};
  }

  fill(255);
  for (let i = 0; i < numNeurons; i++) {

    let curX = x + w / 2;
    let curY = y + h / (numNeurons + 1) * (i + 1);


    for (let j = 0; j < nextNeurons.length; j++) {
      let synWeight = weights.data[j][i];
      let red = synWeight < 0 ? map(synWeight, min, 0, 0, 255) : 0;
      let green = synWeight >= 0 ? map(synWeight, 0, max, 0, 255) : 0;


      stroke(red, green, 0);
      // map(Math.abs(synWeight) - synWeight, 0, max * 2, 0, 255),
      //                 // map(synWeight, min, max, 0, 255),
      //                 // 0);

      strokeWeight(map(Math.abs(synWeight), 0, Math.max(max, Math.abs(min)), 0, maxStroke));

      line(curX + neuronSize / 2, curY, nextNeurons[j].xpos - neuronSize / 2, nextNeurons[j].ypos);
    }

    stroke(255);
    strokeWeight(1);
    ellipse(curX, curY, neuronSize, neuronSize);
  }


}