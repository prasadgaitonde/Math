window.onload = function(){
	var game = GeneralGame();
	game.initOnce();
	game.init();
	game.start();
}

function GeneralGame(){
	var that = {};
	
	var 
		instructionsBar,
		progressBar;
		
	
	that.initOnce = function() {
		var canvasDim = PRASAD.widgets.getCanvasDimensions("canvas_container");
		paper = new Raphael(document.getElementById('canvas_container'), canvasDim.width, canvasWidth.height);
		var shell = PRASAD.widgets.addShell(paper,canvasDim);
		progressBar = PRASAD.widgets.addProgressBar(paper,canvasDim);		
		instructionsBar = PRASAD.widgets.addInstructionBar(paper,canvasDim);
		
	};
	
	that.init = function() {
		
	};


	that.start = function() {
		
	};

	
	return that;
	
}