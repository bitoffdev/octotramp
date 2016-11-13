/**
 * environment.js
 *
 * This object manages the drawing of the background of the main game, including
 * the trampolines
 *
 * This version is non-buffered. The original version used buffered rendering
 * for efficiency, but it had hardware problems with mobile and some graphics
 * cards.
 *
 * @author Elliot Miller
 * @author Chris Baudouin
 * @author Maximillian McMullen
 */
function Environment(height){
	this.height = height;

	this.trampolines = [];

	this.translateX = 0; // This value is used for arrow-key translation
	this.scrollX = 0; // This value should be modified only with small increments

	this.addTrampoline = function(x){
		this.trampolines.push(x);
	}

	this.drawEnvironment = function(){
		// Lerp the scrollX towards the targetX
		this.scrollX += this.translateX * 0.25;
		this.translateX *= 0.75;
		// Draw the environment
		background(220,220,220);
		noStroke();
		fill(color(160, 180, 160));
		rect(0, height-20, GAME_WIDTH, 20);
		// Draw the bases
		fill(150);
		for (var i=0;i<this.trampolines.length;i++){
			rect(this.trampolines[i]-this.scrollX-50, height-20, 100, 40);
		}
		// Draw all the tampolines
		fill(color(156, 218, 239));
		for (var i=0;i<this.trampolines.length;i++){
			ellipse(this.trampolines[i]-this.scrollX, height-30,
				TRAMPOLINE_WIDTH,TRAMPOLINE_HEIGHT);

			// an attempt at removing trampolines that go off screen but I
			// have no idea what I'm doing

			// if(this.trampolines[i]-this.scrollX<-2*GAME_WIDTH){
			// 	this.trampolines.pop(i);
			// 	i--;
			// }
		}
	}

	/**
	Returns the x position of the next trampoline

	@return Xpos of the trampoline
	*/
	this.nextTrampolinePos=function(){
		return this.trampolines[this.trampolines.length-1];
	}
}
