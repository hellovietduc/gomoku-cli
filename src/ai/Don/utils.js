const { BOARD_SIZE } = require('../../configs/constants');

const countCombosInRow = (board, type, n, isFive) => {
  // a combo is either:
  // - open on head & tail
  // - closed on head & tail
  // - open on head, closed on tail
  // - closed on head, open on tail

  let count = 0;

  for (let r = 0; r < BOARD_SIZE; r++) {
    let comboHasOpenHead = false;
    const comboLength = { openHead: 0, closedHead: 0 };

    for (let c = 0; c < BOARD_SIZE; c++) {
      const cell = board[r][c];

      if (cell === 0) {
        if (!comboHasOpenHead) comboHasOpenHead = true;
        if (comboLength.closedHead === n) count++;
        comboLength.closedHead = 0;
        continue;
      }

      if (comboHasOpenHead) {
        if (cell === type) {
          comboLength.openHead++;
          if (comboLength.openHead < n) continue;
          else count++;
        }
        comboHasOpenHead = false;
        comboLength.openHead = 0;
      } else {
        if (cell === type) {
          comboLength.closedHead++;
          if (comboLength.closedHead < n || !isFive) continue;
          else count++;
        }
        comboLength.closedHead = 0;
      }
    }
  }

  return count;
};

const countCombosInCol = (board, type, n, isFive) => {
  const rotatedBoard = [];
  for (let c = 0; c < BOARD_SIZE; c++) {
    const row = [];
    for (let r = 0; r < BOARD_SIZE; r++) {
      row.push(board[r][c]);
    }
    rotatedBoard.unshift([...row]);
  }
  return countCombosInRow(rotatedBoard, type, n, isFive);
};

const countCombosInDownDiagon = (board, type, n) => {
  let count = 0;

  // Length of potential chains
  // every potential chain will have its own index
  // and every broken chain will have undefined in its own index
  const chainNums = [];

  // Points to check with potential chains
  // pointsToCheck[n] should be the next point to check for chain with chainNums[n] length
  // pointsToCheck[n] will be undefined if chainNums[n] is undefined
  const pointsToCheck = [];

  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const cell = board[r][c];
      let pointFound = false;

      // check if the point is a point we're looking for
      for (let i = 0; i < pointsToCheck.length; i++) {

        // ignore indicies that have been reset
        if (pointsToCheck[i] === undefined) {
          continue;
        }

        const ptcX = pointsToCheck[i][0];
        const ptcY = pointsToCheck[i][1];

        if (r === ptcX && c === ptcY) {
          pointFound = true;

          // Add to the appropriate chainNum,
          // check if chainNum is n and increment count accordingly,
          // change the next point to check to the next point in the diagonal chain
          if (cell !== type) {
            delete chainNums[i];
            delete pointsToCheck[i];
            continue;
          }
          chainNums[i]++;
          if (chainNums[i] === n) {
            count++;
            delete chainNums[i];
            delete pointsToCheck[i];
          } else {
            pointsToCheck[i] = [ptcX + 1,ptcY + 1];
          }
        }
      }

      // if it's not a point we were looking for
      if (!pointFound) {
        // Add it as the start of a potential chain
        if (cell === type) {
          chainNums.push(1);
          pointsToCheck.push([r+1,c+1]);
        }
      }
    }
  }

  return count;
};

const countCombosInUpDiagon = (board, type, n) => {
  const rotatedBoard = [];
  for (let c = 0; c < BOARD_SIZE; c++) {
    const row = [];
    for (let r = 0; r < BOARD_SIZE; r++) {
      row.push(board[r][c]);
    }
    rotatedBoard.unshift([...row]);
  }
  return countCombosInDownDiagon(rotatedBoard, type, n);
};

module.exports = {
  countCombosInRow,
  countCombosInCol,
  countCombosInDownDiagon,
  countCombosInUpDiagon,
};
