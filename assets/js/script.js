var blocks = document.querySelectorAll(".block");
var startBtn = document.querySelector("button");
var scoreDisplay = document.querySelector("#score");
var cntDisplay = document.querySelector("#cnt");

var colorEnumeration = {
	red: 0,
	green: 1,
	blue: 2,
	yellow: 3
};

var score = 0;
var cnt = 1;
var clickedNum = 0;
var indexArr = [];

var _quit = false;

var sound = document.querySelector("#audio");

function turnOnClick() {
	blocks.forEach(function(block) {
		block.classList.add("clickable");
		// Change blocks color when clicking
		block.addEventListener("mousedown", focusBlock);
		block.addEventListener("mouseup", unfocusBlock);
		block.addEventListener("click", clickEvent);
	});
}

function turnOffClick() {
	blocks.forEach(function(block) {
		block.classList.remove("clickable");
		// Remove click effect for each block
		block.removeEventListener("mousedown", focusBlock);
		block.removeEventListener("mouseup", unfocusBlock);
		block.removeEventListener("click", clickEvent);
	});
}

function focusBlock(event) {
	var block = event.target;
	var colorSelected = block.classList[0] + "Selected";
	block.classList.add(colorSelected);
	sound.play();
}

function unfocusBlock(event) {
	var block = event.target;
	var colorSelected = block.classList[0] + "Selected";
	block.classList.remove(colorSelected);	
	sound.pause();
}

function clickEvent(event) {
	var index = colorEnumeration[event.target.classList[0]];

	if (indexArr[clickedNum] === index) {
		clickedNum++;
	}
	else {
		alert("You lose");
		turnOffClick();
		startBtn.textContent = "Replay";
	}

	if (clickedNum === cnt) {
	score++;
	scoreDisplay.textContent = score;
	setTimeout(nextRound, 500);
	}
}

startBtn.addEventListener("click", function() {
	_quit = true;
	// Reset the game
	score = 0;
	cnt = 0;
	indexArr = [];

	cntDisplay.textContent = cnt;
	scoreDisplay.textContent = score;
	
	// Pause for some time to wain for termination of the previous function
	// In case the button is pressed while playing
	setTimeout(nextRound, 1000);
});

function nextRound() {
	cnt++;
	indexArr.push(pickRandomNum(4));

	cntDisplay.textContent = cnt;

	clickedNum = 0;
	turnOffClick();

	_quit = false;
	sequentialFocusBlock(indexArr, turnOnClick);
}

// Pick random number betwenn 0~n-1
function pickRandomNum(n) {
	return Math.floor(Math.random() * n);
}

// Sequentially focus a block for 0.5s
function sequentialFocusBlock(arr, callback) {
	if (_quit) {
		return;
	}

	if (arr.length !== 0) {
		var colorSelected = blocks[arr[0]].classList[0] + "Selected";
		blocks[arr[0]].classList.add(colorSelected);
		sound.play();
		setTimeout(function() {
			blocks[arr[0]].classList.remove(colorSelected);
			sound.pause();
			setTimeout(function() {
				sequentialFocusBlock(arr.slice(1), callback);	
			}, 250);			
		}, 500);
	}
	else {
		callback();
	}
}

