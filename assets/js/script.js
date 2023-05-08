
var startButton = document.querySelector(".start-button");
var resetButton = document.querySelector(".reset-button");
var timerElement = document.querySelector(".timer-count"); 
var wordBlanks = document.querySelector(".word-blanks"); 
var win = document.querySelector(".win");
var lose = document.querySelector(".lose");
var winCount = 0;   
var lossCount = 0;  
var gameWords = ['purple', 'green', 'periwinkle', 'black', 'orange', 'turquoise'];
var chosenWord = '';
var lettersInChosenWord = [];
var blanksInChosenWord = [];
//var numBlanks = 0;
var didWin = false;
var secondsLeft;
var timerInterval;

//on load of page:
function init() {
    renderWins();
    renderLosses();
}

//startGame called when start button is clicked
function startGame() {
    didWin = false;
    secondsLeft = 30;
    //disable start button during game
    startButton.disabled = true;
    renderBlanks();
    //start timer
    setTime();
}

//User wins game
function userWon() {
    //send message, add 1 win, store local, display on UI
    wordBlanks.textContent = "Great job, you won!";
    winCount++;
    //re-enable start button
    startButton.disabled = false;
    setWins();
  }

//User loses game
function userLost() {
    //send message, add 1 loss, store local, display on UI
    wordBlanks.textContent = "Game over. Better luck next time!";
    lossCount++;
    //re-enable start button
    startButton.disabled = false;
    setLosses();
}

function setTime() {
    // Sets interval in timerInterval variable
    var timerInterval = setInterval(function() {
        secondsLeft--;
        timerElement.textContent = secondsLeft;

        if (secondsLeft === 0) {
            // Stops execution of action at set interval
            clearInterval(timerInterval);
            //User loses game, send message, add 1 loss, store local, display on UI
            userLost();
        } else if (didWin) {
            //Clear/stop timer; User wins game, send message, add 1 win, store local, display on UI
            clearInterval(timerInterval);
            userWon();
        }
    }, 1000);
}
 
//randomly picks word and adds blanks
function renderBlanks() {
    chosenWord = gameWords[Math.floor(Math.random() * gameWords.length)];
    console.log("chosenWord = " + chosenWord);
    lettersInChosenWord = chosenWord.split("");
    blanksInChosenWord = [];
    for (var i = 0; i < lettersInChosenWord.length; i++) {
        blanksInChosenWord.push("_");
    }
    wordBlanks.textContent = blanksInChosenWord.join(" ");
}

//sets wins in local storage and displays on screen
function setWins() {
    localStorage.setItem("wins", winCount);
    win.textContent = winCount;
}

//sets losses in local storage and displays on screen
function setLosses() {
    localStorage.setItem("losses", lossCount);
    lose.textContent = lossCount;
}

//get wins count from local storage and display on the screen
function renderWins() {
    winCount = localStorage.getItem("wins");
    if (winCount === null) {
        winCount = 0;
    }
    win.textContent = winCount;
}
 
//get losses count from local storage and display on the screen
function renderLosses() {
    lossCount = localStorage.getItem("losses");
    if (lossCount === null) {
        lossCount = 0;
    }
    lose.textContent = lossCount;
}

function checkIfWon() {
    if (chosenWord === blanksInChosenWord.join("")) {
        didWin = true;
    }
}

function checkGuessedLetter(letter) {
    var isLetterInWord = false;
    for (var i = 0; i < lettersInChosenWord.length; i++) {
        if (chosenWord[i] === letter) {
            isLetterInWord = true;
        }
    }
    if (isLetterInWord) {
        for (var j = 0; j < lettersInChosenWord.length; j++) {
            if (chosenWord[j] === letter) {
                blanksInChosenWord[j] = letter;
            }
        }
        wordBlanks.textContent = blanksInChosenWord.join(" ");
    }
}

//track keypress in entire document (counts if in class "word-blanks")
document.addEventListener("keydown", function(event) {
    if (secondsLeft === 0) {
        return;
    }
    //convert key pressed to lower
    var key = event.key.toLowerCase();
    
    var alphanumericChars = "abcdefghijklmnopqrstuvwxyz0123456789".split("");
    //test if key is alphanumeric
    if (alphanumericChars.includes(key)) {
        var letterGuessed = event.key;
        checkGuessedLetter(letterGuessed);
        checkIfWon();
    }
});

//add listener to start button 
startButton.addEventListener("click", startGame);

//add listener to reset button 
resetButton.addEventListener("click", function(event) {
    winCount = 0; 
    lossCount = 0;
    setWins();
    setLosses();
});
  
init();