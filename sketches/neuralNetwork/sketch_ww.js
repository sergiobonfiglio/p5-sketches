let trainingData = [
  {inputs: [1, 0], targets: [1]},
  {inputs: [0, 1], targets: [1]},
  {inputs: [0, 0], targets: [0]},
  {inputs: [1, 1], targets: [0]},
  {inputs: [0.5, 0.5], targets: [0.5]},//fake
];

let nn;
let resolution = 10;

let myWorker;

function getTrainingBatch() {
  let trainingBatch = [];
  for (let i = 0; i < 100; i++) {
    trainingBatch.push(random(trainingData));
  }
  return trainingBatch;
}

function setup() {
  createCanvas(500, 500);

  myWorker = new Worker('nn_tf_ww.js');
  myWorker.onmessage = function (resp) {
    if (resp.data.type === 'feed') {
      //one sample result
      let color = resp.data.result[0] * 255;
      fill(color);
      rect(resp.data.x * resolution, resp.data.y * resolution, resolution, resolution);

    } else if (resp.data.type === 'feedBatch') {
      //batch results
      let cols = width / resolution;
      let rows = cols;
      for (let x = 0; x < cols; x++) {
        for (let y = 0; y < rows; y++) {
          let color = resp.data.result[x][y][0] * 255;
          fill(color);
          rect(x * resolution, y * resolution, resolution, resolution);
        }
      }
      myWorker.postMessage({
        type: 'feedBatch',
        rows: width / resolution,
        cols: width / resolution
      });
    } else if (resp.data.type === 'trainCompleted') {
      myWorker.postMessage({type: 'train', trainingData: getTrainingBatch()});
    }
  }
  ;

  //init neural network
  myWorker.postMessage({
    type: 'init',
    nnParam: {
      inputs: 2,
      hidden: [10, 5],
      out: 1
    }
  });

  //get first frame
  myWorker.postMessage({
    type: 'feedBatch',
    rows: width / resolution,
    cols: width / resolution
  });

  //train first epoch
  myWorker.postMessage({type: 'train', trainingData: getTrainingBatch()});


  background(30);
  noStroke();
}

