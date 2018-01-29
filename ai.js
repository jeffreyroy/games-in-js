// Minimax AI library

// Class for minimax AI
// maxDepth = maximum depth of search tree
function GameAI(position, maxDepth) {
  // Initialize game state
  this.players = {
    human: 0,
    computer: 1
  }
  this.state = {
    position: position,
    player: this.players.human
  };
  // Initialize AI
  this.depth = 0;  // Current search depth
  this.maxDepth = maxDepth || 10; // Default max depth of 10
  this.maxScore = 100;
  this.stateScores = [];
}


/// 1. Methods common to all games
// Customize for specific game as necessary
GameAI.prototype.position = function() {
  return this.state.position;
}

GameAI.prototype.player = function() {
  return this.state.player;
}

// Return opponent of current player
GameAI.prototype.opponent = function(player) {
  return 1 - player;
}

// Make a move and update the state
GameAI.prototype.makeMove = function(move) {
  // If move is illegal, return false
  if(!this.legalMoves(this.state).includes(move)) { return false; }
  // Otherwise, make the move
  this.state = this.nextState(this.state, move);
  return true;
}

// Choose move for computer using minimax
GameAI.prototype.computerMove = function() {
  console.log("thinking...");
  if(this.done(this.state)) { return null; };
  var move = this.bestMove(this.state);
  console.log(move);
  return move;
}

/// 2. Game-specific methods to make moves

// Calculate score for state
// Customize for specific game
GameAI.prototype.heuristicScore = function(state) {
  // fill this in
  return 0;
}

// Decide whether to force analysis beyond normal depth limit
// eg if analyzing series of captures
GameAI.prototype.forceAnalysis = function(state) {
  // fill this in
  return false;
}

// Return hash value for a state for indexing purposes
GameAI.prototype.stateHash = function(state) {
  // fill this in
  return 0;
}

// Return list of legal moves from specific state
GameAI.prototype.legalMoves = function(state) {
  // Fill this in
  return [];
}

GameAI.prototype.nextPosition = function(position, move) {
  // Fill this in
}

// Return next state given current state and move
GameAI.prototype.nextState = function(state, move) {
  // Customize as necessary
  result = {
    position: this.nextPosition(state.position, move),
    player: this.opponent(state.player)
  }
}

// Get player's move and make it
GameAI.prototype.getMove = function() {
  return this.state.player;
}


/// 3. Custom methods to determine outcome of game


GameAI.prototype.done = function(state) {
  return this.won(state) || this.lost(state) || this.drawn(state);
}

// Check whether game has been won by player currently on the move
GameAI.prototype.won = function(state) {
  return false
}

// Check whether game has been lost by player currently on the move
GameAI.prototype.lost = function(state) {
  return false;
}

// Check whether game has been drawn
GameAI.prototype.drawn = function(state) {
  return false;
}

/// 4. Game-specific displays
GameAI.prototype.displayPosition = function(state) {
  console.log("here is where we would display the board");
}

GameAI.prototype.displayMove = function(move) {
  console.log("here is where we would display the move");
}

/// 5. Minimax AI

GameAI.prototype.bestMoveWithScore = function(state) {
  var position = state.position;
  var player = state.player;
  var moves = this.legalMoves(state);
  // If no legal moves, return null move
  if (moves.length == 0) { return [null, 0]};
  // Initialize move variables
  // var bestPlayer = player;
  var bestScore = -999;
  var bestMove = null;
  var nextState = null;
  var moveState = null;
  var nextPlayer = 0;
  var scoreArray = [];
  // Loop over all legal moves
  for( var i = 0; i < moves.length; i++) {
    var move = moves[i];
    // console.log("Move: " + move);
    // Score resulting state after making this move
    nextState = this.nextState(state, move);
    moveScore = this.score(nextState);
    nextPlayer = nextState.player;
    // If the next player to move is the opponent, invert the score
    // (A good score for the current player is a bad one for the opponent)
    if(nextPlayer != player) {
      moveScore = -moveScore;
    }
    // If this is the best move so far, store it
    if( moveScore > bestScore ) {
      bestMove = move;
      bestScore = moveScore;
      // bestPlayer = nextPlayer;
    }
  }
  // Return best move and score found
  return [bestMove, bestScore];
}

GameAI.prototype.bestMove = function(state) {
  return this.bestMoveWithScore(state)[0];
}

// Return score for state (i.e. value to player on the move)
GameAI.prototype.score = function(state) {
  var position = state.position;
  var bestScore = 0;
  // If already scored, return score
  var storedScore = this.stateScores[this.stateHash(state)];
  if(storedScore) { return storedScore; }
  // If game is over, return appropriate score
  if(this.won(state)) {
    bestScore = this.maxScore - this.depth;
  }
  else if(this.lost(state)) {
    bestScore = -this.maxScore + this.depth;
  }
  else if(this.drawn(state)) {
    bestScore = 0;
  }
  // If beyond search depth, return heuristic score
  else if(this.depth > this.maxDepth && !this.forceAnalysis(state)) {
    bestScore = this.heuristicScore(state);
  }
  // Otherwise, continue tree search
  else {
    this.depth += 1;
    // console.log("depth: " + this.depth);
    // console.log("position: " + state.position);
    bestScore = this.bestMoveWithScore(state)[1];
    this.depth -= 1;
  }
  // Add score to master list and return it
  // Q:  always add score?
  this.stateScores[this.stateHash(state)] = bestScore;
  return bestScore;
}

/// 5. Driver code for node test

// newAI = new GameAI("a");
// deepAI = new GameAI("b", 100);
// console.log(newAI.maxDepth);
// console.log(deepAI.maxDepth);
// console.log(deepAI.position());
// console.log(deepAI.player());