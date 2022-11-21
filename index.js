const Status = {
        DEAD: 0,
        ALIVE: 1
}

class Cell {
        constructor(s) {
                this.status = s;
                this.newStatus = Status.DEAD;
        }
}

var canvas;
var context;

const cellGap = 2;      /* space between each cell */
var cellDimensions;

const numCellsX = 100;
var numCellsY;


var cells;              /* 2d array of cells */

var currentKey;
var mouseDown = false;

var tickRate = 4;       /* updates / second */
var gameRunning = false;

title = ["111111  111   1 1  11111     111  11111   1     11111 11111 11111",
        "1    1 1   1 1 1 1 1        1   1 1       1       1   1     1",
        "1      1   1 1 1 1 1        1   1 1111    1       1   1111  1",
        "1  111 11111 1   1 111      1   1 1       1       1   1     111",
        "1    1 1   1 1   1 1        1   1 1       1       1   1     1",
        "111111 1   1 1   1 11111     111  1       11111 11111 1     11111"];

function getCellPosition(screenX, screenY) {
        let x = Math.floor((screenX - cellGap) / (cellDimensions + cellGap));
        let y = Math.floor((screenY - cellGap) / (cellDimensions + cellGap));
        return [x, y];
}

function checkNeighbours(x, y) {
        let numAlive = 0;
        for (let i = -1; i < 2; i++) {
                for (let j = -1; j < 2; j++) {
                        if (i == 0 && j == 0) {
                                continue;
                        }

                        if (x + i < 0 || x + i >= numCellsX) {
                                continue;
                        }

                        if (y + j < 0 || y + j >= numCellsY) {
                                continue;
                        }

                        if (cells[x + i][y + j].status == Status.ALIVE) {
                                numAlive++;
                        }

                        if (numAlive > 3) {
                                return 4;
                        }
                }
        }
        return numAlive;
}

function resetCells() {
        for (let x = 0; x < numCellsX; x++) {
                for (let y = 0; y < numCellsY; y++) {
                        cells[x][y].status = Status.DEAD;
                }
        }
}

function updateCell(x, y) {
        let n = checkNeighbours(x, y); // number of alive neighbours

        if (cells[x][y].status == Status.ALIVE) {
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

        for (let x = 0; x < numCellsX; x++) {
                for (let y = 0; y < numCellsY; y++) {
                        cells[x][y].status = cells[x][y].newStatus;

                        if (cells[x][y].status == Status.ALIVE) draw(x, y);
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
                                draw(x, y);
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

function draw(cellX, cellY) {
        if (cellX >= numCellsX || cellY >= numCellsY) return;

        context.fillStyle = "white";
        context.fillRect((cellX * cellDimensions) + (cellX * cellGap),
                (cellY * cellDimensions) + (cellY * cellGap),
                cellDimensions, cellDimensions);
}


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
                        case 'c':
                                resetCells();
                                clear();
                                break;

                }

        });

        document.addEventListener("mousedown", (event) => {
                if (event.isComposing || gameRunning) return;

                if (!mouseDown) {
                        let mouseX = event.clientX - canvas.offsetLeft;
                        let mouseY = event.clientY - canvas.offsetTop;
                        let cellPosition = getCellPosition(mouseX, mouseY);
                        cells[cellPosition[0]][cellPosition[1]].status = Status.ALIVE;
                        draw(cellPosition[0], cellPosition[1]);
                }

                mouseDown = true;
        });

        document.addEventListener("mouseup", (event) => {
                if (event.isComposing) return;
                mouseDown = false;
        });

        document.addEventListener("mouseout", (event) => {
                if (event.isComposing) return;
                mouseDown = false;
        });

        document.addEventListener("mousemove", (event) => {
                if (event.isComposing) return;

                if (mouseDown) {
                        let mouseX = event.clientX - canvas.offsetLeft;
                        let mouseY = event.clientY - canvas.offsetTop;
                        let cellPosition = getCellPosition(mouseX, mouseY);
                        cells[cellPosition[0]][cellPosition[1]].status = Status.ALIVE;
                        draw(cellPosition[0], cellPosition[1]);
                }
        });
}

function initGame() {
        clear();
        initListeners();
}

/**
 * Waits for a number of milliseconds.
 * 
 * Credit to Dan Dascalescu for his answer in StackOverflow!
 * (from post https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep)
 * @param {*} ms 
 * @returns Promise
 */
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function initSplashScreen() {

        let titleCoords = [];
        let filledTitleCoords = [];
        let lineNum = 0;

        let length = 0;
        for (const line of title) {
                if (line.length > length) length = line.length;
        }

        length = Math.floor(length / 2);

        for (const line of title) {
                for (let i = 0; i < line.length; i++) {
                        if (line[i] == '1') {
                                titleCoords.push(
                                        [i + Math.floor(numCellsX / 2) - length,
                                        lineNum + Math.floor(numCellsY / 2) - Math.floor(title.length / 2)]
                                );
                        }

                }
                lineNum++;
        }

        let y = 0;
        while (y < numCellsY * 3) { // this can be improved with some geometry
                clear();
                let dY = y;
                let x = 0;

                for (const coord of filledTitleCoords) {
                        draw(coord[0], coord[1]);
                }

                while (dY >= 0) {
                        let index = titleCoords.findIndex(coord => coord[0] == x && coord[1] == dY);
                        if (index != -1) {
                                cells[x][dY].status = Status.ALIVE;
                                filledTitleCoords.push(titleCoords[index]);
                        }
                        draw(x, dY);
                        dY--;
                        x++;
                }
                y++;

                await sleep(10);
        }

        await sleep(1000);

        let temp = tickRate;
        tickRate = 30;
        gameRunning = true;
        gameLoop();

        await sleep(3000);

        gameRunning = false;
        tickRate = temp;

        resetCells();

        return;
}

async function init() {
        canvas = document.getElementById("frame");
        context = canvas.getContext('2d');

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let remaindingWidth = canvas.width - ((numCellsX + 1) * cellGap);
        cellDimensions = remaindingWidth / numCellsX;

        numCellsY = Math.floor((canvas.height - cellGap) / (cellDimensions + cellGap));
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

        await initSplashScreen();
        initGame();
}