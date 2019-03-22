const { BOARD_SIZE } = require('../configs/constants');
const { copy2DArray } = require('./common');

const initBoard = () => {
  const board = [];
  const row = [];
  for (let c = 0; c < BOARD_SIZE; c++) row.push(0);
  for (let r = 0; r < BOARD_SIZE; r++) board.push([...row]);
  return board;
};

const printBoard = (board) => {
  const print = [];
  for (let r = -1; r < BOARD_SIZE; r++) {
    const row = [];
    for (let c = -1; c < BOARD_SIZE; c++) {
      if (r === -1 && c === -1) row.push('  ');
      else if (r === -1 && c > -1) row.push(c < 10 ? ` ${c}` : `${c}`);
      else if (r > -1 && c === -1) row.push(r < 10 ? ` ${r}` : `${r}`);
      else if (board[r][c] === 1) row.push(' X');
      else if (board[r][c] === -1) row.push(' O');
      else row.push(' .');
    }
    print.push(row);
  }
  print.forEach(row => console.log(row.reduce((p, c) => `${p} ${c}`, '')));
};

const findCellsOfType = (type, board) => {
  const cells = [];
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (board[r][c] === type) cells.push([r, c]);
    }
  }
  return cells;
};

const findAdjacentEmptyCellsOf = (cell, board) => {
  const row = cell[0];
  const col = cell[1];
  const cells = [];
  cells.push([row - 1, col - 1]); // top left
  cells.push([row - 1, col]); // top
  cells.push([row - 1, col + 1]); // top right
  cells.push([row, col - 1]); // left
  cells.push([row, col + 1]); // right
  cells.push([row + 1, col - 1]); // bottom left
  cells.push([row + 1, col]); // bottom
  cells.push([row + 1, col + 1]); // bottom right

  // filter out-of-range and non-empty cells
  return cells
    .filter(([r, c]) => r - 1 >= 0 && c - 1 >= 0 && r + 1 < BOARD_SIZE && c + 1 < BOARD_SIZE)
    .filter(([r, c]) => board[r][c] === 0);
};

const getChildNodes = (node, type) => {
  // find all non-empty cells
  const nonEmptyCells = [...findCellsOfType(1, node), ...findCellsOfType(-1, node)];

  // find their adjacent empty cells
  const adjacentEmptyCells = [];
  for (let i = 0; i < nonEmptyCells.length; i++) {
    adjacentEmptyCells.push(...findAdjacentEmptyCellsOf(nonEmptyCells[i], node));
  }

  // if not specify type, return the cells
  if (!type) return adjacentEmptyCells;

  // else map each adjacent empty cell to a new node and return
  return adjacentEmptyCells.map(([r, c]) => {
    const childNode = copy2DArray(node);
    childNode[r][c] = type;
    return childNode;
  });
};

module.exports = {
  initBoard,
  printBoard,
  findCellsOfType,
  findAdjacentEmptyCellsOf,
  getChildNodes,
};
