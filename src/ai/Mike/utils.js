const constants = require('../../configs/constants');
const { findSubArray } = require('../../utils/common');

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

module.exports = {
  isAnyComboInDirection,
  getDirectionCells,
};
