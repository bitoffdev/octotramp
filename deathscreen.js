LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ ";

function DeathScreen(){
	this.username = "";

	this.drawDeathScreen = function(){
		// Use an alpha value of 5 to fade the red background in
		background(220,0,0, 5);
		// Draw the logo
		image(logo, 0, 0);
		// Draw the text input
		textAlign(CENTER);
		textStyle(BOLD);
		textSize(TITLE_SIZE);
		text(this.username, GAME_WIDTH/2,GAME_HEIGHT/2)
	}

	this.deathScreenKeyPressed = function() {
		if (keyCode==RETURN || keyCode==ENTER){
			//TODO submit the username and score to the server
		} else if (LETTERS.indexOf(key) > -1){
			this.username = this.username + key;
		}
	}
}
