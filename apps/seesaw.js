window.onload = function(){
	var game = SeesawGame();
	game.initOnce();
	game.init();
	game.start();
}

function SeesawGame(){
	var that = {};
	
	var x, 
		y, 
		width,
		cellSide,
		gapBetweenParts = 5,
		START_PART1_VALUE = '?',
		START_PART2_VALUE = '?',
		WHOLE_NUMBER_COLOR = "#E55B3C", // Coral2
		PART_NUMBER_COLOR =	"#EAC117", // Gold2
		factorsX,
		factorsY;
	
	var instructionsBar, 
		progressBar, 		 
		canvasDim,
		wholeCell,
		part1Cell,
		part2Cell,
		wholeNumberDisplay,
		line,
		set,
		factors=[],
		/*
		 * The number that is to be factored
		 */
		wholeNumber,
		/*
		 * The number of distinct factors for the whole number, there is only one combination of 
		 * 2 numbers  e.g for the whole number 5 , the combination 4 1 will appear only ones
		 * so the distinct factors for 5 are:
		 * 4 1
		 * 3 2
		 * 5 0
		 */
		numDistinctFactors;

	that.initOnce = function(){
		var shell,
		strokeWidth=4,
		triangleSide,
		centerX,
		support,
		wholeNumX,
		wholeNumY;
		
		canvasDim = PRASAD.widgets.getCanvasDimensions("canvas_container");
		paper = new Raphael(document.getElementById('canvas_container'), canvasDim.width, canvasDim.height);
		
		canvasDim = PRASAD.widgets.getCanvasDimensions("canvas_container");
		
		x = canvasDim.width/15;
		y = canvasDim.height/2;
		width = canvasDim.width/2;
		centerX = x + width/2;
		cellSide = canvasDim.width/20;
		triangleSide = cellSide;
		
		shell = PRASAD.widgets.addShell(paper, canvasDim);
		progressBar = PRASAD.widgets.addProgressBar(paper, canvasDim);
		instructionsBar = PRASAD.widgets.addInstructionBar(paper, canvasDim);
		
		line = PRASAD.graphics.line(paper, x,y,x+width,y).attr({'stroke-width': strokeWidth});
		wholeCell = PRASAD.components.TextCell(
							{
							paper:paper,
							x: x,
							y: y-cellSide-strokeWidth,
							width: cellSide,
							height: cellSide,
							color:WHOLE_NUMBER_COLOR,
							text:"" 
							} );
							
								
							
		part1Cell = 	PRASAD.components.TextCell(
							{
							paper:paper,
							x: x+width-cellSide*2-gapBetweenParts,
							y: y-cellSide-strokeWidth,
							width: cellSide,
							height: cellSide,
							text:START_PART1_VALUE,
							color :PART_NUMBER_COLOR,
							callback : function(text) {
								var dim = part1Cell.getDimensions();
								var	number1Grid = PRASAD.widgets.math.FloatingSelectableNumberGrid({
										paper : paper,								
										x:dim.x,							
										y: dim.y,
										width: cellSide * 11,								
										numRows:1,
										numCols:11,
										startNumber:0,
										callback: function(number) {										
											part1Cell.setText(""+number);
											animate();
										}
																						
									});			
							}
							});	
		part2Cell = 	PRASAD.components.TextCell(
							{
							paper:paper,
							x: x+width-cellSide,
							y: y- cellSide -strokeWidth,
							width: cellSide,
							height: cellSide,
							text:START_PART2_VALUE,
							color :PART_NUMBER_COLOR,
							callback: function(text){
								var dim = part2Cell.getDimensions();
								var number2Grid = PRASAD.widgets.math.FloatingSelectableNumberGrid({
									paper: paper,
									x: dim.x,
									y: dim.y,
									width: cellSide * 11,
									numRows: 1,
									numCols: 11,
									startNumber: 0,
									callback: function(number){
										part2Cell.setText("" + number);
										animate();
									}
									
								});
							}		
								} );	
							
		// The pivot triangle		
		support = PRASAD.graphics.EquiTriangle(
								{
									paper:paper,
									x: centerX,
									y: y,
									side:triangleSide,
									color:'#000'
								}
							);
		
		set = paper.set();
		set.push(line);
		
		wholeNumX = canvasDim.width/8;
		wholeNumY = canvasDim.height/8;
		factorsX = canvasDim.width-wholeNumX - cellSide;
		factorsY = wholeNumY + cellSide + 10;
		wholeNumberDisplay = PRASAD.components.TextCell(
							{
							paper:paper,
							x: canvasDim.width-wholeNumX,
							y: wholeNumY,
							width: cellSide,
							height: cellSide,
							text:"" ,
							color:WHOLE_NUMBER_COLOR,
							} );
		
				
		var aElements = part1Cell.getAnimatableElements();
		for(var k=0; k< aElements.length; k++) {
			set.push(aElements[k]);	
		}	
		aElements = part2Cell.getAnimatableElements();
		for(k=0; k< aElements.length; k++) {
			set.push(aElements[k]);	
		}		
		aElements = wholeCell.getAnimatableElements();	
		for (k = 0; k < aElements.length; k++) {
			set.push(aElements[k]);
		}	
			
	};
	
	that.init = function(){
		
	};
	
	that.start = function(){
		
		function computeNumDistinctFactors() {
			console.log("MOD =   " + (wholeNumber %2));
			if( wholeNumber % 2 != 0) {
				// If odd number
				numDistinctFactors = (wholeNumber+1)/2;
			}
			else {
				numDistinctFactors = Math.ceil((wholeNumber+1)/2);
			}
			console.log("# of distinct factors for " + wholeNumber + " = " + numDistinctFactors);
		}
		
		wholeNumber =  PRASAD.utils.randomIntForRange(2,10);
		computeNumDistinctFactors();
		wholeCell.setText(""+wholeNumber);
		wholeNumberDisplay.setText(""+wholeNumber);
		instructionsBar.display("FIND 2 NUMBERS THAT ADD TO " + wholeNumber);
		
		animate();
	};
	
	
		
	
	function animate() {
		var KEEL_FACTOR = 4;
		var whole = + wholeCell.getText();
		var part1 = + part1Cell.getText();
		var part2 = + part2Cell.getText();
		//console.log("part1 = " + part1 + " part2 = " + part2);
		var partCombo = part1 + part2;
		
		var s;
		var diff = whole - partCombo;
		var angle ;
	
		if( isNaN(diff)) {
			diff = wholeNumber;
		}
		if (diff == 0) {
			angle = 0;					
		}
		else {
			if (diff < 0) {
				//+
				angle = -1 * diff * KEEL_FACTOR;				
			}
			else {
				// - 
				angle = -1 * diff * KEEL_FACTOR;
			}
			
		}
		
		// Rotate around the center of the support 
		s = angle  + " " + (x + width/2) + " " + y;		
		//var x1 = width/2 * Math.cos(angle * Math.PI/180) - (x+width/2);
		//var y1 = width/2 * Math.sin(angle * Math.PI/180) - y;
		//console.log("Rotation: " + s);
		//console.log("x1 = " + x1 + ", y1 ="+ y1);
		set.animate({rotation:s},2000,"bounce", function() {
			//var dim = wholeCell.getDimensions();			
			if( diff == 0 ) {
				if( !factorAlreadySelected()) {
					factors.push([part1,part2]);
					drawFactors(part1,part2);
					var percent = (factors.length/numDistinctFactors) * 100;
					progressBar.percentComplete(percent);
					//progressBar.display("CORRECT. " + (numDistinctFactors-factors.length) + " MORE TO GO");
					progressBar.display("CORRECT");
					if( (numDistinctFactors-factors.length) == 0) {
						instructionsBar.clearDisplay();
						progressBar.display("WELL DONE - YOU HAVE FOUND ALL NUMBERS THAT ADD UP TO "+ wholeNumber);
					}
					else {
						progressBar.display("CORRECT - CAN YOU FIND ANOTHER PAIR?");
						part1Cell.setText(START_PART1_VALUE);
						part2Cell.setText(START_PART2_VALUE);
						//animate();
					}
				}
				else {
					progressBar.display("PART NUMBERS ALREADY CHOSEN - TRY AGAIN");
					console.log("These factors are already present");
				}
			}
			else {
					progressBar.display("");
			}
			
			function factorAlreadySelected() {
				for( var i=0; i < factors.length ;i++) {
					var f = factors[i];
					if( f.isNumberPresent(part1) || f.isNumberPresent(part2)) {
						return true;
					}
				}
				return false;
				
			}
		});
		
	}	
	
	
	function drawFactors(part1,part2)  {
		//console.log("part1 = " +part1 + " part2 = " + part2);
		PRASAD.components.TextCell(
							{
							paper:paper,
							x: factorsX,
							y: factorsY,
							width: cellSide,
							height: cellSide,
							color :PART_NUMBER_COLOR,
							text:""+part1
							});
							
		PRASAD.components.TextCell(
							{
							paper:paper,
							x: factorsX + 2 *cellSide,
							y: factorsY,
							width: cellSide,
							height: cellSide,
							color :PART_NUMBER_COLOR,
							text:""+part2
							});
		factorsY += cellSide + 10;					
	}
	return that;
}


