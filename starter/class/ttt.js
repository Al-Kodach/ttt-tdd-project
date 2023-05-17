const Screen = require("./screen");
const Cursor = require("./cursor");
const ComputerPlayer = require("./computer-player");

class TTT {

  constructor() {

    this.grid = [[' ',' ',' '],
                 [' ',' ',' '],
                 [' ',' ',' ']]

    this.cursor = new Cursor(3, 3);

    // Initialize a 3x3 tic-tac-toe grid
    Screen.initialize(3, 3);
    Screen.setGridlines(true);
    this.cursor.setBackgroundColor();

    // Replace this with real commands
    Screen.addCommand('up', 'move cursor up', this.cursor.up.bind(this.cursor));
    Screen.addCommand('down', 'move cursor down', this.cursor.down.bind(this.cursor));
    Screen.addCommand('left', 'move cursor left', this.cursor.left.bind(this.cursor));
    Screen.addCommand('right', 'move cursor right', this.cursor.right.bind(this.cursor));
    Screen.addCommand('return', `place move at cursor position`, this.placeMove.bind(this));
    Screen.addCommand('backspace', `choose a symbol to start the game`, this.assignSymbols.bind(this));

    Screen.render();
    Screen.printCommands();
  }

  assignSymbols() {
    if (this.player && this.computerPlayer) {
      return;
    }

    const symbols = ['O', 'X'];

    const min = Math.ceil(0);
    const max = Math.floor(symbols.length);

    const random = Math.floor(Math.random() * (max - min) + min);

    this.player = symbols[random];
    this.computerPlayer = symbols[1 - random];

    if (this.player === 'X') {
      this.playerTurn = this.player;
      console.log(`You are playing as ${this.player} and starting the game`);
    } else {
      this.playerTurn = this.computerPlayer;
      console.log(`The AI is playing as ${this.computerPlayer} and starting the game`);
      setTimeout(this.placeMove.bind(this), 2000);
    }
  }

  placeMove() {

    if (this.playerTurn === this.computerPlayer) {
      const move = ComputerPlayer.getSmartMove(this.grid, this.computerPlayer);
      console.log(`Move: ${move}`);
      this.cursor.row = move.row;
      this.cursor.col = move.col;
    }

    let row = this.cursor.row;
    let col = this.cursor.col;
    let el = this.grid[row][col];

    // Set grid element to player turn if unplayed and render
    if (el === " ") {
      this.grid[row][col] = this.playerTurn;
      Screen.setGrid(row, col, this.playerTurn);

      // Check for win after placing every move
      let winner = TTT.checkWin(this.grid);

      if ( !!winner ) {
        TTT.endGame(winner);
      } else {
        // Switch player after a turn is played and the game is still unwon
        this.playerTurn === this.player ? this.playerTurn = this.computerPlayer : this.playerTurn = this.player;
        Screen.render();
        if (this.playerTurn === this.player) {
          console.log(`It is currently your move:`);
        } else {
          console.log(`It is currently the AI's move:`);
          setTimeout(this.placeMove.bind(this), 2000);
        }

        Screen.printCommands();
      }

    } else {
      console.log(`You cannot overwrite another player's turn!`);
      Screen.printCommands();
    }
  }

  static checkWin(grid) {
    const emptyGrid = grid.every(row => row.every(el => el === " ") === true);
    const fullGrid = grid.every(row => row.every(el => el !== " ") === true);

    // Return 'X' if player X wins
    // Return 'O' if player O wins
    // Return 'T' if the game is a tie
    // Return false if the game has not ended

    if (emptyGrid) {
      return false;
    } else if (!!TTT.horizontalWin(grid)) {
      return `${TTT.horizontalWin(grid)[0]}`;
    } else if (!!TTT.verticalWin(grid)) {
      return `${TTT.verticalWin(grid)[0]}`;
    } else if (!!TTT.diagonalWin(grid)) {
      return `${TTT.diagonalWin(grid)[0]}`;
    } else if (fullGrid) {
      return "T";
    } else {
      return false;
    }
  }

  static horizontalWin(grid) {
    const win = grid.find(row => row.every(el => el === row[0] && row[0] !== " ") === true);

    return win;
  }

  static verticalWin(grid) {
    let win;

    for (let col = 0; col < grid.length; col++) {
      let column = [];

      for (let row = 0; row < grid[0].length; row++) {
        let el = grid[row][col];
        column.push(el);
      }

      const isWin = column.every(el => el === column[0] && column[0] !== " ");

      if (isWin) {
        win = column;
      }
    }

    return win;
  }

  static diagonalWin(grid) {
    let win;
    let diagonal1 = [];
    let diagonal2 = [];
    let lastIdx = grid.length - 1;
    let midIdx = lastIdx / 2;
    let currIdx = midIdx;

    // Find first diagonal
    for (let col = 0; col < grid.length; col++) {
      for (let row = 0; row < grid[0].length; row++) {
        if (row === col) {
          let el = grid[row][col];
          diagonal1.push(el);
        }
      }
    }

    // Find second diagonal
    for (let i = midIdx; i >= 0; i--) {
      let el1 = grid[i][currIdx];
      let el2 = grid[currIdx][i];

      if (i === currIdx) {
        diagonal2.push(el1);
      } else {
        diagonal2.push(el1, el2);
      }
      currIdx++;
    }

    // Check if either diagonals are a win and set win
    const isDiagonal1Win = diagonal1.every(el => el === diagonal1[0] && diagonal1[0] !== " ");
    const isDiagonal2Win = diagonal2.every(el => el === diagonal2[0] && diagonal2[0] !== " ")

    if (isDiagonal1Win) {
      win = diagonal1;
    } else if (isDiagonal2Win) {
      win = diagonal2;
    }

    return win;
  }

  static endGame(winner) {
    if (winner === this.player) {
      Screen.setMessage(`You win!`);
    } else if (winner === this.computerPlayer) {
      Screen.setMessage(`The AI wins!`);
    } else if (winner === 'T') {
      Screen.setMessage(`Tie game!`);
    } else {
      Screen.setMessage(`Game Over`);
    }
    Screen.render();
    Screen.quit();
  }

}

module.exports = TTT;
