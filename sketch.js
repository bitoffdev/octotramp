
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
		this.xpos=0;
		this.ypos=0;
	}
}

class Trampoline{
	constructor(){
		//trampoline width
		this.size=15
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

/**
Computes the location of the next landing point for the player,
to appropriately place a trampoline. This is done by calculating
the next time where |sin(x)| will be zero, and using the speed
times frame rate.
*/
function computeNextTrampoline(){
	var current=thePlayer.xpos;

	var oldTime=millis();

	//formula found using some algebra. adding pi to the time will result in
	//the next 'zero', so use this to determine next time
	// (t1/const) + pi = (t2/const) -> t2 = t1 + pi*const
	var newTime=oldTime+ Math.PI*TIME_CONSTANT;

	nextSpot=current+(newTime-oldTime)*getFrameRate()*thePlayer.playerSpeed;
}

function drawTrampoline(){
	fill(0,255,0);
	ellipse(nextSpot%GAME_WIDTH,GAME_HEIGHT,50,50);
}

function drawPlayer(){
	//thePlayer.xpos+=thePlayer.playerSpeed;
	environment.scrollX += thePlayer.playerSpeed;

	var sinShenanigans=Math.abs(sin(millis()/TIME_CONSTANT))*(GAME_HEIGHT);
	var sinShenanigans=(sin(millis()/TIME_CONSTANT))*(GAME_HEIGHT-100);
	if(sinShenanigans<0) sinShenanigans*=-1;
	thePlayer.ypos=GAME_HEIGHT-sinShenanigans;

	//ball is hitting the ground
	// if(sinShenanigans<10){
	// 	console.log("player pos="+thePlayer.xpos);
	// 	console.log("tramp pos="+nextSpot%GAME_WIDTH);
	// 	computeNextTrampoline();
	// }


	if(thePlayer.xpos>GAME_WIDTH){
		thePlayer.xpos%=GAME_WIDTH;
	}



	// placeholder for player sprite
	//fill(255, 0, 0);
	image(characterImage,thePlayer.xpos, thePlayer.ypos-100, 75, 75);

	// debug info
	 fill(0);
	 text("framerate = " + getFrameRate(), 25, 25);
}

function increaseSpeed(){
	thePlayer.playerSpeed+=SPEED_MODIFIER;
	console.log('speed increasing');
}

function draw()
{
	drawBackground();
	drawPlayer();
	drawTrampoline();
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
			thePlayer.xpos-=DIST_BETWEEN_TRAMPS;
			break;
		case RIGHT_ARROW:
			thePlayer.xpos+=DIST_BETWEEN_TRAMPS;
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
