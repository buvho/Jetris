const all = document.getElementById("container")
const teclas = {}
const board = Array.from({ length: 22 }, () => Array(10).fill(0));


document.addEventListener("keydown",event =>
    {
        keypress[(event.key.toLowerCase())] = true
    }
)
document.addEventListener("keyup",event =>{
        keypress[(event.key.toLowerCase())] = false
    }
)

class Piece
{
    constructor(squares,color){
    this.squares = squares;
    this.color = color;
    this.pos = [0,4]
    }
    getCell(Cpos){

        const collun = all.children[Cpos[1]]
        const cell = collun.children[Cpos[0]-2]
        return cell;
    };
    Spos(index) { //consegui posição absoluta do quadrado
        const square = this.squares[index]
        const p1 = this.pos[0] + square[0]
        const p2 = this.pos[1] + square[1]
        return [p1,p2]
    };
    render(visible) {
        for (let i = 0; i < 4; i++){
            if(this.getCell(this.Spos(i))){
            if (visible)
            this.getCell(this.Spos(i)).style.backgroundColor = this.color
            else
            this.getCell(this.Spos(i)).style.backgroundColor = ""
            }
        };
    };
}

function start(){
spawnPiece()
piece.render(true);
tack = setTimeout(tick,time)
}

function tick()
{
piecedown()
setTimeout(tick,time)
}

function keypressloop()
{
    if(teclas['d']){
        pieceRight()
    }
    if(teclas['a']){
        pieceLeft()
    }
    if(teclas['s']){
        piecedown()
    }
    if(teclas['d']){
        pieceRight()
    }
        case 'j': flip(-1,1); break;
        case 'k': flip(1,-1); break;
    }
    requestAnimationFrame(keypressloop);
}


function piecedown()
{
    if (piece.squares.every((_,i) => {
        const Spos = piece.Spos(i);
        return Spos[0] + 1 < 22 && board[Spos[0]+1][Spos[1]] === 0;
    })){
        piece.render(false)
        piece.pos[0]++
        piece.render(true)
    }  else 
    {
        for(i = 0;i < 4;i++){
        const Spos = piece.Spos(i)
        board[Spos[0]][Spos[1]] = 1;
        }
        spawnPiece();
        checkLayers();
    }
}

function pieceRight()
{
    if (piece.squares.every((_,i) => {
        const Spos = piece.Spos(i);
        return Spos[1] + 1 < 10 && board[Spos[0]][Spos[1]+1] === 0;
    })){
        piece.render(false)
        piece.pos[1]++
        piece.render(true)
    }
}

function pieceLeft()
{
    if (piece.squares.every((_,i) => {
        const Spos = piece.Spos(i);
        return Spos[1] -1 >= 0 && board[Spos[0]][Spos[1]-1] === 0;
    })){
        piece.render(false)
        piece.pos[1]--
        piece.render(true)
    }
}

function flip(X,Y)
{
    piece.render(false);
    let placeholder = [[0,0],[0,0],[0,0],[0,0]]
    for (let i = 0;i < 4; i++){
        placeholder[i][1] = piece.squares[i][0] * X
        placeholder[i][0] = piece.squares[i][1] * Y
    };
    let P = checkBounds(placeholder,piece.pos)
    
    if (P != -99){
    piece.pos[1] + P;
    piece.squares = placeholder
    piece.render(true);
    }
}

function checkBounds(placeholder,pos)
{
    let P = checkOuter(placeholder,pos[1])
    pos[1] += P
    let Collisions = 0;
    for(i = 0; i < 4; i++)
    {
        if(board[placeholder[i][0] + pos[0]],[placeholder[i][1] + pos[1]] == 1)
        {
            Collisions++
        }
    }
    if(Collisions == 0)
    {return P;} 

    

function checkOuter(placeholder,X)
{
    let P = 0
    for (i = 0;i < 4;i++){
        if(placeholder[i][1] + X + P< 0) 
        {
            P++
            i--
        }
        else if(placeholder[i][1] + X + P > 9)
        {
            P--
            i--
        }
    }
    return P;
}


}
function spawnPiece()
{
const pieces = [new Piece([[0,0],[1,0],[0,1],[0,-1]],"purple"),
                new Piece([[0,-1],[0,0],[1,0],[1,1]],"red"),
                new Piece([[0,1],[0,0],[1,0],[1,-1]],"green"),
                new Piece([[0,0],[1,0],[-1,0],[-1,1]],"blue"),
                new Piece([[0,0],[1,0],[-1,0],[1,1]],"orangeRed"),
                new Piece([[1,0],[0,0],[-1,0],[2,0]],"aqua"),
                new Piece([[0,0],[1,0],[0,1],[1,1]],"yellow")
]
piece = pieces[Math.floor((Math.random() * 7))]
time -= time / 100;
}

function checkLayers()
{
    for(let i = 21; i >= 3;i--){
        if (board[i].every(elem => elem === 1))
        {
            deleteLayer(i)
            i++
        }
    };
}

function deleteLayer(i)
{
for(let k = i; k > 2; k--)
    {
        for (let l = 0; l < 10; l++)
        {
            board[k][l] = board[k-1][l]
            const cell =  piece.getCell([k,l])
            const uppercell =  piece.getCell([k-1,l])
            console.log(uppercell)
            cell.style.backgroundColor = uppercell.style.backgroundColor
        }
    }
}
let time = 800;
let piece;
start()
