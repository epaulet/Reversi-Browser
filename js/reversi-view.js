$.Reversi = function (el) {
  this.$el = $(el);
  this.board = new Board();
  this.$board = this.$el.find('.reversi-board');
  this.$messages = this.$el.find('.reversi-messages');

  this.makeBoard();
  this.render();
};

$.Reversi.prototype.makeBoard = function () {
  var squaresHtml = "";
  for (var i = 0; i < 64; i++) {
    var row = Math.floor(i / 8) + 1;
    var col = i % 8 + 1;
    squaresHtml += '<div class="square" data-coords="[' + [row, col] + ']"></div>';
  }
  this.$board.html(squaresHtml);
};

$.Reversi.prototype.render = function () {
  var $squares = this.$board.children('.square');
  $squares.removeClass('black').removeClass('white');
  var board = this.board;

  $squares.each(function () {
    var $square = $(this);
    var piece = board.getPiece($square.data('coords'));
    if (piece) {
      $square.addClass(piece.color);
    }
  });
};

$.fn.reversi = function () {
  return this.each(function () {
    new $.Reversi(this);
  });
};
