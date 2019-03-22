const constants = require('../../configs/constants');
const { getChildNodes } = require('../../utils/board');
const { copy2DArray, shuffleArray } = require('../../utils/common');
const { countCombosInRow, countCombosInCol, countCombosInDownDiagon, countCombosInUpDiagon } = require('./utils');

const heuristic = (board, type) => {
  const numZeros = countCombosInRow(board, type, 5, true)
    + countCombosInCol(board, type, 5, true)
    + countCombosInDownDiagon(board, type, 5)
    + countCombosInUpDiagon(board, type, 5);

  const numOnes = countCombosInRow(board, type, 4, true)
    + countCombosInCol(board, type, 4, true)
    + countCombosInDownDiagon(board, type, 4)
    + countCombosInUpDiagon(board, type, 4);

  const numTwos = countCombosInRow(board, type, 3, false)
    + countCombosInCol(board, type, 3, false)
    + countCombosInDownDiagon(board, type, 3)
    + countCombosInUpDiagon(board, type, 3);

  const numThrees = countCombosInRow(board, type, 2, false)
    + countCombosInCol(board, type, 2, false)
    + countCombosInDownDiagon(board, type, 2)
    + countCombosInUpDiagon(board, type, 2);

  const numFours = countCombosInRow(board, type, 1, false)
    + countCombosInCol(board, type, 1, false)
    + countCombosInDownDiagon(board, type, 1)
    + countCombosInUpDiagon(board, type, 1);

  return numZeros * 1000000 + numOnes * 5000 + numTwos * 50 + numThrees * 5 + numFours;
};

const negamax = (board, depth, type, alpha, beta) => {
  // get randomly ordered child moves
  const moves = shuffleArray(getChildNodes(board));

  // assume the best move
  let bestMove = moves[0];

  // if we've reached the end node
  if (depth === 0) return {
    score: heuristic(board, type) - heuristic(board, -type),
    move: moves.pop(),
  };

  while (moves.length > 0) {
    const testMove = moves.pop();
    const row = testMove[0];
    const col = testMove[1];

    // create the child board of this move
    const childBoard = copy2DArray(board);
    childBoard[row][col] = type;

    const result = negamax(childBoard, depth - 1, -type, -beta, -alpha);
    const score = -result.score;

    // update better results
    if (score > alpha) {
      alpha = score;
      bestMove = testMove;
    }

    // alpha-beta pruning
    if (alpha >= beta) return { score: alpha, move: bestMove };
  }

  // final return
  return { score: alpha, move: bestMove };
};

module.exports = (board, type) => {
  const { MAX_VALUE, MIN_VALUE } = constants;
  const { move } = negamax(board, 2, type, MIN_VALUE, MAX_VALUE);
  return move;
};
