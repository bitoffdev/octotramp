
//how much the player can modify their speed
const SPEED_MODIFIER=1;

//affects how sensitive the sin functions are since
//the position is a function of sin and time
const TIME_CONSTANT=500;

const GAME_WIDTH=640;
const GAME_HEIGHT=480;


var DEFAULT_SPEED=10;

class Player{
	constructor(){
		this.playerSpeed=DEFAULT_SPEED;
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
	environment = new Environment(10000,GAME_HEIGHT);
}

function drawPlayer(){
	//thePlayer.xpos+=thePlayer.playerSpeed;
	environment.scrollX += thePlayer.playerSpeed;

	var sinShenanigans=(sin(millis()/TIME_CONSTANT))*(GAME_HEIGHT);
	if(sinShenanigans<0) sinShenanigans*=-1;
	thePlayer.ypos=GAME_HEIGHT-sinShenanigans;

	if(thePlayer.xpos>GAME_WIDTH){
		thePlayer.xpos%=GAME_WIDTH;
	}

	// placeholder for player sprite
	fill(255, 0, 0);
	ellipse(thePlayer.xpos, thePlayer.ypos, 25, 25);

	// debug info
	// fill(0);
	// text("speed = " + playerSpeed, 25, 25);
}

function draw()
{
	environment.drawEnvironment();
	drawPlayer();
}

/**
Handle keyboard input.

Left arrow decreases speed, right arrow increases speed
*/
function keyPressed(){
	switch(keyCode){
		case LEFT_ARROW:
			thePlayer.playerSpeed-=SPEED_MODIFIER;
			break;
		case RIGHT_ARROW:
			thePlayer.playerSpeed+=SPEED_MODIFIER;
			break;
		default:
			break;
	}
}
