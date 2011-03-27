window.onload = function(){
	var game = GroupByGame();
	game.initOnce();
	game.init();
	game.start();
}

function GroupByGame(){
	var that = {};
	
	var groupByNumbers = [2,5,10];
	
	var 
		MAX_GROUP_BY_COUNT =10,
		counterWidth,
		counterHeight,
		MAT_X,
		MAT_Y,
		MAT_WIDTH ,
		MAT_HEIGHT,
		MAT_FILL = '#FFF',
		MAT_BORDER = 10,
		MAT_GRID_SIDE = counterWidth,
		matBorder;
		
	var mat,
		instructionsBar,
		progressBar,
		randomNumber,
		groupsLabel,
		groupByNumberLabel,
		onesLabel,
		cubes,
		linkMgr,
		groupByNumber;
		
	cubes = [];
	linkMgr = new LinkMgr(cubes);
	
	that.initOnce = function(){
	
		var shell,
			canvasDim = PRASAD.widgets.getCanvasDimensions("canvas_container");
		paper = new Raphael(document.getElementById('canvas_container'), canvasDim.width, canvasDim.height);
		
		MAT_WIDTH = 4/5 * canvasDim.width;
		MAT_HEIGHT = 7/10 * canvasDim.height;
		MAT_X = 1/10 * canvasDim.width;
		MAT_Y = 1/10 * canvasDim.height;
		
		// This ensures that vertically there is room for 11 counters - so that group by 10 ( the highest) 
		// is possible
		counterHeight = Math.floor(MAT_HEIGHT/(MAX_GROUP_BY_COUNT+1));
		counterWidth = counterHeight;
		MAT_GRID_SIDE = counterWidth;
		matBorder = MAT_WIDTH/50;
		//console.log("counter width = " + counterWidth);
		
		shell = PRASAD.widgets.addShell(paper,canvasDim);
		progressBar = PRASAD.widgets.addProgressBar(paper,canvasDim);		
		instructionsBar = PRASAD.widgets.addInstructionBar(paper,canvasDim);
		
		mat = new SnapableMat({
			paper: paper,
			x: MAT_X,
			y: MAT_Y,
			width: MAT_WIDTH,
			height: MAT_HEIGHT,
			color: '#FFF8C6', //Lemon Chiffon
			gridSide: MAT_GRID_SIDE,
			border: matBorder,
			callback: function(x, y){
			
				var selectedCounters = linkMgr.getSelectedCubes();
				
				var numSelectedCounters = selectedCounters.length;
				console.log("# of sel counters = " + numSelectedCounters);
				if (numSelectedCounters > 0) {
					if (numSelectedCounters == 1) {
						// If counters moved with the box
						selectedCounters[0].animateTo(x, y);
						selectedCounters[0].removeOutline();
						
					}
					else {
						// Multiple counters have been selected																		
						var startOfLink = linkMgr.getFirstSelectedCube();
						linkMgr.moveLinkTo(startOfLink, x, y, startOfLink.height);
					}					
				//updateProgress();
				}
				
			}
		});
		mat.drawGrid();
		(function createProgressLine(){
			var TEXT_SEPARATION = 10;
			var pdim = progressBar.getDimensions();
			
			var 
				X_GAP=2,
				Y_GAP=2,
				TEXT_CELL_WIDTH = pdim.height- 2 * Y_GAP,
				TEXT_CELL_HEIGHT = TEXT_CELL_WIDTH,
				dim;
			
			var text = PRASAD.components.createText({
				paper: paper,
				x: pdim.x  + TEXT_SEPARATION,
				y: pdim.y + pdim.height / 2 ,
				text: "YOU HAVE MADE"
			});
			dim = text.getDimensions();
			
			groupsLabel = PRASAD.components.RoundTextCell({
				paper: paper,
				x: dim.x + dim.width + TEXT_SEPARATION,
				y: pdim.y + Y_GAP,
				width: TEXT_CELL_WIDTH,
				height: TEXT_CELL_HEIGHT,
				text: ""
			});
			dim = groupsLabel.getDimensions();
			
			text = PRASAD.components.createText({
				paper: paper,
				x: dim.x + dim.width + TEXT_SEPARATION,
				y: dim.y + dim.height / 2,
				text: "GROUPS"
			});
			
			
			
		})();
		
		/*
		(function createProgressLine(){
			var pdim = progressBar.getDimensions();
			
			var 
				xgap =3,
				groupCountX = pdim.x + xgap, 
				ygap = 3,
				TEXT_CELL_Y = pdim.y  + ygap,
				TEXT_SEPARATION = 10, 
				TEXT_CELL_WIDTH = pdim.height- 2 *ygap,
				TEXT_CELL_HEIGHT = TEXT_CELL_WIDTH,
				textFontSize = 20, 				 
				onesCountX, 				 				
				dim;
			
			groupsLabel = PRASAD.components.TextCell({
				paper: paper,
				x: groupCountX,
				y: TEXT_CELL_Y,
				width: TEXT_CELL_WIDTH,
				height: TEXT_CELL_HEIGHT,
				text: ""
			});
			dim = groupsLabel.getDimensions();
			
		 	// The text field that updates on progress and has the text containing the group by number
			var progressGroupByText = PRASAD.components.createText({
				paper: paper,
				x: dim.x + dim.width + TEXT_SEPARATION,
				y: dim.y + dim.height / 2,
				text: "GROUPS OF"
			});
			dim = progressGroupByText.getDimensions();
			
			groupByNumberLabel = PRASAD.components.RoundTextCell({
				paper: paper,
				x: dim.x + dim.width + TEXT_SEPARATION,
				y: TEXT_CELL_Y,
				width: TEXT_CELL_WIDTH,
				height: TEXT_CELL_HEIGHT,
				text: ""
			});
			if( groupByNumber !== undefined) {
				groupByNumberLabel.setText(groupByNumber);
			}
			dim = groupByNumberLabel.getDimensions();
			
			//AND
			var andText = PRASAD.components.createText({
				paper: paper,
				x: dim.x + dim.width + TEXT_SEPARATION,
				y: dim.y + dim.height / 2,
				text: "AND"
			});
			
			dim = andText.getDimensions();
			
			onesCountX = dim.x + dim.width + TEXT_SEPARATION;			
			onesLabel = PRASAD.components.TextCell({
				paper: paper,
				x: onesCountX,
				y: TEXT_CELL_Y,
				width: TEXT_CELL_WIDTH,
				height: TEXT_CELL_HEIGHT,
				text: ""
			});
			
			dim = onesLabel.getDimensions();
			
			var finalText = PRASAD.components.createText({
				paper: paper,
				x: dim.x + dim.width + TEXT_SEPARATION,
				y: dim.y + dim.height / 2,
				text: "MORE"
			});		
		})();
		*/
	}
	
	that.init = function() {
		for ( var i=0; i < cubes.length ; i+=1) {
			cubes[i].getShape().remove();
		}
		cubes.splice(0, cubes.length);	
	};

	that.start = function() {
		var 
			counter,
			randX,
			randY,
			lowerX = MAT_X,
			lowerY = MAT_Y+ 10,
			upperX = MAT_X+ MAT_WIDTH - counterWidth,
			upperY = MAT_Y + MAT_HEIGHT - counterHeight;
			
		var randIndex = PRASAD.utils.randomIntForRange(0,groupByNumbers.length-1);
		groupByNumber = groupByNumbers[randIndex];
		//groupByNumberLabel.setText(groupByNumber);
					
		randomNumber = PRASAD.utils.randomIntForRange(10, groupByNumber < 10 ? groupByNumber *4 : groupByNumber * 3);
		console.log("Random number = " + randomNumber);
		for (var i = 0; i < randomNumber; i += 1) {
			
			randX = PRASAD.utils.randomIntForRange(lowerX,upperX);
			randY = PRASAD.utils.randomIntForRange(lowerY,upperY);
			
			var snapTo = mat.getSnapPoint(randX,randY);
			//console.log(randX+"," + randY + " snapping to " + snapTo.x + "," + snapTo.y);
			
			counter = SJCube({
							paper: paper,
							x: snapTo.x,
							y: snapTo.y,
							width: counterWidth,
							height: counterHeight,
							color: '#00F',
							otherCubes:cubes,							
							linkMgr:linkMgr,
							linkUpdateCallback: function() {
								updateProgress();
							}
							});
			cubes.push(counter);
		}
		
		
		instructionsBar.display("GROUP BY " + groupByNumber);
		updateProgress();
		
	};
	
	function updateProgress() {
		var groups = linkMgr.getGroups();
		var occ = groups.occurencesOfNumber(groupByNumber);				
		//console.log("There are " + occ + " occurences of " +  groupByNumber);
		groupsLabel.setText("" + occ);
		var ones = cubes.length - (occ * groupByNumber);
		//onesLabel.setText("" + ones);		
		var answer = Math.floor(randomNumber/groupByNumber);
		progressBar.percentComplete((occ/answer)*100);
	}

	return that;
	
}