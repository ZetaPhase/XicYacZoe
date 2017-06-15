function AI(seed) {
	this.marker = seed;
	this.opponent = seed == 'X' ? 'O' : 'X';
	this.max = 10;
	this.min = -10;
	
	this.minimax = function(board, player) {
		var bestScore = -10,
				currScore = 0,
				moves = board.getAvailableMoves();
		
		//Base case for finding leaf nodes
		if(board.turnCnt >= 9 || board.checkForWin() || !moves)
			return this.evaluate(board);
		
		//Maximize
		if(player === this.marker) {
			bestScore = this.min;
			for(var move in moves) {
				var newBoard = board.clone();
				newBoard.makeMove(this.marker, moves[move]);
				currScore = this.minimax(newBoard, this.opponent);
				if(currScore > bestScore) {
					bestScore = currScore;
				}
			}
			return bestScore;
		}
		
		//Minimize
		if(player === this.opponent) {
			bestScore = this.max;
			for(var move in moves) {
				var newBoard = board.clone();
				newBoard.makeMove(this.opponent, moves[move]);
				currScore = this.minimax(newBoard, this.marker);
				if(currScore < bestScore) {
					bestScore = currScore;
				}
			}
			return bestScore;
		}
	};
	
	//Gets the best move for this board configuration
	this.getBestMove = function(board) {
		var bestScore = this.min;
		var currScore;
		var bestMove = null;
		var moves = board.getAvailableMoves();
		var corners = [[0, 0], [0, 2], [2, 0], [2, 2]];
		//Prunes a few options for the first few states
		if(board.turnCnt === 0)
			return [1, 1];
		else if(board.turnCnt === 1 && board.gamestate[1][1] === '')
			return [1, 1];
		else if(board.turnCnt === 1)
			return corners[Math.floor(Math.random() * 4)];
		
		for(var move in moves) {
			var newBoard = board.clone();
			newBoard.makeMove(this.marker, moves[move]);
			currScore = this.minimax(newBoard, this.opponent);
			//console.log('Current score: ' + currScore);
			//console.log('Current move: ' + moves[move]);
			if(currScore > bestScore) {
				bestScore = currScore;
				bestMove = moves[move];
			}
		}
		return bestMove;
	};
	
	//Evaluates the score for the board passed by checking each line
	this.evaluate = function(board) {
		var score = 0;
		
		score += this.evaluateLine(board, 0, 0, 0, 1, 0, 2);  // row 0
		score += this.evaluateLine(board, 1, 0, 1, 1, 1, 2);  // row 1
		score += this.evaluateLine(board, 2, 0, 2, 1, 2, 2);  // row 2
		score += this.evaluateLine(board, 0, 0, 1, 0, 2, 0);  // col 0
		score += this.evaluateLine(board, 0, 1, 1, 1, 2, 1);  // col 1
		score += this.evaluateLine(board, 0, 2, 1, 2, 2, 2);  // col 2
		score += this.evaluateLine(board, 0, 0, 1, 1, 2, 2);  // diagonal
		score += this.evaluateLine(board, 0, 2, 1, 1, 2, 0);  // alternate diagonal
		
		return score;
	};
	
	//Scores the line by checking each cell for our marker, 1 point for 1, 10 point for 2, 100 for 3, opposite for opponent marker
	this.evaluateLine = function(board, r1, c1, r2, c2, r3, c3) {
		var score = 0;
		
		//First cell
		if(board.gamestate[r1][c1] === this.marker)
			score = 1;
		else if(board.gamestate[r1][c1] === this.opponent)
			score = -1;
		
		//Second cell
		if(board.gamestate[r2][c2] === this.marker){
			if(score == 1) //Cell 1 was my marker
				score = 10;
			else if (score === -1) // Cell 1 was my opponent
				return 0;
			else //Cell 1 was empty
				score = 1;
		}
		else if(board.gamestate[r2][c2] === this.opponent){
			if(score == -1) //Cell 1 was opponent
				score = -10;
			else if (score === 1) // Cell 1 was my marker
				return 0;
			else //Cell 1 was empty
				score = -1;
		}

		//Final cell
		if(board.gamestate[r3][c3] === this.marker){
			if(score > 1) //Cell 1 and or 2 was my marker
				score *= 10;
			else if (score < 0) // Cell 1 and or 2 was my opponent
				return 0;
			else //Cell 1 and 2 are empty
				score = 1;
		}
		else if(board.gamestate[r3][c3] === this.opponent){
			if(score < 0) //Cell 1 and or 2 was my opponent
				score *= 10;
			else if (score > 1) // Cell 1 and or 2 was my marker
				return 0;
			else //Cell 1 and 2 are empty
				score = -1;
		}
		return score;
	};
}

function Board() {
	this.turnCnt = 0;
	this.gamestate = [['','',''],
										['','',''],
										['','','']];
	//Returns the open positions on the board as an array of points as [row, column] or [y, x]
	this.getAvailableMoves = function() {
		var moves = [];
		
		for(var row in this.gamestate)
			for(var col in this.gamestate[row])
				if(this.gamestate[row][col] === '')
					moves.push([row, col]);
		
		return moves;
	};
	
	this.clone = 	function() {
		var newBoard = new Board();
		
		//Copy over the positions of X's and O's and the turn number to the cloned board
		for(var row = 0; row < 3; row++)
			for(var col = 0; col < 3; col++)
				newBoard.gamestate[row][col] = this.gamestate[row][col];
		newBoard.turnCnt = this.turnCnt;
		
		return newBoard;
	};
		
	//Will take in the player making the move as well as an [y, x] array of where to place the player's marker
	this.makeMove = function(player, point) {
		var row = parseInt(point[0]);
		var col = parseInt(point[1]);
		this.gamestate[row][col] = player;
		this.turnCnt++;
	};
	
	this.isFull = function() {
		return this.turnCnt === 9;
	};
	
	this.checkForWin = function() {
		var boardState = this.gamestate;
		var winner;
		
		//checking the diagonals
		if(boardState[1][1] !== '' &&
			 ((boardState[0][0] === boardState[1][1] 
				 && boardState[2][2] === boardState[1][1])
				|| (boardState[0][2] === boardState[1][1] 
						&& boardState[2][0] === boardState[1][1]))) {
			winner = boardState[1][1];
			return winner;
		}
		else {
			//Checking the horizontals
			for(var row in boardState) {
				if(boardState[row][0] !== '' &&
					 boardState[row][0] === boardState[row][1] 
					 && boardState[row][2] === boardState[row][1]) {
					winner = boardState[row][0];
					return winner;
				}
			}
			//Verticals
			for(var col in boardState) {
				if(boardState[0][col] !== '' &&
					 boardState[0][col] === boardState[1][col] 
					 && boardState[1][col] === boardState[2][col]) {
					winner = boardState[0][col];
					return winner;
				}
			}
		}
	};
}

var button = []; //stores the canvases
for(var i=1; i<10; i++) button[i] = document.getElementById('canvas'+i);

var ctx = []; //stores the context of the canvases
for(var i=1; i<10; i++) ctx[i] = button[i].getContext('2d');

var bDisabled = []; //stores the availability of the button
for(var i=1; i<10; i++) bDisabled[i] = false; //all buttons are enabled in the beginning

var isResult = false;
//var content = [];
//for (var i=1; i<10; i++) content[i] = 'n';
var content = new Board();

console.log(content.getAvailableMoves());

var xTurn = true; //X:true O:false
var ai = new AI('O');

function loop(x)
{
    if(!bDisabled[x]){ //button does not currently contain X or O and therefore is enabled.
        bDisabled[x] = true; //button now contains something
        //console.log("Button pressed.");
        
        button[x].style.webkitTransform = "rotateY(180deg)";
        
        content.makeMove('X', [Math.floor((x-1)/3), (x-1)%3]);

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

        if(Math.random()<0.85){
        	setTimeout(function() {
	            var bestMove = ai.getBestMove(content);
	            var row = parseInt(bestMove[0]);
	            var col = parseInt(bestMove[1]);
	            ctxPos = (row*3)+col+1;
	            button[ctxPos].style.webkitTransform = "rotateY(180deg)";
	            content.makeMove('O', [row, col]);

	            setTimeout(function(){
	                ctx[ctxPos].lineWidth = 3;
	                ctx[ctxPos].beginPath();
	                ctx[ctxPos].arc(button[ctxPos].width/2, button[ctxPos].height/2, 40, 0, 2*Math.PI, false);
	                ctx[ctxPos].stroke();
	                ctx[ctxPos].closePath();
	            }, 300);
	            console.log(content.gamestate);
	            console.log(content.checkForWin());
	            if(content.checkForWin()=='X'){
	                setTimeout(function() {
	                        alert("X has Won!");
	                    }, 700);
	            }else if(content.checkForWin()=='O'){
	                setTimeout(function() {
	                        alert("O has Won!");
	                    }, 700);
	            }

	            xTurn = !xTurn;
	            if(xTurn){
	                document.getElementById('whoseturn').innerHTML = "X Turn";
	            }else{
	                document.getElementById('whoseturn').innerHTML = "O Turn";
	            }
	        }, 300);
        }else{
        	setTimeout(function() {
        		var availSpots = content.getAvailableMoves();
	        	var pos = availSpots[Math.floor(Math.random()*availSpots.length)];
	        	var row = parseInt(pos[0]);
	        	var col = parseInt(pos[1]);
	        	randMove = (row*3)+col+1;
	        	button[randMove].style.webkitTransform = "rotateY(180deg)";
	            content.makeMove('O', [row, col]);

	            setTimeout(function(){
	                ctx[randMove].lineWidth = 3;
	                ctx[randMove].beginPath();
	                ctx[randMove].arc(button[randMove].width/2, button[randMove].height/2, 40, 0, 2*Math.PI, false);
	                ctx[randMove].stroke();
	                ctx[randMove].closePath();
	            }, 300);
	            console.log(content.gamestate);
	            console.log(content.checkForWin());
	            if(content.checkForWin()=='X'){
	                setTimeout(function() {
	                        alert("X has Won!");
	                    }, 700);
	            }else if(content.checkForWin()=='O'){
	                setTimeout(function() {
	                        alert("O has Won!");
	                    }, 700);
	            }

	            xTurn = !xTurn;
	            if(xTurn){
	                document.getElementById('whoseturn').innerHTML = "X Turn";
	            }else{
	                document.getElementById('whoseturn').innerHTML = "O Turn";
	            }
        	}, 300)
        }

    }
}