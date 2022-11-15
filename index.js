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

var currentKey;
var canvas;
var context;

const numCellsX = 200;
var cellDimensions;
var numCellsY;

var cells;

const tickRate = 7; // updates / second
var gameRunning = false;


function initListeners() {
        document.addEventListener("keydown", (event) => {

                if (event.isComposing) {
                        return;
                }

                switch (event.key) {
                        case 's':
                                gameRunning = true;
                                gameLoop();
                                break;
                        case 'e':
                                gameRunning = false;
                                break;
                }

        });
}

function init() {
        canvas = document.getElementById("frame");
        context = canvas.getContext('2d');

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        cellDimensions = canvas.width / (numCellsX + 1);
        numCellsY = Math.floor(canvas.height / cellDimensions);

        cells = new Array(numCellsX);

        gameRunning = false;

        for (let i = 0; i < numCellsX; i++) {
                cells[i] = new Array(numCellsY);
        }

        for (let x = 0; x < numCellsX; x++) {
                for (let y = 0; y < numCellsY; y++) {
                        cells[x][y] = new Cell(Status.DEAD);
                }
        }

        cells[20][20].status == Status.ALIVE;
        cells[21][20].status == Status.ALIVE;
        cells[20][21].status == Status.ALIVE;
        cells[21][21].status == Status.ALIVE;

        initListeners();
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

        if (cells[x][y].status == Status.ALIVE) {
                cells[x][y].newStatus = (n != 2 && n != 3) ? Status.DEAD : Status.ALIVE;
                console.log(`${x} ${y}`);
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

        for (let x = 0; x < numCellsX; x++) {
                for (let y = 0; y < numCellsY; y++) {
                        cells[x][y].status = cells[x][y].newStatus;
                }
        }
}

function clear() {
        context.fillStyle = "black";
        context.fillRect(0, 0, canvas.width, canvas.height);
}

function updateCanvas() {
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
        if (gameRunning) {
                updateCanvas();
                setTimeout(gameLoop, 1000 / tickRate);
        }
}