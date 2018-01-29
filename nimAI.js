// Implementation of Nim
// Requires ai.js

var nim = new GameAI([3, 5, 7], 20);  // Stacks of 3, 5, 7

/// 2. Game-specific methods to make moves


// nim.heuristicScore = function(state) {
//   // fill this in
//   return 0;
// }

// nim.forceAnalysis = function(state) {
//   // fill this in
//   return false;
// }


// Return hash value for a state for indexing purposes
// Here just convert position into four digit integer
// With first digit representing player and last three
// Representing the stacks
nim.stateHash = function(state) {
  var pos = state.position
  var hash = (state.player * 1000) + (pos[0] * 100) + (pos[1] * 10) + pos[2];
  return hash;
}

// Return list of legal moves from specific state
// Allow player to take 1-3 objects from one stack
// Move represented as [stack, number]
nim.legalMoves = function(state) {
  pos = state.position;
  moveList = [];
  for(var stack = 0; stack < pos.length; stack++) {
    var max = Math.min(3, pos[stack]);  // Can take up to three objects
    // If stack is non-empty, loop through possible moves
    if(max > 0) {
      for(var number = 1; number <= max; number++) {
        // Add move to list
        moveList.push([stack, number])
      }
    }
  }
  // Return list of moves
  return moveList;
}

nim.nextPosition = function(position, move) {
  result = position.slice(); // Create copy of array
  result[move[0]] -= move[1]; // Subtract objects from stack
  return result; // Return new position
}

// Return next state given current state and move
nim.nextState = function(state, move) {
  // Customize as necessary
  result = {
    position: this.nextPosition(state.position, move),
    player: this.opponent(state.player)
  }
  return result;
}

// Get player's move and make it
nim.getMove = function() {
  return this.state.player;
}


/// 3. Custom methods to determine outcome of game


nim.done = function(state) {
  return this.won(state) || this.lost(state) || this.drawn(state);
}

// Check whether game has been won by player currently on the move
// True if all stacks are empty
nim.won = function(state) {
  function isZero(n) {
    return n == 0;
  }
  return state.position.every(isZero);
}

// // Check whether game has been lost by player currently on the move
// nim.lost = function(state) {
//   return false;
// }

// // Check whether game has been drawn
// nim.drawn = function(state) {
//   // Draw is impossible
//   return false;
// }

/// 4. Game-specific displays
nim.displayPosition = function(state) {
  console.log("here is where we would display the board");
}

nim.displayMove = function(move) {
  console.log("here is where we would display the move");
}


/// Driver code for tests
console.log(nim.position());
// console.log(nim.maxDepth);
// console.log(nim.legalMoves(nim.state));
// console.log(nim.stateHash(nim.state));

var m = nim.computerMove();
// var m = [1, 2];
// console.log(m);
// console.log(nim.nextPosition([3, 5, 7], m));


