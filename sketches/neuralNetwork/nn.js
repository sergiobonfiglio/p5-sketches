function sigmoid(x) {
  return 1 / (1 + Math.exp(-x));
}

function dsigmoid(y) {
  return y * (1 - y);
}

class NeuralNetwork {

  constructor(numInOrNN, hiddenLayers, numOut) {

    if (numInOrNN instanceof NeuralNetwork) {
      let parent = numInOrNN;
      this.numIn = parent.numIn;
      this.numOut = parent.numOut;

      this.hiddenNeurons = parent.hiddenNeurons;

      this.learningRate = parent.learningRate;

      //init weights
      this.weights = [];
      for (let i = 0; i < parent.weights.length; i++) {
        this.weights.push(parent.weights[i].copy());
      }

      this.biases = [];
      for (let i = 0; i < parent.biases.length; i++) {
        this.biases.push(parent.biases[i].copy());
      }

    } else {
      this.numIn = numInOrNN;
      this.numOut = numOut;

      this.hiddenNeurons = Array.isArray(hiddenLayers) ? hiddenLayers : [hiddenLayers];

      this.learningRate = 0.1;

      //init weights
      this.weights = [];
      this.biases = [];

      let prevLayer = this.numIn;
      for (let i = 0; i < this.hiddenNeurons.length; i++) {

        //init weights
        let ihW = new Matrix(this.hiddenNeurons[i], prevLayer);
        ihW.randomize(-1, 1);
        this.weights.push(ihW);

        //init biases
        let ihB = new Matrix(this.hiddenNeurons[i], 1);
        ihB.randomize(-1, 1);
        this.biases.push(ihB);

        prevLayer = this.hiddenNeurons[i];
      }

      //last weights
      let hoW = new Matrix(this.numOut, prevLayer);
      hoW.randomize(-1, 1);
      this.weights.push(hoW);


      //last biases
      let hoB = new Matrix(this.numOut, 1);
      hoB.randomize(-1, 1);
      this.biases.push(hoB);
    }

  }


  feedForward(inputs, retValues) {

    if (inputs.length != this.numIn) {
      console.error("wrong number on inputs");
      return null;
    } else {

      let curLayer = Matrix.fromData(inputs).transpose();
      if (retValues) {
        retValues.push(curLayer);
      }
      for (let i = 0; i < this.weights.length; i++) {

        curLayer = Matrix.dotProduct(this.weights[i], curLayer);

        curLayer.add(this.biases[i]);

        //activation fn
        curLayer.map(sigmoid);

        if (retValues) {
          retValues.push(curLayer);
        }
      }

      return curLayer.toArray();
    }
  }

  train(inputs, targets) {

    let nodeValues = [];
    let guess = this.feedForward(inputs, nodeValues);

    let outErrors = guess.map((el, i) => targets[i] - el); //Matrix.subtract

    let currErr = Matrix.fromData(outErrors).transpose();
    for (let i = this.weights.length - 1; i >= 0; i--) {

      let gradients = Matrix.map(nodeValues[i + 1], dsigmoid)
        .elementMultiply(currErr)
        .elementMultiply(this.learningRate);
      this.biases[i].add(gradients);

      let deltaW = gradients.dotProduct(Matrix.transpose(nodeValues[i]));
      this.weights[i].add(deltaW);

      let transW = Matrix.transpose(this.weights[i]);
      currErr = Matrix.dotProduct(transW, currErr);

    }

  }


  // Adding function for neuro-evolution
  copy() {
    return new NeuralNetwork(this);
  }

  // Accept an arbitrary function for mutation
  mutate(func) {
    for (let i = 0; i < this.weights.length; i++) {
      this.weights[i].map(func);
    }
    for (let i = 0; i < this.biases.length; i++) {
      this.biases[i].map(func);
    }
  }

}

