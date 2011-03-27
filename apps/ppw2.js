window.onload = function(){
	dothis();
}

function dothis(){
	
	// Function definitions
	var drawLine = PRASAD.graphics.line;
	var getRand = PRASAD.utils.randomIntForRange;

	var instructions = [ 'How many counters can you see?', 'How many counters are hidden?', 'Well Done!'];
	var COUNTERS_ABOVE_WATER_QUES_INDEX=0;
	var COUNTERS_BELOW_WATER_QUES_INDEX=1;
	var WELL_DONE_INDEX=2;
	var instructionsIndex = COUNTERS_ABOVE_WATER_QUES_INDEX;	
	
	var paper = new Raphael(document.getElementById('canvas_container'),700, 600);
	
	//var scoreCard = new ScoreCard("score");
	//document.getElementById("next").onclick = next;
	/*
	 * The whole number of which you have to find the parts
	 */
	var theWholeNumber;
	
	/*
	 * The part of the whole number that is hidden (under the water)
	 */
	var coveredNumber;
	
	/*
	 * The box that holds the counters
	 */
	var box;
	/*
	 * The bank from which the counters are picked
	 */
	var bank;
	/* 
	 * The text that either instructs or asks a question
	 */
	var questionText;
	
	/*
	 * A label that displays the = sign
	 */
	var equals;
	
	/*
	 * A label that displays the first addend, i.e. the first part 
	 */
	var addend1;
	
	/*
	 * A label that displays the second addend, i.e. the second part 
	 */
	var addend2;

	/*
	 * A label that displays the + operator
	 */
	var plus;
	
	var mediator;
	/*
	 * The width of the box
	 */
	var WIDTH = 35;
	
	/*
	 * Flag specifying whether the question/instruction needs to be animated
	 */
	var animateTheQuestion = false;
	
	/*
	 * x location of top of box
	 */
	var x = 100;
	
	/*
	 * y location of top of box
	 */
	var y = 50;
	
	/*
	 * Distance between the addends and sign displayed next to box
	 */
	var	gap=10;
	
	
	var questionX = 250;
	var questionY = 100;
	
	var questionWidth = 400;
	var questionHeight = 30;
	
	var numbersBoxX = questionX;
	var numbersBoxY = questionY + questionHeight + 20 ;
	var numberBoxWidth =  questionWidth;
	var numberBoxHeight =  40;

	var sc = new ScoreBoard(paper, 20,500, 600,75, 15000); // Wait 15 seconds before changing indicator
	//var n1 = new PRASAD.widgets.math.SelectableNumbers("numbers",1,9,  function(selectedNumber) {
	var n1  = new SelectableNumbers3(paper, numbersBoxX, numbersBoxY , numberBoxWidth,numberBoxHeight,1,10, function(selectedNumber) {										
										var answer = getAnswer();	
										//console.log("Correct answer = " + answer);
										if( answer == selectedNumber ) {
											if(  instructionsIndex == COUNTERS_ABOVE_WATER_QUES_INDEX) {
												addend1.setText(selectedNumber);
												addend1.setVisible(true);
												plus.setVisible(true);
												addend2.setVisible(true);
												instructionsIndex++;	
												askQuestion(instructions[instructionsIndex]);
												
												n1.setEnabled(true);
											}
											else if(  instructionsIndex == COUNTERS_BELOW_WATER_QUES_INDEX) {
												addend2.setText(selectedNumber);
												addend2.setVisible(true);
												animateTheQuestion = false;
												sc.correct();
												n1.setEnabled(true);
												// Display a congratulatory message for certain time
												// before moving to the next session
												askQuestion(instructions[WELL_DONE_INDEX]);
												//n1.setEnabled(false);
												n1.setVisible(false);
												setTimeout(function() {
													questionText.setVisible(false);	
													next();												
												} ,1500);
												
											} else {
												console.log("no never be here!!");
												
											}
										}
										else {
											if (instructionsIndex == COUNTERS_ABOVE_WATER_QUES_INDEX) {
												
											}
											else if (instructionsIndex == COUNTERS_BELOW_WATER_QUES_INDEX) {
													//console.log("2 - incorrect");
													sc.incorrect();
											}
											//scoreCard.incorrect();
										}
										
									});
	n1.setVisible(false);								
	next();	
	animate();							
	
	function getAnswer() {
		if (instructionsIndex == COUNTERS_ABOVE_WATER_QUES_INDEX) {
			// How many above water
			return box.getNumber() - box.numberOfCountersCovered;
		}
		else if (instructionsIndex == COUNTERS_BELOW_WATER_QUES_INDEX) {
			// How many under water
			return box.numberOfCountersCovered;
		}		
	}
	
	
	
	function askQuestion(question){
		
		questionText.setText(question);
		
		// Animate the question to get the user attention.
		// Technique used is to vary the opacity of the question rectangle
		// The animation will continue indefinitely until either the question has been answered and 
		// there are no more questions to be answered
		var interval = 1500;
		(function anim(){
			//console.log("to anim = " + animateTheQuestion);
			if (animateTheQuestion) {
				questionText.rect.animate({
					opacity:0.4
				}, interval, function(){
					questionText.rect.animate({
						opacity:0.9
					}, interval, anim);
				});
			}
		})();
		
	}
	
	
	function init() {
	
		questionText = questionText ||  new PRASAD.widgets.Label(paper, questionX, questionY, questionWidth, questionHeight, "?", "white");
		questionText.text.attr({'font-size': 20});			
		questionText.rect.attr({stroke: 'black',fill:'grey'});	
		
		equals = equals || PRASAD.widgets.createLabel(paper,x+WIDTH+10,y+ box.height+ 10,WIDTH,30,"=",'white',false);
		addend1 = addend1 || PRASAD.widgets.createLabel(paper,x+ 2 * (WIDTH + gap) ,y+ box.height+ 10,WIDTH,30,"?",'white');
		plus = plus || PRASAD.widgets.createLabel(paper,x+ 3 * (WIDTH + gap)  ,y+ box.height+ 10,WIDTH,30,"+",'white',false);
		addend2 = addend2 || PRASAD.widgets.createLabel(paper,x+ 4 * (WIDTH + gap)  ,y+ box.height+ 10,WIDTH,30,"?",'white');
		
		addend1.setText("?");
		addend2.setText("?");
		equals.setVisible(false);
		addend1.setVisible(false);
		plus.setVisible(false);				
		addend2.setVisible(false);
		
		instructionsIndex = COUNTERS_ABOVE_WATER_QUES_INDEX;
		animateTheQuestion = false;
		
		questionText.setVisible(true);
		
		// Initialize the box
		// Remove counters if any
		box.removeAll();
		// Remove water;
		if( box.theWater !== undefined) {
			box.theWater.remove();
		}
	}
	
	function next(){
		theWholeNumber = getRand(2,10);
		

		box = box || new Box1(paper,x,y,WIDTH, function(numCounters) {
			if( theWholeNumber == numCounters) {
				//console.log("Box has been correctly filled");
				n1.setVisible(true);
				bank.setVisible(false);
				
				equals.setVisible(true);
				addend1.setVisible(true);
				box.fillWater();				
				askQuestion(instructions[instructionsIndex]);
				n1.setEnabled(true);
			}
			
		});	
		init();
			
		box.display();
		
		mediator = mediator || new Mediator( [box]);
		bank = bank || new Bank1(paper, 220,300,box.radius,mediator);
		bank.setVisible(true);
		var question = "Put " + theWholeNumber + " counters in the box";
		//console.log(question);
		askQuestion(question);
		var sessionId = "Part-Part Whole for " + theWholeNumber; 
		sc.newSession(sessionId);
	}			
}

/*
 * callback called as counters are added or removed
 */
function Box1(paper, x, y, width,callback){
	var getRand = PRASAD.utils.randomIntForRange;
	var that = this;
	var Label = PRASAD.widgets.Label;
 	
 	this.x = x;
 	this.y = y;
	this.width = width;
	
	this.NUM_PER_ROW=1;
	var NUM_ROWS=10;
	var padding = 2;
	this.radius = (this.width - (this.NUM_PER_ROW-1) * padding)/(2* this.NUM_PER_ROW); 
	this.height = getHeight(NUM_ROWS);	

 	var shapes = [];
	/*
	 * Path that draw the box
	 */
	var pathStr = 	PRASAD.utils.createPath(['M', x,y, x,y+this.height,x+width,y+this.height,x+width,y]);
	// The actual path
	this.container = paper.path(pathStr).attr({'stroke-width':3, fill:'#d2dbf9'});
	// Hide the box initially
	this.container.hide();
	// Keeps a count of the number of counters in the box	
	this.countLabel = new Label(paper,x,y+ this.height+ 10,width,30,"0",'white');
	// Hide this label initially
	this.countLabel.setVisible(false);
	
	/*
	 * Gets the height of the box
	 */
	function getHeight(numRows) {
		return 2 * that.radius * numRows +  (numRows-1)* padding;
	}
	
	/*
	 * Returns true if the countersToAdd parameter will exceed the capacity of the
	 * box containing the specified shape
	 * The shape is specified to enable the box to determine capacity based on size
	 * Ideally the box could have used one of its existing shapes to determine this,
	 * but this has to work even if the box is initially empty, hence we pass the
	 * shape as a parameter
	 */
	this.isCapacityExceeded = function(shape, countersToAdd) {
		var numb = this.getNumber();				
		var capacity = this.getCapacity(shape);
		return (numb + countersToAdd > capacity) ? true : false;
	}

	/*
	 * Returns the capacity of the box in terms of how many shapes it can hold.
	 * 
	 */
	this.getCapacity = function(shape){		
		var numRows = Math.floor(this.height/shape.getBBox().height);
		return numRows * this.NUM_PER_ROW;
	}
	
	this.fillWater = function(){
		//console.log("getting random between 1 and " + (this.getNumber() - 1));
		
		// The number of counters that are covered (under water) 
		this.numberOfCountersCovered = getRand(1, this.getNumber() - 1);
		var startX = x, startY = y;
		var HEIGHT = this.height;
		var WIDTH = this.width;
		var initialWaterHeight = 2;
		
		var COVER_OPACITY = 1;
		var REVEAL_OPACITY = 0.5;
		
		if (this.theWater !== undefined) {
			this.theWater.remove();
		}
		this.theWater = paper.rect(startX, startY + HEIGHT - initialWaterHeight, WIDTH - 1, initialWaterHeight-1);
		
		this.theWater.attr({
			fill: '#2f97ff',
			stroke: 'none',
			opacity: COVER_OPACITY,
		});
		var rect = this.theWater;
		rect.node.onclick = function(){
			//console.log("click");
			var op = + rect.attr('opacity');
			
			var newOp = op == COVER_OPACITY ? REVEAL_OPACITY : COVER_OPACITY;
			rect.animate({
				opacity: newOp
			}, 2000, function(){
				rect.animate({
					opacity: COVER_OPACITY
				}, 1000);
			});
		}
		
		// Raise the water level to cover that many (numberOfCountersCovered)  counters
		var finalWaterHeight = getHeight(this.numberOfCountersCovered) + padding;
		this.theWater.animate({
			x: startX,
			y: startY + HEIGHT - finalWaterHeight,
			height: finalWaterHeight
		}, 1000);
	}
		
	/*
	 * Returns the number of shapes in the box
	 */
	this.getNumber = function() {
		return shapes.length;
	}
	
	/*
	 * Returns the number of shapes per row, in the box
	 */
	this.boxesPerRow = function() {
		return NUM_PER_ROW;
	}
 	
 	this.pointIsInBox = function(xx,yy) {
		var boxX = this.x + this.width;
		var boxY = this.y + this.height;
		return ( (xx > this.x && xx < boxX) && (yy > this.y && yy < boxY)) ;
	}
	
 	this.display = function(){	
		this.container.show();
		// Keeps a count of the number of counters in the box	
		this.countLabel.setVisible(true);
 	}
 	
 	/*
 	 * Removes the specified shape from the internal array of shapes maintained.
 	 * It also removes the node for this shape from the DOM tree
 	 */
	this.removeShape = function(shape){
		shape.inbox = null;
		for( var i=0; i < shapes.length ;i++) {
			if( shapes[i] == shape) {
				shapes.splice(i,1);
				shape.remove();
				break;
			}
		}			
		repaint();
		if( this.done !== undefined) {
			this.done();
		}		
	}
	
	/*
	 * Redraws the shapes within the box 
	 */			
	function repaint (){
		for (var i = 0; i < shapes.length; i++) {
			drawShapeAt(shapes[i], i + 1);
		}
		that.countLabel.setText(shapes.length);	
	}
		
	function drawShapeAt(shape, count){
		//console.log("drawShapeAt: " + x + "," + y +"," + count + "," + that.NUM_PER_ROW + "," + that.height);
		var pos = shape.getPosition(x,y,count, that.NUM_PER_ROW, that.height, padding);
		shape.drawAt(pos.x,pos.y);
		//shape.toFront(); // check if this fixes the issue in Chrome where the counters are not being correctly displayed in box
							// as if that area required a repaint
	}
		
	this.addShape = function(shape){
		shapes.push(shape);
		drawShapeAt(shape,shapes.length);
		that.countLabel.setText(shapes.length);
	}
	
	this.done = function() {
		if( callback !== undefined) {
			callback(that.getNumber());
		}
	}
	
	/*
	 * Clears the contents of teh box
	 */
	this.removeAll = function(){
		
		for( var i=0; i < shapes.length ;i++) {			
				//shapes.splice(i,1);
				shapes[i].remove();
		}			
		shapes = [];
		repaint();		
		//if( this.done !== undefined) {
		//	this.done();
		//}		
	}
}

Box1.prototype = new DummyBaseBox();

function Bank1(paper, left,  top, radius, mediator) {
	this.countersArray = [];
	var padding =2;
	var boxTop = top;
	
	var leftX = left;
	//var BANK_BOX_WIDTH= radius * 9;
	var alignVert = true;
	
	//var bankBoxHeight =100;
	//paper.text(leftX-40, boxTop-20 +bankBoxHeight/2, "BANK").attr({'font-size':18,fill:"#51a457"});
	//var bank = paper.rect(leftX, boxTop-40, BANK_BOX_WIDTH ,bankBoxHeight,3).attr({fill:'yellow'});
	leftX += 30;
	for (var k = 1; k <= 10; k += 1) {
	
		var counters = new Counters(paper, leftX, boxTop - 10, radius, k, mediator, alignVert);
		this.countersArray.push(counters);
		counters.startDrag();
		leftX += (radius * 2 + padding) + 10;
	}
		
	this.setVisible = function(flag) {
		for( var i=0; i < this.countersArray.length;i+=1) {
			this.countersArray[i].setVisible(flag);
		}
	}	
}
