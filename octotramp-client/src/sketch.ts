/**
 * sketch.js
 *
 * This is the main javascript file that is called by Processing.js
 *
 * @author Elliot Miller
 * @author Chris Baudouin
 * @author Maximillian McMullen
 */
import {Image} from 'p5';

import DeathScreen from './deathscreen';
import Environment from './environment';
import WaitingScreen from './waitingscreen';
import {continueBalloon, continueFounder, continueQuotes, continueRainbow, strobe, spawnBalloon, spawnFounder, spawnQuote, spawnRainbow, spawnStrobe} from './flashyboxofgoodies';
import Player from './player';

import octocatUrl from "./assets/octocat.png";
import hubotUrl from "./assets/octocat.png";
import logoUrl from "./assets/title_logo.png";
import rainbowUrl from "./assets/rainbow-straight.jpg";
import githubFounderUrl from "./assets/some-loser.png";
import githubBackgroundUrl from "./assets/github-homepage.jpg";
import balloonUrl from "./assets/cute_balloon.jpg";

import {
	CHARACTER_WIDTH,
	CHARACTER_HEIGHT,
	GAME_HEIGHT,
	GAME_WIDTH,
	JUMP_DISTANCE,
	MAX_SCROLL_VELOCITY,
	TRAMPOLINE_WIDTH
} from './constants';

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

// State Variables
var totalOffset = 0; // The sum of all offset movements
var gameState = 0; // 0: Start Screen, 1: Play, 2: Paused, 3: Resuming, 4: Dead
var pauseFrame = -1;
var total_score = 0;
var leaders: any = [];
var balloonX = 3000;

// Classes/Objects
let waitingscreen: WaitingScreen;
let deathscreen: DeathScreen;
let environment: Environment;
let thePlayer: Player;

// Assets
var characterImage: Image;
var trampolineImage: Image;
var balloonImage: Image;
var rainbowImage: Image;
var githubFounderImage: Image;
var hubotImage;
var logo;
var githubBackgroundImage;

function updateLeaderBoard(){
	// Load the leaderboard
	fetch("/leaderboard")
		.then(function(response){
			if (response.ok)
				return response.json();
			throw `Error while fetching leaderboard: ${response.statusText}`;
		})
		.then(function(responseJson){
			leaders = responseJson["leaders"];
		})
		.catch(function(error){
			console.warn("The leaderboard could not be loaded");
			console.error(error);
		});
}

window.setup = function ()
{
	// set canvas size
	createCanvas(GAME_WIDTH,GAME_HEIGHT);
	// load images
	characterImage = loadImage(octocatUrl);
	hubotImage = loadImage(hubotUrl);
	logo = loadImage(logoUrl);
	rainbowImage = loadImage(rainbowUrl);
	githubFounderImage = loadImage(githubFounderUrl)
	githubBackgroundImage = loadImage(githubBackgroundUrl);
	balloonImage = loadImage(balloonUrl);
	balloonX = 3000;

	// Initialize Classes
	waitingscreen = new WaitingScreen(GAME_WIDTH,GAME_HEIGHT,characterImage,logo);
	deathscreen = new DeathScreen(logo);
	thePlayer = new Player(characterImage);
	environment = new Environment(thePlayer);

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
		text(leaders[i].score + " - " + leaders[i].name, GAME_WIDTH - 60, 70 + i * 22 + 40);
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
	if (environment.trampolinesPlaced%5==0){
		// change the difficulty settings
		environment.difficulty += environment.difficulty < MAX_DIFFICULTY ? 1 : 0;
		// update the leaderboard every five trampolines
		updateLeaderBoard();
		// trigger fun flashy Stuff based on jump count
		spawnQuote();
		if(environment.trampolinesPlaced%10==0)
			spawnBalloon();
		if(environment.trampolinesPlaced%15==0)
			spawnRainbow();
		if(environment.trampolinesPlaced%20==0)
			spawnStrobe();
		if(environment.trampolinesPlaced%25==0)
			spawnFounder();
	}
}

window.draw = function () {
	switch(gameState){
		case 0:
			waitingscreen.drawScreen();
			break;
		case 1:
			total_score = int(environment.scrollPosition / JUMP_DISTANCE);
			environment.drawEnvironment();
			// Draw the landing highlighter
			var screenHit = thePlayer.xpos + CHARACTER_WIDTH/2 + JUMP_DISTANCE * (1-(thePlayer.jumpTheta/Math.PI)%1);
			noStroke();
			fill(color(255,0,0));
			rect(screenHit - TRAMPOLINE_WIDTH/2, GAME_HEIGHT - 3, TRAMPOLINE_WIDTH, 4);
			// Draw the player
			thePlayer.drawPlayer();
			drawLeaderboard();

			// flashy effects
			continueQuotes();
			continueBalloon(thePlayer, balloonImage);
			continueRainbow(rainbowImage);
			strobe();
			continueFounder(githubFounderImage);
			// Generate the next trampoline each time the player touches the ground
			if (thePlayer.jumpTheta%Math.PI < 0.05){
				bounce();
			}
			break;
		case 3:
			gameState = 1;
			break;
		case 4:
			deathscreen.drawDeathScreen(total_score);
			break;
	}
}

/**
 * Handle keyboard input.
 */
window.keyPressed = function(){
	switch(gameState){
		case 0: // The game is just starting, reset everything
			gameState = 1;
			break;
		case 1:
			switch(keyCode){
				case 65:
				case LEFT_ARROW:
					if(thePlayer.xpos-TRAMPOLINE_WIDTH>0)
						thePlayer.translateX-=TRAMPOLINE_WIDTH;
					break;
				case 68:
				case RIGHT_ARROW:
					if(thePlayer.xpos+TRAMPOLINE_WIDTH<GAME_WIDTH)
						thePlayer.translateX+=TRAMPOLINE_WIDTH;
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
			deathscreen.deathScreenKeyPressed(total_score);
			break;
	}
}

