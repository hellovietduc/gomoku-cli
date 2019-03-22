const Mike = require('./Mike');
const Don = require('./Don');

const init = () => new Promise(resolve => {
  console.log('Play with: 1. Mike or 2. Don?');
  const stdin = process.openStdin();
  const listener = (input) => {
    input = parseInt(input);
    if (Number.isNaN(input) || input < 1 || input > 2) return console.log('Invalid option. Please enter 1 or 2.');
    if (input === 1) input = 'Mike';
    if (input === 2) input = 'Don';
    console.log('Play against ' + input);
    stdin.end();
    stdin.removeListener('data', listener);
    resolve(input);
  };
  stdin.addListener('data', listener);
});

module.exports = {
  init,
  Mike,
  Don,
};
