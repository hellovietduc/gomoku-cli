const Mike = require('../src/ai/Mike');

/**
 * @param {string[][]} board Current game board.
 * @param {object} players Values of players.
 * @param {string} players.a Value of player A.
 * @param {string} players.b Value of player B.
 * @param {number} nToWin Number of consecutive Go's to win.
 * @param {number} moveNum Total number of played moves.
 *
 * @returns {object} State of the game.
 */
const checkGameState = (board, players, nToWin, moveNum) => {
  // game isn't played enough to have one player wins
  if (moveNum < 9) return { state: 'playing' };

  const boardSize = board.length;
  const winLine = [];

  // horizontal & vertical check
  for (let r = 0; r < boardSize; r++) {
    // check vertically if row is in range
    const vCheck = r + nToWin <= boardSize;

    for (let c = 0; c < boardSize; c++) {
      // check horizontally if column is in range
      const hCheck = c + nToWin <= boardSize;

      const hWin = { a: hCheck, b: hCheck };
      const vWin = { a: vCheck, b: vCheck };

      // check from this position [r, c] to the right (horizontal) / bottom (vertical)
      for (let k = 0; k < nToWin; k++) {
        if (hWin.a) hWin.a = hWin.a && board[r][c + k] === players.a;
        if (hWin.b) hWin.b = hWin.b && board[r][c + k] === players.b;

        if (vWin.a) vWin.a = vWin.a && board[r + k][c] === players.a;
        if (vWin.b) vWin.b = vWin.b && board[r + k][c] === players.b;

        // skip checking if both players don't have consecutive go's
        if (!hWin.a && !hWin.b && !vWin.a && !vWin.b) break;
      }

      // if someone wins horizontally or vertically, save the win line
      if (hWin.a || hWin.b) winLine.push([r, c], [r, c + nToWin]);
      if (vWin.a || vWin.b) winLine.push([r, c], [r + nToWin, c]);

      if (hWin.a || vWin.a) return { state: players.a + '-win', winLine };
      if (hWin.b || vWin.b) return { state: players.b + '-win', winLine };
    }
  }

  // diagonal check
  const head = nToWin - 1;
  const tail = boardSize - nToWin;

  // up diagon row goes up to head, down diagon row goes down to tail
  for (let ru = boardSize - 1, rd = 0; ru >= head, rd <= tail; ru--, rd++) {
    // column only goes to tail
    for (let c = 0; c <= tail; c++) {
      const upWin = { a: true, b: true };
      const downWin = { a: true, b: true };

      // check from this position [ru, c] / [rd, c] upwards/downwards
      for (let k = 0; k < nToWin; k++) {
        if (upWin.a) upWin.a = upWin.a && board[ru - k][c + k] === players.a;
        if (upWin.b) upWin.b = upWin.b && board[ru - k][c + k] === players.b;

        if (downWin.a) downWin.a = downWin.a && board[rd + k][c + k] === players.a;
        if (downWin.b) downWin.b = downWin.b && board[rd + k][c + k] === players.b;

        // skip checking if both players don't have consecutive go's
        if (!upWin.a && !upWin.b && !downWin.a && !downWin.b) break;
      }

      // if someone wins diagonally, save the win line
      if (upWin.a || upWin.b) winLine.push([ru, c], [ru - nToWin, c + nToWin]);
      if (downWin.a || downWin.b) winLine.push([rd, c], [rd + nToWin, c + nToWin]);

      if (upWin.a || downWin.a) return { state: players.a + '-win', winLine };
      if (upWin.b || downWin.b) return { state: players.b + '-win', winLine };
    }
  }

  // if there's no more moves, it's a draw
  if (moveNum === boardSize * boardSize) return { state: 'draw' };

  // game's not done yet
  return { state: 'playing' };
};

/**
 * @param {string[][]} board Current game board.
 * @param {string} nextTurn Value of next turn player.
 *
 * @returns {number[]} Position of bot's next move.
 */
const playBotMove = (board, nextTurn) => {
  const valueOf = go => (go === 'X' ? 1 : go === 'O' ? -1 : 0);
  board = board.map(row => row.map(cell => valueOf(cell)));
  nextTurn = valueOf(nextTurn);
  return Mike(board, nextTurn);
};

module.exports = {
  checkGameState,
  playBotMove
};
