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
	
	let xmove = true; let game = true;

	gameCells.forEach(gameCell => {
		gameCell.addEventListener('click', handleClick)
	});

	function handleClick(e){
		const gameCell = e.target;
		if (game && gameCell.textContent == ''){
		  	
			let cellId = gameCell.id.replace(/[^0-9]/g,'');
			const currentPlayer = xmove? player1:player2;
			//add to array
			gameBoard[cellId] = currentPlayer.move;
			//display
			gameCells[cellId].textContent = currentPlayer.move;

			if (checkTie()){
    		 	displayController.displayResult('tie');
    		 	game = false;
    		}

    		if(checkWin(currentPlayer.move)){
    			displayController.displayResult(currentPlayer);
    			game = false;
    		}
    		//swapturn
    		xmove = !xmove; 		
		}
   };

	function checkWin(move){
		let winCombinations = [
			[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]
		]
		return winCombinations.some(combination => {
			return combination.every(index => {
				return gameCells[index].textContent == move;
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
		game = true;
		xmove = true;
		displayController.clearBoard();
	};


	return{
  		gameCells
    };
})();