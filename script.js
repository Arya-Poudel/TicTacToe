const players = (name, move) => {
   return {name, move};
};


let displayController = (function(){

	const resultDiv = document.querySelector('.result');
	const playersDiv = document.querySelector('.players');

	 player1 = players('Player1', 'X'); 
	 player2 = players('Player2', 'O');

	 player1info = document.getElementById('player1info');
	 player2info = document.getElementById('player2info');

	 player1info.addEventListener('keyup', () =>{
	 	  name = player1info.value == '' ? 'Player1' : player1info.value;
	 	  player1 = players(name, 'X')
	 });


	 player2info.addEventListener('keyup', () =>{
		 	  name = player2info.value == '' ? 'Player2' : player2info.value;
		 	  player2 = players(name, 'O')
	 });

	  computerTurn =  false;
	  smartComputerTurn = false;
	 //select player
	const AI = document.getElementById('AI');
	AI.addEventListener('click', () => {
		player2 = players('Dumb AI', 'O');
	    player2info.value = 'Dumb AI';
	    computerTurn = true;
	    smartComputerTurn = false;
	    game.replayGame();
	});

	const hardAI = document.getElementById('AI-hard');
	hardAI.addEventListener('click',() =>{
		player2 = players('Smart AI', 'O');
	    player2info.value = 'Smart AI';
	    computerTurn = false;
	    smartComputerTurn = true;
	    game.replayGame();
	});

	const twoPlayers = document.getElementById('two-players');
	twoPlayers.addEventListener('click', ()=>{
		player2 = players('','O');
		player2info.value = '';
		computerTurn = false;
		smartComputerTurn = false;
		game.replayGame();
	});

	
	let displayResult = (result) => {
		playersDiv.style.display = 'none';
		resultDiv.style.display = 'flex';

		if (result == 'tie')
			resultDiv.textContent = 'Its a tie.'
		else
			resultDiv.textContent = `${result.name} (${result.move}) wins!`;
	};


	let clearBoard = () =>{
		for (let i = 0; i < 9; i++) {
  				game.gameCells[i].textContent = '';
    	}	
	};


	 return{
	 	player1, player2,
	 	resultDiv, playersDiv,
		displayResult, clearBoard
	 };
})();


let game = (function(){
	const gameCells = document.querySelectorAll('.game-cell');
	const replayBtn = document.getElementById('replay-btn')
	replayBtn.addEventListener('click', replayGame);
	
	let gameBoard = Array(9).fill('');
	
	let xmove = true; let gameOn = true;

	gameCells.forEach(gameCell => {
		gameCell.addEventListener('click', handleClick)
	});

	function handleClick(e){
		const gameCell = e.target;
		if (gameOn && gameCell.textContent == ''){	  	
			let cellId = gameCell.id.replace(/[^0-9]/g,'');
			const currentPlayer = xmove? player1:player2;
			//add to array
			gameBoard[cellId] = currentPlayer.move;
			//display
			gameCells[cellId].textContent = currentPlayer.move;
			checkGameEnd(currentPlayer);
			//swapturn
			xmove = !xmove; 
		}

		//random AI
		if (computerTurn && gameOn) {
			let computerMove;
			function getEmptyCells(){
				return gameBoard.filter(elements=>{
					return elements == '';
				})
			};
			function setComputerMove() {
				while( gameBoard[computerMove] != ''  && getEmptyCells().length != 0){
				    computerMove = Math.floor(Math.random() * 9)
			    }
			};
			setComputerMove();
			xmove = !xmove;
			gameBoard[computerMove] = 'O';
			gameCells[computerMove].textContent = 'O';
			checkGameEnd(player2);
		}

		//smart AI
		if (smartComputerTurn && gameOn ) {
			let bestScore = -Infinity;
			let bestMove;
			for (let i = 0; i < gameBoard.length; i++) {
				if (gameBoard[i] == '') {
					gameBoard[i] = 'O';
					let score = minimax(gameBoard, 0, false);
					gameBoard[i] = '';
					
					if (score > bestScore) {
						bestScore = score;
						bestMove = i;
					}
			 }
			}
			xmove =!xmove;
			gameBoard[bestMove] = 'O';
			gameCells[bestMove].textContent = 'O';
			checkGameEnd(player2);
		}

	function minimax(gameBoard, depth, isMaximizing){				
		// 'X' : -1; 'O' : 1; 'tie' : 0
		if (checkWin('X')) { return -1};
		if (checkWin('O')) { return 1};
		if (checkTie()) { return 0;}
		
		if (isMaximizing) {
			let bestScore = -Infinity;
			for (let i = 0; i < gameBoard.length; i++) {
				if (gameBoard[i] == '') {
					gameBoard[i] = 'O';
					let score = minimax(gameBoard, depth + 1, false);
					gameBoard[i] = '';
					bestScore = Math.max(score, bestScore);
				 }
			}
		return bestScore;
		}
		else{
			let bestScore = Infinity;
			for (let i = 0; i < gameBoard.length; i++) {
				if (gameBoard[i] == '') {
					gameBoard[i] = 'X';
					let score = minimax(gameBoard, depth + 1, true);
					gameBoard[i] = '';
					bestScore = Math.min(score, bestScore);
				}
			}
		return bestScore;
		}
	}			
   };

   function checkGameEnd(currentPlayer){
		if (checkTie()){
		 	displayController.displayResult('tie');
		 	gameOn = false;
		}

		if(checkWin(currentPlayer.move)){
			displayController.displayResult(currentPlayer);
			gameOn = false;
		}
    };

	function checkWin(move){
		let winCombinations = [
			[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]
		]
		return winCombinations.some(combination => {
			return combination.every(index => {
				return gameBoard[index] == move;
			});
		});
	};


	function checkTie(){
		return gameBoard.every(index =>{
			return index == 'X' || index == 'O';
		});
	};
	

	function replayGame(){
		displayController.resultDiv.style.display = 'none';
		displayController.playersDiv.style.display = 'flex';
		gameBoard = Array(9).fill('');
		gameOn = true;
		xmove = true;
		displayController.clearBoard();
	};


	return{ 
		replayGame, gameCells, gameBoard
    };
})();