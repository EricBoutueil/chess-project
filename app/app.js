'use strict';

angular.module('myApp', ['nywton.chess'])

.config(['nywtonChessboardConfigProvider', function nywtonChessConfigConfig(chessboardProvider) {
  chessboardProvider.pieceTheme('bower_components/chessboard.js/dist/img/chesspieces/wikipedia/{piece}.png');
}])

.controller('BodyCtrl', function BodyCtrl($scope) {
  // players names
  this.playerOne = "Player1"
  this.playerTwo = "Player2"
  this.turnFor = function turnFor(game) {
    return game.turn() === "w" ? this.playerOne + "'s turn" : this.playerTwo + "'s turn";
  };
  // game status
  this.gameStatus = function gameStatus(game) {
    if (game.fen() === "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1") {
      return "Game not started"
    } else if (game.in_check() === true) {
      return game.turn() === "w" ? "White is in check !" : "Black is in check !" ;
    } else if (game.in_checkmate() === true) {
      return game.turn() === "w" ? "White is in checkmate !" : "Black is in checkmate !" ;
    } else if (game.in_stalemate() === true) {
      return game.turn() === "w" ? "White is in stalemate !" : "Black is in stalemate !" ;
    } else if (game.in_threefold_repetition() === true) {
      return "Threefold repetition: Game is a draw !" ;
    } else if (game.in_draw() === true) {
      return "Game is a draw !" ;
    } else {
      return "Ongoing game"
    }
  };
  // game reset
  $scope.reRender = true; //initial value
  $scope.resetNytonChessgame = function(){
      $scope.reRender = false;
      var timer = $timeout(function(){
          $scope.reRender = true;
          $timeout.cancel(timer);
      }, 500);
  }
})

.filter('capitalize', function() {
    return function(input) {
      return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
})

.directive('chessgameDebug', [function () {
  var directive = {
    restrict: 'A',
    priority: 1,
    scope : {
      game: '=chessgameDebug',
    },
    template: '<div>' +
     '<button type="button" data-ng-click="_debug = !_debug">show debug</button>' +
     '<div class="game-debug-container" data-ng-show="_debug">' +
       '<span class="label label-info">Game debug</span>' +
       '<p><code>game_over()? {{game.game_over()}}</code></p>'+
       '<p><code>fen()? {{game.fen()}}</code></p>'+
       '<p><code>history()? {{game.history()}}</code></p>'+
       '<p><code>in_check()? {{game.in_check()}}</code></p>'+
       '<p><code>in_checkmate()? {{game.in_checkmate()}}</code></p>'+
       '<p><code>in_stalemate()? {{game.in_stalemate()}}</code></p>'+
       '<p><code>in_draw()? {{game.in_draw()}}</code></p>'+
       '<p><code>in_threefold_repetition()? {{game.in_threefold_repetition()}}</code></p>'+
       '<p><code>insufficient_material()? {{game.insufficient_material()}}</code></p>'+
       '<p><code>moves()? {{game.moves()}}</code></p>'+
       '<p><pre style="font-size: 0.7em">{{game.ascii()}}</pre></p>'+
     '</div>' +
   '</div>',
  };

  return directive;
}]);

