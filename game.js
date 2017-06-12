var button = []; //stores the canvases
for(var i=1; i<10; i++) button[i] = document.getElementById('canvas'+i);

var ctx = []; //stores the context of the canvases
for(var i=1; i<10; i++) ctx[i] = button[i].getContext('2d');

var bDisabled = []; //stores the availability of the button
for(var i=1; i<10; i++) bDisabled[i] = false; //all buttons are enabled in the beginning

var isResult = false;
var content = [];
for (var i=1; i<10; i++) content[i] = 'n';

var xTurn = true; //X:true O:false

var huPlayer = "X";
var aiPlayer = "O";

var origBoard = [];
origBoard[1] = "O";
origBoard[2] = 2;
origBoard[3] = 3;
origBoard[4] = 4;
origBoard[5] = 5;
origBoard[6] = 6;
origBoard[7] = "X";
origBoard[8] = 8;
origBoard[9] = "X";

function emptyIndexies(board){
  return  board.filter(s => s != "O" && s != "X");
}

function minimax(newBoard, player){
    var availSpots = emptyIndexies(newBoard);
    if (checkWin()&&xTurn){
        return {score:-10};
    }else if(checkWin()&&!xTurn){
        return {score:10};
    }else if(availSpots.length === 0){
        return {score:0};
    }
    var moves = [];
    for (var i=0; i<availSpots.length; i++){
        var move = {};
        move.index = newBoard[availSpots[i]];

        newBoard[availSpots[i]] = player;

        if(player == aiPlayer){
            var result = minimax(newBoard, huPlayer);
            move.score = result.score;
        }else{
            var result = minimax(newBoard, aiPlayer);
            move.score = result.score;
        }

        newBoard[availSpots[i]] = move.index;

        moves.push(move);
    }
    var bestMove;
    if(player == aiPlayer){
        var bestScore = -10000;
        for(var i=0; i<moves.length; i++){
            if(moves[i].score>bestScore){
                bestScore = moves[i].score;
                bestMove= i;
            }
        }
    }else{
        var bestScore = 10000;
        for(var i=0; i< moves.length; i++){
            if(moves[i].score<bestScore){
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }
    return moves[bestMove];
}

var bestSpot = minimax(origBoard, aiPlayer);

console.log(origBoard);
console.log("index: " + bestSpot.index);

function loop(x)
{
    if(!bDisabled[x]){ //button does not currently contain X or O and therefore is enabled.
        bDisabled[x] = true; //button now contains something
        //console.log("Button pressed.");
        
        button[x].style.webkitTransform = "rotateY(180deg)";
        
        if(xTurn){
            content[x] = "X";

            setTimeout(function(){
                ctx[x].lineWidth = 3;
                ctx[x].beginPath();
                ctx[x].moveTo(15, 15);
                ctx[x].lineTo(85, 85);
                ctx[x].moveTo(85, 15);
                ctx[x].lineTo(15, 85);
                ctx[x].stroke();
                ctx[x].closePath();
            }, 300);
        }else{
            /*
            content[x] = "O";

            setTimeout(function(){
                ctx[x].lineWidth = 3;
                ctx[x].beginPath();
                ctx[x].arc(button[x].width/2, button[x].height/2, 40, 0, 2*Math.PI, false);
                ctx[x].stroke();
                ctx[x].closePath();
            }, 300);
            */
            var bestSpot = minimax(content, aiPlayer);
        }

        console.log(checkWin());
        xCheck = xTurn;
        if(checkWin()){
            console.log("WINNER");
            if(xCheck){
                setTimeout(function() {
                    alert("X has Won!");
                }, 700);
            }else{
                setTimeout(function() {
                    alert("O has Won!");
                }, 700);
            }
        }

        xTurn = !xTurn;
        if(xTurn){
            document.getElementById('whoseturn').innerHTML = "X Turn";
        }else{
            document.getElementById('whoseturn').innerHTML = "O Turn";
        }
    }
}

//check if current board state is a win
function checkWin()
{
    return(horizontalCheckWin() || verticalCheckWin() || negDiagonalCheckWin() || posDiagonalCheckWin());
}

//check for 3 in a row horizontally
function horizontalCheckWin()
{
    if( (content[1]==content[2] && content[2]==content[3] && content[1]!='n') 
    || (content[4]==content[5] && content[5]==content[6] && content[4]!='n') 
    || (content[7]==content[8] && content[8]==content[9] && content[7]!='n')){
        return true;
    }
    return false;
}

//check for 3 in a row vertically
function verticalCheckWin()
{
    if( (content[1]==content[4] && content[4]==content[7] && content[1]!='n') 
    || (content[2]==content[5] && content[5]==content[8] && content[2]!='n') 
    || (content[3]==content[6] && content[6]==content[9] && content[3]!='n')){
        return true;
    }
    return false;
}

//check for 3 in a row diagonally downwards
function negDiagonalCheckWin()
{
    if(content[1]==content[5] && content[5]==content[9] && content[1]!='n'){
        return true;
    }
    return false;
}

//check for 3 in a row diagonally upwards
function posDiagonalCheckWin()
{
    if(content[3]==content[5] && content[5]==content[7] && content[3]!='n'){
        return true;
    }
    return false;
}