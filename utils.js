module.exports = {
  printBoard: board => board.forEach(row => console.log(row.reduce((p, c) => `${p} ${c}`, ''))),

  copy2DArray: (srcArray) => {
    const newArray = [];
    srcArray.forEach(e => newArray.push([...e]));
    return newArray;
  },

  random: (min, max) => Math.floor(Math.random() * (max - min + 1) + min),
};
