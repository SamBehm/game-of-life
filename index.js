const Status = {
        DEAD: 0,
        ALIVE: 1
}

class Cell {
        constructor(status) {
                this.status = status;
                this.newStatus = Status.DEAD;
        }
}

const canvas = document.getElementById("frame");
const context = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var numCellsX = 1000;
var cellDimensions = canvas.width / (numCellsX + 1);
var numCellsY = Math.floor(canvas.height / cellDimensions);

var cells = new Array(numCellsX);

var tickRate = 7; // updates / second

for (let i = 0; i < numCellsX; i++) {
        cells[i] = new Array(numCellsY);
}

for (let x = 0; x < numCellsX; x++) {
        for (let y = 0; y < numCellsY; y++) {
                cells[x][y] = new Cell(Status.DEAD);
        }
}

function checkNeighbours(x, y) {
        let numAlive = 0;
        for (let i = -1; i < 2; i++) {
                for (j = -1; j < 2; j++) {
                        if (i == 0 && j == 0) continue;

                        if (x + i < 0 || x + i >= numCellsX) {
                                continue;
                        }

                        if (y + j < 0 || y + j >= numCellsY) {
                                continue;
                        }

                        if (cells[x + i][y + j].status == Status.ALIVE) {
                                numAlive++;
                        }
                }
        }
        return numAlive;
}

function updateCell(x, y) {
        let n = checkNeighbours(x, y); // number of alive neighbours

        if (cells[x][y] == Status.ALIVE) {
                cells[x][y].newStatus = (n != 2 && n != 3) ? Status.DEAD : Status.ALIVE;
        } else {
                cells[x][y].newStatus = (n == 3) ? Status.ALIVE : Status.DEAD;
        }
}

function updateCells() {
        for (let x = 0; x < numCellsX; x++) {
                for (let y = 0; y < numCellsY; y++) {
                        updateCell(x, y);
                }
        }
}

function clear() {
        context.fillStyle = "black";
        context.fillRect(0, 0, canvas.width, canvas.height);
}

function draw() {
        clear();
        updateCells();

        for (let x = 0; x < numCellsX; x++) {
                for (let y = 0; y < numCellsY; y++) {
                        if (cells[x][y].status == Status.ALIVE) {
                                context.filLStyle = "white";
                                context.fillRect(x + 1, y + 1, cellDimensions, cellDimensions);
                        }
                }
        }
}


function gameLoop() {
        draw();
        setTimeout(gameLoop, 1000 / tickRate);
}


gameLoop();