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
const TIME_CONSTANT=55; // number of frames per jump
const DIST_BETWEEN_TRAMPS = 100;
const GAME_WIDTH = window.innerWidth;
const GAME_HEIGHT = window.innerHeight;
const TITLE_SIZE = 32;
const TITLE_POS = GAME_HEIGHT/2;
const SUBTITLE_SIZE = 24;
const SUBTITLE_POS = ((GAME_HEIGHT/2)/2) + (((GAME_HEIGHT/2)/2)/1.6);
const TRAMPOLINES_PER_DIFFICULTY=5;
const MAX_DIFFICULTY=2;

const START_SPEED = 8;
const SPEED_MODIFIER = 0.6;

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
var difficulty=0; //determines how far a trampoline can spawn from the center
var trampolinesPlaced=0; //amount of trampolines jumped on, determines difficulty
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

	rainbowImage=loadImage("assets/rainbow-straight.jpg");

	githubFounderImage=loadImage("assets/some-loser.png")
	githubBackgroundImage=loadImage("assets/github-homepage.jpg");


	// Initialize Classes
	waitingscreen = new WaitingScreen(GAME_WIDTH,GAME_HEIGHT);
	deathscreen = new DeathScreen();
	environment = new Environment(GAME_HEIGHT);
	thePlayer = new Player();

	// Load the leaderboard
	$.ajax({url: "leaderboard",
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

function placeTrampoline(){
	trampolinesPlaced++;
	var scrollPlayer = environment.scrollX + thePlayer.xpos + CHARACTER_WIDTH/2;
	// Calculate where the player will hit after the last trampoline placed
	if (trampolinesPlaced==1){
		var scrollHit = scrollPlayer + thePlayer.playerSpeed * (TIME_CONSTANT - frameCount%TIME_CONSTANT);
	} else {
		var scrollHit = environment.trampolines[environment.trampolines.length-1] + TIME_CONSTANT * thePlayer.playerSpeed;
	}
	// Adjust trampolines for changes in speed
	var jumpsBefore = (scrollHit - scrollPlayer) / (TIME_CONSTANT * thePlayer.playerSpeed);
	if (trampolinesPlaced%5==0 ||trampolinesPlaced%5 + jumpsBefore > 5.5){
		scrollHit += (SPEED_MODIFIER * TIME_CONSTANT);
	}
	// Calculate the total score
	total_score = trampolinesPlaced - int(jumpsBefore);
	// Get random offset based on difficulty
	var offset = DIST_BETWEEN_TRAMPS * (int(Math.random() * (2 * difficulty + 1)) - difficulty);
	// Prevent offsets from flying to far off the center
	if (totalOffset < -300 || totalOffset > 300){offset=-offset;}
	totalOffset += offset;
	// Put it all together and add the trampoline
	environment.addTrampoline(scrollHit + offset);
}

function drawTrampoline(){

	placeTrampoline();

	// Increase the difficulty every 5 trampolines placed
	if(trampolinesPlaced%TRAMPOLINES_PER_DIFFICULTY==0){
		difficulty += difficulty<MAX_DIFFICULTY ? 1 : 0;
		thePlayer.playerSpeed+=SPEED_MODIFIER;

		//trigger fun flashy Stuff based on jump count
		spawnQuote();
		if(trampolinesPlaced%10==0)
			spawnBalloon();
		if(trampolinesPlaced%15==0)
			spawnRainbow();
		if(trampolinesPlaced%20==0)
			spawnSeizure();
		if(trampolinesPlaced%25==0)
			spawnFounder();
		if(trampolinesPlaced%5==0){
			thePlayer.rot = 2*PI;
			thePlayer.anim = thePlayer.anim==0 ? 1 : 0;
		}
	}
}

function draw() {
	if (gameState==4){
		deathscreen.drawDeathScreen();
		return;
	}
	if (gameState == 0){
		waitingscreen.drawScreen();
	} else if (pauseFrame > -1) {
		if (gameState == 3 && frameCount%TIME_CONSTANT==pauseFrame%TIME_CONSTANT){ // If Resume State
			pauseFrame = -1;
		}
	} else {
		environment.drawEnvironment();
		var scrollHit = thePlayer.xpos + CHARACTER_WIDTH/2 + thePlayer.playerSpeed * (TIME_CONSTANT - frameCount%TIME_CONSTANT);
		noStroke();
		fill(color(255,0,0));
		rect(scrollHit-DIST_BETWEEN_TRAMPS/2+thePlayer.playerSpeed, GAME_HEIGHT-3, DIST_BETWEEN_TRAMPS, 4);
		thePlayer.drawPlayer();

		// Draw the leaderboard box
		fill(color(255, 255, 255, 90));
		rect(GAME_WIDTH - 300, 50, 250, 300);
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
		text("Score: " + total_score, GAME_WIDTH - 60, 380);

		// flashy effects
		continueQuotes();
		continueBalloon();
		continueRainbow();
		strobe();
		continueFounder();

		// Generate the next trampoline each time the player touches the ground
		if (frameCount%TIME_CONSTANT == 0){
			// Trampolines are ellipses, which are anchored in the center by default.
			// The player is an image, anchored by bottom left by default
			// Trampoline Screen Position - Player Screen Position = Player Width / 2 = 37.5
			var offset = environment.scrollX + thePlayer.xpos + CHARACTER_WIDTH/2;
			for (var i=0;i<environment.trampolines.length;i++){
				var diff = environment.trampolines[i] - offset;
				if (Math.abs(diff) < CHARACTER_WIDTH){ // less forgiving because of improved targeting
					drawTrampoline();
					return;
				}
			}
			// If we didn't bounce, end game
			gameState = 4;
		}
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
			//drawTrampoline();
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
