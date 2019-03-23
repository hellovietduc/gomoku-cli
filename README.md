# gomoku-cli

Play Gomoku in command line

## How to play it?

```
npm run play
```

## Use gomoku-cli API

1. Install the package

   ```
   npm install vietduc01100001/gomoku-cli
   ```

2. Use it in your code

   ```
   const Gomoku = require('gomoku-cli');
   ```

## API reference

### Gomoku.checkGameState(board, players, nToWin, moveNum)

Params:

| Key       | Type       | Description                                           |
| --------- | ---------- | ----------------------------------------------------- |
| board     | String[][] | 2D-array of strings represents the current game board |
| players   | Object     | Values of 2 players                                   |
| players.a | String     | Value of player A (`X` or `O`)                        |
| players.b | String     | Value of player B (`X` or `O`)                        |
| nToWin    | Number     | Number of consecutive Go's to win                     |
| moveNum   | Number     | Total number of played moves                          |

Returns:

```
Object: {
  state: String, // State of the game. Possible values: 'X-win', 'O-win', 'draw', 'playing'.
  [winLine]: Number[][] // Array contains start and end points of the win line.
}
```

### Gomoku.playBotMove(board, nextTurn)

Params:

| Key      | Type       | Description                                           |
| -------- | ---------- | ----------------------------------------------------- |
| board    | String[][] | 2D-array of strings represents the current game board |
| nextTurn | String     | Value of next turn player (`X` or `O`)                |

Returns:

```
Array: [row, col] // Position of bot's next move.
```
