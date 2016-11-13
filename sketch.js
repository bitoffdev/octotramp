/**
 * sketch.js
 *
 * This is the main javascript file that is called by Processing.js
 *
 * @author Elliot Miller
 * @author Chris Baudouin
 * @author Maximillian McMullen
 */

// Constant
const DIST_BETWEEN_TRAMPS = 100;
const GAME_WIDTH = window.innerWidth;
const GAME_HEIGHT = window.innerHeight;
const TITLE_SIZE = 32;
const TITLE_POS = GAME_HEIGHT/2;
const SUBTITLE_SIZE = 24;
const SUBTITLE_POS = ((GAME_HEIGHT/2)/2) + (((GAME_HEIGHT/2)/2)/1.6);

const START_SPEED = 10;
const SPEED_MODIFIER=1;

const SCORE_HEIGHT = (((GAME_HEIGHT/2)/2)/2);
const SCORE_WIDTH = (GAME_WIDTH/2);

const LEADERBOARD_XPOS = GAME_WIDTH - (GAME_WIDTH/5.5);
const LEADERBOARD_YPOS = GAME_HEIGHT/30;
const LEADERBOARD_X_SIZE = 200;
const LEADERBOARD_TITLE = "Leaderboard";
const LEADERBOARD_TITLE_XPOS = LEADERBOARD_XPOS + (LEADERBOARD_X_SIZE/2);
const LEADERBOARD_TITLE_YPOS = LEADERBOARD_YPOS + 20;

// State Variables
var gameState = 0; // 0: Start Screen, 1: Play, 2: Paused, 3: Resuming, 4: Dead
var pauseFrame = -1;
var validSpots=[]; //list of valid trampoline x positions
var difficulty=0; //determines how far a trampoline can spawn from the center
var maxTrampolinesFromCenter=0; //furthest from the center a trampoline can spawn (dependent on screen width)
var trampolinesJumped=0; //amount of trampolines jumped on, determines difficulty
var total_score = 0;

//number of trampolines before the difficulty increases
var TRAMPOLINES_PER_DIFFICULTY=10;
var MAX_DIFFICULTY=2;

// Classes/Objects
var waitingscreen;
var deathscreen;
var environment;
var thePlayer;

// Assets
var characterImage;
var hubotImage;
var logo;


class Player{
	constructor(){
		this.playerSpeed = 0;
		this.translateX = 0;
		this.xpos=100;
		this.ypos=0;
	}
	drawPlayer(){
		// Lerp the x position
		this.xpos += this.translateX * 0.25;
		this.translateX *= 0.75;
		// Scroll the background
		environment.scrollX += thePlayer.playerSpeed;
		// calculate the player's height
		var sinShenanigans = Math.abs(sin(Math.PI*frameCount/60)) * (GAME_HEIGHT-200);
		thePlayer.ypos=GAME_HEIGHT-sinShenanigans;
		// player sprite
		image(characterImage,thePlayer.xpos, thePlayer.ypos-100, 75, 75);
	}
}

//list of valid trampoline x positions
var validSpots=[];
//determines how far a trampoline can spawn from the center
var difficulty=0;
//furthest from the center a trampoline can spawn (dependent on screen width)
var maxTrampolinesFromCenter=0;
//amount of trampolines jumped on, determines difficulty
var trampolinesJumped=0;
var lastTrampolineSpot=0;

var thePlayer=new Player();
var environment;

var SCORE = "Score: ";

function setup()
{
	// set canvas size
	createCanvas(GAME_WIDTH,GAME_HEIGHT);
	// load images
	characterImage = loadImage("assets/octocat.png");
	hubotImage = loadImage("assets/hubot.jpg");
	logo = loadImage("assets/title_logo.png");

	// Initialize Classes
	waitingscreen = new WaitingScreen(GAME_WIDTH,GAME_HEIGHT);
	deathscreen = new DeathScreen();
	environment = new Environment(GAME_HEIGHT);
	thePlayer = new Player();
	thePlayer.xpos=GAME_WIDTH/2;

	// find all valid trampoline spots
	validSpots.push(thePlayer.xpos);
	for(var i=1;;i++){
		if(thePlayer.xpos+(i*DIST_BETWEEN_TRAMPS)>GAME_WIDTH)
			break;

		validSpots.push(thePlayer.xpos+(i*DIST_BETWEEN_TRAMPS));
		validSpots.push(thePlayer.xpos-(i*DIST_BETWEEN_TRAMPS));
		text(SCORE, this.width/2, this.start_message_ypos);
	}
	drawTrampoline();
}

function drawTrampoline(){
	var maxT=lastTrampolineSpot+difficulty;
	var minT=lastTrampolineSpot-difficulty;

	var spot=minT+int(Math.random()*(maxT-minT));

	if(spot<0) spot=0;
	if(spot>validSpots.length) spot=validSpots.length-1;

	var pos = environment.scrollX + thePlayer.playerSpeed * (60 - frameCount%60);
	environment.addTrampoline(pos+validSpots[spot]+40);

	if(gameState > 0){
		trampolinesJumped++;
		if(trampolinesJumped%TRAMPOLINES_PER_DIFFICULTY==0){
			difficulty++;
			thePlayer.playerSpeed+=SPEED_MODIFIER;
		}
		if(difficulty>MAX_DIFFICULTY)
			difficulty=MAX_DIFFICULTY;
	}

	lastTrampolineSpot=spot;
}

function draw()
{
	if (gameState==4){
		deathscreen.drawDeathScreen();
		return;
	}
	if (gameState == 0){
		waitingscreen.drawScreen();
	} else if (pauseFrame > -1) {
		if (gameState == 3 && frameCount%60==pauseFrame%60){ // If Resume State
			pauseFrame = -1;
		}
	} else {
		environment.drawEnvironment();
		thePlayer.drawPlayer();
		// Display player's current score
		textSize(START_MESSAGE_SIZE);
		fill(0);
		textAlign(CENTER);
		text(SCORE, SCORE_WIDTH, SCORE_HEIGHT);
		text(total_score, SCORE_WIDTH + 55, SCORE_HEIGHT);

		// Display leaderboard
		fill(color(156, 218, 239, 90));
		rect(LEADERBOARD_XPOS, LEADERBOARD_YPOS, 200, 250);
		textSize(START_MESSAGE_SIZE);
		fill(color(25, 82, 88));
		textAlign(CENTER);
		text(LEADERBOARD_TITLE, LEADERBOARD_TITLE_XPOS, LEADERBOARD_TITLE_YPOS);


		// Generate the next trampoline each time the player touches the ground
		if (frameCount%60 == 0){
			var diff = environment.trampolines[environment.trampolines.length-1] - 40 - environment.scrollX - thePlayer.xpos;
			console.log(diff);
			if (diff < -60 || diff > 100){
				gameOver();
			}
			// console.log("Player: " + thePlayer.xpos);
			// console.log("Tramp: " + (environment.trampolines[environment.trampolines.length-1] - environment.scrollX));

			drawTrampoline();
		}
	}
}

/**
 * Change the Game's State
 */

function pauseGame(){
	if (gameState == 2){ // Pause State
		gameState = 3; // Resume State
	} else {
		pauseFrame = frameCount;
		gameState = 2; // Pause State
	}
}
function gameOver(){
	gameState = 4;
}



/**
 * Handle keyboard input.
 */
function keyPressed(){
	if(gameState == 0){
		thePlayer.playerSpeed = START_SPEED;
		gameState = 1;
		drawTrampoline();
		return;
	} else if (gameState == 4){
		deathscreen.deathScreenKeyPressed();
		return;
	}

	switch(keyCode){
		case LEFT_ARROW:
			if(thePlayer.xpos-DIST_BETWEEN_TRAMPS>0)
				thePlayer.translateX-=DIST_BETWEEN_TRAMPS;
			break;
		case RIGHT_ARROW:
			if(thePlayer.xpos+DIST_BETWEEN_TRAMPS<GAME_WIDTH)
				thePlayer.translateX+=DIST_BETWEEN_TRAMPS;
			break;
		case ESCAPE:
			pauseGame();
			break;
	}
}
