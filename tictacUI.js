$(document).ready(function() {

  ticTacUI();
  
});

const BoardTrans = [[6, 1, 8], [7, 5, 3], [2, 9, 4]]
const BoardRevTrans = [[-1, -1], [0, 1], [2, 0], [1, 2], [2, 2], [1, 1], [0, 0], [1, 0], [0, 2], [2, 1]]


var ticTacUI = function() {
  game = new Game();

  // Handle click on piece or grid
  game.click = function(event) {
    var cell = event.target;
    if(event.target.classList.contains("piece")) {
      updateBlurb("You can't move there.")
    }
    else {
      var move = coordinatesToSpace( gameBoard.coordinates(cell) );
      // alert("You clicked on " + move);
      gameBoard.addPiece(cell.id, x);
      updateBlurb("Thinking...");
      submitMove(move);
    }
  };

  var spaceToCoordinates = function(number) {
    return BoardRevTrans[number];

  }

  var coordinatesToSpace = function(coordinates) {
    var row = coordinates[0];
    var column = coordinates[1];
    return BoardTrans[row][column];
  }


  // Submit player move to server and get AI response
  var submitMove = function(move) {
    // Perform Ajax call to submit move to server
    if(ticTacAI.makeMove(move)) {
      computerMove();
    }
    else {
      alert("Can't make that move!");
    }
  }

  var computerMove = function() {
    if(ticTacAI.lost(ticTacAI.state)) {
      updateBlurb("You win!");
      updateFace("anguished");
    }
    else if(ticTacAI.done(ticTacAI.state)) {
      updateBlurb("Cat's game!  Refresh to play again.");
      updateFace("smiling");

    }
    else {
      // Make computer move
      var move = ticTacAI.computerMove()
      ticTacAI.makeMove(move);
      var coord = spaceToCoordinates(move);
      var destination = gameBoard.cellByCoordinates(coord[0], coord[1]);
      gameBoard.addPiece(destination.id, o);
      // Check to see whether computer has won
      if(ticTacAI.lost(ticTacAI.state)) {
        updateBlurb("I win!");
        updateFace("smiling");
      }
      else {
        updateBlurb("I move to " + destination.id + ".");
        updateFace("neutral");
      }
    }
  }

  var location = function(cell) {
    console.log("location = " + gameBoard.coordinates(cell))
    return gameBoard.coordinates(cell);
  }

  // Check for a win
  var checkForWin = function() {

  }

  var lost = function(pieceClass) {
    return gameBoard.pieceByClass(pieceClass).length == 0;
  }

  // Create game board

  gameBoard = Grid.generate("board", 5, 5, 3, 3, 120, 120);
  o = new Piece("o", "o");
  x = new Piece("x", "x");




}


