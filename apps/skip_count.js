window.onload = function(){
	var game = SkipCountGame();
	game.initOnce();
	game.init();
	game.start();
}

function SkipCountGame(){
	var that = {};
	var ACTIVITY_COUNT = "COUNTERS COUNT";
	
	var 
		counterWidth,
		counterHeight,
		matX,
		matY,
		matWidth,
		matHeight,
		MAT_FILL = '#FFF',
		matGridSide,
		matBorder;
		
			
	var paper,
		progressBar;
	var userEnteredCount;
	var mat;
	var cubes = [];
	var userEnteredCount;
	var randomNumber ;
	
	var groupBy = function(number) {
		
		var edgeOffset = matBorder,
			startX = matX + edgeOffset,
			startY = matY + edgeOffset,
			rowX = startX,
			rowY = startY,
			locX = rowX,
			locY = rowY,
			cubeSeparationX = counterWidth,
			sepX = counterWidth + cubeSeparationX,
			rowSeparation = counterHeight;
		
			
		for (var i = 0; i < cubes.length; i += number) {
			for (var k = i; k < i + number; k += 1) {
				if (k == cubes.length) {
					break;
				}
				cubes[k].animateTo(locX, locY);
				if (k != 0) {
					cubes[k].getShape().insertBefore(cubes[k - 1].getShape());
				}
				locY += counterHeight;
			}
			locX += sepX;
			locY = rowY;
			//console.log("x = "+ locX + ", y = " + locY);
			//if( locX > startX - edgeOffset + matWidth - counterWidth - edgeOffset) {
			if( locX > startX - edgeOffset + mat.width - counterWidth - edgeOffset) {
				locX = startX;
				rowY += number * counterHeight + rowSeparation;
				locY = rowY;
			}
		}
		
	};
	
	function updateScoreTable() {
		var a1 = activityList.getActivity(ACTIVITY_COUNT);
		PRASAD.utils.updateScore(a1,"score_table");
	}
	
	function updateProgressAndScore() {
		var percentComplete = activityList.getPercentComplete();
		progressBar.percentComplete(percentComplete);
		console.log("% complete = " + percentComplete);
		
		if( percentComplete == 100) {
			activityList.print();
			updateScoreTable();	
			PRASAD.utils.waitAndRestartGame(that,1000);				
		}		
	}
	
	that.initOnce = function() {
		
		var button1X,
			button1Y,			
			button2Y ,
			button3Y,		
			button0Y,			
			buttonWidth,
			buttonHeight,
			/*
			 * Font size of the count question: "HOW MANY"
			 */
			textFontSize,
			/*
			 * x coordinate of leftmost point of the box in which user count is entered
			 */
			userCountX,
			/*
			 * Width of box in which count is entered
			 */
			userCountWidth,
			/*
			 * Height of box in which count is entered
			 */
			userCountHeight,
			gridNumRows = 10,
			gridNumCols =10,
			numberGrid;
			
		var canvasDim = PRASAD.widgets.getCanvasDimensions("canvas_container");	
		paper = new Raphael(document.getElementById('canvas_container'), canvasDim.width, canvasDim.height);
		
		activityList = new PRASAD.utils.ActivityList();
		activityList.addActivity( new PRASAD.utils.Activity(ACTIVITY_COUNT));
		
		matWidth = 4/5 * canvasDim.width;
		matHeight = 7/10 * canvasDim.height;
		matX = 1/10 * canvasDim.width;
		matY = 1/10 * canvasDim.height;
		counterHeight = Math.floor(matHeight/15); // 15 is arbit
		counterWidth = counterHeight;
		matGridSide = counterWidth;
		buttonWidth = counterWidth *2 ;
		buttonHeight = counterHeight;
		button1X = matX;
		button2X = button1X + buttonWidth +10;
		button3X = button2X + buttonWidth +10;
		button0X = button3X + buttonWidth +10;

		textY = matY/2;
		textX = matX ;
		userCountWidth = userCountHeight = counterWidth;
		userCountY = textY - userCountHeight/2,
		textFontSize = userCountHeight/1.5;
		
		matBorder = matWidth/50;
		
		var shell = PRASAD.widgets.addShell(paper,canvasDim);
		progressBar = PRASAD.widgets.addProgressBar(paper,canvasDim);
		
		mat = new SnapableMat({
								paper: paper,
								x: matX,
								y: matY,
								width: matWidth,
								height: matHeight,
								color: '#FFF8C6', //Lemon Chiffon
								gridSide: matGridSide,
								border:matBorder
								});
															
		mat.drawGrid();
		button1Y = 	button2Y = button3Y = button0Y = matY + mat.height+ 10;
		
		makeButton(button1X,button1Y,buttonWidth,buttonHeight,"2", 2); 
		makeButton(button2X,button2Y,buttonWidth,buttonHeight,"5", 5);
		makeButton(button3X,button3Y,buttonWidth,buttonHeight,"10", 10);
		makeButton(button0X,button0Y,buttonWidth,buttonHeight,"1", 1);
		
		var text = paper.text(textX,textY,"HOW MANY: ").attr({'font-size':textFontSize,'text-anchor':'start'});
		console.log(text);
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
										if(numberGrid == undefined) {
											numberGrid = PRASAD.widgets.math.FloatingSelectableNumberGrid({
												paper : paper,
												x: userCountX,
												y:userCountY,
												width: userCountWidth * gridNumCols,								
												numRows:gridNumRows,
												numCols:gridNumRows,
												startNumber:1,
												callback: function(number) {
													//console.log("Number selected = " +  number);
													activityList.getActivity(ACTIVITY_COUNT).addTry(number);
													userEnteredCount.setText("" + number);
													if( randomNumber == number) {
														console.log("correct answer");
														progressBar.display("WELL DONE");
														//progressBar.percentComplete(100);
														activityList.getActivity(ACTIVITY_COUNT).stop();
														updateProgressAndScore();
														//PRASAD.utils.waitAndRestartGame(that,1000);
														/*
														setTimeout(function() {
															progressBar.clearDisplay();
															that.init();
															that.start();
														},1000);
														*/
													
													}
													else {
														progressBar.display("TRY AGAIN");
														progressBar.incorrect();
																									
													}
												}
											})
										}
										else {
											numberGrid.setVisible(true);
										}
									}
									
		});
			
		function makeButton(x,y,width,height, text, number) {
			return  PRASAD.components.Button(
							{
								paper:paper,
								x: x,
								y: y,
								width: width,
								height: height,
								text:text,
								onclick: function() {							
									groupBy(number);
								}						
							}
						);
			
		}	
	};
	
	
	that.init = function() {
		for ( var i=0; i < cubes.length ; i+=1) {
			cubes[i].getShape().remove();
		}
		cubes.splice(0, cubes.length);	
		userEnteredCount.setText("?");
		progressBar.resetCorrectness();
		progressBar.clearDisplay();
		
		activityList.init();
	};


	that.start = function() {
		
		var 
			counter,
			randX,
			randY,
			lowerX = matX,
			lowerY = matY+ 10,
			upperX = matX+ matWidth - counterWidth,
			upperY = matY + matHeight - counterHeight;
					
		randomNumber = PRASAD.utils.randomIntForRange(5,100);

		console.log("Random number = " + randomNumber);
		for (var i = 0; i < randomNumber; i += 1) {
			
			randX = PRASAD.utils.randomIntForRange(lowerX,upperX);
			randY = PRASAD.utils.randomIntForRange(lowerY,upperY);
			
			var snapTo = mat.getSnapPoint(randX,randY);
			//console.log(randX+"," + randY + " snapping to " + snapTo.x + "," + snapTo.y);
			
			counter = Cube({
							paper: paper,
							x: snapTo.x,
							y: snapTo.y,
							width: counterWidth,
							height: counterHeight,
							color: '#00F',
							});
			cubes.push(counter);
		}
		
		activityList.getActivity(ACTIVITY_COUNT).start(randomNumber);
	};

	
	return that;
	
}

/*
function Mat(options) {	
	options.paper.rect(options.x, options.y, options.width, options.height).attr({fill:options.color||'#FFF'});	
}
*/
