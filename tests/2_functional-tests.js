const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
  const validPuzzle =
    '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9....5.9....1.9.4.7.4.4.3..6';
  const solvedPuzzle =
    '135762984946381257728459613694517832812936745357824196473298561581673429269145378';
  const invalidCharPuzzle =
    '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9....5.9....1.9.4.7.4.4.3..X';
  const shortPuzzle =
    '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9....5.9';
  const unsolvablePuzzle =
    '999..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9....5.9....1.9.4.7.4.4.3..6';

  // --- /api/solve ---
  test('Solve a puzzle with valid puzzle string: POST request to /api/solve', function (done) {
    chai
      .request(server)
      .post('/api/solve')
      .send({ puzzle: validPuzzle })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, 'solution');
        assert.equal(res.body.solution, solvedPuzzle);
        done();
      });
  });

  test('Solve a puzzle with missing puzzle string: POST request to /api/solve', function (done) {
    chai
      .request(server)
      .post('/api/solve')
      .send({})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: 'Required field missing' });
        done();
      });
  });

  test('Solve a puzzle with invalid characters: POST request to /api/solve', function (done) {
    chai
      .request(server)
      .post('/api/solve')
      .send({ puzzle: invalidCharPuzzle })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: 'Invalid characters in puzzle' });
        done();
      });
  });

  test('Solve a puzzle with incorrect length: POST request to /api/solve', function (done) {
    chai
      .request(server)
      .post('/api/solve')
      .send({ puzzle: shortPuzzle })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: 'Expected puzzle to be 81 characters long' });
        done();
      });
  });

  test('Solve a puzzle that cannot be solved: POST request to /api/solve', function (done) {
    chai
      .request(server)
      .post('/api/solve')
      .send({ puzzle: unsolvablePuzzle })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: 'Puzzle cannot be solved' });
        done();
      });
  });

  // --- /api/check ---
  test('Check a puzzle placement with all fields: POST request to /api/check', function (done) {
    chai
      .request(server)
      .post('/api/check')
      .send({ puzzle: validPuzzle, coordinate: 'A2', value: '3' })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, 'valid');
        assert.isTrue(res.body.valid);
        done();
      });
  });

  test('Check a puzzle placement with single placement conflict: POST request to /api/check', function (done) {
    chai
      .request(server)
      .post('/api/check')
      .send({ puzzle: validPuzzle, coordinate: 'A2', value: '6' }) // row conflict
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isFalse(res.body.valid);
        assert.deepEqual(res.body.conflict, ['row']);
        done();
      });
  });

  test('Check a puzzle placement with multiple placement conflicts: POST request to /api/check', function (done) {
    chai
      .request(server)
      .post('/api/check')
      .send({ puzzle: validPuzzle, coordinate: 'A2', value: '5' }) // row + column conflict
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isFalse(res.body.valid);
        assert.includeMembers(res.body.conflict, ['row', 'column']);
        done();
      });
  });

  test('Check a puzzle placement with all placement conflicts: POST request to /api/check', function (done) {
    chai
      .request(server)
      .post('/api/check')
      .send({ puzzle: validPuzzle, coordinate: 'A2', value: '2' }) // row + column + region conflict
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isFalse(res.body.valid);
        assert.includeMembers(res.body.conflict, ['row', 'column', 'region']);
        done();
      });
  });

  test('Check a puzzle placement with missing required fields: POST request to /api/check', function (done) {
    chai
      .request(server)
      .post('/api/check')
      .send({ puzzle: validPuzzle, coordinate: 'A2' })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: 'Required field(s) missing' });
        done();
      });
  });

  test('Check a puzzle placement with invalid characters: POST request to /api/check', function (done) {
    chai
      .request(server)
      .post('/api/check')
      .send({ puzzle: invalidCharPuzzle, coordinate: 'A2', value: '3' })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: 'Invalid characters in puzzle' });
        done();
      });
  });

  test('Check a puzzle placement with incorrect length: POST request to /api/check', function (done) {
    chai
      .request(server)
      .post('/api/check')
      .send({ puzzle: shortPuzzle, coordinate: 'A2', value: '3' })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: 'Expected puzzle to be 81 characters long' });
        done();
      });
  });

  test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check', function (done) {
    chai
      .request(server)
      .post('/api/check')
      .send({ puzzle: validPuzzle, coordinate: 'Z9', value: '3' })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: 'Invalid coordinate' });
        done();
      });
  });

  test('Check a puzzle placement with invalid placement value: POST request to /api/check', function (done) {
    chai
      .request(server)
      .post('/api/check')
      .send({ puzzle: validPuzzle, coordinate: 'A2', value: 'A' })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: 'Invalid value' });
        done();
      });
  });
});
