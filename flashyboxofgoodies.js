


//strings that will float around as the user plays.
//a string will appear every time the difficulty increases
var INSPIRATIONAL_STRINGS=[
	 "Stay committed!",
	 "When push comes to shove...",
	 "git push your dreams... before they get crushed",
	 "You can pull through!",
	 "git checkout the high scores when you're done!",
	 "If you don't do too well, you can always git reset!",
	 "git show me what you've got",
	 "It makes no diff to me",
	 "At this rate, you're going to git add your name to the high scores!",
	 "rm all your doubts!",
	 "git fetch silly-quotes.git",
	 "Keep mv'ing!",
	 "The difficulty isn't going to revert any time soon"
];

class Quote{
	constructor(){
		this.x=0;
		this.y=0;
		this.text="";

		//direction the quote is floating in
		this.direction="";
	}
}

var STRING_OPACITY=50;
var STRING_SPEED=5;

//designate the areas strings can appear from
var STRINGS_ABOVE=GAME_HEIGHT/2; //top half
var STRINGS_WITHIN_EDGE=GAME_WIDTH/3; //within 1/3 of edge

var activeQuotes=[];

var balloonX=0;
var balloonY=0;
var balloonActive=false;

var rainbowXs=[];
var rainbowActive=false;
const RAINBOW_WIDTH=1200;
const RAINBOW_HEIGHT=100;
const RAINBOW_ANGLE=45;
const RAINBOW_SPEED=25;

var strobeStart=0;
var strobeActive=false;
const STROBE_FRAMES=120;

var founderX=0;
var founderY=GAME_HEIGHT/2;
var founderActive=false;
var founderRotation=0;

/**
Creates a random quote from the list, and initializes it to float across the
screen in a random location.
*/
function spawnQuote(){

	var activeQuote=new Quote();

	var quote=INSPIRATIONAL_STRINGS[int(Math.random()*INSPIRATIONAL_STRINGS.length)];

	activeQuote.text=quote;

	//determine starting location by randomizing a spot along the valid edges
	var start=int(Math.random()*(STRINGS_ABOVE*2+GAME_WIDTH-STRINGS_WITHIN_EDGE));

	//coming from left
	if(start<STRINGS_ABOVE){
		activeQuote.x=0;
		activeQuote.y=start;
		activeQuote.direction="right";
	}
	//coming from right
	else if(start>STRINGS_ABOVE+GAME_WIDTH-STRINGS_WITHIN_EDGE){
		activeQuote.x=GAME_WIDTH;
		activeQuote.y=start-(GAME_WIDTH-STRINGS_WITHIN_EDGE+STRINGS_ABOVE);
		activeQuote.direction="left";
	}
	//coming from top
	else{
		topPos=start-(STRINGS_ABOVE);

		if(topPos<STRINGS_WITHIN_EDGE)
			activeQuote.x=topPos;
		else
			activeQuote.x=topPos+STRINGS_WITHIN_EDGE;

		activeQuote.y=0;
		activeQuote.direction="down";
	}

	console.log("x="+activeQuote.x+" y="+activeQuote.y+" dir="+activeQuote.direction);

	activeQuotes.push(activeQuote);
}

/**
Continue each quote animation, having each float in the direction they were
initialized in. If a quote goes offscreen, it is removed.
*/
function continueQuotes(){
	for(var i=0;activeQuotes && i<activeQuotes.length;i++){
		current=activeQuotes[i];

		switch(current.direction){
			case "right":
				textAlign(LEFT);
				current.x+=STRING_SPEED;
				break;
			case "left":
				textAlign(RIGHT);
				current.x-=STRING_SPEED;
				break;
			case "down":
				if(current.x<GAME_WIDTH)
					textAlign(LEFT);
				else
					textAlign(RIGHT);
				current.y+=STRING_SPEED;
				break;
			default:
				break;
		}

		text(current.text,current.x,current.y);

		if(current.x<0 || current.x>GAME_WIDTH ||
			current.y<0 || current.y>GAME_HEIGHT){
				activeQuotes.pop(i);
				i--;
		}
	}
}

/**
'Spawns' a balloon on the screen. What's really happening is the balloon's
x position is reset to 0, so that it appears as though it just appeared.
Lazy? Yes. Effective? Also yes.
*/
function spawnBalloon(){
	var start=int(Math.random()*GAME_HEIGHT/2);

	balloonX=0;
	balloonY=start;

	balloonActive=true;
}

/**
Continues balloon animation in a circular pattern across the screen
*/
function continueBalloon(){
	if(!balloonActive)
		return;

	balloonX+=5;
	var balloonXPos=(sin(3*frameCount/TIME_CONSTANT)+1)*100 + balloonX;
	var balloonYPos=(cos(3*frameCount/TIME_CONSTANT)+1)*GAME_HEIGHT/2 - balloonY;

	image(balloonImage,balloonXPos, balloonYPos,100,100);

	if(balloonX>GAME_WIDTH)
		ballonActive=false;
}


/**
Trigger the rainbow animation
*/
function spawnRainbow(){
	rainbowXs.push(-RAINBOW_WIDTH);
	rainbowActive=true;
}

/**
Have a rainbow fall through the screen diagonally, continuing through the top
until the rainbow has reached the right side of the screen.
*/
function continueRainbow(){

	if(!rainbowActive)
		return;

	push();

	rotate(RAINBOW_ANGLE);

	for(var i=0;i<rainbowXs.length;i++){
		rainbowXs[i]+=RAINBOW_SPEED;
		rainbowY=-2*i*RAINBOW_HEIGHT;
		image(rainbowImage,rainbowXs[i],rainbowY,RAINBOW_WIDTH,RAINBOW_HEIGHT);


	}

	if(rainbowXs[rainbowXs.length-1]+RAINBOW_WIDTH>GAME_HEIGHT
		&& rainbowXs.length*2*RAINBOW_HEIGHT < GAME_WIDTH)
		rainbowXs.push(-RAINBOW_WIDTH);

	if(rainbowXs[rainbowXs.length-1]>GAME_HEIGHT){
		rainbowActive=false;

		while(rainbowXs.length>0)
			rainbowXs.pop(0);
	}

	pop();
}

/**
Trigger the strobe effect
*/
function spawnSeizure(){
	strobeStart=frameCount;
	strobeActive=true;
}

/**
Rapidly change the color of the screen for a strobe effect.
The screen flickers for an amount of frames equal to STROBE_FRAMES, after which
it stops.
*/
function strobe(){

	if(!strobeActive)
		return;

	var r=int(Math.random()*255);
	var g=int(Math.random()*255);
	var b=int(Math.random()*255);

	push();
	fill(r,g,b,50);
	rect(0,0,GAME_WIDTH,GAME_HEIGHT);
	pop();

	if(frameCount-strobeStart>STROBE_FRAMES)
		strobeActive=false;
}


/**
Trigger animation using a picture of github's founder
*/
function spawnFounder(){
	founderX=0;
	founderY=GAME_HEIGHT/2;
	founderRotation=0;
	founderActive=true;
}

/**
Maintain a spinny animation of github's founder
*/
function continueFounder(){
	if(!founderActive)
		return;

	push();

	founderX+=20;
	translate(founderX+100,founderY-100);
	rotate(founderRotation);

	founderRotation+=.5;

	image(githubFounderImage,founderX,founderY,200,200);

	if(founderX>GAME_WIDTH)
		founderActive=false;
	pop();
}
