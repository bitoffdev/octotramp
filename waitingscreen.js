const GAME_TITLE = "OCTOTRAMP";
const GAME_TITLE_SIZE = 32;
const START_MESSAGE = "press any key to start";
const START_MESSAGE_SIZE = 24;

function WaitingScreen(width, height){
	this.width = width;
	this.height = height;
	this.game_title_pos = ((height/2)/2);
	this.start_message_ypos = ((height/2)/2) + (((height/2)/2)/2);


	this.drawScreen = function(){
		fill(50);
		textAlign(CENTER);

		textStyle(BOLD);
		textSize(GAME_TITLE_SIZE);
		text(GAME_TITLE, this.width/2, this.game_title_pos);

		textSize(START_MESSAGE_SIZE);
		text(START_MESSAGE, this.width/2, this.start_message_ypos);
	}
}
