class Piece {

  constructor(r, c, rot, board) {
    this.rotation = rot;
    this.r = r;
    this.c = c;

    this.board = board;
    this.box = this.getBox(this.rotation);

  }

  static randPiece(r, c, board) {
    let t = floor(random(0, 1));
    let rot = floor(random(0, 4));

    let p;
    if (t === 0) {
      p = new PieceO(r, c, rot, board);
    } else if (t === 1) {
      p = new PieceI(r, c, rot, board);
    } else if (t === 2) {
      p = new PieceS(r, c, rot, board);
    } else if (t === 3) {
      p = new PieceZ(r, c, rot, board);
    } else if (t === 4) {
      p = new PieceL(r, c, rot, board);
    } else if (t === 5) {
      p = new PieceJ(r, c, rot, board);
    } else if (t === 6) {
      p = new PieceT(r, c, rot, board);
    }

    //do not spawn pieces outside the board
    p.c = min(p.c, board.cols - p.box[0].length);

    return p;
  }


  rotate() {
    this.rotation = (this.rotation + 1) % 4;
    this.box = this.getBox(this.rotation);
  }

  down() {
    this.r++;
  }

  moveH(amount) {
    this.c += amount;
  }

  right() {
    this.moveH(1);
  }

  left() {
    this.moveH(-1);
  }

  draw() {
    fill(this.color);
    stroke(0);
    for (let r = 0; r < this.box.length; r++) {
      for (let c = 0; c < this.box[r].length; c++) {
        if (this.box[r][c] === 1) {
          rect((this.c + c) * this.board.cellW, (this.r + r) * this.board.cellH, this.board.cellW, this.board.cellH);
        }
      }
    }
  }

}

class PieceO extends Piece {

  constructor(r, c, rot, board) {
    super(r, c, rot, board);
    this.color = [255, 255, 50];
  }

  copy(newR, newC, newRot, board) {
    return new PieceO(newR, newC, newRot, board);
  }

  getBox(rotation) {
    return [[1, 1], [1, 1]];
  }

}

class PieceI extends Piece {
  constructor(r, c, rot, board) {
    super(r, c, rot, board);
    this.color = [50, 255, 255];
  }

  copy(newR, newC, newRot, board) {
    return new PieceI(newR, newC, newRot, board);
  }

  getBox(rotation) {
    return (rotation + 1) % 2 !== 0 ? [[1, 1, 1, 1]] : [[1], [1], [1], [1]];
  }
}


class PieceS extends Piece {
  constructor(r, c, rot, board) {
    super(r, c, rot, board);
    this.color = [255, 50, 50];
  }

  copy(newR, newC, newRot, board) {
    return new PieceS(newR, newC, newRot, board);
  }

  getBox(rotation) {
    return (rotation + 1) % 2 !== 0 ? [[0, 1, 1], [1, 1, 0]] : [[1, 0], [1, 1], [0, 1]];
  }
}

class PieceZ extends Piece {
  constructor(r, c, rot, board) {
    super(r, c, rot, board);
    this.color = [50, 255, 50];
  }

  copy(newR, newC, newRot, board) {
    return new PieceZ(newR, newC, newRot, board);
  }

  getBox(rotation) {
    return (rotation + 1) % 2 !== 0 ? [[1, 1, 0], [0, 1, 1]] : [[0, 1], [1, 1], [1, 0]];
  }
}

class PieceL extends Piece {
  constructor(r, c, rot, board) {
    super(r, c, rot, board);
    this.color = [255, 255, 50];
  }

  copy(newR, newC, newRot, board) {
    return new PieceL(newR, newC, newRot, board);
  }

  getBox(rotation) {
    switch (rotation) {
      case 0:
        return [[0, 0, 1], [1, 1, 1]];
      case 1:
        return [[1, 0], [1, 0], [1, 1]];
      case 2:
        return [[1, 1, 1], [1, 0, 0]];
      case 3:
        return [[1, 1], [0, 1], [0, 1]];
    }
  }
}


class PieceJ extends Piece {
  constructor(r, c, rot, board) {
    super(r, c, rot, board);
    this.color = [255, 50, 255];
  }

  copy(newR, newC, newRot, board) {
    return new PieceJ(newR, newC, newRot, board);
  }

  getBox(rotation) {
    switch (rotation) {
      case 0:
        return [[1, 0, 0], [1, 1, 1]];
      case 1:
        return [[1, 1], [1, 0], [1, 0]];
      case 2:
        return [[1, 1, 1], [0, 0, 1]];
      case 3:
        return [[0, 1], [0, 1], [1, 1]];
    }
  }
}

class PieceT extends Piece {
  constructor(r, c, rot, board) {
    super(r, c, rot, board);
    this.color = [50, 50, 255];
  }

  copy(newR, newC, newRot, board) {
    return new PieceT(newR, newC, newRot, board);
  }

  getBox(rotation) {
    switch (rotation) {
      case 0:
        return [[1, 1, 1], [0, 1, 0]];
      case 1:
        return [[0, 1], [1, 1], [0, 1]];
      case 2:
        return [[0, 1, 0], [1, 1, 1]];
      case 3:
        return [[1, 0], [1, 1], [1, 0]];
    }
  }
}
