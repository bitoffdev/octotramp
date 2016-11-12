function Environment(width, height){
	// create buffer
	this.buffer = createGraphics(width, height);
	this.buffer.background(200,230,250);

	this.buffer.ellipse(0, 0, 50, 50);
	this.buffer.ellipse(100, 0, 50, 50);
	this.buffer.ellipse(200, 0, 50, 50);
	this.buffer.ellipse(300, 0, 50, 50);

	this.scrollX = 0;

	console.log("test");

	this.drawit = function(){
		image(this.buffer,this.scrollX,0);
	}
}
