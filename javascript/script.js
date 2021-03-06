console.log('Hello')
const canvas = document.querySelector('#canvas')
const ctx = canvas.getContext('2d')
const nextBlock = document.querySelector('#nextBlock')
const blockContext = nextBlock.getContext('2d')
const scoreboard = document.querySelector('#scoreboard')
const scorePoint = document.querySelector('#score')
const rowTotal = document.querySelector('#rowTotal')
const newGame = document.querySelector('#new')
const pause = document.querySelector('.pause')
const lastScorePoint = document.querySelector('#last-score')
const lastRows = document.querySelector('#last-rows')
const body = document.querySelector('body')
let playing = true
let lastScore
let lastRowsCleared
let imageSet = ['forest', 'beach', 'ocean','meadow']
// const tetrisDivider = document.querySelector('#tetris')
// console.log(canvas)
// Tetris is a grid with a pre-set amount of columns and rows. Canvas dimensions will be scaled to my boxSize which is the size of one square. Looked up the scale method in MDN.
const rows = 20
const col = 10
const boxSize = 30
canvas.width = col * boxSize
canvas.height = rows * boxSize
ctx.scale(boxSize, boxSize)
nextBlock.width = col * boxSize
nextBlock.height = rows * boxSize / 2
// tetrisDivider.style.maxHeight = canvas.height

// Tetrominoes!!!! After researching games that had grid arrangement like chess or checkers, decided to make Tetris using arrays in matrix format. The tetrominoes are called T,I,J,L,O,Z, and S.
function createPiece(shape) {
    switch (shape) {
        case 'T': return [
            [0, 1, 0],
            [1, 1, 1],
            [0, 0, 0]
        ]
        case 'O': return [
            [2, 2],
            [2, 2]
        ]
        case 'S': return [
            [0, 3, 3],
            [3, 3, 0],
            [0, 0, 0]
        ]
        case 'Z': return [
            [4, 4, 0],
            [0, 4, 4],
            [0, 0, 0]
        ]
        case 'J': return [
            [5, 0, 0],
            [5, 5, 5],
            [0, 0, 0]
        ]
        case 'L': return [
            [0, 0, 6],
            [6, 6, 6],
            [0, 0, 0]
        ]
        case 'I': return [
            [0, 0, 0, 0],
            [7, 7, 7, 7],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ]
    }
}
// console.log(createPiece('T'))
// Drawing logic if given a tetromino. Using array accessing logic of array[row][column] === value of that coordinate, will draw the tetromino using forEach as it's an array and forEach simulates accessing the matrix in a (y,x) manner. 
// Canvas fillRect method syntax: fillRect(x, y, width, height)
// Therefore, tetris logic dictates it's 
// ctx.fillRect(row, column, 1, 1). ctx.scale takes care of the scaling way up there.
const currentPiece = {
    x: 4,
    y: 0,
    shape: createPiece('T'),
}
let bag = ['T', 'T', 'T', 'T', 'O', 'O', 'O', 'O', 'L', 'L', 'L', 'L', 'S', 'S', 'S', 'S', 'Z', 'Z', 'Z', 'Z', 'I', 'I', 'I', 'I', 'J', 'J', 'J', 'J']
let nextPiece = []
let savedPiece = []
let swapped = false
const board = []
for (let y = 0; y < rows; y++) {
    // further research made the for x loop obsolete. Array() takes in desired length as the argument.
    board.push(new Array(col))
    board[y].fill(0)
    // for(let x = 0; x < col; x++){
    //     // board[y][x] = 0
    // }
}
function checkColor(val) {
    switch (val) {
        case 1: return 'fuchsia' //Purple
        case 2: return '#ffff00' //Yellow
        case 3: return 'lime'    //Green
        case 4: return '#ff2800' //Red
        case 5: return 'blue'    //Blue
        case 6: return '#ff8c00' //Orange
        case 7: return 'cyan'    //Cyan
        default: return 'pink'
    }
}

function changePiece(piece) {
    if (nextPiece.length === 0) {
        nextPiece = createPiece((bag.splice(Math.floor(Math.random() * bag.length), 1)[0]))
        console.log(nextPiece)
    }
    // console.log(nextPiece)
    piece.shape = nextPiece
    nextPiece = createPiece((bag.splice(Math.floor(Math.random() * bag.length), 1)[0]))
    if (bag.length < 1) {
        bag = ['T', 'T', 'T', 'T', 'O', 'O', 'O', 'O', 'L', 'L', 'L', 'L', 'S', 'S', 'S', 'S', 'Z', 'Z', 'Z', 'Z', 'I', 'I', 'I', 'I', 'J', 'J', 'J', 'J']
    }
    if (nextPiece.length === 0) {
        nextPiece.push(bag.splice(Math.floor(Math.random() * bag.length), 1))
    }
    // console.log(nextPiece)
}
changePiece(currentPiece)

function savePiece() {
    if (savedPiece.length < 1) {
        savedPiece.push(currentPiece.shape)
        // console.log(savedPiece)
        reset(currentPiece)
        swapped = true
        drawNextPieceDisplay()
    } else if (swapped) {
        console.log('swapped already')
    } else {
        savedPiece.push(currentPiece.shape)
        // console.log(savedPiece)
        currentPiece.shape = savedPiece.shift()
        // console.log(currentPiece.shape)
        // console.log(savedPiece)
        // console.log(bag)
        currentPiece.x = 4
        currentPiece.y = 0
        if (checkOccupied(board, currentPiece)) {
            gameReset()
        }
        swapped = true
        drawNextPieceDisplay()
    }

}
function reset(piece) {
    changePiece(piece)
    // console.log(piece.shape)
    piece.x = 4
    piece.y = 0
    if (checkOccupied(board, piece)) {
        gameReset()
    }
    if (board[0].some(val => val > 0)) {
        gameReset()
    }
    // console.log(bag)
    // console.log(nextPiece)
    // console.log(currentPiece.shape)
}
function gameReset() {
    bag = ['T', 'T', 'T', 'T', 'O', 'O', 'O', 'O', 'L', 'L', 'L', 'L', 'S', 'S', 'S', 'S', 'Z', 'Z', 'Z', 'Z', 'I', 'I', 'I', 'I', 'J', 'J', 'J', 'J']
    lastScore = score
    lastRowsCleared = rowsCleared
    score = 0
    rowsCleared = 0
    savedPiece = []
    swapped = false
    if (!playing) {
        pauseGame()
    }
    nextPiece = []
    board.forEach(row => (row.fill(0)))
    changePiece(currentPiece)
    currentPiece.x = 4
    currentPiece.y = 0
    dropInterval = 1000
    updateSpeed()
    drawNextPieceDisplay()
    lastScorePoint.innerText = `Last Score: ${lastScore}`
    lastRows.innerText = `Last Rows Cleared: ${lastRowsCleared}`
    scorePoint.innerText = `Score: ${score}`
    rowTotal.innerText = `Rows Cleared: ${rowsCleared}`
    body.style.backgroundImage = 'url(../images/meadow.jpg)'
    imageSet = ['forest', 'beach', 'ocean','meadow']
}

function drawPiece(piece, move) {
    piece.forEach((row, y) => {
        row.forEach((val, x) => {
            if (val !== 0) {
                ctx.fillStyle = checkColor(val)
                ctx.lineWidth = .05
                ctx.strokeRect(x + move.x, y + move.y, 1, 1)
                ctx.fillRect(x + move.x, y + move.y, 1, 1)
            }
        })
    })
}

blockContext.font = '15px sans-serif'
blockContext.fillText('Next Block', 90, 18, 100)
blockContext.fillText('Saved Block', 84, 158, 100)

function drawNextPiece(piece, xChange, yChange, scale) {
    // console.log(currentPiece)
    // console.log(nextPiece)
    piece.forEach((row, y) => {
        row.forEach((val, x) => {
            if (val !== 0) {
                // console.log(val)
                blockContext.fillStyle = checkColor(val)
                blockContext.fillRect((x + xChange) * scale / 1.5, (y + yChange) * scale / 1.5, scale / 1.5, scale / 1.5)
            }
        })
    })
}
function drawNextPieceDisplay() {
    blockContext.fillStyle = 'black'
    blockContext.fillRect(boxSize + 50, boxSize * .75, boxSize / 2 * 6.2, boxSize / 2 * 6.2)
    blockContext.fillRect(boxSize + 50, boxSize * .75 + 140, boxSize / 2 * 6.2, boxSize / 2 * 6.2)
    drawNextPiece(nextPiece, 4.5, 2, boxSize)
    if (savedPiece.length > 0) {
        // console.log('hello')
        drawNextPiece(savedPiece[0], 4.5, 8.6, boxSize)
    }
}
// console.log(nextPiece[0][0])
// drawNextPiece(nextPiece[0])
// I've decided to make another array to save my values to simulate tetrominoes freezing in place. The array will be a matrix like the tetrominoes but in 20x10 dimensions. Reminder :increasing y value increases the row count while x increases column count.
// This for loop is to create my board. Using similiar accessing logic as my drawPiece function to make my board matrix. Looked up how to make an array, using new Array() method
// console.log(board)
function drawBoard(board) {
    board.forEach((row, y) => {
        row.forEach((val, x) => {
            if (val !== 0) {
                ctx.fillStyle = checkColor(val)
                ctx.lineWidth = .05
                ctx.strokeRect(x, y, 1, 1)
                ctx.fillRect(x, y, 1, 1)
            }
        })
    })
}
drawNextPieceDisplay()

function drawGame() {
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    for (let i = 0; i < col; i++) {
        ctx.fillStyle = "gray"
        ctx.fillRect(i, 0, .005, canvas.height)
    }
    for (let i = 0; i < rows; i++) {
        ctx.fillStyle = "gray"
        ctx.fillRect(0, i, canvas.width, .005)
    }
    drawBoard(board)
    drawPiece(currentPiece.shape, currentPiece)
    // drawNextPieceDisplay()
}

let timeNow = 0
let lastTime = 0
let timeDiff = 0
let dropInterval = 1000
let rowsCleared = 0
let score = 0

function updateSpeed() {
    if (dropInterval > 500) {
        dropInterval = dropInterval - (rowsCleared * 10)
    } else if (dropInterval !== 500) {
        dropInterval = 500
    }
}

function dropPiece(time) {
    currentPiece.y++
    // console.log(checkOccupied(board, currentPiece))
    if (checkOccupied(board, currentPiece)) {
        currentPiece.y--
        freeze(board, currentPiece)
        reset(currentPiece)
        clearLine()
        drawNextPieceDisplay()
        swapped = false
        updateSpeed()
    }
    return lastTime = time
}

function update(time) {
    // let lastTime = 0 If I did this, the requestAnimationFrame function will continuously set my variable to 0. Put it outside.
    // console.log(time)
    timeNow = time
    timeDiff = timeNow - lastTime
    // console.log(timeDiff)
    if (timeDiff > dropInterval) {
        dropPiece(timeNow)
    }
    drawGame()
    if (playing) {
        requestAnimationFrame(update)
    } else {
        ctx.fillStyle = 'silver'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.font = "1px sans-serif"
        ctx.strokeText("Paused", canvas.width / (3 * boxSize), canvas.height / (2 * boxSize))
    }
}
update()
// using logic established in drawPiece to access currentPiece and copy it to my game board
function freeze(board, piece) {
    piece.shape.forEach((row, y) => {
        row.forEach((val, x) => {
            if (val !== 0)
                board[y + currentPiece.y][x + currentPiece.x] = val
        })
    })
    // console.log(board)
}
function checkOccupied(board, piece) {
    for (let y = 0; y < piece.shape.length; y++) {
        for (let x = 0; x < piece.shape[y].length; x++) {
            if (piece.shape[y][x] !== 0 &&
                (board[y + piece.y] && board[y + piece.y][x + piece.x]) !== 0) {
                return true
            }
        }
    }
    return false
}
function clearLine() {
    let sameRows = 0
    for (let y = board.length - 1; y > 0; y--) {
        if (!board[y].some(val => val === 0)) {
            const row = board.splice(y, 1)[0].fill(0)
            board.unshift(row)
            y++
            rowsCleared++
            sameRows++
            score += 10 * sameRows ** 2
            changeBackground()
        }
    }
    scorePoint.innerText = `Score: ${score}`
    rowTotal.innerText = `Rows Cleared: ${rowsCleared}`
}
// console.log(board)
// const T = [
//     [1, 2, 3],
//     [4, 5, 6],
//     [7, 8, 9]
// ]
// const T = [
//     [1, 4, 7],
//     [2, 5, 8],
//     [3, 6, 9]
// ]
// const T = [
//     [7, 4, 1],
//     [8, 5, 2],
//     [9, 6, 3]
// ]
function rotate(piece, direction) {
    for (let y = 0; y < piece.shape.length; y++) {
        for (let x = 0; x < y; x++) {
            [piece.shape[y][x], piece.shape[x][y]] = [piece.shape[x][y], piece.shape[y][x]]
        }
    }
    if (direction > 0) {
        piece.shape.forEach(array => {
            array.reverse()
        })
        // console.log(piece)
    } else if (direction < 0) {
        piece.shape.reverse()
        // console.log(piece)
    }
    // console.log(piece.shape)
}
// rotate(currentPiece, 1)
// rotate(currentPiece, -1)
function rotateCurrentPiece(direction) {
    const originalX = currentPiece.x
    let buffer = 1
    rotate(currentPiece, direction)
    while (checkOccupied(board, currentPiece)) {
        currentPiece.x += buffer
        buffer = -(buffer + (buffer > 0 ? 1 : -1))
        if (buffer > currentPiece.shape.length) {
            rotate(currentPiece, -direction)
            currentPiece.x = originalX
            return
        }
    }
}
function move(direction) {
    currentPiece.x += direction
    if (checkOccupied(board, currentPiece)) {
        currentPiece.x -= direction
    }
}
function dropDown(event) {
    while (!checkOccupied(board, currentPiece)) {
        currentPiece.y++
    }
    currentPiece.y--
    // dropPiece(timeNow)
}
function pressKey(event) {
    // console.log(event) //Consoled to check event properties to use for movement. Decided on keyCode
    // keyCodes are 37 : leftArrow, 39 : rightArrow, 40 : downArrow,88: x, 90: z, 32: space, 80: p, 83: s
    if (playing) {
        if (event.keyCode === 37) {
            move(-1)
        } else if (event.keyCode === 39) {
            move(1)
        } else if (event.keyCode === 40) {
            dropPiece(timeNow)
            timeDiff = 0
        } else if (event.keyCode === 88) {
            rotateCurrentPiece(1)
        } else if (event.keyCode === 90) {
            rotateCurrentPiece(-1)
        } else if (event.keyCode === 32) {
            dropDown(event)
            timeDiff = 0
        } else if (event.keyCode === 80) {
            pauseGame()
        } else if (event.keyCode === 83) {
            savePiece()
        }
    } else {
        if (event.keyCode === 80) {
            pauseGame()
        }
    }
}
function pauseGame() {
    playing = !playing
    update()
    if (playing) {
        pause.innerText = 'Pause'
    } else {
        pause.innerText = 'Unpause'
    }
}
document.addEventListener('keydown', pressKey)
newGame.addEventListener('click', gameReset)
pause.addEventListener('click', pauseGame)
// =============ExtraExtraExtra=============
function changeOpacity() {
    if (rowsCleared % 40) {
        body.style.opacity = 1 - (rowsCleared % 40) / 200
    }
}
function changeBackground() {
    if (imageSet.length < 1) {
        imageSet = ['forest', 'beach', 'ocean','meadow']
    }
    if (rowsCleared !== 0 && rowsCleared % 40 === 0) {
        body.style.backgroundImage = `url(../images/${imageSet.shift()}.jpg)`
    }
}