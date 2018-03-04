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
	this.username = localStorage.getItem("username");
	if (this.username==null){
		this.username = "";
	}

	this.drawDeathScreen = function(){
		// Use an alpha value of 20 to fade the red background in
		background(220,0,0, 20);
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
			// Display the score
			textSize(200);
			textAlign(RIGHT);
			text(total_score, GAME_WIDTH-10,GAME_HEIGHT - 20);
		}
	}

	this.deathScreenKeyPressed = function() {
		if ((keyCode==RETURN || keyCode==ENTER) && this.username.length > 0){
			localStorage.setItem("username", this.username);
			$.ajax({url: "leaderboard?name=" + this.username + "&score=" + total_score,
				success: function(result){
					location.reload(); // Go back to the loading screen
				},
				error: function(result){
					console.log("The high score could not be saved.");
				}
			});
		} else if ((keyCode==BACKSPACE || keyCode==DELETE) && this.username.length > 0){
			this.username = this.username.slice(0, -1);
		} else if (LETTERS.indexOf(key) > -1 && this.username.length < 30){
			this.username = this.username + key;
		}
	}
}
