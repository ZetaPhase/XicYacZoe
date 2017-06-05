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

function loop(x)
{
    if(!bDisabled[x]){ //button does not currently contain X or O and therefore is enabled.
        bDisabled[x] = true; //button now contains something
        //console.log("Button pressed.");
        
        button[x].style.webkitTransform = "rotateY(180deg)";
        
        if(xTurn){
            content[x] = 'x';

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
            content[x] = 'o';

            setTimeout(function(){
                ctx[x].lineWidth = 3;
                ctx[x].beginPath();
                ctx[x].arc(button[x].width/2, button[x].height/2, 40, 0, 2*Math.PI, false);
                ctx[x].stroke();
                ctx[x].closePath();
            }, 300);
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