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
const MAX_SCROLL_VELOCITY = 13; // The maximum speed at which to scroll (pixels per frame)
const JUMP_DISTANCE = 500; // Number of pixels traveled on the x-axis per jump

var jumpDuration; // Number of frames per jump
var jumpTheta = 0.1; // Current theta of the jump height used in a sin function

const GAME_WIDTH = window.innerWidth;
const GAME_HEIGHT = window.innerHeight;
const TITLE_SIZE = 32;
const TITLE_POS = GAME_HEIGHT/2;
const SUBTITLE_SIZE = 24;
const SUBTITLE_POS = ((GAME_HEIGHT/2)/2) + (((GAME_HEIGHT/2)/2)/1.6);
const TRAMPOLINES_PER_DIFFICULTY=5;
const MAX_DIFFICULTY=2;

const SCORE = "Score: ";
const SCORE_HEIGHT = (GAME_HEIGHT/6);
const SCORE_WIDTH = (GAME_WIDTH/2);

const LEADERBOARD_XPOS = GAME_WIDTH - (GAME_WIDTH/5.5);
const LEADERBOARD_YPOS = 50;
const LEADERBOARD_X_SIZE = 200;
const LEADERBOARD_TITLE = "Leaderboard";
const LEADERBOARD_TITLE_XPOS = LEADERBOARD_XPOS + (LEADERBOARD_X_SIZE/2);
const LEADERBOARD_TITLE_YPOS = LEADERBOARD_YPOS + 20;

const CHARACTER_WIDTH=80;
const CHARACTER_HEIGHT=80;

const TRAMPOLINE_WIDTH=100;
const TRAMPOLINE_HEIGHT=40;

// State Variables
var totalOffset = 0; // The sum of all offset movements
var gameState = 0; // 0: Start Screen, 1: Play, 2: Paused, 3: Resuming, 4: Dead
var pauseFrame = -1;
var difficulty = 0; //determines how far a trampoline can spawn from the center
var trampolinesPlaced = 0; //amount of trampolines jumped on, determines difficulty
var total_score = 0;
var leaders = [];

// Classes/Objects
var waitingscreen;
var deathscreen;
var environment;
var thePlayer;

// Assets
var characterImage;
var trampolineImage;
var balloonImage;
var rainbowImage;
var githubFounderImage;
var hubotImage;
var logo;
var githubBackgroundImage;

class Player{
	constructor(){
		this.translateX = 0;
		this.xpos = GAME_WIDTH / 2;
	}
	drawPlayer(){
		// Increase the y
		jumpTheta += Math.PI / jumpDuration;
		// Lerp the x position
		this.xpos += this.translateX * 0.25;
		this.translateX *= 0.75;
		// calculate the player's height
		var yPos = GAME_HEIGHT - Math.abs(sin(jumpTheta)) * (GAME_HEIGHT-200);
		// player sprite
		image(characterImage,thePlayer.xpos, yPos-100,
			CHARACTER_WIDTH,CHARACTER_HEIGHT);
	}
}

function updateLeaderBoard(){
	// Load the leaderboard
	$.ajax({url: "leaderboard",
			success: function(result){
				leaders = [];
				var listings = result.split("\n");
				for (var i=0;i<listings.length;i++){
					leaders.push(listings[i]);
				}
	}});
}

function setup()
{
	// set canvas size
	createCanvas(GAME_WIDTH,GAME_HEIGHT);
	// load images
	characterImage = loadImage("static/assets/octocat.png");
	hubotImage = loadImage("static/assets/hubot.jpg");
	logo = loadImage("static/assets/title_logo.png");
	rainbowImage = loadImage("static/assets/rainbow-straight.jpg");
	githubFounderImage = loadImage("static/assets/some-loser.png")
	githubBackgroundImage = loadImage("static/assets/github-homepage.jpg");
	balloonImage = loadImage("static/assets/cute_balloon.jpg");
	balloonX = 3000;

	// Initialize Classes
	waitingscreen = new WaitingScreen(GAME_WIDTH,GAME_HEIGHT);
	deathscreen = new DeathScreen();
	environment = new Environment(GAME_HEIGHT);
	thePlayer = new Player();

	environment.adjustScrollVelocity();
	updateLeaderBoard();
}

function drawLeaderboard(){
	// Draw the leaderboard box
	fill(color(255, 255, 255, 90));
	rect(GAME_WIDTH - 300, 50, 250, 400);
	// Style the text
	textStyle(NORMAL);
	textSize(20);
	fill(color(25, 82, 88));
	textAlign(CENTER);
	// Display leaderboard
	text(LEADERBOARD_TITLE, GAME_WIDTH-175, 70);
	// List leaders
	textAlign(RIGHT);
	for (var i=0;i<leaders.length;i++){
		text(leaders[i], GAME_WIDTH - 60, 70 + i * 22 + 40);
	}
	// Display player's current score
	text("Score: " + total_score, GAME_WIDTH - 60, 480);
}

function bounce(){
	environment.adjustScrollVelocity();
	increaseDifficulty();
	// Trampolines are ellipses, which are anchored in the center by default.
	// The player is an image, anchored by bottom left by default
	// Trampoline Screen Position - Player Screen Position = Player Width / 2 = 37.5
	var offset = environment.scrollPosition + thePlayer.xpos + CHARACTER_WIDTH/2;
	for (var i=0;i<environment.trampolines.length;i++){
		var diff = environment.trampolines[i] - offset;
		if (Math.abs(diff) < CHARACTER_WIDTH){ // less forgiving because of improved targeting
			return;
		}
	}
	// If we didn't bounce, end game
	gameState = 4;
}

function increaseDifficulty(){
	if (trampolinesPlaced%5==0){
		// change the difficulty settings
		difficulty += difficulty < MAX_DIFFICULTY ? 1 : 0;
		// update the leaderboard every five trampolines
		updateLeaderBoard();
		// trigger fun flashy Stuff based on jump count
		spawnQuote();
		if(trampolinesPlaced%10==0)
			spawnBalloon();
		if(trampolinesPlaced%15==0)
			spawnRainbow();
		if(trampolinesPlaced%20==0)
			spawnSeizure();
		if(trampolinesPlaced%25==0)
			spawnFounder();
	}
}

function draw() {
	switch(gameState){
		case 0:
			waitingscreen.drawScreen();
			break;
		case 1:
			total_score = int(environment.scrollPosition / JUMP_DISTANCE);
			environment.drawEnvironment();
			// Draw the landing highlighter
			var screenHit = thePlayer.xpos + CHARACTER_WIDTH/2 + JUMP_DISTANCE * (1-(jumpTheta/Math.PI)%1);
			noStroke();
			fill(color(255,0,0));
			rect(screenHit - TRAMPOLINE_WIDTH/2, GAME_HEIGHT - 3, TRAMPOLINE_WIDTH, 4);
			// Draw the player
			thePlayer.drawPlayer();
			drawLeaderboard();

			// flashy effects
			continueQuotes();
			continueBalloon();
			continueRainbow();
			strobe();
			continueFounder();
			// Generate the next trampoline each time the player touches the ground
			if (jumpTheta%Math.PI < 0.05){
				bounce();
			}
			break;
		case 3:
			gameState = 1;
			break;
		case 4:
			deathscreen.drawDeathScreen();
			break;
	}
}

/**
 * Handle keyboard input.
 */
function keyPressed(){
	switch(gameState){
		case 0: // The game is just starting, reset everything
			gameState = 1;
			break;
		case 1:
			switch(keyCode){
				case LEFT_ARROW:
					if(thePlayer.xpos-TRAMPOLINE_WIDTH>0)
						thePlayer.translateX-=TRAMPOLINE_WIDTH;
					break;
				case A:
					if(thePlayer.xpos-DIST_BETWEEN_TRAMPS>0)
						thePlayer.translateX-=DIST_BETWEEN_TRAMPS;
					break;
				case RIGHT_ARROW:
					if(thePlayer.xpos+TRAMPOLINE_WIDTH<GAME_WIDTH)
						thePlayer.translateX+=TRAMPOLINE_WIDTH;
					break;
				case D:
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
