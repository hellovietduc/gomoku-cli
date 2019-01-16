module.exports = class Player {
  constructor(sign) {
    sign = sign.trim();
    if (!sign || sign !== 'X' && sign !== 'O') throw new Error('Invalid sign. Only X or O are allowed.');
    this.sign = sign;
    this.value = this.sign === 'X' ? 1 : -1;
    this.moves = 0;
  }

  static chooseSign() {
    return new Promise(resolve => {
      console.log('Pick: 1. O or 2. X?');
      const stdin = process.openStdin();
      const listener = (input) => {
        input = parseInt(input);
        if (Number.isNaN(input) || input < 1 || input > 2) return console.log('Invalid option. Please enter 1 or 2.');
        if (input === 1) input = 'O';
        if (input === 2) input = 'X';
        console.log('You pick ' + input);
        stdin.end();
        stdin.removeListener('data', listener);
        resolve(input);
      };
      stdin.addListener('data', listener);
    });
  }
};
