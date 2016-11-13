
//how much the player can modify their speed
const SPEED_MODIFIER=1;

//affects how sensitive the sin functions are since
//the position is a function of sin and time
const TIME_CONSTANT=500;

const GAME_WIDTH=640;
const GAME_HEIGHT=480;

const DIST_BETWEEN_TRAMPS=100;
const GAME_TITLE_YPOS = ((GAME_HEIGHT/2)/2);
const GAME_TITLE = "OCTOTRAMP";
const GAME_TITLE_SIZE = 32;
const START_MESSAGE = "press any key to start";
const START_MESSAGE_YPOS = ((GAME_HEIGHT/2)/2) + (((GAME_HEIGHT/2)/2)/2);
const START_MESSAGE_SIZE = 24;

var DEFAULT_SPEED=10;
var STARTING_SPEED = 0;

var GAME_STARTED = 0;

var characterImage;

var nextSpot=0;

class Player{
	constructor(){
		this.playerSpeed=STARTING_SPEED;
		this.xpos=100;
		this.ypos=0;
	}
}

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
	addNextTrampoline();
}

function drawBackground(){
	// Draw Environment
	environment.drawEnvironment();

	// Draw Chris' Stuff
	fill(0);
	text(START_MESSAGE, GAME_WIDTH/2, START_MESSAGE_YPOS);
	textSize(GAME_TITLE_SIZE);
	textAlign(CENTER);

	text(GAME_TITLE, GAME_WIDTH/2, GAME_TITLE_YPOS);
	textStyle(BOLD);
	textSize(START_MESSAGE_SIZE);
	textAlign(CENTER);
}

function addNextTrampoline(){
	var pos = environment.scrollX + thePlayer.playerSpeed * (60 - frameCount%60);
	environment.addTrampoline(pos + thePlayer.xpos);
}

function drawPlayer(){
	environment.scrollX += thePlayer.playerSpeed;

	var sinShenanigans = Math.abs(sin(Math.PI*frameCount/60)) * (GAME_HEIGHT-200);
	thePlayer.ypos=GAME_HEIGHT-sinShenanigans;

	// Generate the next trampoline each time the player touches the ground
	if (frameCount%60 == 0){
		addNextTrampoline();
	}

	image(characterImage,thePlayer.xpos, thePlayer.ypos-100);

	// debug info
	//  fill(0);
	//  text("framerate = " + getFrameRate(), 25, 25);
}

function increaseSpeed(){
	thePlayer.playerSpeed+=SPEED_MODIFIER;
	console.log('speed increasing');
}

function draw()
{
	drawBackground();
	drawPlayer();
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
	}
	switch(keyCode){
		case LEFT_ARROW:
			//thePlayer.xpos-=DIST_BETWEEN_TRAMPS;
			environment.translateX -= DIST_BETWEEN_TRAMPS;
			break;
		case RIGHT_ARROW:
			//thePlayer.xpos+=DIST_BETWEEN_TRAMPS;
			environment.translateX += DIST_BETWEEN_TRAMPS;
				// if(thePlayer.playerSpeed > 0){
				// 	thePlayer.playerSpeed-=SPEED_MODIFIER;
				// }
			break;
	}
}
