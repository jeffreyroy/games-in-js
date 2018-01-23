// Class used for minimax AI

function AI(maxDepth) {
  this.depth = 0;
  this.maxDepth = maxDepth || 10;
  this.maxScore = 100;
}

// Driver code for node test

newAI = new AI();
deepAI = new AI(100);
console.log(newAI.maxDepth);
console.log(deepAI.maxDepth);