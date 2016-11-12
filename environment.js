function Environment(width, height){
	// load sprites
	img = loadImage("assets/trampoline.png");
	// create buffer
	this.buffer = createGraphics(width, height);
	this.buffer.background(220,220,220);

	this.trampolines = [];

	for (var i=0;i<30;i++){
		this.buffer.noStroke();
		this.buffer.fill(color(156, 218, 239));
		this.buffer.ellipse(i*200, height-20, 100, 40);
	}
	this.buffer.rect(30*200, 0, 20, height);

	this.scrollX = 0;

	this.addTrampoline = function(x){
		this.buffer.noStroke();
		this.buffer.fill(color(0, 255, 0));
		this.buffer.ellipse(x, height-20, 100, 40);
	}

	this.drawEnvironment = function(){
		image(this.buffer,-this.scrollX,0);
	}
}

function EnvironmentFrame(width, height){
	// create buffer
	this.buffer = createGraphics(width, height);
	this.buffer.background(220,220,220);

	this.trampolines = [];

	for (var i=0;i<30;i++){
		this.buffer.noStroke();
		this.buffer.fill(color(156, 218, 239));
		this.buffer.ellipse(i*200, height-20, 100, 40);
	}
	this.buffer.rect(30*200, 0, 20, height);

	this.scrollX = 0;

	this.drawEnvironment = function(){
		image(this.buffer,-this.scrollX,0);
	}
}
