// User interface for Annuvin
// Requires annuvinAI.js

// Page-specific ready function
$('#annuvin').ready(function() {

  annuvin();
  
});

var annuvin = function() {
  game = new Game();

  // Six directions for hex board
  var DIRECTIONS = {
    e: [0, 1],
    w: [0, -1],
    ne: [-1, 1],
    nw: [-1, 0],
    se: [1, 0],
    sw: [1, -1]
  }

  // Handle click on piece or grid
  game.click = function(event) {
    var cell = event.target;
    if(event.target.classList.contains("BlackK")) {
      clickPiece(cell);
    }
    else {
      clickCell(cell);
    }
  };

  // Handle click on a movable piece
  var clickPiece = function(piece) { 
    console.log("clicked on piece " + piece.id);
    if(!annuvinAI.state.player == 0)
    { 
      alert ("It's not your move!");
      return false;
    }
    var loc = location(piece);
    data = { move: [loc[1], loc[0]] };
    // If clicking on active piece
    if(game.activePiece == piece) {
      // If it's a legal move, submit it
      if(piece.parentElement.classList.contains("highlight")) {

      }
      // Otherwise clear active piece
      else if(!annuvinAI.state.movingPiece) {
        game.activePiece = null;
        unHighlightTargets();
        updateBlurb("Click on a piece to move.");
      }
    }
    // Otherwise, activate piece
    else {
      unHighlightTargets();
      game.activePiece = piece;
      highlightTargets(piece);
      updateBlurb("Click on highlighted space to move.");
    }

  }

  // get list of valid targets from server
  highlightTargets = function(piece) {
    // Find location of piece
    var loc = location(piece.parentElement);
    // Note: reverse coordinates because UI and AI
    // use different order (need to fix this)
    loc.reverse();
    console.log("That piece seems to be at: " + loc);
    var s = annuvinAI.state;
    // Get list of legal moves for that piece
    var moves = annuvinAI.getMoves(s, loc, annuvinAI.totalMoves(s), false);
    console.log(moves);
    if(moves.length > 0) {
      // Highlight targets
      for(var i=0; i<moves.length; i++) {
        // Need to reverse coordinates again - fix this!
        var target = gameBoard.cellByCoordinates(moves[i][1][1], moves[i][1][0]);
        target.classList.add("highlight");
      }
    }
    else alert("Can't get move for that piece!");
  }

  // Remove all highlighting from game board
  var unHighlightTargets = function() {
    var targetList = document.getElementsByClassName("highlight");
    while(targetList.length > 0) {
      target = targetList[0];
      target.classList.remove("highlight");
    }
  }

  // Handle click on empty cell or enemy piece
  var clickCell = function(cell) { 
    if(cell.classList.contains("WhiteK")) { cell = cell.parentElement };
    console.log("clicked on cell " + cell.id);
    piece = game.activePiece;
    // Make sure a piece is ready to move
    if(piece && cell.classList.contains("highlight")) {
      // Reverse coordinates - need to fix this!
      var from = location(piece.parentElement).reverse();
      var to = location(cell).reverse();
 
      console.log("You seem to be moving from " + from + " to " + to);
      updateBlurb("Thinking...");
      unHighlightTargets();
      movePiece(piece, cell);

      // Make move
      annuvinAI.makeMove([from, to]);
      // Check to see whether either player has won
      checkForWin();
      // If player's move is over, get ai response
      if (annuvinAI.state.movingPiece) {
        highlightTargets(piece);
      }
      else
      {
        game.activePiece = null;
        // Delay starting tree search to allow DOM update
        setTimeout(getResponse, 50);
      }
    }
  }

  // var submitMove = function(move) {
  //     annuvinAI.makeMove(move);

  // }

  // Get AI response
  var getResponse = function() {
    console.log("My turn!");
    var move = annuvinAI.computerMove();
    annuvinAI.makeMove(move);
    var from = gameBoard.cellByCoordinates(move[0][1], move[0][0]);
    var to = gameBoard.cellByCoordinates(move[1][1], move[1][0]);
    updateBlurb("I move from " + from.id + " to " + to.id + ".");
    piece = from.firstChild;
    movePiece(piece, to);
    // Continue making additional moves for computer if possible
    if(annuvinAI.state.movingPiece) {
      // Delay starting tree search to allow DOM update
      setTimeout(getResponse, 200);
    }
    checkForWin();
  }

  var location = function(cell) {
    console.log("location = " + gameBoard.coordinates(cell))
    return gameBoard.coordinates(cell);
  }

  // Check for a win
  var checkForWin = function() {
    if(lost("BlackK")) { updateBlurb("I win!"); }
    if(lost("WhiteK")) { updateBlurb("You win!"); }
  }

  var lost = function(pieceClass) {
    return gameBoard.pieceByClass(pieceClass).length == 0;
  }


  // Functions to allow dragging and dropping
  // (Not used in this game)
  game.dragstart = function(event) {
    // game.activePiece = this;
    // event.dataTransfer.setData("text", event.target.id);
    clickPiece(event.target);
  };

  game.dragover = function(event) {
    var cell = event.target;
    if(cell.classList.contains("WhiteK")) {
      cell = cell.parentElement;
    }
    if(cell.classList.contains("highlight")) {
      event.preventDefault();
    }
  };

  // This is run when user tries to drop a piece
  game.drop = function(event) {
    clickCell(event.target);
  };

  // Create game board

  gameBoard = Grid.generateHex("board", 0, 16, 5, 5, 50, 42);
  bk = new Piece("black king", "BlackK");
  wk = new Piece("white king", "WhiteK");
  gameBoard.addDraggablePiece("A1", bk);
  gameBoard.addDraggablePiece("B1", bk);
  gameBoard.addDraggablePiece("C1", bk);
  gameBoard.addDraggablePiece("D2", bk);
  gameBoard.addDraggablePiece("B4", wk);
  gameBoard.addDraggablePiece("C5", wk);
  gameBoard.addDraggablePiece("D5", wk);
  gameBoard.addDraggablePiece("E5", wk);


}
