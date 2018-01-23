

// Piece class
function Piece(name, id) {
  this.name = name;
  this.id = id;
  this.image = this.id + ".png";
}

Piece.prototype.imageTag = function() {
    var imageNode = document.createElement("img");
    imageNode.setAttribute("src", "images/"+ this.image);
    imageNode.classList.add("piece");
    imageNode.classList.add(this.id);
    var nameArray = this.name.split(" ");
    for(var i=0; i<nameArray.length; i++) {
        imageNode.classList.add(nameArray[i]);
      }
    return imageNode;
}