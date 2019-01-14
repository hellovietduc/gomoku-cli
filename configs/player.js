module.exports = class Player {
  constructor(sign) {
    sign = sign.trim();
    if (!sign || sign !== 'X' && sign !== 'O') throw new Error('Invalid sign. Only X or O are allowed.');
    this.sign = sign;
    this.value = this.sign === 'X' ? 1 : -1;
    this.moves = 0;
  }
};
