const constants = require('../../configs/constants');
const { copy2DArray, findSubArray, findArray } = require('../../utils/common');

const isAnyComboInDirection = (combos, direction) => {
  for (let i = 0; i < combos.length; i++) {
    if (findSubArray(combos[i], direction)) return true;
  }
  return false;
};

const getDirectionCells = (node, type, i, j, dx, dy) => {
  const { BOARD_SIZE, N_TO_WIN } = constants;
  const direction = [type];
  for (let k = 1; k < N_TO_WIN; k++) {
    const row = i - dx * k;
    const col = j - dy * k;
    if (row < 0 || col < 0 || row >= BOARD_SIZE || col >= BOARD_SIZE) break;
    const cell = node[row][col];
    direction.unshift(cell);
    if (cell === -type) break;
  }
  for (let k = 1; k < N_TO_WIN; k++) {
    const row = i + dx * k;
    const col = j + dy * k;
    if (row < 0 || col < 0 || row >= BOARD_SIZE || col >= BOARD_SIZE) break;
    const cell = node[row][col];
    direction.push(cell);
    if (cell === -type) break;
  }
  return direction;
};

const getChildNodes = (node, type) => {
  const { BOARD_SIZE } = constants;

  // find all non-empty cells
  const nonEmptyCells = [];
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (node[r][c] !== 0) nonEmptyCells.push([r, c]);
    }
  }

  const adjacentEmptyCells = [];
  for (let i = 0; i < nonEmptyCells.length; i++) {
    const [row, col] = nonEmptyCells[i];

    // ignore cell indexes that are out of range
    if (row - 1 < 0 || col - 1 < 0 || row + 1 >= BOARD_SIZE || col + 1 >= BOARD_SIZE) continue;

    // get this cell's adjacent cells
    const adjacentCells = [];
    adjacentCells.push([row - 1, col - 1]); // top left
    adjacentCells.push([row - 1, col]); // top
    adjacentCells.push([row - 1, col + 1]); // top right
    adjacentCells.push([row, col - 1]); // left
    adjacentCells.push([row, col + 1]); // right
    adjacentCells.push([row + 1, col - 1]); // bottom left
    adjacentCells.push([row + 1, col]); // bottom
    adjacentCells.push([row + 1, col + 1]); // bottom right

    // only push cells that are empty and not already in the list
    adjacentEmptyCells.push(
      ...adjacentCells
        .filter(([r, c]) => node[r][c] === 0)
        .filter(cell => !findArray(cell, adjacentEmptyCells))
    );
  }

  // map each adjacent empty cell to a new node
  return adjacentEmptyCells.map(([row, col]) => {
    const childNode = copy2DArray(node);
    childNode[row][col] = type;
    return childNode;
  });
};

module.exports = {
  isAnyComboInDirection,
  getDirectionCells,
  getChildNodes,
};
