/**
 * deathscreen.js
 *
 * Displays a red screen after the player dies and then submits the user's
 * score to the server.
 *
 * @author Elliot Miller
 * @author Chris Baudouin, Jr.
 * @author Maximillian McMullen
 */
import {Image} from 'p5';
import {GAME_HEIGHT, GAME_WIDTH} from './constants';

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export default class DeathScreen{
	logo: Image;
	submitted: boolean;
	username: string;

	constructor (logo: Image){
		this.logo = logo;
		this.submitted = false;
		this.username = localStorage.getItem("username") ?? "";
	}

	drawDeathScreen = function(total_score: number){
		// Use an alpha value of 20 to fade the red background in
		background(220,0,0, 20);
		// Draw the logo
		image(this.logo, 0, 0);
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

	deathScreenKeyPressed = function(total_score: number) {
		if ((keyCode==RETURN || keyCode==ENTER) && this.username.length > 0){
			localStorage.setItem("username", this.username);
			fetch("/leaderboard?name=" + this.username + "&score=" + total_score)
				.then(function(response){
					if (!response.ok) throw `Error while submitting score to leaderboard: ${response.statusText}`;
				})
				.catch(function(){
					console.log("The high score could not be saved.");
				})
				.finally(function(){
					// Go back to the loading screen
					location.reload();
				});
		} else if ((keyCode==BACKSPACE || keyCode==DELETE) && this.username.length > 0){
			this.username = this.username.slice(0, -1);
		} else if (LETTERS.indexOf(key) > -1 && this.username.length < 30){
			this.username = this.username + key;
		}
	}
}
