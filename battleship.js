var view = {
  // this method takes a string message and displays it
  // in the message display area
  displayMessage: function(msg) {
    var messageArea = document.getElementById("messageArea");
    messageArea.innerHTML = msg;
  },
  // this method displays the image onto the board
  // to indicate a hit
  displayHit: function(location) {
    var cell = document.getElementById(location);
    cell.setAttribute("class", "hit");
  },
  // this method displays the image onto the board
  // to indicate a miss02
  displayMiss: function(location) {
    var cell = document.getElementById(location);
    cell.setAttribute("class","miss");
  }
};

// Controller below

var controller = {
  guesses: 0,
  processGuess: function(guess) {
    var location = parseGuess(guess);
    if (location) {
      this.guesses++;
      var hit = model.fire(location);
      if ( hit && model.shipsSunk === model.numShips) {
        view.displayMessage("You sank all my battleships, in " +
                                        this.guesses + " guesses")
      }
    }
  }
};


// Model Object below
var model = {
  boardSize: 7,
  numShips: 3,
  shipLength: 3,
  shipsSunk: 0,
  ships: [{locations: [0, 0, 0], hits: ["", "", ""] },
          {locations: [0, 0, 0], hits: ["", "", ""] },
          {locations: [0, 0, 0], hits: ["", "", ""] }],
  fire: function(guess) {
    for (var i = 0; i < this.numShips; i++) {
      var ship = this.ships[i];
      var index = ship.locations.indexOf(guess);
      if (index >= 0) {
        ship.hits[index] = "hit";
        view.displayHit(guess);
        view.displayMessage("HIT!");

        if (this.isSunk(ship)) {
          view.displayMessage("You sank my battleship!");
          this.shipsSunk++;
        }
        return true;
      }
    }
    view.displayMiss(guess);
    view.displayMessage("You missed.");
    return false;
  },

  // code below check to for sunken ships
  isSunk: function(ship) {
    for (var i = 0; i < this.shipLength; i++) {
      if (ship.hits[i] !== "hit") {
        return false;
      }
    }
    return true;
  },

  // code below generate the start location of each ship
  generateShipLocations: function() {
    var locations;
    for (var i = 0; i < this.numShips; i++) {
      do {
        locations = this.generateShip();
      } while (this.collision(locations));
      this.ships[i].locations = locations;
    }
  },

  // code below generate ship orientation and size
  generateShip: function() {
    var direction = Math.floor(Math.random() * 2);
    var row;
    var col;
    if (direction === 1) { // horizontal ship
      row = Math.floor(Math.random() * this.boardSize);
      col = Math.floor(Math.random() * ((this.boardSize - 3) + 1));
    } else { // vertical ship
      row = Math.floor(Math.random() * ((this.boardSize - 3) + 1));
      col = Math.floor(Math.random() * this.boardSize);
    }
    var newShipLocation = [];
    for (var i = 0; i < this.shipLength; i++) {
      if (direction === 1) { // horizontal ship
        newShipLocation.push(row + "" + (col + i));
      } else { // vertical ship
        newShipLocation.push((row + i) + "" + col);
      }
    }
    return newShipLocation;
  },

  // code below checks for ship collisions
  collision: function(locations) {
    for (var i = 0; i < this.numShips; i++) {
      var ship = this.ships[i];
      for (var j = 0; j < locations.length; j++) {
        if (ship.locations.indexOf(locations[j]) >= 0 ) {
          return true;
        }
      }
    }
    return false;
  }
};

function handleFireButton() {
  var guessInput = document.getElementById("guessInput");
  var guess = guessInput.value;
  controller.processGuess(guess);
  guessInput.value = "";
};
function handleKeyPress(e) {
  var fireButton = document.getElementById("fireButton");
  if (e.keyCode === 13) {
    fireButton.click();
    return false;
  }
}
function init() {
  var fireButton = document.getElementById("fireButton");
  fireButton.onclick = handleFireButton;
  var guessInput = document.getElementById("guessInput");
  guessInput.onkeypress = handleKeyPress;

  model.generateShipLocations();
};
window.onload = init;

// alphanumeric converter below


function parseGuess(guess) {
  var alphabet = ["A", "B", "C", "D", "E", "F", "G",];
  if (guess === null || guess.length !== 2) {
    alert("oops, please enter a letter and a number on the board.")
  } else {
    var firstChar = guess.charAt(0);
    var row = alphabet.indexOf(firstChar);
    var column = guess.charAt(1);
    if (isNaN(row) || isNaN(column)) {
      alert("Oops, that isn't on the board.");
    } else if (row < 0 || row >= model.boardSize ||
      column < 0 || column >=    model.boardSize) {
        alert("Oops, thats off the board!");
      } else {
        return row + column;
      }
  }
  return null;
}


// test code below
var array = [true, false, true];
function test(array) {
  for (var i = 0; i < array.length; i++) {
    console.log("we are testing index: " + i); // this stops
    if (array[i] !== true) {
      console.log("This is not the way");
      return false;
    }
  }
  return true;
};
