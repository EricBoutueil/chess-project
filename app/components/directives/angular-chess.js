(function () {
  'use strict';

  angular.module('nywton.chess', ['nywton.chessboard'])

  .service('NywtonChessGameService', ['$log', function ChessGameService($log) {
    this.onDragStart = function(game, source, piece, position, orientation) {
      $log.debug('lift piece ' + piece + ' from ' + source + ' - ' + position + ' - ' + orientation);
      if (game.game_over() === true ||
          (game.turn() === 'w' && piece.search(/^b/) !== -1) ||
          (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
        return false;
      }
      return true;
    };

    this.onDrop = function(game, source, target) {
      // see if the move is legal
      var move = game.move({
        from: source,
        to: target,
        promotion: 'q' // NOTE: always promote to a queen for example simplicity
      });
      // illegal move
      if (move === null) {
        $log.log('Illegal move.. cannot move from ' + source + ' to ' + target);
        return 'snapback';
      }

      $log.debug('moved from ' + source + ' to ' + target);
    };

    this.onSnapEnd = function(game, board, source, target, piece) {
      $log.debug('onSnapEnd ' + piece + ' from ' + source + ' to ' + target);
      // update the board position after the piece snap
      // for castling, en passant, pawn promotion
      board.position(game.fen());
    };
  }])

  .directive('nywtonChessgame', ['$window','$log', 'NywtonChessGameService', function($window, $log, ChessGameService) {

    var directive = {
      restrict: 'E',
      template: '<div>' +
        '<nywton-chessboard board="board" position="\'start\'" draggable="true" on-change="onChange" on-drag-start-cb="onDragStart" on-snap-end="onSnapEnd" on-drop="onDrop"></nywton-chessboard>' +
      '</div>',
      replace:false,
      scope : {
        'name': '@',
        'game': '=',
        'board': '=',
      },
      controller: ['$scope', function chessgame($scope) {
        var game = $scope.game = new $window.Chess();
        game.name = $scope.name || 'game' + $scope.$id;

        this.game = function gameF() {
          return $scope.game;
        };
        this.board = function boardF() {
          return $scope.board;
        };
        $scope.onDragStart = function onDragStartF(source, piece, position, orientation) {
          return ChessGameService.onDragStart($scope.game, source, piece, position, orientation);
        };
        $scope.onSnapEnd = function onSnapEndF(source, target, piece) {
          return ChessGameService.onSnapEnd($scope.game, $scope.board, source, target, piece);
        };
        $scope.onDrop = function onDropF(source, target) {
          return ChessGameService.onDrop($scope.game, source, target);
        };
        $scope.onChange = function onChangeF(oldPosition, newPosition) {
          return angular.noop(oldPosition, newPosition);
        };
      }],
    };

    return directive;
  }])

  ;

})();
