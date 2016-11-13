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
const TIME_CONSTANT=60;
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
var leaders = [];

//number of trampolines before the difficulty increases
const TRAMPOLINES_PER_DIFFICULTY=5;
const MAX_DIFFICULTY=2;

// Classes/Objects
var waitingscreen;
var deathscreen;
var environment;
var thePlayer;

// Assets
var characterImage;
const CHARACTER_WIDTH=80;
const CHARACTER_HEIGHT=80;

var trampolineImage;
const TRAMPOLINE_WIDTH=100;
const TRAMPOLINE_HEIGHT=40;

var balloonImage;

var hubotImage;
var logo;

class Player{
	constructor(){
		this.playerSpeed = START_SPEED;
		this.translateX = 0;
		this.xpos=GAME_WIDTH/2;
		this.ypos=0;
		// animations
		this.rot = 0;
		this.anim = 0;
	}
	drawPlayer(){
		// Lerp the x position
		this.xpos += this.translateX * 0.25;
		this.translateX *= 0.75;
		// Scroll the background
		environment.scrollX += thePlayer.playerSpeed;
		// calculate the player's height
		var sinShenanigans = Math.abs(sin(Math.PI*frameCount/TIME_CONSTANT)) * (GAME_HEIGHT-200);
		thePlayer.ypos=GAME_HEIGHT-sinShenanigans;
		// do flip
		if (this.rot > 0){
			push();
			translate(thePlayer.xpos+CHARACTER_WIDTH/2, thePlayer.ypos-100+CHARACTER_HEIGHT/2);
			if (this.anim==0){
				rotate(this.rot);
			} else {
				scale(1, Math.cos(this.rot));
			}
			translate(-CHARACTER_WIDTH/2, -CHARACTER_HEIGHT/2);
			image(characterImage,0,0,CHARACTER_WIDTH,CHARACTER_HEIGHT);
			pop();
			this.rot -= PI / 30;
		} else {
			// player sprite
			image(characterImage,thePlayer.xpos, thePlayer.ypos-100,
				CHARACTER_WIDTH,CHARACTER_HEIGHT);
		}
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

	balloonImage=loadImage("assets/cute_balloon.jpg");
	balloonX=3000;


	// Initialize Classes
	waitingscreen = new WaitingScreen(GAME_WIDTH,GAME_HEIGHT);
	deathscreen = new DeathScreen();
	environment = new Environment(GAME_HEIGHT);
	thePlayer = new Player();

	// find all valid trampoline spots
	validSpots.push(thePlayer.xpos);
	for(var i=1;;i++){
		if(thePlayer.xpos+(i*DIST_BETWEEN_TRAMPS)>GAME_WIDTH)
			break;

		validSpots.push(thePlayer.xpos+(i*DIST_BETWEEN_TRAMPS));
		validSpots.push(thePlayer.xpos-(i*DIST_BETWEEN_TRAMPS));
		text(SCORE, this.width/2, this.start_message_ypos);
	}
	// Load the leaderboard
	$.ajax({url: "http://54.157.12.226:8000",
			success: function(result){
				var listings = result.split("\n");
				for (var i=0;i<listings.length;i++){
					leaders.push(listings[i]);
				}
	}});
}

/**
Draw an arrow pointing to the next trampoline.
*/
function drawArrow(){

	var arrowLength=30;

	var arrowX=thePlayer.xpos+(CHARACTER_WIDTH/2);
	var arrowY=thePlayer.ypos-CHARACTER_HEIGHT-60;

	var targetX=environment.nextTrampolinePos()-environment.scrollX
	+(TRAMPOLINE_WIDTH/2);
	var targetY=environment.height-30;

	var adj=targetX-arrowX;
	var opp=targetY-arrowY;

	var arrowX2=arrowX+arrowLength*cos(opp/adj);
	var arrowY2=arrowY+arrowLength*sin(opp/adj);

	stroke(0,0,0);
	line(arrowX,arrowY,arrowX2,arrowY2);
}

function drawTrampoline(){
	var maxT=lastTrampolineSpot+difficulty;
	var minT=lastTrampolineSpot-difficulty;

	var spot=minT+int(Math.random()*(maxT-minT));

	if(spot<0) spot=0;
	if(spot>validSpots.length) spot=validSpots.length-1;

	if (environment.trampolines.length == 0){
		var pos = environment.scrollX + thePlayer.playerSpeed * (60 - frameCount%60);
		environment.addTrampoline(pos+validSpots[spot]+40);
	} else {
		var lastTramp = environment.trampolines[environment.trampolines.length-1];
		environment.addTrampoline(lastTramp + thePlayer.playerSpeed * 60);
	}

	if(gameState > 0){
		if (total_score%10==6){
			thePlayer.rot = 2*PI;
			thePlayer.anim = thePlayer.anim==0 ? 1 : 0;
		}
		trampolinesJumped++;total_score++;
		if(trampolinesJumped%TRAMPOLINES_PER_DIFFICULTY==0){
			difficulty++;
			thePlayer.playerSpeed+=SPEED_MODIFIER;

			//trigger inspirational quote
			spawnQuote();

			if(trampolinesJumped%15==0)
				spawnBalloon();
		}
		if(difficulty>MAX_DIFFICULTY)
			difficulty=MAX_DIFFICULTY;
	}

	lastTrampolineSpot=spot;
}

function draw() {
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

		drawArrow();

		textAlign(RIGHT);
		for (var i=0;i<leaders.length;i++){
			text(leaders[i], LEADERBOARD_XPOS + 200, LEADERBOARD_TITLE_YPOS + i * 20 + 40);
		}
		// Generate the next trampoline each time the player touches the ground
		if (frameCount%60 == 0){
			// Trampolines are ellipses, which are anchored in the center by default.
			// The player is an image, anchored by bottom left by default
			// Trampoline Screen Position - Player Screen Position = Player Width / 2 = 37.5
			var diff = environment.trampolines[environment.trampolines.length-2] - environment.scrollX - thePlayer.xpos - CHARACTER_WIDTH/2;
			if (Math.abs(diff) > CHARACTER_WIDTH/2 + TRAMPOLINE_WIDTH){
				var diff2 = environment.trampolines[environment.trampolines.length-1] - environment.scrollX - thePlayer.xpos - CHARACTER_WIDTH/2;
				if (Math.abs(diff2) > CHARACTER_WIDTH/2 + TRAMPOLINE_WIDTH){
					gameState = 4; // game over
				}
			}
			drawTrampoline();
		}

		// flashy effects

		continueQuotes();
		continueBalloon();

	}
}

/**
 * Handle keyboard input.
 */
function keyPressed(){
	switch(gameState){
		case 0: // The game is just starting, reset everything
			gameState = 1;
			drawTrampoline();
			drawTrampoline();
			break;
		case 1:
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
					gameState = 2;
					break;
			}
			break;
		case 2: // The game is paused
			if (keyCode==ESCAPE)
				gameState = 3;
			break;
		case 4:
			deathscreen.deathScreenKeyPressed();
			break;
	}
}
