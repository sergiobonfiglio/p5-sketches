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
        this.weights.push(parent.weights[i].clone());
      }

      this.biases = [];
      for (let i = 0; i < parent.biases.length; i++) {
        this.biases.push(parent.biases[i].clone());
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
        let ihW = tf.variable(tf.randomUniform([this.hiddenNeurons[i], prevLayer], -1, 1));
        this.weights.push(ihW);

        //init biases
        let ihB = tf.variable(tf.randomUniform([this.hiddenNeurons[i], 1], -1, 1));
        this.biases.push(ihB);

        prevLayer = this.hiddenNeurons[i];
      }

      //last weights
      let hoW = tf.variable(tf.randomUniform([this.numOut, prevLayer], -1, 1));
      this.weights.push(hoW);


      //last biases
      let hoB = tf.variable(tf.randomUniform([this.numOut, 1], -1, 1));
      this.biases.push(hoB);
    }

  }


  dispose() {
    for (let i = 0; i < this.weights.length; i++) {
      this.weights[i].dispose();
    }
    for (let i = 0; i < this.biases.length; i++) {
      this.biases[i].dispose();
    }
  }

  feedForward(inputs, retValues) {

    if (inputs.length != this.numIn) {
      console.error("wrong number on inputs");
      return null;
    } else {

      let ret = tf.tidy(() => {
        let hiddenNodeValues = [];
        let curLayer = tf.tensor2d(inputs, [inputs.length, 1]);
        if (retValues) {
          hiddenNodeValues.push(curLayer);
        }
        for (let i = 0; i < this.weights.length; i++) {

          curLayer = this.weights[i].matMul(curLayer)
            .add(this.biases[i])
            .sigmoid();

          if (retValues) {
            hiddenNodeValues.push(curLayer);
          }
        }

        if (retValues) {
          return {guess: curLayer, nodeValues: hiddenNodeValues};
        } else {
          return curLayer;
        }
      });

      if (retValues) {
        return ret;
      } else {
        return ret.dataSync();
      }

    }
  }



  train(inputs, targets) {
    tf.tidy(() => {
      // const f = x => x.sigmoid().mul(tf.scalar(-1));
      // const dsigmoid = tf.grad(f);
      let sigmoid = tf.customGrad(x => {
        // Override gradient of our custom x ^ 2 op to be dy * abs(x);
        return {value: x.sigmoid(), gradFunc: dy => x.mul(tf.scalar(1).sub(x))};
      });
      let dsigmoid = tf.grad(x => sigmoid(x));

      let guess, nodeValues;
      ({guess, nodeValues} = this.feedForward(inputs, true));

      let outErrors = tf.tensor1d(targets).sub(guess);
      // let outErrors = guess.sub(tf.tensor1d(targets));

      // console.log('error BEFORE');
      // outErrors.print();

      let currErr = outErrors.transpose();
      for (let i = this.weights.length - 1; i >= 0; i--) {

        let gradients = dsigmoid(nodeValues[i + 1])
          .mul(currErr)
          .mul(tf.scalar(this.learningRate));
        this.biases[i].assign(this.biases[i].add(gradients));

        let deltaW = gradients.matMul(nodeValues[i].transpose());
        this.weights[i].assign(this.weights[i].add(deltaW));

        let transW = this.weights[i].transpose();
        currErr = transW.matMul(currErr);
      }


      //check if error diminished
      // ({guess, nodeValues} = this.feedForward(inputs, false));
      // outErrors = guess.sub(tf.tensor1d(targets));
      // console.log('error AFTER');
      // outErrors.print();

    });

  }


  // Adding function for neuro-evolution
  copy() {
    return new NeuralNetwork(this);
  }

  // Accept an arbitrary function for mutation
  mutateNormal(mean, std) {
    tf.tidy(() => {
      for (let i = 0; i < this.weights.length; i++) {
        let shape = this.weights[i].shape;
        this.weights[i].assign(this.weights[i].add(tf.randomNormal(shape, mean, std)));
      }
      for (let i = 0; i < this.biases.length; i++) {
        let shape = this.biases[i].shape;
        this.biases[i].assign(this.biases[i].add(tf.randomNormal(shape, mean, std)));
      }
    });

  }

}

