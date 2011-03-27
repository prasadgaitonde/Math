/**
 * @author prasad
 */

window.onload = function(){
	drawBox();
}

function printStyles(elem){
		for( var i in elem.style)  {
		//if (i === "width" || i === "height") {
			console.log(i + " = " + elem.style[i]);
		//}
	}
}

function getInt(elem, field){
	return parseInt(elem.css(field),10);
}

/*
function displayDotCard(paper) {
	return  new PRASAD.widgets.math.RandomDotCardGenerator(paper,250,20,100,100);
}
*/

 function drawBox() {
	var paper = new Raphael(document.getElementById('canvas_container'), 600, 600);
	
	var gridGen = new PRASAD.widgets.math.RandomDotCardGenerator(paper,250,20,100,100);
	var grid = gridGen.getNextCard();
	//var grid = new RandomDotCard(paper,250,20,100,100);
	
		
	var width = 150; var height = 150;
	
	var left = 10, top =170;
	var DISTANCE_BETWEEN_BOXES=20;

	
	//var box1 = new Box(paper,getInt(b1Elem,"left"),getInt(b1Elem,"top"),getInt(b1Elem,"width")-2,getInt(b1Elem,"height")-2,"LESS");
	//var box2 = new Box(paper,getInt(b2Elem,"left"),getInt(b2Elem,"top"),getInt(b2Elem,"width"),getInt(b2Elem,"height"),"SAME");
	var box1 = new Box(paper,left,top,width,height,"LESS");
	var box2 = new Box(paper,left+width+DISTANCE_BETWEEN_BOXES,top,width,height,"SAME");
	var box3 = new Box(paper,left+width+DISTANCE_BETWEEN_BOXES+width+DISTANCE_BETWEEN_BOXES,top,width,height,"MORE");
	 
	var mediator = new Mediator(new Array (box1,box2,box3));
	box1.display();
	box2.display();
	box3.display();
	
	 var NUM_PER_ROW=box1.boxesPerRow();
	 
	 var radius = (width - (NUM_PER_ROW-1) * 2)/(2* NUM_PER_ROW);
	 
	 var widthX = width * 3 + 2 * DISTANCE_BETWEEN_BOXES; 
	 
	 //var c1 = new CountersBox(paper,left,widthX,top + height,radius,mediator);
	 //var c2 = new Bank1(paper,$('#countersBank'),radius,mediator);
	 var c2 = new Bank(paper,left,widthX,top + height,radius,mediator);
	 
	 function newDotCard(){	
	 /* 
	 	if (grid !== undefined) {		
			grid.clear();
		}
		grid = displayDotCard(paper);
		*/
		grid = gridGen.getNextCard();
		clear();
	 }
	 
	function check() {
		var count = grid.getCount();
		box1.checkAnswer(count);
		box2.checkAnswer(count);
		box3.checkAnswer(count);
	}
	
	function clear(){
		box1.clear();
		box2.clear();
		box3.clear();
	}
	
	
	 document.getElementById("new").onclick = newDotCard;
	 document.getElementById("clear").onclick = clear;
	 document.getElementById("check").onclick = check;
	
	/*		
	new Button(paper, left + widthX + 20, top+100, 70, 30, "CHECK", check);
	 
	new Button(paper, left + widthX + 20, top+100 + 50, 70, 30, "CLEAR", clear);
	*/
}

/*
function Bank1(paper, bankElement, radius, mediator){
//function Bank(paper, left, widthX, top, radius, mediator) {
	
	console.log("bank elem > " + bankElement);
	var left = bankElement.css("left");
	left = parseInt(left,10);
	
	var top = bankElement.css("top");
	top = parseInt(top,10);
	
	console.log("left = "+  left);
	var oneCounter = new Counters(paper, left + 50, 30+top, radius, 1, mediator);
	oneCounter.startDrag();
	
	var fiveCounters = new Counters(paper,left + 120, 30+top, radius, 5, mediator);
	fiveCounters.startDrag();
	
	var tenCounters = new Counters(paper, left +50, 80+top, radius, 10, mediator);
	tenCounters.startDrag();	
}
*/

/*
 * left is the start x values of the first box
 * widthX is the total width of the 3 boxes and the gap between them. The counters box
 *         must be centered in this width
 */
function Bank(paper, left, widthX, top, radius, mediator) {
	
	var padding =2;
	
	var NUM_PER_ROW=10;
	var boxTop = top + 100;
	var NUM_COUNTERS=1;
	var startY = boxTop - radius + padding;
	
	var width = NUM_COUNTERS * 2 * radius + (NUM_COUNTERS-1) * padding ;
	
	var someX = (widthX - width)/2;
	var startX = left + someX;
	
	
	//var leftX = left + 80;
	var leftX = left + widthX/3;
	
	var bankBoxHeight =100;
	paper.text(leftX-40, boxTop-20 +bankBoxHeight/2, "BANK").attr({'font-size':18,fill:"#51a457"});
	var bank = paper.rect(leftX, boxTop-20, widthX/3 ,bankBoxHeight,3).attr({fill:'yellow'});
	
	leftX += 20;
	var oneCounter = new Counters(paper,leftX , boxTop , radius, 1, mediator);
	oneCounter.startDrag();
	
	leftX += (radius * 2+ padding) + 40; // * (NUM_COUNTERS+1);
	var fiveCounters = new Counters(paper, leftX, boxTop , radius, 5, mediator);
	fiveCounters.startDrag();
	
	//leftX += ((radius) *  5 + padding) + 40; // * (NUM_COUNTERS+1);
	var tenCounters = new Counters(paper, leftX-50 , boxTop+50 , radius, 10, mediator);
	tenCounters.startDrag();	
}

/*
 * left is the start x values of the first box
 * widthX is the total width of the 3 boxes and the gap between them. The counters box
 *         must be centered in this width
 */
/*
function CountersBox(paper, left, widthX, top, radius, mediator) {
	var padding =2;
	
	var NUM_PER_ROW=10;
	var boxTop = top + 100;
	var NUM_COUNTERS=1;
	var startY = boxTop - radius + padding;
	
	var width = NUM_COUNTERS * 2 * radius + (NUM_COUNTERS-1) * padding ;
	
	var someX = (widthX - width)/2;
	var startX = left + someX;
	
	var bank = paper.rect(left, boxTop-20, widthX,50,3).attr({fill:'yellow'});
	
	var leftX = left + 80;
	
	var oneCounter = new Counters(paper,leftX , boxTop , radius, 1, mediator);
	oneCounter.startDrag();
	
	leftX += (radius * 2+ padding) + 50; // * (NUM_COUNTERS+1);
	var fiveCounters = new Counters(paper, leftX, boxTop , radius, 5, mediator);
	fiveCounters.startDrag();
	
	leftX += ((radius) *  5 + padding) + 50; // * (NUM_COUNTERS+1);
	var tenCounters = new Counters(paper, leftX , boxTop , radius, 10, mediator);
	tenCounters.startDrag();
}
*/

 function Box(paper, x, y, width, height, text){
	var Label = PRASAD.widgets.Label;
 	//console.log(x +"," + y+","+ width +","+height+","+ text);
 	this.x = x;
 	this.y = y;
 	this.width = width;
 	this.height = height;
	this.text = text;

 	var NUM_PER_ROW = 5;
 	var padding = 2;
 	var shapes = new Array();
	
	var NORMAL_BG = "white";
	var CORRECT_ANS_BG = "green";
	var WRONG_ANS_BG = "red";
	
	this.checkAnswer = function(correctAnswer) {
		var answer = this.getNumber();
		var rect = this.rect;
		if( text == "LESS") {
			if(answer != 0 && answer < correctAnswer )
				correctAnsBackground(rect);
			else
				errorBackground(rect);	
			
		}
		if( text == "MORE") {
			if(answer > correctAnswer )
				correctAnsBackground(rect);
			else
				errorBackground(rect);	
		}
		else if( text == "SAME") {
			if(answer == correctAnswer )
				correctAnsBackground(rect);
			else
				errorBackground(rect);	
		}
	}
	
	normalBackground = function(rect) {
		rect.attr({fill:NORMAL_BG});
	} 
	
	errorBackground = function(rect) {
		rect.attr({fill:WRONG_ANS_BG});
	} 
	
	correctAnsBackground = function(rect) {
		rect.attr({fill:CORRECT_ANS_BG});
	} 

	
	this.clear = function() {
		for (var i = 0; i < shapes.length; i++) {
			shapes[i].remove();
		}
		shapes = [];
		normalBackground(this.rect);
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
		return numRows * NUM_PER_ROW;
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
 		this.rect = paper.rect(x, y, width, height).attr({fill:'white'});;		
		new Label(paper,x,y+height,width,30,text,'white');
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
	}
	
	/*
	 * Redraws the shapes within the box 
	 */			
	function repaint (){
		for (var i = 0; i < shapes.length; i++) {
			drawShapeAt(shapes[i], i + 1);
		}
	}
		
	function drawShapeAt(shape, count){
		var pos = shape.getPosition(x,y,count, NUM_PER_ROW, height, padding);
		shape.drawAt(pos.x,pos.y);
		shape.toFront(); // check if this fixes the issue in Chrome where the counters are not being correctly displayed in box
						// as if that area required a repaint
	}
		
	this.addShape = function(shape){
		shapes.push(shape);
		drawShapeAt(shape,shapes.length);		
	}
		
}

Box.prototype = new DummyBaseBox();

/*	
 function Mediator(boxes) {
 	that = this;
	this.boxes = boxes;

	this.self = this;
	
	this.findBox= function (cx,cy) {
		for( var i=0; i < this.boxes.length;i++){
			if( this.boxes[i].pointIsInBox(cx,cy))
			return this.boxes[i];
		}
		return null;
	}
	
		
 	this.up = function(){
		// The this reference is the raw shape ( circle etc)
		var pos = this.getPoint();
			
		var withinBox = that.findBox(pos.x,pos.y);
		// Check if this location is within any of the boxes
		if( withinBox != null){
		
			// if not already within the box
			if (this.inbox == null) {			
				// this condition will never be satisfied				
				withinBox.addShape(this);
				this.inbox = withinBox;
				
				// Counters are automatically replenished in the bank
			}
			else {
				// moved within the box
				this.revertToOrigPos();
			}
		}
		else {
			if (this.inbox != null) {
				this.inbox.removeShape(this);
				this.remove();
			}
			else {
				alert('should i be here?');
			}
		}
	}
 }
 */
 
 
 