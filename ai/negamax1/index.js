const constants = require('../../configs/constants');
const { isAnyComboInDirection, getDirectionCells, getChildNodes } = require('./utils');

const combos = {
  win: [
    [1, 1, 1, 1, 1],
    [-1, -1, -1, -1, -1]
  ],
  unCovered4: [
    [0, 1, 1, 1, 1, 0],
    [0, -1, -1, -1, -1, 0]
  ],
  unCovered3: [
    [0, 1, 1, 1, 0, 0],
    [0, 0, 1, 1, 1, 0],
    [0, 1, 0, 1, 1, 0],
    [0, 1, 1, 0, 1, 0],
    [0, -1, -1, -1, 0, 0],
    [0, 0, -1, -1, -1, 0],
    [0, -1, 0, -1, -1, 0],
    [0, -1, -1, 0, -1, 0]
  ],
  unCovered2: [
    [0, 0, 1, 1, 0, 0],
    [0, 1, 0, 1, 0, 0],
    [0, 0, 1, 0, 1, 0],
    [0, 1, 1, 0, 0, 0],
    [0, 0, 0, 1, 1, 0],
    [0, 1, 0, 0, 1, 0],
    [0, 0, -1, -1, 0, 0],
    [0, -1, 0, -1, 0, 0],
    [0, 0, -1, 0, -1, 0],
    [0, -1, -1, 0, 0, 0],
    [0, 0, 0, -1, -1, 0],
    [0, -1, 0, 0, -1, 0]
  ],
  covered4: [
    [-1, 1, 0, 1, 1, 1],
    [-1, 1, 1, 0, 1, 1],
    [-1, 1, 1, 1, 0, 1],
    [-1, 1, 1, 1, 1, 0],
    [0, 1, 1, 1, 1, -1],
    [1, 0, 1, 1, 1, -1],
    [1, 1, 0, 1, 1, -1],
    [1, 1, 1, 0, 1, -1],
    [1, -1, 0, -1, -1, -1],
    [1, -1, -1, 0, -1, -1],
    [1, -1, -1, -1, 0, -1],
    [1, -1, -1, -1, -1, 0],
    [0, -1, -1, -1, -1, 1],
    [-1, 0, -1, -1, -1, 1],
    [-1, -1, 0, -1, -1, 1],
    [-1, -1, -1, 0, -1, 1]
  ],
  covered3: [
    [-1, 1, 1, 1, 0, 0],
    [-1, 1, 1, 0, 1, 0],
    [-1, 1, 0, 1, 1, 0],
    [0, 0, 1, 1, 1, -1],
    [0, 1, 0, 1, 1, -1],
    [0, 1, 1, 0, 1, -1],
    [-1, 1, 0, 1, 0, 1, -1],
    [-1, 0, 1, 1, 1, 0, -1],
    [-1, 1, 1, 0, 0, 1, -1],
    [-1, 1, 0, 0, 1, 1, -1],
    [1, -1, -1, -1, 0, 0],
    [1, -1, -1, 0, -1, 0],
    [1, -1, 0, -1, -1, 0],
    [0, 0, -1, -1, -1, 1],
    [0, -1, 0, -1, -1, 1],
    [0, -1, -1, 0, -1, 1],
    [1, -1, 0, -1, 0, -1, 1],
    [1, 0, -1, -1, -1, 0, 1],
    [1, -1, -1, 0, 0, -1, 1],
    [1, -1, 0, 0, -1, -1, 1]
  ]
};

const valueCombos = (w, u4, u3, u2, c4, c3) => {
  if (w > 0) return 1000000000;
  if (u4 > 0) return 100000000;
  if (c4 > 1) return 10000000;
  if (u3 > 0 && c4 > 0) return 1000000;
  if (u3 > 1) return 100000;

  if (u3 === 1) {
    if (u2 === 3) return 40000;
    if (u2 === 2) return 38000;
    if (u2 === 1) return 35000;
    return 3450;
  }

  if (c4 === 1) {
    if (u2 === 3) return 4500;
    if (u2 === 2) return 4200;
    if (u2 === 1) return 4100;
    return 4050;
  }

  if (c3 === 1) {
    if (u2 === 3) return 3400;
    if (u2 === 2) return 3300;
    if (u2 === 1) return 3100;
  }

  if (c3 === 2) {
    if (u2 === 2) return 3000;
    if (u2 === 1) return 2900;
  }

  if (c3 === 3) {
    if (u2 === 1) return 2800;
  }

  if (u2 === 4) return 2700;
  if (u2 === 3) return 2500;
  if (u2 === 2) return 2000;
  if (u2 === 1) return 1000;
  return 0;
};

const valuePosition = (h, v, u, d) => {
  let w = 0, u4 = 0, u3 = 0, u2 = 0, c4 = 0, c3 = 0;
  const directions = [h, v, u, d];
  for (let i = 0; i < directions.length; i++) {
    if (isAnyComboInDirection(combos.win, directions[i])) {
      w++;
      continue;
    }
    if (isAnyComboInDirection(combos.unCovered4, directions[i])) {
      u4++;
      continue;
    }
    if (isAnyComboInDirection(combos.unCovered3, directions[i])) {
      u3++;
      continue;
    }
    if (isAnyComboInDirection(combos.unCovered2, directions[i])) {
      u2++;
      continue;
    }
    if (isAnyComboInDirection(combos.covered4, directions[i])) {
      c4++;
      continue;
    }
    if (isAnyComboInDirection(combos.covered3, directions[i])) {
      c3++;
    }
  }
  return valueCombos(w, u4, u3, u2, c4, c3);
};

const heuristic = (node, parent) => {
  const { BOARD_SIZE } = constants;
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (node[r][c] === parent[r][c]) continue;
      const type = node[r][c];
      const playerVal = valuePosition(
        getDirectionCells(node, type, r, c, 1, 0),
        getDirectionCells(node, type, r, c, 0, 1),
        getDirectionCells(node, type, r, c, 1, 1),
        getDirectionCells(node, type, r, c, 1, -1)
      );
      node[r][c] = -type;
      const oponentVal = valuePosition(
        getDirectionCells(node, -type, r, c, 1, 0),
        getDirectionCells(node, -type, r, c, 0, 1),
        getDirectionCells(node, -type, r, c, 1, 1),
        getDirectionCells(node, -type, r, c, 1, -1)
      );
      node[r][c] = -type;
      return 2 * playerVal + oponentVal;
    }
  }
  return 0;
};

// Note: This algorithm depends entirely on heuristic() function to determine the best move.
// Passing a depth higher than 0 leads to slower calculation and worse intelligence.
// TODO: find out why
const negamax = (node, depth, alpha, beta, type, parent) => {
  // const { MIN_VALUE } = constants;
  if (depth === 0) return heuristic(node, parent);
  // let score = MIN_VALUE;
  // const childNodes = getChildNodes(node, type);
  // for (let i = 0; i < childNodes.length; i++) {
  //   score = Math.max(score, -negamax(childNodes[i], depth - 1, -beta, -alpha, -type, node));
  //   alpha = Math.max(score, alpha);
  //   if (alpha >= beta) break;
  // }
  // return score;
};

module.exports = (board, type) => {
  const { BOARD_SIZE, MAX_VALUE, MIN_VALUE } = constants;

  // get child nodes of the current board
  const nodes = getChildNodes(board, type);

  // set initial values for the best node
  let bestNode = -1;
  let bestScore = MIN_VALUE;

  // find the best node from all child nodes
  for (let i = 0; i < nodes.length; i++) {
    let score = negamax(nodes[i], 0, MIN_VALUE, MAX_VALUE, -type, board);
    if (score > bestScore) {
      bestNode = i;
      bestScore = score;
    }
  }

  // find the indexes of the best move
  const bestMove = [-1, -1];
  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      if (nodes[bestNode][i][j] !== board[i][j]) {
        bestMove[0] = i;
        bestMove[1] = j;
        return bestMove;
      }
    }
  }
  return bestMove;
};
