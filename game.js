const constants = require('./constants');
const configs = require('./configs');
const { printBoard, copy2DArray, random } = require('./utils');

const Game = {
  start() {
    // init game board
    this.board = this.createGame();

    // open standard input and listen for human move
    const stdin = process.openStdin();
    stdin.addListener('data', (input) => {
      const move = input.toString().trim().split(',');
      const saved = this.saveMove('HUMAN', move, this.board);
      if (saved) this.callBot(this.board);
    });
  },

  createGame() {
    const { BOARD_SIZE } = configs;
    const { EMPTY_SIGN } = constants;
    const board = [];
    const row = [];

    // fill row
    for (let c = 0; c < BOARD_SIZE; c++) {
      row.push(EMPTY_SIGN);
    }

    // copy row to board
    for (let r = 0; r < BOARD_SIZE; r++) {
      board.push([...row]);
    }

    console.log('Game started!');
    printBoard(board);
    console.log('Your move:');
    return board;
  },

  checkGameState(board, silent) {
    const { BOARD_SIZE, N_TO_WIN, HUMAN_SIGN, BOT_SIGN } = configs;
    const { EMPTY_SIGN } = constants;

    // horizontal & vertical check
    for (let r = 0; r < BOARD_SIZE; r++) {

      // check vertically if row is in range
      const vCheck = r + N_TO_WIN <= BOARD_SIZE;

      for (let c = 0; c < BOARD_SIZE; c++) {

        // check horizontally if column is in range
        const hCheck = c + N_TO_WIN <= BOARD_SIZE;

        const hWin = { human: hCheck , bot: hCheck };
        const vWin = { human: vCheck, bot: vCheck };

        // check from this position to the right/bottom
        for (let k = 0; k < N_TO_WIN; k++) {
          if (hWin.human) hWin.human = hWin.human && board[r][c + k] === HUMAN_SIGN;
          if (hWin.bot) hWin.bot = hWin.bot && board[r][c + k] === BOT_SIGN;

          if (vWin.human) vWin.human = vWin.human && board[r + k][c] === HUMAN_SIGN;
          if (vWin.bot) vWin.bot = vWin.bot && board[r + k][c] === BOT_SIGN;

          // if all wins are false, skip checking
          if (!hWin.human && !hWin.bot && !vWin.human && !vWin.bot) break;
        }

        if (hWin.human || vWin.human) {
          if (!silent) console.log('You win!');
          return 'WIN';
        }
        if (hWin.bot || vWin.bot) {
          if (!silent) console.log('You lose!');
          return 'LOSE';
        }
      }
    }

    // diagonal check
    const head = N_TO_WIN - 1;
    const tail = BOARD_SIZE - N_TO_WIN;

    // up diagon row goes up to head, down diagon row goes down to tail
    for (let ru = BOARD_SIZE - 1, rd = 0; ru >= head, rd <= tail; ru--, rd++) {

      // column only goes to tail
      for (let c = 0; c <= tail; c++) {
        const upWin = { human: true, bot: true };
        const downWin = { human: true, bot: true };

        // check from this position upwards/downwards
        for (let k = 0; k < N_TO_WIN; k++) {
          if (upWin.human) upWin.human = upWin.human && board[ru - k][c + k] === HUMAN_SIGN;
          if (upWin.bot) upWin.bot = upWin.bot && board[ru - k][c + k] === BOT_SIGN;

          if (downWin.human) downWin.human = downWin.human && board[rd + k][c + k] === HUMAN_SIGN;
          if (downWin.bot) downWin.bot = downWin.bot && board[rd + k][c + k] === BOT_SIGN;

          // if all wins are false, skip checking
          if (!upWin.human && !upWin.bot && !downWin.human && !downWin.bot) break;
        }

        if (upWin.human || downWin.human) {
          if (!silent) console.log('You win!');
          return 'WIN';
        }
        if (upWin.bot || downWin.bot) {
          if (!silent) console.log('You lose!');
          return 'LOSE';
        }
      }
    }

    // if no one wins and there's no empty sign left, it's a draw
    if (!board.reduce((prev, row) => [...prev, ...row], []).includes(EMPTY_SIGN)) {
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

    const { BOARD_SIZE, HUMAN_SIGN, BOT_SIGN } = configs;
    const { EMPTY_SIGN } = constants;

    if (row < 0 || row >= BOARD_SIZE) {
      console.log(`Row index must be in [0, ${BOARD_SIZE}]!`);
      console.log('Next move:');
      return false;
    }

    if (col < 0 || col >= BOARD_SIZE) {
      console.log(`Column index must be in [0, ${BOARD_SIZE}]!`);
      console.log('Next move:');
      return false;
    }

    if (board[row][col] !== EMPTY_SIGN) {
      console.log('Position was not empty!');
      console.log('Next move:');
      return false;
    }

    board[row][col] = player === 'HUMAN' ? HUMAN_SIGN : BOT_SIGN;
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
    const { BOARD_SIZE } = configs;
    const moves = [];
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        if (board[i][j] === EMPTY_SIGN) moves.push([i, j]);
      }
    }
    return moves;
  },

  findBestMove(board, isMax) {
    const { MAX_VALUE, MIN_VALUE } = constants;
    const { BOT_SIGN } = configs;

    // find possible next moves
    const parentMoves = this.findPossibleMoves(board);

    // calculate each move's value with minimax()
    const movesWithValues = parentMoves.map((move) => {
      const nextBoard = copy2DArray(board);
      nextBoard[move[0]][move[1]] = BOT_SIGN;
      return { move, value: this.minimax(nextBoard, !isMax, 1, MIN_VALUE, MAX_VALUE) };
    });

    // sort asc or desc based on isMax and pick the move with best value
    movesWithValues.sort((a, b) => isMax ? b.value - a.value : a.value - b.value);
    const bestValue = movesWithValues[0].value;
    const possibleMoves = movesWithValues.filter(m => m.value === bestValue);

    // if there are more than one best move, pick a random one
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
