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
const GAME_WIDTH=window.innerWidth;
const GAME_HEIGHT=window.innerHeight;
const DIST_BETWEEN_TRAMPS=100;
const START_SPEED = 10;
const TRAMPOLINES_PER_DIFFICULTY=2; //number of trampolines before the difficulty increases

// State Variables
var GAME_STARTED = 0;
var validSpots=[]; //list of valid trampoline x positions
var difficulty=0; //determines how far a trampoline can spawn from the center
var maxTrampolinesFromCenter=0; //furthest from the center a trampoline can spawn (dependent on screen width)
var trampolinesJumped=0; //amount of trampolines jumped on, determines difficulty

// Classes/Objects
var waitingscreen;
var environment;
var thePlayer;

// Assets
var characterImage;

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

function setup() {
  // set canvas size
  createCanvas(GAME_WIDTH,GAME_HEIGHT);

	// load images
	characterImage = loadImage("assets/octocat.png");
	trampolineImage = loadImage("assets/trampoline.png");

	// Initialize Classes
	waitingscreen = new WaitingScreen(GAME_WIDTH,GAME_HEIGHT);
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
	}
	drawTrampoline();
}

function drawTrampoline() {
	var spot=validSpots[int(Math.random()*difficulty)];

	var pos = environment.scrollX + thePlayer.playerSpeed * (60 - frameCount%60);
	environment.addTrampoline(pos+spot + 40);

	if(GAME_STARTED){
		trampolinesJumped++;
		if(trampolinesJumped%TRAMPOLINES_PER_DIFFICULTY==0)
			difficulty++;
	}
}

function draw()
{
	if (GAME_STARTED == 0){
		waitingscreen.drawScreen();
	} else {
		environment.drawEnvironment();
		thePlayer.drawPlayer();
		// Generate the next trampoline each time the player touches the ground
		if (frameCount%60 == 0){
			drawTrampoline();
		}
	}
}

/**
 * Handle keyboard input.
 */
function keyPressed(){
	if(GAME_STARTED == 0){
		thePlayer.playerSpeed = START_SPEED;
		GAME_STARTED = 1;
		drawTrampoline();
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
	}
}
