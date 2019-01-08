const constants = require('./constants');
const configs = require('./configs');
const { printBoard, copy2DArray, random } = require('./utils');

const Game = {
  start() {
    this.board = this.createGame();
    // this.humanMoves = [];
    // this.botMoves = [];

    const stdin = process.openStdin();
    stdin.addListener('data', (input) => {
      const move = input.toString().trim().split(' ');
      const saved = this.saveMove('HUMAN', move, this.board);
      if (saved) this.callBot(this.board);
    });
  },

  createGame() {
    const { EMPTY_SIGN } = constants;
    const { BOARD_COLS, BOARD_ROWS } = configs;
    const board = [];
    const row = [];
    for (let i = 0; i < BOARD_COLS; i++) {
      row.push(EMPTY_SIGN);
    }
    for (let i = 0; i < BOARD_ROWS; i++) {
      board.push([...row]);
    }
    console.log('Game started!');
    printBoard(board);
    console.log('Your move:');
    return board;
  },

  // TODO: refactor to dynamically check
  checkGameState(board, silent) {
    for (let i = 0; i < 3; i++) {
      const horizontal = board[i][0] + board[i][1] + board[i][2];
      const vertical = board[0][i] + board[1][i] + board[2][i];
      const diagonalDown = board[0][0] + board[1][1] + board[2][2];
      const diagonalUp = board[2][0] + board[1][1] + board[0][2];
      if (horizontal === 'XXX' || vertical === 'XXX' || diagonalDown === 'XXX' || diagonalUp === 'XXX') {
        if (!silent) console.log('You win!');
        return 'WIN';
      }
      if (horizontal === 'OOO' || vertical === 'OOO' || diagonalDown === 'OOO' || diagonalUp === 'OOO') {
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

    const { EMPTY_SIGN } = constants;
    const { BOARD_COLS, BOARD_ROWS, HUMAN_SIGN, BOT_SIGN } = configs;

    if (row < 0 || row >= BOARD_ROWS) {
      console.log(`Row index must be in [0, ${BOARD_ROWS}]!`);
      console.log('Next move:');
      return false;
    }

    if (col < 0 || col >= BOARD_COLS) {
      console.log(`Column index must be in [0, ${BOARD_COLS}]!`);
      console.log('Next move:');
      return false;
    }

    if (board[row][col] !== EMPTY_SIGN) {
      console.log('Position was not empty!');
      console.log('Next move:');
      return false;
    }

    if (player === 'HUMAN') {
      board[row][col] = HUMAN_SIGN;
      // this.humanMoves.push([row, col]);
    }

    if (player === 'BOT') {
      board[row][col] = BOT_SIGN;
      // this.botMoves.push([row, col]);
    }

    printBoard(board);

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
    const { EMPTY_SIGN } = constants;
    const { BOARD_COLS, BOARD_ROWS } = configs;
    const moves = [];
    for (let i = 0; i < BOARD_ROWS; i++) {
      for (let j = 0; j < BOARD_COLS; j++) {
        if (board[i][j] === EMPTY_SIGN) moves.push([i, j]);
      }
    }
    return moves;
  },

  findBestMove(board, isMax) {
    const { MAX_VALUE, MIN_VALUE } = constants;
    const { BOT_SIGN } = configs;
    const parentMoves = this.findPossibleMoves(board);
    const movesWithValues = parentMoves.map((move) => {
      const nextBoard = copy2DArray(board);
      nextBoard[move[0]][move[1]] = BOT_SIGN;
      return { move, value: this.minimax(nextBoard, !isMax, 1, MIN_VALUE, MAX_VALUE) };
    });
    movesWithValues.sort((a, b) => isMax ? b.value - a.value : a.value - b.value);
    const bestValue = movesWithValues[0].value;
    const possibleMoves = movesWithValues.filter(m => m.value === bestValue);
    return possibleMoves[random(0, possibleMoves.length - 1)].move;
  },

  minimax(board, isMax, depth = 0, alpha, beta) {
    const { MAX_VALUE, MIN_VALUE, DRAW_VALUE } = constants;
    const { BOT_SIGN, HUMAN_SIGN } = configs;
    if (this.checkGameState(board, true) === 'WIN') return MAX_VALUE - depth;
    if (this.checkGameState(board, true) === 'LOSE') return MIN_VALUE + depth;
    if (this.checkGameState(board, true) === 'DRAW') return DRAW_VALUE;
    if (isMax) {
      let bestValue = MIN_VALUE;
      const moves = this.findPossibleMoves(board);
      for (const move of moves) {
        const nextBoard = copy2DArray(board);
        nextBoard[move[0]][move[1]] = depth % 2 === 0 ? BOT_SIGN : HUMAN_SIGN;
        const value = this.minimax(nextBoard, false, depth + 1);
        bestValue = value > bestValue ? value : bestValue;
        alpha = bestValue > alpha ? bestValue : alpha;
        if (beta <= alpha) break;
      }
      return bestValue;
    } else {
      let bestValue = MAX_VALUE;
      const moves = this.findPossibleMoves(board);
      for (const move of moves) {
        const nextBoard = copy2DArray(board);
        nextBoard[move[0]][move[1]] = depth % 2 === 0 ? BOT_SIGN : HUMAN_SIGN;
        const value = this.minimax(nextBoard, true, depth + 1);
        bestValue = value < bestValue ? value : bestValue;
        beta = bestValue < beta ? bestValue : beta;
        if (beta <= alpha) break;
      }
      return bestValue;
    }
  }
};

Game.start();
