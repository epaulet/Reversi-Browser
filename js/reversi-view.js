$.Reversi = function (el) {
  this.$el = $(el);
  this.board = new Board();
  this.$board = this.$el.find('.reversi-board');
  this.$messages = this.$el.find('.reversi-messages');
  this.turn = 'black';

  this.makeBoard();

  this.registerEvents();
};

$.Reversi.prototype.makeBoard = function () {
  var squaresHtml = "";
  for (var i = 0; i < 64; i++) {
    var row = Math.floor(i / 8) + 1;
    var col = i % 8 + 1;
    squaresHtml += '<div class="square" data-coords="[' + [row, col] + ']"></div>';
  }
  this.$board.html(squaresHtml);
  this.$messages.html('Your turn, ' + this.turn + '!');

  this.render();
};

$.Reversi.prototype.render = function () {
  var $squares = this.$board.children('.square');
  $squares.empty();
  var board = this.board;

  $squares.each(function () {
    var $square = $(this);
    var piece = board.getPiece($square.data('coords'));
    if (piece) {
      $piece = $('<div class="piece"></div>');
      $piece.addClass(piece.color);
      $square.html($piece);
      $square.addClass('occupied');
    }
  });

  this.$messages.html('Your turn, ' + this.turn + '!');
};

$.Reversi.prototype.registerEvents = function () {
  this.$board.on('click', '.square', this.makeMove.bind(this));
};

$.Reversi.prototype.makeMove = function (event) {
  var $square = $(event.currentTarget);
  var pos = $square.data('coords');
  var color = this.turn;

  if (this.board.validMove(pos, color)) {
    this.board.placePiece(pos, color);
    if (this.board.isOver()) {
      this.endGame();
    }
    this.switchTurn();
    this.render();
  }
};

$.Reversi.endGame = function () {
  this.$board.off('click');
  this.$messages.html('You win, ' + this.turn + '!');
};

$.Reversi.prototype.switchTurn = function () {
  this.turn = this.turn === "black" ? "white" : "black";
};

$.fn.reversi = function () {
  return this.each(function () {
    new $.Reversi(this);
  });
};
