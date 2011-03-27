window.onload = function(){
	var game = LayoutGame();
	game.initOnce();
	game.init();
	game.start();
}

function LayoutGame(){
	var that = {};
	
	var instructionBar;
	var progressBar;
	
	that.initOnce = function() {
		var canvasDim = PRASAD.widgets.getCanvasDimensions("canvas_container");
		paper = new Raphael(document.getElementById('canvas_container'), canvasDim.width, canvasDim.height);
		instructionBar = PRASAD.widgets.addInstructionBar(paper,canvasDim);
		progressBar = PRASAD.widgets.addProgressBar(paper,canvasDim);
	};
	
	that.init = function() {
		
	};


	that.start = function() {
		
	};

	
	return that;
	
}