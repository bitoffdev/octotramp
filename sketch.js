
//how much the player can modify their speed
const SPEED_MODIFIER=1;

//affects how sensitive the sin functions are since
//the position is a function of sin and time
const TIME_CONSTANT=500;

const GAME_WIDTH=640;
const GAME_HEIGHT=480;

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

class Player{
	constructor(){
		this.playerSpeed=STARTING_SPEED;
		this.xpos=0;
		this.ypos=0;
	}
}

var thePlayer=new Player();
var environment;


function setup()
{
  // set canvas size
  createCanvas(GAME_WIDTH,GAME_HEIGHT);
	characterImage = loadImage("assets/octocat.png");
	image(characterImage, 0, 0);
	environment = new Environment(10000,GAME_HEIGHT);
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

function drawPlayer(){
	//thePlayer.xpos+=thePlayer.playerSpeed;
	environment.scrollX += thePlayer.playerSpeed;

	var sinShenanigans=(sin(millis()/TIME_CONSTANT))*(GAME_HEIGHT-100);
	if(sinShenanigans<0) sinShenanigans*=-1;
	thePlayer.ypos=GAME_HEIGHT-sinShenanigans;

	if(thePlayer.xpos>GAME_WIDTH){
		thePlayer.xpos%=GAME_WIDTH;
	}

	// placeholder for player sprite
	//fill(255, 0, 0);
	image(characterImage,thePlayer.xpos, thePlayer.ypos-100, 75, 75);

	// debug info
	// fill(0);
	// text("speed = " + playerSpeed, 25, 25);
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
				if(thePlayer.playerSpeed > 0){
					thePlayer.playerSpeed-=SPEED_MODIFIER;
				}
			break;
		case RIGHT_ARROW:
				thePlayer.playerSpeed+=SPEED_MODIFIER;
			break;
		default:
			break;
	}
}
