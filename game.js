const constants = require('./configs/constants');
const Player = require('./configs/player');
const Board = require('./utils/board');
const AI = require('./ai');

const Game = {
  start() {
    // initialize the game
    this.board = Board.initBoard();
    this.human = new Player('X');
    this.bot = new Player('O');

    // print the board
    Board.printBoard(this.board);
    console.log(this.human.sign + ' move:');

    // listen for human's move
    const stdin = process.openStdin();
    stdin.addListener('data', input => {
      input = input.toString().trim().split(',');
      if (this.saveMove(input, this.human)) {
        this.checkGameState();
        this.playBotMove();
        this.checkGameState();
      }
    });
  },

  saveMove(move, player) {
    if (move.length < 2) {
      console.log('Please specify both row and column indexes!');
      console.log(player.sign + ' move:');
      return false;
    }

    const row = parseInt(move[0]);
    const col = parseInt(move[1]);

    if (Number.isNaN(row) || Number.isNaN(col)) {
      console.log('Indexes must be numbers!');
      console.log(player.sign + ' move:');
      return false;
    }

    const { BOARD_SIZE } = constants;

    if (row < 0 || row >= BOARD_SIZE) {
      console.log(`Row index must be in range [0, ${BOARD_SIZE}]!`);
      console.log(player.sign + ' move:');
      return false;
    }

    if (col < 0 || col >= BOARD_SIZE) {
      console.log(`Column index must be in range [0, ${BOARD_SIZE}]!`);
      console.log(player.sign + ' move:');
      return false;
    }

    if (this.board[row][col] !== 0) {
      console.log('Cell was already taken!');
      console.log(player.sign + ' move:');
      return false;
    }

    this.board[row][col] = player.value;
    Board.printBoard(this.board);
    player.moves++;
    return true;
  },

  checkGameState() {
    const { BOARD_SIZE, N_TO_WIN } = constants;

    // horizontal & vertical check
    for (let r = 0; r < BOARD_SIZE; r++) {

      // check vertically if row is in range
      const vCheck = r + N_TO_WIN <= BOARD_SIZE;

      for (let c = 0; c < BOARD_SIZE; c++) {

        // check horizontally if column is in range
        const hCheck = c + N_TO_WIN <= BOARD_SIZE;

        const hWin = { human: hCheck, bot: hCheck };
        const vWin = { human: vCheck, bot: vCheck };

        // check from this position to the right/bottom
        for (let k = 0; k < N_TO_WIN; k++) {
          if (hWin.human) hWin.human = hWin.human && this.board[r][c + k] === this.human.value;
          if (hWin.bot) hWin.bot = hWin.bot && this.board[r][c + k] === this.bot.value;

          if (vWin.human) vWin.human = vWin.human && this.board[r + k][c] === this.human.value;
          if (vWin.bot) vWin.bot = vWin.bot && this.board[r + k][c] === this.bot.value;

          // if all wins are false, skip checking
          if (!hWin.human && !hWin.bot && !vWin.human && !vWin.bot) break;
        }

        if (hWin.human || vWin.human) {
          console.log('You win!');
          process.exit(0);
        }
        if (hWin.bot || vWin.bot) {
          console.log('You lose!');
          process.exit(0);
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
          if (upWin.human) upWin.human = upWin.human && this.board[ru - k][c + k] === this.human.value;
          if (upWin.bot) upWin.bot = upWin.bot && this.board[ru - k][c + k] === this.bot.value;

          if (downWin.human) downWin.human = downWin.human && this.board[rd + k][c + k] === this.human.value;
          if (downWin.bot) downWin.bot = downWin.bot && this.board[rd + k][c + k] === this.bot.value;

          // if all wins are false, skip checking
          if (!upWin.human && !upWin.bot && !downWin.human && !downWin.bot) break;
        }

        if (upWin.human || downWin.human) {
          console.log('You win!');
          process.exit(0);
        }
        if (upWin.bot || downWin.bot) {
          console.log('You lose!');
          process.exit(0);
        }
      }
    }

    // if no one wins and there's no more moves, it's a draw
    if (this.human.moves + this.bot.moves === BOARD_SIZE * BOARD_SIZE) {
      console.log('You draw!');
      process.exit(0);
    }
  },

  playBotMove() {
    const move = AI.negamax1(this.board, this.bot.value);
    console.log(this.bot.sign + ' move:');
    console.log(`${move[0]},${move[1]}`);
    this.saveMove(move, this.bot);
    console.log(this.human.sign + ' move:');
  },
};

Game.start();
