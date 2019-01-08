const Game = {
  constants: {
    MAX_VALUE: 100,
    MIN_VALUE: -100,
    DRAW_VALUE: 0,
  },

  start() {
    this.board = this.createGame();
    const stdin = process.openStdin();

    stdin.addListener('data', input => {
      const move = input.toString().trim().split(' ');
      const saved = this.saveMove('HUMAN', move, this.board);
      if (saved) this.callBot(this.board);
    });
  },

  createGame() {
    const board = [
      ['.', '.', '.'],
      ['.', '.', '.'],
      ['.', '.', '.']
    ];
    console.log('Game started!');
    this.printBoard(board);
    console.log('Your move:');
    return board;
  },

  checkGameState(board, silent) {
    for (let i = 0; i < 3; i++) {
      const horizontal = board[i][0] + board[i][1] + board[i][2];
      const vertical = board[0][i] + board[1][i] + board[2][i];
      const down = board[0][0] + board[1][1] + board[2][2];
      const up = board[2][0] + board[1][1] + board[0][2];
      if (horizontal === 'XXX' || vertical === 'XXX' || down === 'XXX' || up === 'XXX') {
        if (!silent) console.log('You win!');
        return 'WIN';
      }
      if (horizontal === 'OOO' || vertical === 'OOO' || down === 'OOO' || up === 'OOO') {
        if (!silent) console.log('You lose!');
        return 'LOSE';
      }
    }
    if (!board.reduce((prev, row) => [...prev, ...row], []).includes('.')) {
      if (!silent) console.log('You draw!');
      return 'DRAW';
    }
  },

  saveMove(player, move, board) {
    if (move.length < 2) {
      console.log('Too little arguments!');
      console.log('Next move:');
      return false;
    }

    const row = parseInt(move[0]);
    const col = parseInt(move[1]);

    if (Number.isNaN(row) || Number.isNaN(col)) {
      console.log('Arguments are not numbers!');
      console.log('Next move:');
      return false;
    }

    if (row < 0 || col < 0 || row > 2 || col > 2) {
      console.log('Arguments must be in [0, 2]!');
      console.log('Next move:');
      return false;
    }

    if (board[row][col] !== '.') {
      console.log('Position was not empty!');
      console.log('Next move:');
      return false;
    }

    board[row][col] = player === 'HUMAN' ? 'X' : 'O';
    this.printBoard(board);

    const finished = this.checkGameState(board);
    if (finished) process.exit(0);
    return true;
  },

  callBot(board) {
    const bestMove = this.findBestMove(board, false);
    console.log('Bot move:');
    this.saveMove('BOT', bestMove, board);
    console.log('Next move:');
  },

  findPossibleMoves(board) {
    const moves = [];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] === '.') moves.push([i, j]);
      }
    }
    return moves;
  },

  findBestMove(board, isMax) {
    const parentMoves = this.findPossibleMoves(board);
    const movesWithValues = parentMoves.map(move => {
      const nextBoard = this.copy2DArray(board);
      nextBoard[move[0]][move[1]] = 'O';
      return { move, value: this.minimax(nextBoard, !isMax, 1, this.constants.MIN_VALUE, this.constants.MAX_VALUE) };
    });
    movesWithValues.sort((a, b) => isMax ? b.value - a.value : a.value - b.value);
    const bestValue = movesWithValues[0].value;
    const possibleMoves = movesWithValues.filter(m => m.value === bestValue);
    return possibleMoves[this.random(0, possibleMoves.length - 1)].move;
  },

  minimax(board, isMax, depth = 0, alpha, beta) {
    if (this.checkGameState(board, true) === 'WIN') return this.constants.MAX_VALUE - depth;
    if (this.checkGameState(board, true) === 'LOSE') return this.constants.MIN_VALUE + depth;
    if (this.checkGameState(board, true) === 'DRAW') return this.constants.DRAW_VALUE;
    if (isMax) {
      let bestValue = this.constants.MIN_VALUE;
      const moves = this.findPossibleMoves(board);
      for (const move of moves) {
        const nextBoard = this.copy2DArray(board);
        nextBoard[move[0]][move[1]] = depth % 2 === 0 ? 'O' : 'X';
        const value = this.minimax(nextBoard, false, depth + 1);
        bestValue = value > bestValue ? value : bestValue;
        alpha = bestValue > alpha ? bestValue : alpha;
        if (beta <= alpha) break;
      }
      return bestValue;
    } else {
      let bestValue = this.constants.MAX_VALUE;
      const moves = this.findPossibleMoves(board);
      for (const move of moves) {
        const nextBoard = this.copy2DArray(board);
        nextBoard[move[0]][move[1]] = depth % 2 === 0 ? 'O' : 'X';
        const value = this.minimax(nextBoard, true, depth + 1);
        bestValue = value < bestValue ? value : bestValue;
        beta = bestValue < beta ? bestValue : beta;
        if (beta <= alpha) break;
      }
      return bestValue;
    }
  },

  printBoard(board) {
    board.forEach(row => console.log(row.reduce((p, c) => `${p} ${c}`, '')));
  },

  copy2DArray(srcArray) {
    const newArray = [];
    srcArray.forEach(e => newArray.push([...e]));
    return newArray;
  },

  random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
};

Game.start();
