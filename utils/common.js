const copy2DArray = (array) => {
  const newArray = [];
  array.forEach(e => newArray.push([...e]));
  return newArray;
};

const shuffleArray = (array) => {
  let len = array.length;
  while (len > 0) {
    const rnd = Math.floor(Math.random() * len--);
    const tmp = array[len];
    array[len] = array[rnd];
    array[rnd] = tmp;
  }
  return array;
};

const findSubArray = (subArray, array) => {
  let elements;
  for (let i = 0; i <= array.length - subArray.length; i++) {
    elements = 0;
    for (let j = 0; j < subArray.length; j++) {
      if (subArray[j] === array[i + j]) elements++;
      else break;
    }
    if (elements === subArray.length) return true;
  }
  return false;
};

const findArray = (array, arrayOfArrays) => {
  for (let i = 0; i < arrayOfArrays.length; i++) {
    let found = true;
    for (let j = 0; j < array.length; j++) {
      if (array[j] !== arrayOfArrays[i][j]) {
        found = false;
        break;
      }
    }
    if (found) return true;
  }
  return false;
};

module.exports = {
  copy2DArray,
  shuffleArray,
  findSubArray,
  findArray,
};
