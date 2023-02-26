var gameBoard = [[]];
var switchCellStatus = [];
var gameInterval = null;

// Game settings
const boardSize = 30;
const iterationInterval = 300;

const logGameBoard = () => {
    console.log(gameBoard);
};

const resumeGame = () => {
    gameInterval = setInterval(gameOfLifeIteration, iterationInterval);
    document.getElementById("resume-game").disabled = true;
    document.getElementById("pause-game").disabled = false;
};

const pauseGame = () => {
    clearInterval(gameInterval);
    document.getElementById("resume-game").disabled = false;
    document.getElementById("pause-game").disabled = true;
};

// ------------------------------

window.addEventListener("load", function () {
    initGameBoard();
    displayGameBoard();
    gameInterval = setInterval(gameOfLifeIteration, iterationInterval);
});

const initGameBoard = () => {
    for (var i = 0; i < boardSize; i++) {
        gameBoard[i] = Array.from({ length: boardSize }, () => {
            const result = Math.floor(Math.random() * 100);
            return result < 45 ? 0 : result < 99 ? 1 : 2;
        });
    }
};

const displayGameBoard = () => {
    const board = document.getElementById("game-board");

    for (var i = 0; i < gameBoard.length; i++) {
        const row = document.createElement("div");
        row.classList.add("row");
        for (var j = 0; j < gameBoard[i].length; j++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.classList.add(gameBoard[i][j] === 1 ? "alive" : gameBoard[i][j] === 2 ? "border" : "dead");

            ((i, j) => {
                cell.onclick = () => {
                    switchCellStatus.push({
                        i: i,
                        j: j,
                        value: gameBoard[i][j] === 2 ? 2 : gameBoard[i][j] === 1 ? 0 : 1,
                    });
                };
            })(i, j);

            row.appendChild(cell);
        }
        board.appendChild(row);
    }
};

const updateGameBoard = () => {
    const board = document.getElementById("game-board");
    const rows = board.getElementsByClassName("row");
    for (var i = 0; i < rows.length; i++) {
        const cells = rows[i].getElementsByClassName("cell");
        for (var j = 0; j < cells.length; j++) {
            switch (gameBoard[i][j]) {
                case 0:
                    cells[j].classList.remove("alive");
                    cells[j].classList.add("dead");
                    break;
                case 1:
                    cells[j].classList.remove("dead");
                    cells[j].classList.add("alive");
                    break;
                case 2:
                    cells[j].classList.remove("dead");
                    cells[j].classList.remove("alive");
                    cells[j].classList.add("border");
                    break;
            }
        }
    }
};

const gameOfLifeIteration = () => {
    const newBoard = gameBoard.map((row, i) => {
        return row.map((cell, j) => {
            const neighbors = getNeighborsCount(i, j);
            const aliveNeighborsCount = neighbors.filter((neighbor) => neighbor === 1 || neighbor === 2).length;

            if (cell === 2) {
                return 2;
            } else if (cell === 1) {
                if (aliveNeighborsCount < 2 || aliveNeighborsCount > 3) {
                    return 0;
                } else {
                    return 1;
                }
            } else {
                if (aliveNeighborsCount === 3) {
                    return 1;
                } else {
                    return 0;
                }
            }
        });
    });

    if (switchCellStatus.length > 0) {
        switchCellStatus.forEach((cell) => {
            newBoard[cell.i][cell.j] = cell.value;
        });
        switchCellStatus = [];
    }

    gameBoard = newBoard;
    updateGameBoard();
};

const getNeighborsCount = (i, j) => {
    const neighbors = [];
    for (var x = -1; x <= 1; x++) {
        for (var y = -1; y <= 1; y++) {
            if (x === 0 && y === 0) {
                continue;
            }
            neighbors.push(gameBoard[i + x]?.[j + y] ?? 0);
        }
    }
    return neighbors;
};
