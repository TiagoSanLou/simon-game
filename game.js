// VARIABLES
var buttonColors = ["red", "blue", "green", "yellow"];

var gameLength = 10;
var gamePattern = makeColorSequence(gameLength);
var sequencePlayInterval = 600;

var gameLevel = 0;
var userClickedPattern = [];
var isGameOver = false;

// EXECUTION & DEBUGGING
console.log("Generated game pattern:");
console.log(gamePattern);

// Detect keyboard input to start game.
$(document).keydown(function (e) {
    if (e.key == "s") {
        if (gameLevel === 0) {
            startGame();
        } else if (isGameOver) {
            startOver();
        }
    }
});

// Detect clicking on colored divs.
$("div.btn").click(function (e) {
    let userChosenColour = $(this).attr("id");
    if (gameLevel === 0) {
        // Before the game starts, the user can just press buttons.
        pressButton(userChosenColour);
    } else if (gameLevel <= gameLength) {
        // After start, buttons pressed will be logged.
        pressButton(userChosenColour);
        userClickedPattern.push(userChosenColour);
        // When the input reaches the right length, check it.
        if (userClickedPattern.length === gameLevel) {
            checkAnswer(userClickedPattern);
        }
    }
});

// FUNCTIONS
function startGame() {
    console.log("Game Level: " + gameLevel);
    console.log("Starting game!");
    gameLevel++;
    $("#level-title").text("Level " + gameLevel);
    playSequence(gamePattern.slice(0, gameLevel), sequencePlayInterval);
}

function startOver() {
    $("body").removeClass("game-over");
    $("body").removeClass("right-answer");
    gamePattern = makeColorSequence(gameLength);
    userClickedPattern = [];
    $("#level-title").text("Press S to start.");
    gameLevel = 0;
}

function playNextLevel() {
    userClickedPattern = [];
    gameLevel++;
    if (gameLevel > gameLength) {
        var Sound = new Audio("./sounds/applause.mp3");
        Sound.play();
        isGameOver = true;
        $("#level-title").text("YOU WIN! Press S to play again.");
        $("#level-title").addClass("finish-title");
        $("body").addClass("right-answer");
    } else {
        $("#level-title").text("Level " + gameLevel);
        console.log("Game Level: " + gameLevel);
        playSequence(gamePattern.slice(0, gameLevel), sequencePlayInterval);
    }
}

function checkAnswer(pattern) {
    if (pattern.toString() === gamePattern.slice(0, gameLevel).toString()) {
        // If the answer is right        
        $("#level-title").text("Well done!");
        $("body").addClass("right-answer");
        setTimeout(function () {
            $("body").removeClass("right-answer");
            playNextLevel();
        }, 900);
    } else {
        // If the answer is wrong
        setTimeout(function () {
            var Sound = new Audio("./sounds/wrong.mp3");
            Sound.play();
        }, 500);
        $("body").addClass("game-over");
        $("#level-title").text("Game Over. Press S to restart.");
        isGameOver = true;
    }
}

function makeColorSequence(length) {
    let sequence = [];
    for (let i = 0; i < length; i++) {
        let randNum = Math.floor(Math.random() * 4);
        let randomChosenColor = buttonColors[randNum];
        sequence.push(randomChosenColor);
    }
    return sequence;
}

function playSequence(sequence, timeInterval) {
    let timer = 0;
    for (let index = 0; index < sequence.length; index++) {
        setTimeout(function (param) {
            // Parse Color
            const currentColor = sequence[index];
            // Play tone
            playColorSound(currentColor);
            // Blink button animation
            blinkButton(currentColor);
        }, timer);
        timer += timeInterval;
    }
}

function pressButton(color) {
    playColorSound(color);
    blinkButton(color);
}

function blinkButton(color) {
    let selector = "div." + color;
    $(selector).addClass("pressed");
    setTimeout(function () { $(selector).removeClass("pressed"); }, 200);
}

function playColorSound(color) {
    let soundFilePath = "./sounds/" + color + ".mp3"
    var Sound = new Audio(soundFilePath);
    Sound.play();
}