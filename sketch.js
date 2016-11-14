
//how much the player can modify their speed
const SPEED_MODIFIER=1;

//affects how sensitive the sin functions are since
//the position is a function of sin and time
const TIME_CONSTANT=500;

const GAME_WIDTH=window.innerWidth;
const GAME_HEIGHT=window.innerHeight;

const DIST_BETWEEN_TRAMPS=100;
const GAME_TITLE_YPOS = ((GAME_HEIGHT/2)/2);
const GAME_TITLE = "OCTOTRAMP";
const GAME_TITLE_SIZE = 32;
const START_MESSAGE = "press any key to start";
const START_MESSAGE_YPOS = ((GAME_HEIGHT/2)/2) + (((GAME_HEIGHT/2)/2)/2);
const START_MESSAGE_SIZE = 24;

var DEFAULT_SPEED=5;
var STARTING_SPEED = 0;

var GAME_STARTED = 0;

//number of trampolines before the difficulty increases
var TRAMPOLINES_PER_DIFFICULTY=10;
var MAX_DIFFICULTY=2;

var characterImage;

class Player{
	constructor(){
		this.playerSpeed=STARTING_SPEED;
		this.xpos=100;
		this.ypos=0;
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

function setup()
{
	// set canvas size
	createCanvas(GAME_WIDTH,GAME_HEIGHT);
  // set canvas size
  createCanvas(GAME_WIDTH,GAME_HEIGHT);
	characterImage = loadImage("assets/octocat.png");
	image(characterImage, 0, 0);
	environment = new Environment(10000,GAME_HEIGHT);

	thePlayer.xpos=GAME_WIDTH/2;
	thePlayer.ypos=0;

	// find all valid trampoline spots
	validSpots.push(thePlayer.xpos);
	for(var i=1;;i++){
		if(thePlayer.xpos+(i*DIST_BETWEEN_TRAMPS)>GAME_WIDTH)
			break;

		validSpots.push(thePlayer.xpos+(i*DIST_BETWEEN_TRAMPS));
		validSpots.push(thePlayer.xpos-(i*DIST_BETWEEN_TRAMPS));
	}

	drawTrampoline();
	trampolineImage = loadImage("assets/trampoline.png");
}

function drawBackground(){
	// Draw Environment
	environment.drawEnvironment();

	// Draw Chris' Stuff
	text(START_MESSAGE, GAME_WIDTH/2, START_MESSAGE_YPOS);
	textSize(GAME_TITLE_SIZE);
	textAlign(CENTER);

	text(GAME_TITLE, GAME_WIDTH/2, GAME_TITLE_YPOS);
	textStyle(BOLD);
	textSize(START_MESSAGE_SIZE);
	textAlign(CENTER);

}

function drawTrampoline(){
	var maxT=lastTrampolineSpot+difficulty;
	var minT=lastTrampolineSpot-difficulty;

	var spot=minT+int(Math.random()*(maxT-minT));

	if(spot<0) spot=0;
	if(spot>validSpots.length) spot=validSpots.length-1;

	var pos = environment.scrollX + thePlayer.playerSpeed * (60 - frameCount%60);
	environment.addTrampoline(pos+validSpots[spot] + 40);

	if(GAME_STARTED){
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

function drawPlayer(){
	environment.scrollX += thePlayer.playerSpeed;

	var sinShenanigans = Math.abs(sin(Math.PI*frameCount/60)) * (GAME_HEIGHT-200);
	thePlayer.ypos=GAME_HEIGHT-sinShenanigans;

	//player sprite
	image(characterImage,thePlayer.xpos, thePlayer.ypos-100, 75, 75);
}

function increaseSpeed(){
	thePlayer.playerSpeed+=SPEED_MODIFIER;
	console.log('speed increasing');
}

function draw()
{
	drawBackground();
	drawPlayer();

	if (frameCount%60 == 0){
		drawTrampoline();
	}
}

/**
Handle keyboard input.

Left arrow decreases speed, right arrow increases speed
*/
function keyPressed(){
	if(GAME_STARTED == 0){
		thePlayer.playerSpeed = DEFAULT_SPEED;
		text(START_MESSAGE, GAME_WIDTH/2, START_MESSAGE_YPOS);
		textSize(GAME_TITLE_SIZE);
		textAlign(CENTER);
		fill(220,220,220);
		GAME_STARTED = 1;
		drawTrampoline();
		return;
	}

	switch(keyCode){
		case LEFT_ARROW:
			if(thePlayer.xpos-DIST_BETWEEN_TRAMPS>0)
				thePlayer.xpos-=DIST_BETWEEN_TRAMPS;
			break;
		case RIGHT_ARROW:
			if(thePlayer.xpos+DIST_BETWEEN_TRAMPS<GAME_WIDTH)
				thePlayer.xpos+=DIST_BETWEEN_TRAMPS;
			break;
		default:
			break;
	}
}
