window.onload = function(){
	var game = GroupByUsing10FrameActivity();
	game.initOnce();
	game.init();
	game.start();
}

function GroupByUsing10FrameActivity(){
	var that = {};
	var ACTIVITY_FILL_FRAME = "FILL FRAME",
			ACTIVITY_FIND_TENS = "FIND TENS",
			ACTIVITY_FIND_ONES = "FIND ONES";
			
	var instructionsBar,
		progressBar,
		theNumberText,
		equalsLabelText,
		tensLabelText,
		plusLabelText,
		onesLabelText,
		
		tensCountText,
		onesCountText,
		generalText,
		tenFrames = [],
		theNumber,
		answerNumTens,
		answerNumOnes,

		activityList
		;
	
	
	function updateScoreTable() {
			
			var a1 = activityList.getActivity(ACTIVITY_FILL_FRAME);
			var a2 = activityList.getActivity(ACTIVITY_FIND_TENS);
			var a3 = activityList.getActivity(ACTIVITY_FIND_ONES);
			
			$("#score_table").find('tbody')
    					.append($('<tr>')
							.append($('<td>')
            							.text("" + a1.contextData))	
							.append($('<td>')
            							.text("" + a1.time))							
							.append($('<td>')
            							.text("" + a2.time))						
							.append($('<td>')
            							.text("" + a2.getTries()))
							.append($('<td>')
            							.text("" + a3.time))						
							.append($('<td>')
            							.text("" + a3.getTries()))


			);
	
	}
	
	function tenFrameCountUpdated() {
		var count =0;
		for( var i=0; i < tenFrames.length ;i++) {
			count += tenFrames[i].getCount();
		}
		//console.log("Total count = " + count);
		theNumberText.setText(""+count);
		if( count == theNumber) {
			
			equalsLabelText.setVisible(true);
			tensLabelText.setVisible(true);
			tensCountText.setVisible(true);
			
			// Disable selection/deselection on all  the ten frames now that the correct number
			// has been filled
			enableInteractionWith10Frames(false);
			
			activityList.getActivity(ACTIVITY_FILL_FRAME).stop();
			
			activityList.getActivity(ACTIVITY_FIND_TENS).start(theNumber);
			
			updateProgressAndScore();
		}
	}
	
	function enableInteractionWith10Frames(flag) {
		for (var i = 0; i < tenFrames.length; i++) {
			tenFrames[i].enableInteraction(flag);
		}		
	}
	
	function updateProgressAndScore() {
		var percentComplete = activityList.getPercentComplete();
		progressBar.percentComplete(percentComplete);
		console.log("Activity done: " + activityList.isDone());
		if( percentComplete == 100) {
			//activityList.print();
			updateScoreTable();	
			PRASAD.utils.waitAndRestartGame(that,1000);				
		}		
	}
	
	that.initOnce = function() {
		var NUM_TEN_FRAMES_PER_ROW = 5,
			TEXT_SEPARATION =10;
			
		var shell,
		canvasDim,		
		tenFrameWidth,		
		distBetweenFrames,
		first10FrameX,
		first10FrameY,
		dim,
		textCellWidth,
		textCellHeight,
		i;
		
		
		activityList = new PRASAD.utils.ActivityList();
		activityList.addActivity( new PRASAD.utils.Activity(ACTIVITY_FILL_FRAME));
		activityList.addActivity( new PRASAD.utils.Activity(ACTIVITY_FIND_TENS));
		activityList.addActivity( new PRASAD.utils.Activity(ACTIVITY_FIND_ONES));
		
		canvasDim = PRASAD.widgets.getCanvasDimensions("canvas_container");
		paper = new Raphael(document.getElementById('canvas_container'), canvasDim.width, canvasDim.height);
		
		
		shell = PRASAD.widgets.addShell(paper,canvasDim);
		instructionsBar = PRASAD.widgets.addInstructionBar(paper,canvasDim);
		progressBar = PRASAD.widgets.addProgressBar(paper,canvasDim);
		
		dim = instructionsBar.getDimensions();
		distBetweenFrames = 20;
		tenFrameWidth = Math.floor(canvasDim.width/NUM_TEN_FRAMES_PER_ROW - distBetweenFrames);
		// Have to make sure that the 10 frame width is a mutiple of 10, otherwise the cells
		// will not all be of the same width
		tenFrameWidth = PRASAD.utils.getClosestMultipleOf(tenFrameWidth,10);
		
		first10FrameX = distBetweenFrames/2;
		first10FrameY = dim.y + dim.height + 4 * distBetweenFrames/2;
		console.log(first10FrameX + " , " + first10FrameY + " - " +tenFrameWidth );
		for (i = 0; i < NUM_TEN_FRAMES_PER_ROW; i++) {
			tenFrames.push(new PRASAD.components.math.InteractiveNFrame(
															{
															paper:paper, 
															x:first10FrameX + i *(tenFrameWidth + distBetweenFrames) , 
															y: first10FrameY, 
															width: tenFrameWidth, 												
															frameType:10,
															callback: tenFrameCountUpdated
															
															}));
		}
		dim = tenFrames[0].getDimensions();
		
		for (i = 0; i < NUM_TEN_FRAMES_PER_ROW; i++) {
			tenFrames.push(new PRASAD.components.math.InteractiveNFrame(
															{
															paper:paper, 
															x:first10FrameX + i *(tenFrameWidth + distBetweenFrames) , 
															y: first10FrameY + dim.height + distBetweenFrames , 
															width: tenFrameWidth, 												
															frameType:10,
															callback: tenFrameCountUpdated
															}));
		}
		
		dim = tenFrames[tenFrames.length-1].getDimensions();
		var y1 = (dim.y + dim.height + distBetweenFrames + progressBar.getDimensions().y)/2;
		
		textCellWidth = 1.5 *tenFrameWidth/5;
		textCellHeight = textCellWidth;
		
		theNumberText = PRASAD.components.RoundTextCell({
				paper: paper,
				x: first10FrameX,
				y: y1-textCellHeight/2,
				width: textCellWidth,
				height: textCellHeight,
				text: ""
			});
		
		dim = theNumberText.getDimensions();
		
		equalsLabelText = PRASAD.components.createText({
				paper: paper,
				x: dim.x + dim.width + 3 * TEXT_SEPARATION,
				y: y1,
				text: "="
			});
		dim = equalsLabelText.getDimensions();
			
		
		tensCountText = PRASAD.components.TextCellWithNumberSelection({
				paper: paper,
				x: dim.x  + dim.width +  3 * TEXT_SEPARATION,
				y: dim.y - dim.height ,
				width: textCellWidth,
				height: textCellHeight,
				text: "?",
				numRows : 1,
				startNumber: 1,
				callback: function(number) {
					activityList.getActivity(ACTIVITY_FIND_TENS).addTry(number);
					if( answerNumTens == number) {
						
						plusLabelText.setVisible(true);
						onesLabelText.setVisible(true);
						onesCountText.setVisible(true);
						activityList.getActivity(ACTIVITY_FIND_TENS).stop();	
						updateProgressAndScore();					
						activityList.getActivity(ACTIVITY_FIND_ONES).start(theNumber);
					}					
				}
				
			});
		dim = tensCountText.getDimensions();
		
		tensLabelText = PRASAD.components.createText({
				paper: paper,
				x: dim.x + dim.width + TEXT_SEPARATION,
				y: y1 ,
				text: "TENS"
			});	
		dim = tensLabelText.getDimensions();
		
		plusLabelText = PRASAD.components.createText({
				paper: paper,
				x: dim.x + dim.width + 3 * TEXT_SEPARATION,
				y: y1 ,
				text: "+"
			});	
		dim = plusLabelText.getDimensions();	
	
			
		onesCountText = PRASAD.components.TextCellWithNumberSelection({
				paper: paper,
				x: dim.x  + dim.width +  3 *TEXT_SEPARATION,
				y: dim.y - dim.height ,
				width: textCellWidth,
				height: textCellHeight,
				text: "?",
				numRows : 1,
				startNumber: 0,
				callback: function(number) {
					activityList.getActivity(ACTIVITY_FIND_ONES).addTry(number);			
					if( answerNumOnes == number) {													
						activityList.getActivity(ACTIVITY_FIND_ONES).stop();
						updateProgressAndScore();																
					}					
				}
				
			});	
		dim = onesCountText.getDimensions();
		
		onesLabelText = PRASAD.components.createText({
				paper: paper,
				x: dim.x + dim.width + TEXT_SEPARATION,
				y: y1 ,
				text: "ONES"
			});			
	};
	
	that.init = function() {
		
		
		for( var i=0; i < tenFrames.length ; i++) {
			tenFrames[i].setCount(0);
		}
		tensCountText.setText("?");
		onesCountText.setText("?");
		theNumberText.setText("");
		
		equalsLabelText.setVisible(false);
		tensLabelText.setVisible(false);
		tensCountText.setVisible(false);
		plusLabelText.setVisible(false);
		onesLabelText.setVisible(false);
		onesCountText.setVisible(false);
				
		progressBar.resetCorrectness();
		progressBar.clearDisplay();
		
		enableInteractionWith10Frames(true);
		
		activityList.init();
	};

	

	that.start = function() {
		theNumber = PRASAD.utils.randomIntForRange(10,100);
		
		answerNumTens = Math.floor(theNumber/10);
		answerNumOnes = theNumber % 10;
		instructionsBar.display("FIND THE NUMBER OF TENS AND ONES IN " + theNumber + " AFTER FILLING THE TEN FRAMES");
		//theNumberText.setText("" + theNumber);
		
		activityList.getActivity(ACTIVITY_FILL_FRAME).start(theNumber);
	};

	
	return that;
	
}