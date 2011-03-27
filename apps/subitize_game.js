window.onload = function(){
	var game = SubitizeGame();
	game.initOnce();
	game.init();
	game.start();
}

function SubitizeGame(){
	var that = {};
	
	var 
		DISPLAY_INTERVAL=1500,
		instructionsBar,
		progressBar,
		dotCard,
		dotCardGen,
		x,
		y,
		width = 500,
		height =300,
		textX,
		textY,
		textFontSize,
		userCountWidth,
		userCountHeight,
		userCountX,
		userCountY;
		
	
	that.initOnce = function() {
		var 
			NUM_GRID_NUM_ROWS = 1,
			NUM_GRID_NUM_COLS =10,
			bbox,
			canvasDim = PRASAD.widgets.getCanvasDimensions("canvas_container");
		paper = new Raphael(document.getElementById('canvas_container'), canvasDim.width, canvasDim.height);
		
		width =  canvasDim.width/5;
		height =  width;
		x= canvasDim.width/2 -width/2;
		y = canvasDim.height/2 - height/2;
		
		
		textY = canvasDim.height/10;
		textX = canvasDim.width/10 ;
		userCountWidth = userCountHeight = width/4;
		userCountY = textY - userCountHeight/2,
		textFontSize = userCountHeight/1.5;
		
		
		var shell = PRASAD.widgets.addShell(paper,canvasDim);
		progressBar = PRASAD.widgets.addProgressBar(paper,canvasDim);		
		//instructionsBar = PRASAD.widgets.addInstructionBar(paper,canvasDim);
		
		dotCardGen = new PRASAD.widgets.math.RandomDotCardGenerator(paper,x,y,width,height);
		//dotCard = dotCardGen.getNextCard();
		
		var text = paper.text(textX,textY,"HOW MANY: ").attr({'font-size':textFontSize,'text-anchor':'start'});
		//console.log(text);
		var bbox = text.getBBox();
	
		userCountX = text.attr('x') + bbox.width + 10;
		
		userEnteredCount = PRASAD.components.TextCell({
									paper:paper,
									x: userCountX,
									y: userCountY,
									width:userCountWidth,
									height:userCountHeight,
									text:"?",
									callback : function() {
										console.log("on click called");
										
											var numberGrid = PRASAD.widgets.math.FloatingSelectableNumberGrid({
												paper : paper,
												x: userCountX,
												y:userCountY,
												width: userCountWidth * NUM_GRID_NUM_COLS,								
												numRows:NUM_GRID_NUM_ROWS,
												numCols:NUM_GRID_NUM_COLS,
												startNumber:1,
												callback: function(number) {
													userEnteredCount.setText(""+number);
													if (dotCard.getCount() == number) {
														progressBar.correct();
														// Clear the "CLICK ON SQUARE TO SHOW DOTS AGAIN" message
														progressBar.display("WELL DONE");
														PRASAD.utils.waitAndRestartGame(that,1500);
													}
													else {
														progressBar.incorrect();
													}
												}
											})
										
									}
									
		});
		
	};
	
	that.init = function() {
		userEnteredCount.setText("?");	
		progressBar.clearDisplay();	
		progressBar.resetCorrectness();
	};


	that.start = function() {
		dotCard = dotCardGen.getNextCard();
		dotCard.animate(DISPLAY_INTERVAL, function() {
			progressBar.display("CLICK ON SQUARE TO SHOW DOTS AGAIN");
		});	
	};

	
	return that;
	
}
