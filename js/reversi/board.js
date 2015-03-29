var Piece = require("./piece");

/**
 * Returns a 2D array (8 by 8) with two black pieces at [3, 4] and [4, 3]
 * and two white pieces at [3, 3] and [4, 4]
 */
function _makeGrid () {
  var grid = [];
  for (var i = 0; i < 8; i ++) {
    grid.push([null, null, null, null, null, null, null, null]);
  }

  grid[3][4] = new Piece('black');
  grid[4][3] = new Piece('black');
  grid[3][3] = new Piece('white');
  grid[4][4] = new Piece('white');

  return grid;
}

/**
 * Constructs a Board with a starting grid set up.
 */
var Board = window.Board = function () {
  this.grid = _makeGrid();
};

Board.DIRS = [
  [ 0,  1], [ 1,  1], [ 1,  0],
  [ 1, -1], [ 0, -1], [-1, -1],
  [-1,  0], [-1,  1]
];

/**
 * Returns the piece at a given [x, y] position,
 * throwing an Error if the position is invalid.
 */
Board.prototype.getPiece = function (pos) {
  var row = pos[0] - 1;
  var col = pos[1] - 1;

  return this.isValidPos(pos) ? this.grid[row][col] : null;
};

/**
 * Checks if there are any valid moves for the given color.
 */
Board.prototype.hasMove = function (color) {
  return this.validMoves(color).length > 0;
};

/**
 * Checks if the piece at a given position
 * matches a given color.
 */
Board.prototype.isMine = function (pos, color) {
  var piece = this.getPiece(pos);

  return piece.color === color;
};

/**
 * Checks if a given position has a piece on it.
 */
Board.prototype.isOccupied = function (pos) {
  return this.getPiece(pos) !== null;
};

/**
 * Checks if both the white player and
 * the black player are out of moves.
 */
Board.prototype.isOver = function () {
  return !this.hasMove("white") && !this.hasMove("black");
};

/**
 * Checks if a given position is on the Board.
 */
Board.prototype.isValidPos = function (pos) {
  var row = pos[0];
  var col = pos[1];

  return (row <= 8 && row >= 1) && (col <= 8 && col >= 1);
};

/**
 * Recursively follows a direction away from a starting position, adding each
 * piece of the opposite color until hitting another piece of the current color.
 * It then returns an array of all pieces between the starting position and
 * ending position.
 *
 * Returns null if it reaches the end of the board before finding another piece
 * of the same color.
 *
 * Returns null if it hits an empty position.
 *
 * Returns null if no pieces of the opposite color are found.
 */
function _positionsToFlip (pos, color, dir, board) {
  var positions = [];
  var currentPos = [].concat(pos); // Prevent mutating parameter
  var currentPiece = null;

  do {
    currentPos = [(currentPos[0] + dir[0]), (currentPos[1] + dir[1])];
    currentPiece = board.getPiece(currentPos);

    if (currentPiece === null) {
      return [];
    } else if (currentPiece.oppColor() === color) {
      positions.push(currentPos);
    }
  } while (currentPiece.color !== color);

  return positions;
}

/**
 * Adds a new piece of the given color to the given position, flipping the
 * color of any pieces that are eligible for flipping.
 *
 * Throws an error if the position represents an invalid move.
 */
Board.prototype.placePiece = function (pos, color) {
  var row = pos[0] - 1;
  var col = pos[1] - 1;

  this.grid[row][col] = new Piece(color);

  var currentBoard = this;
  var positionsToFlip = [];
  Board.DIRS.forEach(function (dir) {
    positionsToFlip = positionsToFlip.concat(_positionsToFlip(pos, color, dir, currentBoard));
  });

  positionsToFlip.forEach(function (position) {
    currentBoard.getPiece(position).flip();
  });
};

/**
 * Prints a string representation of the Board to the console.
 */
Board.prototype.print = function () {
  console.log("  1 2 3 4 5 6 7 8");
  for (var rowNum = 1; rowNum <= 8; rowNum++) {
    var rowString = (rowNum) + " ";
    for (var colNum = 1; colNum <= 8; colNum++) {
      var piece = this.getPiece([rowNum, colNum]);
      rowString += piece === null ? "_" : piece.toString();
      rowString += " ";
    }
    console.log(rowString);
  }
};

/**
 * Checks that a position is not already occupied and that the color
 * taking the position will result in some pieces of the opposite
 * color being flipped.
 */
Board.prototype.validMove = function (pos, color) {
  if (this.isOccupied(pos)) {
    return false;
  }

  var flips = [];
  for (var i = 0; i < Board.DIRS.length; i++) {
    flips = flips.concat(_positionsToFlip(pos, color, Board.DIRS[i], this));
  }


  return flips.length === 0 ? false : true;
};

/**
 * Produces an array of all valid positions on
 * the Board for a given color.
 */
Board.prototype.validMoves = function (color) {
  var validMoves = [];

  for (var rowNum = 1; rowNum <= 8; rowNum++) {
    for (var colNum = 1; colNum <= 8; colNum++) {
      var pos = [rowNum, colNum];
      if (this.validMove(pos, color)) {
        validMoves.push(pos);
      }
    }
  }

  return validMoves;
};

module.exports = Board;
