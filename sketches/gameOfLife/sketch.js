let grid;
let canvas;

let res = 5;

let fr;

function makeGrid(rows, cols) {

    let arr = new Array(rows);
    for (let r = 0; r < arr.length; r++) {
        arr[r] = new Array(cols);
    }

    return arr;
}

function countAliveNeighbours(arr, r, c) {
    let sum = 0.0;

    let radius = 1;
    let tot = radius * 2 * radius * 2 - 1;
    for (let i = r - radius; i <= r + radius; i++) {
        for (let j = c - radius; j <= c + radius; j++) {
            if (i !== r && j !== c) {
                let wrapI = i % arr.length;
                let wrapJ = j % arr[0].length;
                if (i < 0) {
                    wrapI = arr.length - 1;
                }
                if (j < 0) {
                    wrapJ = arr[0].length - 1;
                }

                sum += arr[wrapI][wrapJ].val;
            }
        }
    }
    return sum / tot; //max(8, random(16) );
}

function mouseDragged() {
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            grid[i][j].click();
        }

    }
}

function initGrid(arr) {
    for (let r = 0; r < arr.length; r++) {
        for (let c = 0; c < arr[r].length; c++) {
            arr[r][c] = new Cell(c, r, random(1));
        }
    }
}

function setup() {
    canvas = createCanvas(800, 600);


    let w = Math.floor(canvas.width / res);
    let h = Math.floor(canvas.height / res);

    grid = makeGrid(h, w);

    initGrid(grid);

    fr = createP('');
    frameRate(10);
}

function draw() {
    background(0);
    for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < grid[r].length; c++) {

            let cell = grid[r][c];
            if (cell.isAlive()) {
                fill(cell.val * 255);
                rect(cell.x * res, cell.y * res, res, res);
            }

        }
    }


    let next = makeGrid(grid.length, grid[0].length);

    for (let r = 0; r < next.length; r++) {
        for (let c = 0; c < next[r].length; c++) {

            let curCell = grid[r][c];
            //count alive neighbour
            let aliveNeighbours = countAliveNeighbours(grid, r, c);

            next[r][c] = new Cell(c, r, curCell.val);

            if (aliveNeighbours < 2 / 8.0) {
                next[r][c].kill();
            } else if (aliveNeighbours >= 2 / 8.0 && aliveNeighbours <= 3 / 8.0) {
                next[r][c].revive();
            } else if (aliveNeighbours > 3 / 8.0) {
                next[r][c].kill();
            }

        }
    }

    grid = next;


    fr.html(floor(frameRate()));
}

