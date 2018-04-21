class HopfieldNetwork {

  constructor(size) {
    this.size = size;
    this.weights = new Array(this.size).fill().map(() => Array(this.size).fill(0));
    this.learnedVectors = 0;
  }

  static _transfer(x) {
    return x >= 0 ? 1 : -1;
  }

  static _shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  recall(vector) {

    let iter = 0;
    let hasChanged;
    do {
      let randOrder = HopfieldNetwork._shuffle([...Array(this.size).keys()]);

      hasChanged = false;
      for (let i = 0; i < randOrder.length; i++) {
        let sum = 0;
        for (let j = 0; j < this.size; j++) {
          sum += this.weights[randOrder[i]][j] * vector[j];
        }

        let outVal = HopfieldNetwork._transfer(sum);
        hasChanged |= outVal !== vector[randOrder[i]];

        vector[randOrder[i]] = outVal;
      }

      iter++;
    } while (hasChanged && iter < 1000);
    console.log("cycle: " + iter)

    return vector;
  }


  //Hebbian learning rule
  train(vector) {

    //expect bipolar input -1,1
    this.learnedVectors++;
    for (let i = 0; i < this.weights.length; i++) {
      for (let j = 0; j < this.weights[i].length; j++) {
        if (i !== j) {
          this.weights[i][j] = this.weights[i][j] * (this.learnedVectors - 1) + vector[i] * vector[j];
          this.weights[i][j] = this.weights[i][j] / this.learnedVectors;
        }
      }
    }
  }

  //Storkey learning rule
  trainStorkey(vector) {
    this.learnedVectors++;
    let prevWeights = this.weights.slice();
    for (let i = 0; i < this.weights.length; i++) {
      for (let j = 0; j < this.weights[i].length; j++) {
        if (i !== j) {
          let denormW = this.weights[i][j] * (this.learnedVectors - 1);
          this.weights[i][j] = denormW + (vector[i] * vector[j])
            - (vector[i] * HopfieldNetwork._h(prevWeights, vector, j, i))
            - (vector[j] * HopfieldNetwork._h(prevWeights, vector, i, j));

          this.weights[i][j] = this.weights[i][j] / this.learnedVectors;

        }

      }
    }
  }

  static _h(vector, weights, i, j) {
    let sum = 0;
    for (let k = 0; k < weights[i].length; k++) {
      if (k !== i && k !== j) {
        sum += weights[i][k] * vector[k];
      }
    }
    return sum;
  }


}
