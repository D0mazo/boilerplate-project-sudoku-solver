'use strict';

class SudokuSolver {
  // Validate puzzle string: length 81, only digits or '.'
  validate(puzzleString) {
    if (!puzzleString) {
      return { valid: false, error: 'Required field missing' };
    }
    if (puzzleString.length !== 81) {
      return { valid: false, error: 'Expected puzzle to be 81 characters long' };
    }
    if (/[^1-9.]/.test(puzzleString)) {
      return { valid: false, error: 'Invalid characters in puzzle' };
    }
    return { valid: true };
  }

  // Helpers to translate row letters to index
  rowLetterToIndex(row) {
    return row.toUpperCase().charCodeAt(0) - 65; // 'A' -> 0, 'B' -> 1 ...
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const rowIndex = this.rowLetterToIndex(row);
    const board = this.stringToBoard(puzzleString);
    const rowVals = board[rowIndex];
    return !rowVals.includes(value);
  }

  checkColPlacement(puzzleString, row, column, value) {
    const colIndex = Number(column) - 1;
    const board = this.stringToBoard(puzzleString);
    for (let i = 0; i < 9; i++) {
      if (board[i][colIndex] === value) return false;
    }
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const rowIndex = this.rowLetterToIndex(row);
    const colIndex = Number(column) - 1;
    const board = this.stringToBoard(puzzleString);

    const startRow = Math.floor(rowIndex / 3) * 3;
    const startCol = Math.floor(colIndex / 3) * 3;

    for (let r = startRow; r < startRow + 3; r++) {
      for (let c = startCol; c < startCol + 3; c++) {
        if (board[r][c] === value) return false;
      }
    }
    return true;
  }

  stringToBoard(puzzleString) {
    const board = [];
    for (let i = 0; i < 81; i += 9) {
      board.push(puzzleString.slice(i, i + 9).split(''));
    }
    return board;
  }

  boardToString(board) {
    return board.map(r => r.join('')).join('');
  }

  solve(puzzleString) {
    const validCheck = this.validate(puzzleString);
    if (!validCheck.valid) return validCheck;

    const board = this.stringToBoard(puzzleString);

    if (!this.solveBoard(board)) {
      return { valid: false, error: 'Puzzle cannot be solved' };
    }

    return { valid: true, solution: this.boardToString(board) };
  }

  solveBoard(board) {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (board[r][c] === '.') {
          for (let num = 1; num <= 9; num++) {
            const val = String(num);
            if (
              this.isSafe(board, r, c, val)
            ) {
              board[r][c] = val;
              if (this.solveBoard(board)) {
                return true;
              }
              board[r][c] = '.';
            }
          }
          return false; // no valid number found
        }
      }
    }
    return true; // solved
  }

  isSafe(board, row, col, value) {
    // Row check
    if (board[row].includes(value)) return false;
    // Column check
    for (let r = 0; r < 9; r++) {
      if (board[r][col] === value) return false;
    }
    // Region check
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let r = startRow; r < startRow + 3; r++) {
      for (let c = startCol; c < startCol + 3; c++) {
        if (board[r][c] === value) return false;
      }
    }
    return true;
  }
}

module.exports = SudokuSolver;
