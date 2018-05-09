class Matrix {
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;

        this.data = [];

        for (let r = 0; r < rows; r++) {
            this.data[r] = [];
            for (let c = 0; c < cols; c++) {
                this.data[r][c] = 0;
            }
        }
    }


    add(m2) {
        this.data = Matrix.add(this, m2).data;
        return this;
    }

    transpose() {
        let m = Matrix.transpose(this);
        this.rows = m.rows;
        this.cols = m.cols;
        this.data = m.data;

        return this;
    }

    map(f) {
        this.data = Matrix.map(this, f).data;
    }

    static map(m1, f) {
        return Matrix.fromData(m1.data.map(r => r.map(c => f(c))));
    }

    toArray() {
        return this.data.map(r => r);
    }

    static add(m1, m2) {
        let matrixValue;
        if (m2 instanceof Matrix) {
            if (m1.cols !== m2.cols || m1.rows !== m2.rows) {
                console.error("number of rows/columns don't match: " + m1.rows + "x" + m1.cols + " vs. " + m2.rows + "x" + m2.cols);
                return null;
            } else {
                matrixValue = m1.data.map((row, r) => row.map((col, c) => col + m2.data[r][c]));
            }
        } else {
            //scalar
            matrixValue = m1.data.map((row) => row.map(col => col + m2));
        }
        return Matrix.fromData(matrixValue);
    }

    elementMultiply(m2) {
        return Matrix.elementMultiply(this, m2);
    }

    static elementMultiply(m1, m2) {
        //Hadamard product
        if (m2 instanceof Matrix) {
            return Matrix.fromData(m1.data.map((row, r) => row.map((col, c) => m1.data[r][c] * m2.data[r][c])));
        } else {
            //scalar
            return Matrix.fromData(m1.data.map((row, r) => row.map((col, c) => m1.data[r][c] * m2)));
        }
    }


    dotProduct(m2) {
        let m = Matrix.dotProduct(this, m2);
        this.rows = m.rows;
        this.cols = m.cols;
        this.data = m.data;
        return this;
    }

    static dotProduct(m1, m2) {
        if (m2 instanceof Matrix) {
            //data product
            if (m1.cols !== m2.rows) {
                console.error("number of rows/columns don't match: " + m1.rows + "x" + m1.cols + " vs. " + m2.rows + "x" + m2.cols);
                return null;
            } else {
                let ret = new Matrix(m1.rows, m2.cols);
                for (let r = 0; r < ret.rows; r++) {
                    for (let c = 0; c < ret.cols; c++) {
                        ret.data[r][c] = m1.data[r].map((el, ix) => el * m2.data[ix][c])
                            .reduce((acc, val) => acc + val);
                    }
                }
                return ret;
            }

        } else {
            console.error("both parameters should be a matrix ", m1, m2);
            return null;
        }
    }

    static transpose(m) {
        let res = [];
        for (let c = 0; c < m.cols; c++) {
            res[c] = [];
            for (let r = 0; r < m.rows; r++) {
                res[c][r] = m.data[r][c];
            }
        }
        return Matrix.fromData(res);
    }

    static fromData(data) {
        let dataM = data[0].length ? data : [data];
        let m = new Matrix(dataM.length, dataM[0].length)
        m.data = dataM;
        return m;
    }

  copy() {
    let m = new Matrix(this.rows, this.cols);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        m.data[i][j] = this.data[i][j];
      }
    }
    return m;
  }

    randomize(n, m) {
        let max = m || n;
        let min = m !== undefined ? n : 0;
        this.data = this.data.map(r => r.map(() => Math.random() * (max - min) + min));
        return this;
    }

    print() {
        console.table(this.data);
    }

}