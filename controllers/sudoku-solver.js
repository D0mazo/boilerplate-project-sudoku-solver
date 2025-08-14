'use strict';

class SudokuSolver {
  validate(puzzleString) {
    if (!puzzleString) {
      return { valid: false, error: 'Required field missing' };
    }
    if (/[^1-9.]/.test(puzzleString)) {
      return { valid: false, error: 'Invalid characters in puzzle' };
    }
    if (puzzleString.length !== 81) {
      return { valid: false, error: 'Expected puzzle to be 81 characters long' };
    }
    return { valid: true };
  }

  rowLetterToIndex(row) {
    return row.toUpperCase().charCodeAt(0) - 65;
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

  checkRowPlacement(puzzleString, row, column, value) {
    const rowIndex = this.rowLetterToIndex(row);
    const board = this.stringToBoard(puzzleString);
    const colIndex = Number(column) - 1;
    return board[rowIndex].every((cell, idx) => idx === colIndex || cell !== value);
  }

 checkColPlacement(puzzleString, row, column, value) {
  const rowIndex = this.rowLetterToIndex(row);
  const colIndex = Number(column) - 1;
  const board = this.stringToBoard(puzzleString);
  console.log(`Checking column ${colIndex} for value ${value}, excluding row ${rowIndex}`);
  console.log(`Column values: ${board.map(row => row[colIndex]).join(',')}`);
  for (let r = 0; r < 9; r++) {
    if (r !== rowIndex && board[r][colIndex] === value) {
      console.log(`Conflict found at row ${r}, col ${colIndex}: ${value}`);
      return false;
    }
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
        if (r !== rowIndex || c !== colIndex) {
          if (board[r][c] === value) return false;
        }
      }
    }
    return true;
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
            if (this.isSafe(board, r, c, val)) {
              board[r][c] = val;
              if (this.solveBoard(board)) return true;
              board[r][c] = '.';
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  isSafe(board, row, col, value) {
    for (let c = 0; c < 9; c++) {
      if (c !== col && board[row][c] === value) return false;
    }
    for (let r = 0; r < 9; r++) {
      if (r !== row && board[r][col] === value) return false;
    }
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let r = startRow; r < startRow + 3; r++) {
      for (let c = startCol; c < startCol + 3; c++) {
        if (!(r === row && c === col) && board[r][c] === value) return false;
      }
    }
    return true;
  }
}

module.exports = SudokuSolver;