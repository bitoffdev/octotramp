


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

}

/**
Continues balloon animation in a circular pattern across the screen
*/
function continueBalloon(){
	balloonX+=5;
	var balloonXPos=(sin(3*frameCount/TIME_CONSTANT)+1)*100 + balloonX;
	var balloonYPos=(cos(3*frameCount/TIME_CONSTANT)+1)*GAME_HEIGHT/2 - balloonY;

	image(balloonImage,balloonXPos, balloonYPos,100,100);
}
