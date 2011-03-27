window.onload = function(){
	var game = CountGame();
	game.initOnce();
	game.init();
	game.start();
}

function CountGame() {
	var that = {};

	var DICE_CLICK = "CLICK THE DICE";
	var DROP_COUNTERS = "DROP THE COUNTERS IN THE BOX";

	var paper;
	var cubes=[];
	var countersInBox =[];
	var countersMovedInThisRun = 0;
	var instruction;
	var timer;
	var dice;
	var diceNumber;
	var bankCounter;
	var dropCount;
	var linkMgr;
	var target;	
	var nextGame;
	
	function createSelectableCounter() {
		var counterX = 10,
			counterY = 100,
			counterWidth = 30, 
			counterHeight=counterWidth,
			offset = counterWidth/5, 
			connWidth = counterWidth-2*offset,			
			connHeight=counterHeight/5,
			counter;
			
		counter = //
							SJCube( {
								paper:paper,
								x:counterX,
								y:counterY,
								width:counterWidth,
								height:counterHeight,
								otherCubes:cubes,
								/*
								connectorWidth:connWidth,
								connectorHeight:connHeight,
								*/
								color:'#00F',
								linkMgr:linkMgr
								});		
		cubes.push(counter);
		console.log("cubes has length " + cubes.length);
		/*
		if (target !== undefined) {
			counter.getShape().insertAfter(target.getShape());
		}
		*/
		return counter;						
	}
	
	function setDropCount() {
		var remaining = (diceNumber-countersMovedInThisRun);
		dropCount.attr({text: (remaining == 0 ? "" : (""+remaining))});	
	}
	
	that.init = function() {
		countersMovedInThisRun = 0;
		if (cubes !== undefined) {
			for( var k=0; k < cubes.length ; k+=1) {
				cubes[k].getShape().remove();
			}
			cubes.splice(0, cubes.length);
		}
		countersInBox.splice(0,countersInBox.length);
		dice.setVisible(true);
		timer.initialize();
	};
	
	that.initOnce = function() {
		var diceX =10, 
			diceY = 200, 
			diceWidth = 100, 
			diceHeight = diceWidth,
			timerX = 100,
			timerY = 430,
			timerWidth = 500,
			timerHeight =15,
			timerInterval = 120000,
			
			targetX = 150,
			targetY = 50,
			targetWidth = 500,
			targetHeight =350,
			
			dropCountFontSize=25,
			arrowX = targetX + targetWidth+100,
			arrowY = targetY + targetHeight/2;
			
			
		paper = new Raphael(document.getElementById('canvas_container'), 800, 500);
		instruction = new InstructionsBar(paper,0,500,800,40);
		linkMgr = new LinkMgr(cubes);
		
		dice = new Shuffle(paper,diceX,diceY,diceWidth,diceHeight,6, function(number) {
											diceNumber = number;
											countersMovedInThisRun = 0;
											instruction.display(DROP_COUNTERS);
											dice.setEnabled(false);										
											//bankCounter.setVisible(true);
											bankCounter = createSelectableCounter();
											setDropCount();		
										},true,true);
		dice.setBackground("yellow");
		dice.setPulsate(true);
		
		timer = new BarTimer(paper,timerX,timerY,timerWidth,timerHeight,timerInterval, function() {
										// Timer is complete
											console.log("timer is complete");
											timer.setVisible(false);
											bankCounter.setVisible(false);
											dice.setVisible(false);
											});
		/*
		target = new SelectableCounterTarget(
							 {
								paper:paper,
								x: targetX,
								y: targetY,
								width: targetWidth,
								height: targetHeight,
								color:'#FFF8C6', //Lemon Chiffon
		*/
		
			
		target = new SnapableMat({
			paper: paper,
			x: targetX,
			y: targetY,
			width: targetWidth,
			height: targetHeight,
			color: '#FFF8C6', //Lemon Chiffon
			gridSide:30,
			border:10,
			callback: function(x,y) {	
									console.log(">>Target clicked at " + x + ","+y);
									var selectedCounters = linkMgr.getSelectedCubes();
									
									var numSelectedCounters = selectedCounters.length;
									console.log("# of sel counters = " + numSelectedCounters);	
									if (numSelectedCounters > 0) {
										if (numSelectedCounters == 1) {	
											bankCounter = createSelectableCounter();																	
											if (selectedCounters[0].insideOf == undefined) {												
												selectedCounters[0].insideOf = target;
												countersInBox.push(selectedCounters[0]);
														
												console.log("# of countersInBox: "+ countersInBox.length);
												countersMovedInThisRun++;
												setDropCount();
												selectedCounters[0].animateTo(x, y);
												selectedCounters[0].removeOutline();
												
												if(countersMovedInThisRun == diceNumber ) {
													countersMovedInThisRun = 0;
													//bankCounter.setEnabled(false);	
													bankCounter.setVisible(false);	
													dice.clearDisplay();
													dice.setEnabled(true);
													//dice.setVisible(true);
													instruction.display(DICE_CLICK);				
												}												
											}
											else {
												// If counters moved with the box
												selectedCounters[0].animateTo(x, y);
												selectedCounters[0].removeOutline();
											}
										}
										else {
											console.log("mult counters");
											// Multiple counters have been selected																		
											var startOfLink = linkMgr.getFirstSelectedCube();
											linkMgr.moveLinkTo(startOfLink,x,y,startOfLink.height);								
										}
									}
								}
							}
						);	
		target.drawGrid();															
											
		dropCount = paper.text(targetX+20,targetY+targetHeight-20,"").attr({'font-size':25});
		nextGame = new ArrowButton(paper,arrowX,arrowY, new ArrowDim(50,20), function(){
			that.init();
			that.start();
		}); 
			
	};
	
	that.start = function() {	
		timer.start();
		instruction.display(DICE_CLICK);			
	};
	
	return that;	
}