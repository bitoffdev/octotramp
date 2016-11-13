/**
 * deathscreen.js
 *
 * Displays a red screen after the player dies and then submits the user's
 * score to the server.
 *
 * @author Elliot Miller
 * @author Chris Baudouin
 * @author Maximillian McMullen
 */
LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function DeathScreen(){
	this.submitted = false;
	this.username = "";

	this.drawDeathScreen = function(){
		// Use an alpha value of 5 to fade the red background in
		background(220,0,0, 5);
		// Draw the logo
		image(logo, 0, 0);
		// Draw the text input
		if (!this.submitted){
			fill(255);
			textStyle(BOLD);
			textSize(24);
			text("Type your name:", GAME_WIDTH/2,GAME_HEIGHT/2-50);
			textSize(32);
			text(this.username, GAME_WIDTH/2,GAME_HEIGHT/2);
		}
	}

	this.deathScreenKeyPressed = function() {
		if (keyCode==RETURN || keyCode==ENTER){
			$.ajax({url: "http://54.157.12.226:8000/?name=" + this.username + "&score=" + total_score,
			    success: function(result){
              location.reload(); // Go back to the loading screen
      }});
		} else if (keyCode==BACKSPACE && this.username.length > 0){
			this.username = this.username.slice(0, -1);
		} else if (LETTERS.indexOf(key) > -1){
			this.username = this.username + key;
		}
	}
}
