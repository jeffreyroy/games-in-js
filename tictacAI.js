// class Tictac < Game

//   attr_reader :current_state
//   attr_accessor :minimax


// Constants used to map board onto magic square
// const boardTrans = [[6, 1, 8], [7, 5, 3], [2, 9, 4]]
// const boardRevTrans = [0, [0, 1], [2, 0], [1, 2], [2, 2], [1, 1], [0, 0], [1, 0], [0, 2], [2, 1]]
// const markers = [" X ", " O ", "   "]

ticTacAI = new GameAI([-1, 2, 2, 2, 2, 2, 2, 2, 2, 2], 9)

// Reduce state to number
ticTacAI.stateHash = function(state) {
  const reducer = (accumulator, currentValue) => 3 * accumulator + currentValue;
  var pos = state.position.slice(1, 10);  // strip first (null) value from position
  var hash = pos.reduce(reducer);
  return hash;
}



// ## 2. Methods to make moves

ticTacAI.legalMoves = function(state) {
  var pos = state.position;
  var moveList = [];
  // Add all blank squares to list
  for( i=1; i<=9; i++ ) {
    if(pos[i] == 2) { moveList.push(i) }
  }
  return moveList;
}

ticTacAI.nextState = function(state, move) {
  var player = state.player
  var newPosition = state.position.slice();  // copy current position
  newPosition[move] = player;
  var newState = {
    position: newPosition,
    player: this.opponent(player)
  }
  return newState;
}

// # Get the player's move
// def get_move
//   puts
//   display_position
//   array_square = 0
//   until array_square > 0
//     puts
//     print "Enter your move (1-9): "
//     player_move = gets.chomp.to_i
//     array_square = self.class::BOARD_TRANS[player_move]

//     if !legal_moves(@current_state).index(array_square)
//       puts "That's not a legal move!"
//       # minimax.show_scores
//       array_square = 0
//     end
//   end
//   make_move(array_square)
// end

// ## 3. Methods to input moves via web interface

// # Import player's click
// def import_click(move_param)
//   # Integerize move parameter
//   move = move_param.to_i
//   # Make move
//   puts "You seem to be moving to #{move}"
//   if !legal_moves(@current_state).index(move)
//     puts "That's not a legal move!"
//   end
//   make_move(move)
//   if lost?(@current_state)
//     # If computer has lost, return player as winner
//     return { move: 0, winner: "player" }
//   elsif done?(@current_state)
//     return { move: 0, winner: "cat" }
//   else
//     # Otherwise, get computer move
//     response = best_move(@current_state)
//     puts
//     p "I respond #{response}"
//     make_move(response)
//     winner = lost?(@current_state) ? "computer" : "none"
//     # Send move to client
//     { move: response, winner: winner }
//   end
// end


// ## 4. Methods to determine outcome

ticTacAI.done = function(state) {
  // Check whether board is full
  return !state.position.includes(2);
}

// # check for three in a row using magic square
// # value: 0 = player, 1 = computer, 2 = empty
ticTacAI.checkRow = function(pos, a, c, value) {
  var c = 15 - a - b;
  // Squares are out of bounds (should not ever happen)
  if( a < 1 || a > 9  || b < 1 || b > 9 ) {
    console.log( "Out of bounds error while checking row " + a + "-" + b );
    return false;
  }
  // Third space is not legal
  else if( c < 1 || c > 9 || c == a || c == b || a == b ) {
    return false;
  }
  // Three in a row
  else if(pos[a] == value && pos[b] == value && pos[c] == value ) {
    return true;
  }
  else { return false; }
}


// Search board for three in a row
ticTacAI.threeInARow = function(pos, value) {
  var move = null;
  // Loop over all possible rows
  for(a = 1; a <= 9; a++) {
    for(b = 1; b <= 9; b++) {
      if( this.checkRow(pos, a, b, value) ) {
        move = 15 - a - b;
      }
    }
  }
  return move != null;
}

// Won if player has three in a row
ticTacAI.won = function(state) {
  return this.threeInARow(state.position, state.player);
}

// Lost if opponent has three in a row
ticTacAI.lost = function(state) {
  var player = this.opponent(state.player);
  return this.threeInARow(state.position, player);
}

// # ## Displays

// # # Get marker on square on the board (1-9)
// # def marker(num)
// #   square_code = current_position[self.class::BOARD_TRANS[num]]
// #   self.class::MARKERS[square_code]
// # end


