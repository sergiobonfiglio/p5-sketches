class TetrisGrid {
  constructor(rows, cols, w, h) {
    this.cellW = w;
    this.cellH = h;
    this.rows = rows;
    this.cols = cols;
    this.pieces = [];
    this.board = [];
    for (let r = 0; r < this.rows; r++) {
      this.board[r] = [];
      for (let c = 0; c < this.cols; c++) {
        this.board[r][c] = 0;
      }
    }
    this.gameover = false;
    this.movingH = 0;
    this.movingDown = 0;
    this.score = 0;
  }

  addPiece() {

    if (!this.gameover) {
      let randC = floor(random(0, this.cols));
      let piece = Piece.randPiece(0, randC, this);

      this.pieces.push(piece);
    }
  }


  nextStep() {

    if (!this.gameover) {

      if (this.pieces.length === 0) {
        this.addPiece();
      }

      for (let i = this.pieces.length - 1; i >= 0; i--) {
        let piece = this.pieces[i];
        let newPiece = piece.copy(piece.r + 1, piece.c, piece.rotation);

        if (this.collideWithBorders(newPiece) || this.collideWithGarbage(newPiece)) {
          if (piece.r <= 0) {
            //game over
            this.gameover = true;
          } else {
            this.pieces.splice(i, 1);//ok because we're iterating backwards

            //add to garbage
            for (let r = 0; r < piece.box.length; r++) {
              for (let c = 0; c < piece.box[r].length; c++) {
                this.board[r + piece.r][c + piece.c] += piece.box[r][c];
              }
            }

            //clear lines if necessary
            this.clearLines();

            this.addPiece();
          }
        } else {
          //update piece
          piece.down();
        }
      }
    }

  }

  clearLines() {
    let linesToClear = [];
    for (let r = this.rows - 1; r >= 0; r--) {
      //check if should clear line
      let shouldClear = true;
      for (let c = 0; c < this.cols; c++) {
        shouldClear &= this.board[r][c] !== 0;
      }
      if (shouldClear) {
        linesToClear.push(r);
        // console.log('clear line ' + r)
      }
    }

    this.score += 0.1 + 100 * Math.pow(2, linesToClear.length) * linesToClear.length;

    //clear lines and push down lines above
    for (let i = linesToClear.length - 1; i >= 0; i--) {
      let row = linesToClear[i];
      this.board.splice(row, 1);
      this.board.unshift(new Array(this.cols).fill(0));
      linesToClear.splice(i, 1);
    }
  }

  collideWithBorders(piece) {
    let [h, w] = [piece.box.length, piece.box[0].length];

    if (piece.r < 0 || piece.c < 0) {
      return true;
    }
    return piece.r + h > this.rows || piece.c + w > this.cols;
  }

  collideWithGarbage(piece) {
    for (let r = 0; r < piece.box.length; r++) {
      for (let c = 0; c < piece.box[r].length; c++) {
        if (this.board[r + piece.r][c + piece.c] === 1 && piece.box[r][c] !== 0) {
          return true;
        }
      }
    }
    return false;
  }


  moveH(amount) {
    if (this.pieces.length > 0) {
      let activePiece = this.pieces[0];
      let newPiece = activePiece.copy(activePiece.r, activePiece.c + amount, activePiece.rotation);

      if (!this.collideWithBorders(newPiece) && !this.collideWithGarbage(newPiece)) {
        this.pieces[0].moveH(amount);
      }
    }
  }

  moveHorizStart(amount) {
    this.movingH = amount;
  }

  moveHorizEnd() {
    this.movingH = 0;
  }

  moveDownStart() {
    this.movingDown = 1;
  }

  moveDownEnd() {
    this.movingDown = 0;
  }

  rotate() {
    if (this.pieces.length > 0) {
      let newPiece = this.pieces[0].copy(this.pieces[0].r, this.pieces[0].c, this.pieces[0].rotation);
      newPiece.rotate();

      if (!this.collideWithBorders(newPiece) && !this.collideWithGarbage(newPiece)) {
        this.pieces[0].rotate();
      } else {

      }
    }
  }

  draw() {
    if (!this.gameover && this.pieces.length > 0 &&
      this.movingH !== 0 && (frameCount) % 5 === 0) {
      this.moveH(this.movingH);
    }
    if (!this.gameover && this.pieces.length > 0 &&
      this.movingDown !== 0 && (frameCount) % 5 === 0) {
      this.nextStep();
    }
    // for (let i = 0; i < this.pieces.length; i++) {
    //   let p = this.pieces[i];
    //   for (let rp = 0; rp < p.box.length; rp++) {
    //     for (let cp = 0; cp < p.box[0].length; cp++) {
    //       let gridR = p.r + rp;
    //       let gridC = p.c + cp;
    //       this.board[gridR][gridC] = p.box[rp][cp] > 0 ? 2 : 0;
    //     }
    //   }
    // }
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (this.board[r][c] === 0) {
          fill(0);
        } else {
          fill(this.board[r][c] * 128);
        }
        rect(c * this.cellW, r * this.cellW, this.cellW, this.cellH);
      }
    }

    for (let i = 0; i < this.pieces.length; i++) {
      let p = this.pieces[i];
      p.draw();
    }

    if (this.gameover && frameCount % 120 < 60) {
      fill(255, 0, 0);
      textSize(36);
      textStyle(BOLD);
      textAlign(CENTER, CENTER);
      text("GAME OVER", 0, 0, width, height);
    }
  }

}