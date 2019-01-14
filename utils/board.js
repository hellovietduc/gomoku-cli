const { BOARD_SIZE } = require('../configs/constants');

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

module.exports = {
  initBoard,
  printBoard,
};
