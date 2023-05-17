
class ComputerPlayer {

  static getValidMoves(grid) {
    // Your code here
    const valid = [];

    grid.forEach((row, i) => {
      row.forEach((el, idx) => {
        let move;

        if (el === ' ') {
          move = {
            id: `${i}${idx}`,
            row: i,
            col: idx
          };

          valid.push(move);
        }
      });
    });

    return valid;
  }

  static randomMove(grid) {
    // Your code here
    const validMoves = ComputerPlayer.getValidMoves(grid);

    const min = Math.ceil(0);
    const max = Math.floor(validMoves.length);
    const random = Math.floor(Math.random() * (max - min) + min);

    return validMoves[random];
  }

  static adjacentMoves(grid, symbol) {
    let adjacent = [];
    const valid = ComputerPlayer.getValidMoves(grid);

    for (let r = 0; r < grid.length; r++) {
      for (let c = 0; c < grid[0].length; c++) {
        let el = grid[r][c];
        let adj = [];

        let above = {
          id: `${r - 1}${c}`,
          row: r - 1,
          col: c
        };

        let below = {
          id: `${r + 1}${c}`,
          row: r + 1,
          col: c
        };

        let left = {
          id: `${r}${c - 1}`,
          row: r,
          col: c - 1
        };

        let right = {
          id: `${r}${c + 1}`,
          row: r,
          col: c + 1
        };

        let topLeft = {
          id: `${r - 1}${c - 1}`,
          row: r - 1,
          col: c - 1
        };

        let topRight = {
          id: `${r - 1}${c + 1}`,
          row: r - 1,
          col: c + 1
        };

        let bottomLeft = {
          id: `${r + 1}${c - 1}`,
          row: r + 1,
          col: c - 1
        };

        let bottomRight = {
          id: `${r + 1}${c + 1}`,
          row: r + 1,
          col: c + 1
        };

        adj.push(above, below, left, right, topRight, topLeft, bottomRight, bottomLeft);

        const sanAdj = adj.filter(el => {
          const isRow = el.row >= 0 && el.row < grid.length;
          const isCol = el.col >= 0 && el.col < grid[0].length;
          const isValid = valid.some(element => element.id === el.id);
          const isUnique = !( adjacent.some(element => element.id === el.id) );


          if (isRow && isCol && isValid && isUnique) {
            return true;
          }

          return false;
        });


        if (el === symbol  && sanAdj.length > adjacent.length) {
          adjacent = sanAdj;
        }
      }
    }

    return adjacent;
  }

  static getWinningMoves(grid, symbol) {
    // Your code here
    const winningMoves = [];

    const horizontals = ComputerPlayer.getHorizontalWinningMoves(grid, symbol);
    const verticals = ComputerPlayer.getVerticalWinningMoves(grid, symbol);
    const diagonals = ComputerPlayer.getDiagonalWinningMoves(grid, symbol);

    winningMoves.push(...horizontals, ...verticals, ...diagonals);

    return winningMoves;
  }

  static getSmartMove(grid, symbol) {
    // Your code here
    let player;

    if (symbol === 'X') {
      player = 'O';
    } else if (symbol === 'O') {
      player = 'X';
    }

    let playerWins = ComputerPlayer.getWinningMoves(grid, player),
      compWins = ComputerPlayer.getWinningMoves(grid, symbol),
      adjacent = ComputerPlayer.adjacentMoves(grid, player),
      random = ComputerPlayer.randomMove(grid),
      move = {
      row: 0,
      col: 0
    };

    if (playerWins.length <= 0 && compWins.length <= 0 && adjacent.length <= 0) {
      console.log(`Random: ${JSON.stringify(random)}`);
      move.row = random.row;
      move.col = random.col;
      return move;
    } else if (playerWins.length <= 0 && compWins.length <= 0 && adjacent.length > 0){
      console.log(`Adjacent: ${JSON.stringify(adjacent)}`);
      // TODO Increase accuracy by not playing a row and diagonal if it had been played before and instead block another row, col or diag
      move.row = adjacent[0].row;
      move.col = adjacent[0].col;
      return move;
    } else if (playerWins.length > 0 && compWins.length <= 0) {
      console.log(`Player: ${JSON.stringify(playerWins)}`);
      move.row = playerWins[0].row;
      move.col = playerWins[0].col;
      return move;
    } else {
      console.log(`Comp: ${JSON.stringify(compWins)}`);
      move.row = compWins[0].row;
      move.col = compWins[0].col;
      return move;
    }

  }

  static getHorizontalWinningMoves(grid, symbol) {
    const horizontals = [];

    let move = {
      row: 0,
      col: 0
    };

    grid.forEach((row, i) => {
      let count = 0;

      row.forEach(el => {
        if (el === symbol) {
          count++;
        }
      });

      if (count === 2  && row.includes(' ')) {i
        move.row = i;
        move.col = row.indexOf(' ');
        horizontals.push(move);
      }
    });

    return horizontals;
  }

  static getVerticalWinningMoves(grid, symbol) {
    const verticals = [];

    let move = {
      row: 0,
      col: 0
    };

    for (let col = 0; col < grid[0].length; col++) {
      let column = [];
      let count = 0;

      for (let row = 0; row < grid.length; row++) {
        let el = grid[row][col];
        column.push(el);

        if (el === symbol) {
          count++;
        }
      }

      if (count === 2 && column.includes(' ')) {
        move.row = column.indexOf(' ');
        move.col = col;
        verticals.push(move);
      }
    }

    return verticals;
  }

  static getDiagonalWinningMoves(grid, symbol) {
    const diagonals = [];

    let move1 = {
      row: 0,
      col: 0
    };

    let move2 = {
      row: 0,
      col: 0
    };

    const diagonal1 = [];
    const diagonal2 = [];

    let count1 = 0;
    let count2 = 0;

    let row = grid.length;

    for (let col = 0; col < grid[0].length; col++) {

      let el1 = grid[col][row];
      let el2 = grid[col][col];


      diagonal1.push(el1);
      diagonal2.push(el2);

      if (el1 === symbol) {
        count1++;
      }

      if (el2 === symbol) {
        count2++
      }

      row--;
    }

    if (count1 === 2 && diagonal1.includes(' ')) {
      move1.row = diagonal1.indexOf(' ');
      move1.col = diagonal1.reverse().indexOf(' ');
      diagonals.push(move1);
    }

    if (count2 === 2 && diagonal2.includes(' ')) {
      move2.row = diagonal2.indexOf(' ');
      move2.col = diagonal2.indexOf(' ');
      diagonals.push(move2);
    }

    return diagonals;
  }

}

module.exports = ComputerPlayer;
