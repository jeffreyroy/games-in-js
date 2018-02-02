// Game-specific variables

// Constants
const initialPosition = ["- - O O O",
                          "- O . . .",
                           ". . . . .",
                            ". . . X -",
                             "X X X - -"].map(row => row.split(" "));
const symbols = ['X', 'O', '.'];
const numberOfPieces = 4;
const directions = [ [0, 1], [0, -1], [-1, 1], [-1, 0], [1, 0], [1, -1] ];

var annuvinAI = new GameAI(initialPosition, 2);

// Variables to track partial moves
annuvinAI.state.piecesLeft = [4, 4];
annuvinAI.state.movingPiece = null;
annuvinAI.state.movesLeft = 0;
annuvinAI.state.forceAnalysis = false;
annuvinAI.currentMoveList = [];

// Initialize Zobrist array
annuvinAI.zobrist = annuvinAI.zobristArray(3, 19);

// reduce position to minimal array representation 
annuvinAI.positionArray = function(state) {
  // Split rows
  var positionArray = state.position.join().split(",");
  // Delete out-of-bounds positions
  return positionArray.filter(e => e !== "-");
}


// Score of position is difference between number of pieces left
// (More pieces is better)
annuvinAI.heuristicScore = function(state) {
  var player = state.player;
  var piecesLeft = state.piecesLeft;
  return piecesLeft[player] - piecesLeft[this.opponent(player)];
}

annuvinAI.forceAnalysis = function(state) {
  // Fill in
  return false;
}

// Return hash value for a state for indexing purposes
annuvinAI.stateHash = function(state) {
  // fill this in
  var str = this.positionArray(state).join('') + state.player;
  if(state.movingPiece) str += state.movingPiece.join('');
  return str;
}

//   ## 2. Game-specific methods to make moves

//   # Vector arithmetic

// Add two vectors of equal length
function addVector(v1, v2) {
  if(v1.length != v2.length) { return null; }
  var result = [];
  for( var i=0; i<v1.length; i++) {
    result[i] = v1[i] + v2[i];
  }
  return result;
}

// Calculate distance between two spaces on board
function distance(space1, space2) {
  var ydiff = space1[0] - space2[0];
  var xdiff = space1[1] - space2[1];
  var result = (Math.abs(xdiff + ydiff) + Math.abs(xdiff) + Math.abs(ydiff)) / 2;
  return result;
}

// Make a move and update the state
annuvinAI.makeMove = function(move) {
  // If move is legal, make it
  this.state = this.nextState(this.state, move);
  console.log("Move: " + move[0] + move[1]);
  console.log("Moving piece: " + this.state.movingPiece);
  console.log("Moves left: " + this.state.movesLeft);

}


// Check whether a space is on the board
annuvinAI.inbounds = function(space) {
  // Return false if outside of array
  if(space[0] < 0 || space[0] > 4) return false;
  if(space[1] < 0 || space[1] > 4) return false;
  //  Return false if space marked as off limits
  if(this.state.position[space[0]][space[1]] == "-") return false;
  // Otherwise, it's on the board
  return true;
}

//   # Legal moves for minimax algorithm
//   # Returns array containing list of legal moves in given state
//   # Move is a hash { destination, movesLeft }

annuvinAI.legalMoves = function(state) {
  var moves = [];
  // Check whether currently in the middle of a move
  var movingPiece = state.movingPiece;
  if(movingPiece) {
    // Generate list of captures
    moves = this.getMoves(state, movingPiece, state.movesLeft, true)
    // Add "pass" move
    // moves.push([movingPiece, movingPiece])
  }
  else {
    // Get number of spaces available
    var movesLeft = this.totalMoves(state);
    // Loop through pieces
    var pieces = this.getPieces(state);
    for(var i=0; i<pieces.length; i++) {
      // Add moves to list
      moves = moves.concat(this.getMoves(state, pieces[i], movesLeft, false))
    }
  }
  return moves;
}

//   # Calculate total number of moves available, given number of pieces left
annuvinAI.totalMoves = function(state) {
  // If piece is midway through moves, return number stored in state
  if(state.movingPiece) return state.movesLeft;
  // Otherwise, compute based on number of pieces left
  else return 1 + numberOfPieces - state.piecesLeft[state.player];
}

//   # Find locations of all of a player's pieces on the board
annuvinAI.getPieces = function(state) {
  var pos = state.position
  var pieces = [];
  // Get symbol representing player's piece
  var symbol = symbols[state.player];
  // Loop through all spaces on board
  for(var row=0; row<pos.length; row++) {
    for(var column=0; column<pos[row].length; column++) {
      // If space contains player's symbol, add piece to list
      if(pos[row][column] == symbol) pieces.push([row, column]);
    }
  }
  return pieces;
}


//   # Get list of possible moves
// This is slow, but it works
annuvinAI.getMoves = function(state, startSpace, movesLeft, captureOnly) {
  var pos = state.position;
  var legalDestinations = []
  // Loop over board
  // Note: may want to limit to spaces within range, e.g.
  // maximum = Math.min(4, startspace[0] + movesLeft)
  for(var i=0; i<=4; i++) {
    for(var j=0; j<=4; j++) {
      var destination = [i, j];
      var contents = state.position[i][j];
      var d = distance(startSpace, destination);
      // Check whether destination is within legal distance
      if(d > 0 && d <= movesLeft) {
        // Check whether space is available for move
        if(contents == symbols[this.opponent(state.player)] || (contents == "." && !captureOnly)) {
          // Move is legal!  If not in list, add it
          if(!legalDestinations.includesArray(destination)) {
            legalDestinations.push(destination);
          }
        }
      }
    }
  }
  // Convert destinations into list of moves
  return legalDestinations.map(e => [startSpace, e])
}

//   # Get list of possible moves
//  This is faster, but not working at the moment
annuvinAI.getMovesOld = function(state, startSpace, movesLeft, captureOnly) {
  // Intialize empty list of destinations
  this.currentMoveList = [];
  // Populate list of desinations for this piece
  this.addDestinations(state, startSpace, movesLeft, captureOnly) 
  // Convert it into a list of moves
  return this.currentMoveList.map(e => [startSpace, e])
}

// Recursive function to add destinations to currentMoveList
annuvinAI.addDestinations = function(state, startSpace, movesLeft, captureOnly) {
  // Loop through all directions
  for(i=0; i<directions.length; i++) {
    var dir = directions[i];
    var currentSpace = addVector(startSpace, dir);
    // Check whether destination is legal
    if(this.inbounds(currentSpace)) {
      var spaceContents = state.position[currentSpace[0]][currentSpace[1]]
      if(spaceContents == symbols[this.opponent(state.player)] || (spaceContents == "." && !captureOnly)) {
        // Move is legal!  If not in list, add it
        if(!this.currentMoveList.includesArray(currentSpace)) {
          this.currentMoveList.push(currentSpace);
        }
      }
      // If more moves left, continue to add destinations recursively
      if(movesLeft > 1) {
        this.addDestinations(state, currentSpace, movesLeft - 1, captureOnly);
      }
    }
  }
}

annuvinAI.nextState = function(state, move) {
  // Intialize state information
  var position = state.position.deepCopy();  // Use helper to clone position
  var piecesLeft = state.piecesLeft.slice();
  var movingPiece = null;
  var movesLeft = 0;
  var opponent = this.opponent(state.player);
  var nextPlayer = state.player;
  var piece = move[0];
  var destination = move[1];
  var capture = false;
  var destinationContents = position[destination[0]][destination[1]];
  // Move piece to new location
  position[piece[0]][piece[1]] = ".";
  position[destination[0]][destination[1]] = symbols[state.player];

  // check for capture
  if(destinationContents == symbols[opponent]) {
    piecesLeft[opponent] -= 1;
    movesLeft = this.totalMoves(state) - distance(piece, destination);
    capture = true;
  }
  // Create new state
  var newState = {
    position: position,
    player: nextPlayer,
    piecesLeft: piecesLeft,
    movingPiece: movingPiece,
    movesLeft: movesLeft,
    forceAnalysis: capture  // Force analysis of series of captures
  }
  // console.log(newState);
  // If capture move, check whether additional captures are possible
  // If so, store data in new state
  if(capture && movesLeft > 0 && this.getMoves(newState, destination, movesLeft, true).length > 0) {
    newState.movingPiece = destination;
    
  }
  // Otherwise, switch active player to opponent
  else newState.player = this.opponent(state.player);
  return newState;
}

//   ## 4. Game-specific methods to determine outcome

// Game is won if opponent has no pieces left
annuvinAI.won = function(state) {
  var p = this.opponent(state.player);
  var l = state.piecesLeft;
  return ( l[p] == 0 )
}

// Game is lost if player has no pieces left
annuvinAI.lost = function(state) {
  var p = state.player;
  var l = state.piecesLeft;
  return ( l[p] == 0 )
}

//   ## 5. Game-specific displays

annuvinAI.displayPosition = function(state) {
  // Create visual version of position
  view = state.position.map(row => row.map(p => p=="-" ? " " : p).join(" "));
  for(var i=0; i<5; i++) {
    var spaces = "";
    for(var j=0; j<=i; j++) {
      spaces += " ";
    }
    console.log(spaces + view[i]);
  }
  console.log("To move: " + symbols[state.player]);
  console.log("Score: " + this.score(state));
}

// end


