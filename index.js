const all = document.getElementById("container")
const SideDisplay = document.getElementById("sideDisplay")
const holdDisplay = document.getElementById("holdDisplay")
const scoreDisplay = document.getElementById("Score")
let bag = [];
let holdedPiece = 0;
let holded = false;
let lastmove = 0;
let lastdown = 0;
let lastflip = 0;
let score = 0;
let time = 800;
let piece;
let tack;
const teclas = {}
const board = Array.from({ length: 22 }, () => Array(10).fill(0));


document.addEventListener("keydown", event => {
    teclas[(event.key.toLowerCase())] = true
}
)
document.addEventListener("keyup", event => {
    teclas[(event.key.toLowerCase())] = false
}
)

class Piece {
    constructor(squares, color, type) {
        this.squares = squares;
        this.color = color;
        this.type = type;
        this.pos = [0, 4]
    }
    getCell(Cpos) {

        const collun = all.children[Cpos[1]]
        const cell = collun.children[Cpos[0] - 2]
        return cell;
    };
    Spos(index) { //consegui posição absoluta do quadrado
        const square = this.squares[index]
        const p1 = this.pos[0] + square[0]
        const p2 = this.pos[1] + square[1]
        return [p1, p2]
    };
    render(visible) {
        for (let i = 0; i < 4; i++) {
            if (this.getCell(this.Spos(i))) {
                if (visible)
                    this.getCell(this.Spos(i)).style.backgroundColor = this.color
                else
                    this.getCell(this.Spos(i)).style.backgroundColor = ""
            }
        };
    };
}

function start() {
    spawnPiece();
    keypressloop();
    piece.render(true);
    tack = setTimeout(tick, time)
}

function tick() {
    piecedown()
    tack = setTimeout(tick, time)
}

function keypressloop(timestamp) {
    if (timestamp - lastmove >= 75) {
        if (teclas['d']) {
            pieceRight()
            lastmove = timestamp
        }
        if (teclas['a']) {
            pieceLeft()
            lastmove = timestamp
        }
    }
    if (timestamp - lastdown >= 40) {
        if (teclas['s']) {
            piecedown()
            lastdown = timestamp
            clearTimeout(tack)
            tack = setTimeout(tick, time)
        }
    }
    if (timestamp - lastflip >= 200) {
        if (teclas['j']) {
            flip(-1, 1)
            lastflip = timestamp
        } if (teclas['k']) {
            flip(1, -1)
            lastflip = timestamp
        }
        if (teclas['c'] && holded == false) {
            hold()
            lastflip = timestamp
        }
    }
    requestAnimationFrame(keypressloop);
}

function piecedown() {
    if (piece.squares.every((_, i) => {
        const Spos = piece.Spos(i);
        return Spos[0] + 1 < 22 && board[Spos[0] + 1][Spos[1]] === 0;
    })) {
        piece.render(false)
        piece.pos[0]++
        piece.render(true)
    } else {
        for (i = 0; i < 4; i++) {
            const Spos = piece.Spos(i)
            board[Spos[0]][Spos[1]] = 1;
        }
        holded = false;
        spawnPiece();
        checkLayers();
    }
}

function pieceRight() {
    if (piece.squares.every((_, i) => {
        const Spos = piece.Spos(i);
        return Spos[1] + 1 < 10 && board[Spos[0]] && board[Spos[0]][Spos[1] + 1] == 0;
    })) {
        piece.render(false)
        piece.pos[1]++
        piece.render(true)
    }
}

function pieceLeft() {
    if (piece.squares.every((_, i) => {
        const Spos = piece.Spos(i);
        return Spos[1] - 1 >= 0 && board[Spos[0]] && board[Spos[0]][Spos[1] - 1] == 0;
    })) {
        piece.render(false)
        piece.pos[1]--
        piece.render(true)
    }
}

function flip(X, Y) {
    piece.render(false);
    let placeholder = [[0, 0], [0, 0], [0, 0], [0, 0]]
    for (let i = 0; i < 4; i++) {
        placeholder[i][1] = piece.squares[i][0] * X
        placeholder[i][0] = piece.squares[i][1] * Y
    };
    let P = checkBounds(placeholder, piece.pos)

    if (P != -99) {
        piece.pos[1] + P;
        piece.squares = placeholder
        piece.render(true);
    }
}

function checkBounds(placeholder, pos) {
    let P = checkOuter(placeholder, pos[1])
    pos[1] += P
    let Collisions = 0;
    for (i = 0; i < 4; i++) {
        if (board[placeholder[i][0] + pos[0]], [placeholder[i][1] + pos[1]] == 1) {
            Collisions++
        }
    }
    if (Collisions == 0) { return P; }



    function checkOuter(placeholder, X) {
        let P = 0
        for (i = 0; i < 4; i++) {
            if (placeholder[i][1] + X + P < 0) {
                P++
                i--
            }
            else if (placeholder[i][1] + X + P > 9) {
                P--
                i--
            }
        }
        return P;
    }
}
function hold() {
    if (holdedPiece == 0) {
        holdedPiece = piece
        piece.render(false)
        spawnPiece()
    } else {
        let save = piece;
        piece.render(false)
        piece = holdedPiece;
        holdedPiece = save
        piece.pos = [1, 4]
    }
    holded = true
    piece.render(false)
    holdDisplay.firstElementChild.src = `images/${holdedPiece.type}.png`
}

function spawnPiece() {
    while (bag.length < 7) {
        const pieces = [new Piece([[0, 0], [1, 0], [0, 1], [0, -1]], "purple", 'T'),
        new Piece([[0, -1], [0, 0], [1, 0], [1, 1]], "red", 'S'),
        new Piece([[0, 1], [0, 0], [1, 0], [1, -1]], "green", 'Z'),
        new Piece([[0, 0], [1, 0], [-1, 0], [-1, 1]], "blue", 'J'),
        new Piece([[0, 0], [1, 0], [-1, 0], [1, 1]], "orangeRed", 'L'),
        new Piece([[1, 0], [0, 0], [-1, 0], [2, 0]], "aqua", 'I'),
        new Piece([[0, 0], [1, 0], [0, 1], [1, 1]], "yellow", 'O')
        ]
        let prebag = [...pieces]
        console.log(prebag)
        while (prebag.length > 0) {
            let rand = Math.floor(Math.random() * (prebag.length));
            bag.push(prebag[rand])
            prebag.splice(rand, 1)
        }
    }
    piece = bag.shift()
    displaySidePieces()
    time -= time / 100;
}

function displaySidePieces() {
    for (let i = 0; i < 5; i++) {
        SideDisplay.children[i].firstElementChild.src = `images/${bag[i].type}.png`
    }
}

function checkLayers() {
    for (let i = 21; i >= 3; i--) {
        if (board[i].every(elem => elem === 1)) {
            deleteLayer(i)
            i++
        }
    };
}

function deleteLayer(layer) {
    score += 100
    scoreDisplay.textContent = `Score:${score}`
    for (let k = layer; k > 2; k--) {
        for (let l = 0; l < 10; l++) {
            board[k][l] = board[k - 1][l]
            const cell = piece.getCell([k, l])
            const uppercell = piece.getCell([k - 1, l])
            console.log(uppercell)
            cell.style.backgroundColor = uppercell.style.backgroundColor
        }
    }
}
start();