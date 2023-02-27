var gameBoard = [[]];
var switchCellStatus = [];
var gameInterval = null;

// Game settings
const boardSize = 50;
const iterationInterval = 500;

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

    const patternPosSelectors = document.querySelectorAll("#pattern-pos-selectors > input[type='range']");
    patternPosSelectors.forEach((inputRange) => {
        inputRange.max = boardSize - 1;

        const output = this.document.getElementById(inputRange.id + "-output");
        output.textContent = inputRange.value;
        inputRange.addEventListener("input", (event) => {
            output.textContent = event.target.value
        })
    });
});



const clearPatternOverlapped = () => {
    document.querySelectorAll(".pattern-overlapped").forEach((cell) => cell.classList.remove("pattern-overlapped"));
}

const displayPattern = (pattern) => {
    const patternPosSelectors = document.querySelectorAll("#pattern-pos-selectors > input[type='range']");
    const patternPosX = parseInt(patternPosSelectors[0].value);
    const patternPosY = parseInt(patternPosSelectors[1].value);

    const patternData = getPatternData(pattern);

    const board = document.getElementById("game-board");
    const rows = board.getElementsByClassName("row");

    patternData.forEach((cell) => {
        const cellElement = rows[cell.y + patternPosY]?.getElementsByClassName("cell")[cell.x + patternPosX];
        cellElement?.classList.add("pattern-overlapped");
    });
}

const applyPattern = (pattern) => {
    const patternPosSelectors = document.querySelectorAll("#pattern-pos-selectors > input[type='range']");
    const patternPosX = parseInt(patternPosSelectors[0].value);
    const patternPosY = parseInt(patternPosSelectors[1].value);

    const patternData = getPatternData(pattern);

    patternData.forEach((cell) => {
        switchCellStatus.push({
            i: cell.y + patternPosY,
            j: cell.x + patternPosX,
            value: 1,
        });
    });
}

const getPatternData = (pattern) => {
    switch (pattern) {
        case "glider":
            return [{
                x: 0,
                y: 0,
            },{
                x: 1,
                y: 0,
            },{
                x: 2,
                y: 0,
            },{
                x: 0,
                y: 1,
            },{
                x: 1,
                y: 2,
            }];
            case "glider-gun":
                return [{
                    x: 0,
                    y: 0,
                },{
                    x: 1,
                    y: 0,
                },{
                    x: 0,
                    y: 1,
                },{
                    x: 1,
                    y: 1,
                },{
                    x: 10,
                    y: 0,
                },{
                    x: 10,
                    y: 1,
                },{
                    x: 10,
                    y: 2,
                },{
                    x: 11,
                    y: -1,
                },{
                    x: 11,
                    y: 3,
                },{
                    x: 12,
                    y: -2,
                },{
                    x: 12,
                    y: 4,
                },{
                    x: 13,
                    y: -2,
                },{
                    x: 13,
                    y: 4,
                },{
                    x: 14,
                    y: 1,
                },{
                    x: 15,
                    y: -1,
                },{
                    x: 15,
                    y: 3,
                },{
                    x: 16,
                    y: 0,
                },{
                    x: 16,
                    y: 1,
                },{
                    x: 16,
                    y: 2,
                },{
                    x: 17,
                    y: 1,
                },{
                    x: 20,
                    y: 0,
                },{
                    x: 20,
                    y: -1,
                },{
                    x: 20,
                    y: -2,
                },{
                    x: 21,
                    y: 0,
                },{
                    x: 21,
                    y: -1,
                },{
                    x: 21,
                    y: -2,
                },{
                    x: 22,
                    y: -3,
                },{
                    x: 22,
                    y: 1,
                },{
                    x: 24,
                    y: -4,
                },{
                    x: 24,
                    y: -3,
                },{
                    x: 24,
                    y: 1,
                },{
                    x: 24,
                    y: 2,
                },{
                    x: 34,
                    y: -2,
                },{
                    x: 35,
                    y: -2,
                },{
                    x: 34,
                    y: -1,
                },{
                    x: 35,
                    y: -1,
                }];
    }
}

const initGameBoard = () => {
    for (var i = 0; i < boardSize; i++) {
        gameBoard[i] = Array.from({ length: boardSize }, () => {
            const result = Math.floor(Math.random() * 100);
            //return result < 40 ? 0 : result < 100 ? 1 : 2;
            return 0
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
        console.log(switchCellStatus);
        console.log(newBoard.toString());
        switchCellStatus.forEach((cell) => {
            newBoard[cell.i][cell.j] = cell.value;
        });
        switchCellStatus = [];
        console.log(newBoard.toString());
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
