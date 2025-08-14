const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver;

suite('Unit Tests', () => {
  suiteSetup(() => {
    solver = new Solver();
  });

  const validPuzzle =
    '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9....5.9....1.9.4.7.4.4.3..6';
  const invalidCharPuzzle =
    '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9....5.9....1.9.4.7.4.4.3..X';
  const shortPuzzle =
    '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9....5.9';
  const solvedPuzzle =
    '135762984946381257728459613694517832812936745357824196473298561581673429269145378';

  test('Logic handles a valid puzzle string of 81 characters', () => {
    assert.isTrue(solver.validate(validPuzzle).valid);
  });

  test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', () => {
    const result = solver.validate(invalidCharPuzzle);
    assert.isFalse(result.valid);
    assert.equal(result.error, 'Invalid characters in puzzle');
  });

  test('Logic handles a puzzle string that is not 81 characters in length', () => {
    const result = solver.validate(shortPuzzle);
    assert.isFalse(result.valid);
    assert.equal(result.error, 'Expected puzzle to be 81 characters long');
  });

  test('Logic handles a valid row placement', () => {
    assert.isTrue(solver.checkRowPlacement(validPuzzle, 'A', 2, '3'));
  });

  test('Logic handles an invalid row placement', () => {
    assert.isFalse(solver.checkRowPlacement(validPuzzle, 'A', 2, '1'));
  });

  test('Logic handles a valid column placement', () => {
    assert.isTrue(solver.checkColPlacement(validPuzzle, 'A', 2, '3'));
  });

  test('Logic handles an invalid column placement', () => {
    assert.isFalse(solver.checkColPlacement(validPuzzle, 'A', 2, '5'));
  });

  test('Logic handles a valid region (3x3 grid) placement', () => {
    assert.isTrue(solver.checkRegionPlacement(validPuzzle, 'A', 2, '3'));
  });

  test('Logic handles an invalid region (3x3 grid) placement', () => {
    assert.isFalse(solver.checkRegionPlacement(validPuzzle, 'A', 2, '2'));
  });

  test('Valid puzzle strings pass the solver', () => {
    const result = solver.solve(validPuzzle);
    assert.isTrue(result.valid);
  });

  test('Invalid puzzle strings fail the solver', () => {
    const result = solver.solve(invalidCharPuzzle);
    assert.isFalse(result.valid);
  });

  test('Solver returns the expected solution for an incomplete puzzle', () => {
    const result = solver.solve(validPuzzle);
    assert.equal(result.solution, solvedPuzzle);
  });
});
