// Rock Paper Scissors experimental webapp for derekandersen.net
// -------------------------------------------------------------

// Initialize global state object for saving game state
let globalState = {}
let hands = ['Rock', 'Paper', 'Scissors']
let streak = 0
let best = 0

function setState (pick) {
  // Pick computer's hand
  globalState.computer = hands[Math.floor(Math.random() * hands.length)]
  // Set player's hand
  globalState.player = pick
  // Player wins
  if (globalState.computer == 'Rock' && globalState.player == 'Paper') {
    document.getElementById("log").innerHTML = "> Rock. You win!"
    plusStreak()
  }
  if (globalState.computer == 'Paper' && globalState.player == 'Scissors') {
    document.getElementById("log").innerHTML = "> Paper. You win!"
    plusStreak()
  }
  if (globalState.computer == 'Scissors' && globalState.player == 'Rock') {
    document.getElementById("log").innerHTML = "> Scissors. You win!"
    plusStreak()
  }
  // Computer wins
  if (globalState.computer == 'Rock' && globalState.player == 'Scissors') {
    document.getElementById("log").innerHTML = "> Rock. You lose!"
    updateStreak()
  }
  if (globalState.computer == 'Paper' && globalState.player == 'Rock') {
    document.getElementById("log").innerHTML = "> Paper. You lose!"
    updateStreak()
  }
  if (globalState.computer == 'Scissors' && globalState.player == 'Paper') {
    document.getElementById("log").innerHTML = "> Scissors. You lose!"
    updateStreak()
  }
  // Players tie
  if (globalState.computer == 'Rock' && globalState.player == 'Rock') {
    document.getElementById("log").innerHTML = "> Rock. Tie!"
    updateStreak()
  }
  if (globalState.computer == 'Paper' && globalState.player == 'Paper') {
    document.getElementById("log").innerHTML = "> Paper. Tie!"
    updateStreak()
  }
  if (globalState.computer == 'Scissors' && globalState.player == 'Scissors') {
    document.getElementById("log").innerHTML = "> Scissors. Tie!"
    updateStreak()
  }
}

function plusStreak () {
  streak++
  document.getElementById("streak").innerHTML = 'Current win streak: ' + streak;
}

function updateStreak () {
  if (streak > best) {
    best = streak
    document.getElementById("best").innerHTML = 'Best streak: ' + best;
  }
  streak = 0
  document.getElementById("streak").innerHTML = 'Current win streak: ' + streak;
}
