document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    let squares = Array.from(document.querySelectorAll('.grid div'));
    const width = 10;
    const scoreDisplay = document.querySelector('#score');
    const startBtn = document.querySelector('#start_button');
    const resetBtn = document.querySelector('#reset_button');
    let nextRandom = 0;
    let score = 0;

    //The Tetrominoes
    const lTetromino = [
        [1, width + 1, width * 2 + 1, 2],
        [width, width + 1, width + 2, width * 2 + 2],
        [1, width + 1, width * 2 + 1, width * 2],
        [width, width * 2, width * 2 + 1, width * 2 + 2]
    ]

    const zTetromino = [
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1],
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1]
    ]

    const tTetromino = [
        [1, width, width + 1, width + 2],
        [1, width + 1, width + 2, width * 2 + 1],
        [width, width + 1, width + 2, width * 2 + 1],
        [1, width, width + 1, width * 2 + 1]
    ]

    const oTetromino = [
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1]
    ]

    const iTetromino = [
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3],
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3]
    ]

    const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];

    let currentPosition = 4;
    let currentRotation = 0;

    //random select a tetromino
    let random = Math.floor(Math.random() * theTetrominoes.length);
    let current = theTetrominoes[random][currentRotation];

    //draw the tetromino
    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino');
        });
    };
    //undraw the tetromino
    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino');
        });
    };

    //move Down
    let timerID = setInterval(moveDown, 1000);

    //assigh function to keyCodes
    function control(e) {
        console.log('keydown');
        if (e.keyCode === 37 && scoreDisplay.innerHTML != 'end') {
            moveLeft();
        }
        else if (e.keyCode === 38 && scoreDisplay.innerHTML != 'end') {
            rotate();
        }
        else if (e.keyCode === 39 && scoreDisplay.innerHTML != 'end') {
            moveRight();
        }
        else if (e.keyCode === 40 && scoreDisplay.innerHTML != 'end') {
            moveDown();
        }
        else if (e.altKey && e.keyCode === 82) {
            location.reload();
        }
        else if (e.keyCode === 80) {
            start_pause();
        }
    }
    document.addEventListener('keydown', control);

    //move Down Function
    function moveDown() {
        undraw();
        currentPosition += width;
        draw();
        freeze();
        gameOver();
    };
    function holdDown() {
    };

    //freeze function
    function freeze() {
        if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
            current.forEach(index => squares[currentPosition + index].classList.add('taken'));
            //start a new tetromino
            random = nextRandom;
            nextRandom = Math.floor(Math.random() * theTetrominoes.length);
            current = theTetrominoes[random][currentRotation];
            currentPosition = 4;
            draw();
            displayShape();
            addScore();
        }
    };



    //left edge
    function moveLeft() {
        undraw();
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);
        if (!isAtLeftEdge) {
            currentPosition -= 1;
        }
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition += 1;
        }
        draw();
    };
    //right edge
    function moveRight() {
        undraw();
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === width - 1);
        if (!isAtLeftEdge) {
            currentPosition += 1;
        }
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition -= 1;
        }
        draw();
    };
    //rotate tetramino
    function rotate() {
        undraw();
        currentRotation++;
        if (currentRotation === current.length) {
            currentRotation = 0;
        }
        current = theTetrominoes[random][currentRotation];
        draw();
    };

    //mini-grid showup
    const displaySquares = document.querySelectorAll('.mini_grid div');
    const displayWidth = 4;
    let displayIndex = 0;

    //the tetrominos without rotations
    const upNextTetrominoes = [
        [1, displayWidth + 1, displayWidth * 2 + 1, 2], //lTetromino
        [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], //zTetromino
        [1, displayWidth, displayWidth + 1, displayWidth + 2], //tTetromino
        [0, 1, displayWidth, displayWidth + 1], //oTetromino
        [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1] //iTetromino
    ]

    //display the shape in the mini-grind
    function displayShape() {
        displaySquares.forEach(square => {
            square.classList.remove('tetromino');
        });
        upNextTetrominoes[nextRandom].forEach(index => {
            displaySquares[displayIndex + index].classList.add('tetromino');
        });
    }

    //add pause/start
    function start_pause() {
        if (timerID) {
            clearInterval(timerID);
            timerID = null;
        } else {
            draw();
            timerID = setInterval(moveDown, 1000);
            displayShape();
        }
    }
    startBtn.addEventListener('click', () => {
        start_pause();
    });
    resetBtn.addEventListener('click', () => {
        location.reload();
    })

    //add score
    function addScore() {
        for (let i = 0; i < 199; i += width) {
            const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9]

            if (row.every(index => squares[index].classList.contains('taken'))) {
                score += 10;
                scoreDisplay.innerHTML = score;
                row.forEach(index => {
                    squares[index].classList.remove('taken')
                    squares[index].classList.remove('tetromino')
                    squares[index].style.backgroundColor = ''
                })
                const squaresRemoved = squares.splice(i, width);
                squares = squaresRemoved.concat(squares);
                squares.forEach(cell => grid.appendChild(cell));
            }
        }
    }

    //game over
    function gameOver() {
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            scoreDisplay.innerHTML = 'end';
            clearInterval(timerID);
        }
    }
});