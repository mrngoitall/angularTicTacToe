var app = angular.module('ticTacToe',[]);

app.controller('MainController', function($scope) {
  $scope.currentPlayer = 'X';
  $scope.winner = '';
  $scope.marks = [[],[],[]];
  $scope.marks[1][1] = 'O';
  $scope.movesLeft = 8;

  $scope.attemptMove = function(row,num){
    if($scope.winner) return $scope.gameOver();
    if($scope.marks[row][num]) return;
    $scope.marks[row][num] = $scope.currentPlayer;
    $scope.currentPlayer = $scope.currentPlayer === 'X' ? 'O' : 'X';
    $scope.preventLoss();
    $scope.movesLeft--;
    if($scope.movesLeft === 7) $scope.secondMove(row,num);
    $scope.checkForWinner();
    if($scope.currentPlayer === 'O') $scope.attemptWin();
  };

  // Check after each turn to see if a loss could be prevented
  $scope.preventLoss = function(){
    var row0 = $scope.marks[0];
    var row1 = $scope.marks[1];
    var row2 = $scope.marks[2];
    var col0 = [row0[0],row1[0],row2[0]];
    var col1 = [row0[1],row1[1],row2[1]];
    var col2 = [row0[2],row1[2],row2[2]];

    function checkRow(row){
      var matches = row.join('').match(/X/g);
      return matches && matches.length > 1;
    };
    function blockRow(rownum,row){
      for(var i = 0; i < 3; i++){
        if(row[i] !== 'X') $scope.attemptMove(rownum,i);
      }
    };
    function checkCol(col){
      var matches = col.join('').match(/X/g);
      return matches && matches.length > 1;
    };
    function blockCol(colnum,column){
      for(var i = 0; i < 3; i++){
        if(column[i] !== 'X') $scope.attemptMove(i,colnum);
      }
    };

    if(checkRow(row0)){
      blockRow(0,row0);
    } else if(checkRow(row2)){
      blockRow(2,row2);
    }
    if(checkCol(col0)){
      blockCol(0,col0);
    } else if (checkCol(col2)){
      blockCol(2,col2);
    }
  };

  // Tell player Game is over;
  $scope.gameOver = function(){
    alert('Game Over');
    location.reload();
  };

  // Attempt to make a move that will win the game
  $scope.attemptWin = function(){
    var corners = [$scope.marks[0][0],$scope.marks[0][2],$scope.marks[2][0],$scope.marks[2][2]];
    var locations = [[0,0],[0,2],[2,0],[2,2]];
    var middles = [$scope.marks[0][1],$scope.marks[1][0],$scope.marks[1][2],$scope.marks[2][1]];
    var middleLocs = [[0,1],[1,2],[1,2],[2,1]];
    for(var i = 0; i < corners.length; i++){
      if(!corners[i]){
        $scope.attemptMove(locations[i][0],locations[i][1])
        return;
      }
    }
    for(var i = 0; i < middles.length; i++){
      if(!middles[i]){
        $scope.attemptMove(middleLocs[i][0],middleLocs[i][1])
        return;
      }
    }
  };

  // Only expected to execute this function after the second move has been played
  $scope.secondMove = function(row,num){
    if(row === 1){
      if(num === 0) $scope.attemptMove(0,2);
      if(num === 2) $scope.attemptMove(0,0);
    } else if(row === 0){
      num < 2 ? $scope.attemptMove(2,2) : $scope.attemptMove(2,0);
    } else {
      num < 2 ? $scope.attemptMove(0,2) : $scope.attemptMove(0,0);
    }
  };

  // Check the board for possible win combinations
  $scope.checkForWinner = function(){
    var cols = [[],[],[]];
    for (var row = 0; row < 3; row++) {
      // Check each row
      var matches = $scope.marks[row].join('').match(/O/g);
      if (!$scope.winner && matches && matches.length === 3) {
        $scope.winner = 'O';
      }
      for (var colCache = 0; colCache < 3; colCache++) {
        cols[colCache].push($scope.marks[row][colCache])
      }
    }
    for (var col = 0; col < 3; col++) {
      // Check each column
      var matches = $scope.marks[col].join('').match(/O/g);
      if (!$scope.winner && matches && matches.length === 3) {
        $scope.winner = 'O';
      }
    }
    var rightDiag = [$scope.marks[0][0],$scope.marks[1][1],$scope.marks[2][2]].join('').match(/O/g);
    var leftDiag = [$scope.marks[0][2],$scope.marks[1][1],$scope.marks[2][0]].join('').match(/O/g);
    if (!$scope.winner && ((rightDiag && rightDiag.length === 3) || (leftDiag && leftDiag.length === 3))) {
      $scope.winner = 'O';
    }
  };
 });
