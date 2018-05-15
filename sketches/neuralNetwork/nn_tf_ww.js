importScripts(
  "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@0.10.3",
  'nn_tf.js');
let nn;

// tf.setBackend('cpu');
onmessage = function (e) {

  if (e.data.type === 'init') {

    nn = new NeuralNetwork(
      e.data.nnParam.inputs,
      e.data.nnParam.hidden,
      e.data.nnParam.out);

  } else if (e.data.type === 'train') {

    let trainingData = e.data.trainingData;
    for (let i = 0; i < trainingData.length; i++) {
      let data = trainingData[i];
      nn.train(data.inputs, data.targets);
    }
    postMessage({type: 'trainCompleted'});

  } else if (e.data.type === 'feed') {

    nn.feedForward(e.data.input);
    postMessage({type: 'feed', result: res, x: e.data.x, y: e.data.y});
  }
  else if (e.data.type === 'feedBatch') {
    let rows = e.data.rows;
    let cols = e.data.cols;
    let result = [];
    for (let x = 0; x < cols; x++) {
      result[x] = [];
      for (let y = 0; y < rows; y++) {
        result[x][y] = nn.feedForward([x / cols, y / rows]);
      }
    }

    postMessage({type: 'feedBatch', result: result});
  }
};

