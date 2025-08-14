'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route('/api/check').post((req, res) => {
    const { puzzle, coordinate, value } = req.body;

    // Required fields check
    if (!puzzle || !coordinate || !value) {
      return res.json({ error: 'Required field(s) missing' });
    }

    // Puzzle validation
    const validCheck = solver.validate(puzzle);
    if (!validCheck.valid) {
      return res.json({ error: validCheck.error });
    }

    // Coordinate validation
    if (!/^[A-I][1-9]$/.test(coordinate)) {
      return res.json({ error: 'Invalid coordinate' });
    }

    // Value validation
    if (!/^[1-9]$/.test(value)) {
      return res.json({ error: 'Invalid value' });
    }

    const row = coordinate[0];
    const column = coordinate[1];
    const board = solver.stringToBoard(puzzle);
    const rowIndex = solver.rowLetterToIndex(row);
    const colIndex = Number(column) - 1;

    // ✅ Requirement #9: If value already exists at that coordinate, it's valid
    if (board[rowIndex][colIndex] === value) {
      return res.json({ valid: true });
    }

    const conflicts = [];
    if (!solver.checkRowPlacement(puzzle, row, column, value)) {
      conflicts.push('row');
    }
    if (!solver.checkColPlacement(puzzle, row, column, value)) {
      conflicts.push('column');
    }
    if (!solver.checkRegionPlacement(puzzle, row, column, value)) {
      conflicts.push('region');
    }

    if (conflicts.length > 0) {
      return res.json({ valid: false, conflict: conflicts });
    }

    return res.json({ valid: true });
  });

  app.route('/api/solve').post((req, res) => {
    const { puzzle } = req.body;

    if (!puzzle) {
      return res.json({ error: 'Required field missing' });
    }

    const result = solver.solve(puzzle);
    if (!result.valid) {
      return res.json({ error: result.error });
    }

    return res.json({ solution: result.solution });
  });
};
