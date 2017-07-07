var blocks = document.querySelectorAll(".block");
var startBtn = document.querySelector("#start");
var cntDisplay = document.querySelector("#cnt");

var colorEnumeration = {
	green: 0,
	red: 1,
	yellow: 2,
	blue: 3
};

var beepSounds = {
	red: document.querySelector("#red-beep"),
	green: document.querySelector("#green-beep"),
	blue: document.querySelector("#blue-beep"),
	yellow: document.querySelector("#yellow-beep")
}

var cnt = 1;
var clickedNum = 0;
var indexArr = [];

var _quit = false;

var sound = document.querySelector("#audio");

startBtn.addEventListener("click", function() {
	_quit = true;
	// Reset the game
	cnt = 0;
	indexArr = [];

	cntDisplay.textContent = cnt;
	
	// Pause for some time to wain for termination of the previous function
	// In case the button is pressed while playing
	setTimeout(nextRound, 1000);
});

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
	var color = block.classList[0];
	var colorSelected = color + "Selected";
	block.classList.add(colorSelected);
	play(color);
}

function unfocusBlock(event) {
	var block = event.target;
	var color = block.classList[0];
	var colorSelected = color + "Selected";
	block.classList.remove(colorSelected);	
	pause(color);
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
	setTimeout(nextRound, 500);
	}
}

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
		var block = blocks[arr[0]];
		var color = block.classList[0];
		var colorSelected = color + "Selected";
		block.classList.add(colorSelected);
		play(color);
		setTimeout(function() {
			blocks[arr[0]].classList.remove(colorSelected);
			pause(color);
			setTimeout(function() {
				sequentialFocusBlock(arr.slice(1), callback);	
			}, 250);			
		}, 500);
	}
	else {
		callback();
	}
}

// Play the beep for respective color
function play(color) {
	beepSounds[color].currentTime = 0;
	beepSounds[color].play();
}

// Pause the beep for respective color
function pause(color) {
	beepSounds[color].pause();
}