window.onload = function(){
	var game = NlineBasicGame();
	game.initOnce();
	game.init();
	game.start();
}

function NlineBasicGame(){
	var that = {};
	
	var 
		instructionsBar,
		progressBar,
		line,
		canvasDim;
		
		
	
	that.initOnce = function() {
		var shell;
		paper = new Raphael(document.getElementById('canvas_container'), 800, 600);
		
		canvasDim = PRASAD.widgets.getCanvasDimensions("canvas_container");
		shell = PRASAD.widgets.addShell(paper,canvasDim);
		progressBar = PRASAD.widgets.addProgressBar(paper,canvasDim);		
		instructionsBar = PRASAD.widgets.addInstructionBar(paper,canvasDim);
		
	};
	
	that.init = function() {
		if( line !== undefined) {
			line.remove();
		}
	};


	that.start = function() {
		var 
			NUM_TICKS = 10,
			lineX =10,
			lineWidth = canvasDim.width/1.125,
			lineY = canvasDim.height/2,
			tickOffset = 10,
			TICK_HEIGHT=8,
			tickStartX,
			tickStartY = lineY - TICK_HEIGHT,
			tickInterval = lineWidth/NUM_TICKS,
			tickEndX = tickStartX,			
			tickEndY = tickStartY + TICK_HEIGHT,
			numberFontSize=15,
			cellX,
			cellY,
			cellWidth= 30,
			cellHeight = cellWidth,
			cellNumCols = 10
			;
			
		
		line = PRASAD.graphics.line(paper, lineX, lineY , lineX + lineWidth,lineY );
		var cells = [];
		for( var i=0; i < NUM_TICKS ; i ++)  (function(index)  {
			tickStartX = lineX + tickOffset + index * tickInterval;
			tickEndX = tickStartX;
			//console.log("statX = " + tickStartX +" starY = "+ tickStartY + " endY = " + tickEndY);
			PRASAD.graphics.line(paper, tickStartX ,tickStartY, tickEndX, tickEndY);
			//paper.print(tickStartX , lineY + 10, "A", paper.getFont("Museo"),20).attr({fill:'black'});
			paper.text(tickStartX , lineY + 15, "" + (index+1)).attr({'font-size':numberFontSize});
			cellX = tickStartX - cellWidth/2;
			cellY = lineY + 30;
			//console.log("index = " + index);
			cells[index]  = PRASAD.components.TextCell(
				{
				paper: paper,
				x: cellX ,
				y: cellY,
				width: cellWidth,
				height: cellHeight,
				text: "",
				callback : function(text) {
					
						var cdim = cells[index].getDimensions();
						
						var	numberGrid = PRASAD.widgets.math.FloatingSelectableNumberGrid({
								paper : paper,
								//x: bindCellX,
								x:cdim.x,
								
								//y:bindCellY,
								y: cdim.y,
								width: cellWidth * cellNumCols,								
								numRows:1,
								numCols:10,
								startNumber:1,
								callback: function(number) {										
										//console.log("Number selected = " + number);					
										cells[index].setText("" + number);
									
								}
																						
						});					
				}
				
				
			});
			
		})(i);
	};

	return that;
	
}