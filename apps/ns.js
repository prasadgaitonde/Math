window.onload = function(){
	dothis();
}

function dothis() {
	
	var paper = new Raphael(document.getElementById('canvas_container'), 700, 500);
	
	
	var mat;
	var diceNumber;
	var countersInBox = [];
	var GAP =5;
	var DICE_CLICK = "CLICK THE DICE";
	var DROP_COUNTERS = "DROP THE COUNTERS IN THE BOX";
	var countersMovedInThisRun =0;
	
	var instruction = new InstructionsBar(paper,0,500,700,40);
	instruction.display(DICE_CLICK);
	
	var diceX =10, diceY = 200, diceWidth = 100, diceHeight =diceWidth;
	
	var dice = new Shuffle(paper,diceX,diceY,diceWidth,diceHeight,6, diceRolled,true,true);
	dice.setBackground("yellow");
	//var diceGoader = new GoadingArrow(paper, diceX,diceY + diceHeight/2,"LTR",new ArrowDim(20,10),10);
	//diceGoader.startAnimation();
	
	var matX = 150, matY = 20, matWidth = 500, matHeight = 300;
	var radius = PRASAD.utils.getRadius(matWidth,GAP,10);
	
	mat = new Mat2(paper,matX,matY,matWidth,matHeight);	
	//mat.drawGrid(2 * (radius+GAP));
	
	// Circle as counter - to be used with Mat
	//var bankCounter = new DraggableCircle(paper, matX-2*radius,matY+radius ,radius, callback, moveToAllowed );
	var otherCubes = [];
	bankCounter = getSingleCounter();
	
	bankCounter.setEnabled(false);
	

	var timer = new BarTimer(paper,matX, 400,500,20,20000, function() {
		// Timer is comple
		console.log("timer is complete");
		timer.setVisible(false);
	});
	timer.start();
	
	function getSingleCounter() {
		var x = 100, y =100, width =25, height=width;
		var offset = width/5, connWidth=width-2*offset;
		var connHeight=height/5;
		var i=0;
		var spec = {
			paper:paper,
			x:x+ i*(width+2),
			y:y,
			width:width,
			height:height,
			connectorWidth:connWidth,
			connectorHeight:connHeight,
			otherCubes:otherCubes,
			callback:callback,
			moveToAllowed: moveToAllowed,
			identifier:"" + (i+1)			
		};
		//var cube =  new DraggableUCube(paper,x+ i*(width+2),y,width,height,connWidth,connHeight,true, otherCubes,callback,moveToAllowed);
		var cube = DraggableAndJoinableCube(spec);
		cube.activateDrag();
		otherCubes.push(cube);
		return cube;

	// Circle as counter - to be used with Mat
	// return  new DraggableCircle(paper, matX-2*radius,matY+radius ,radius, callback, moveToAllowed );
		
		
	}
	
	function diceRolled(number) {
		diceNumber = number;
		//dice.setClickEnabled(false);
		//diceGoader.stopAnimation();
		bankCounter.setDragEnabled(true);
		countersMovedInThisRun =0;
		instruction.display(DROP_COUNTERS);
		//bankCounterEnable(true);
		dice.setEnabled(false);
		bankCounter.setEnabled(true);
	}
	
	var scramble = new PRASAD.widgets.Button(paper,matX + 100 + 20,matY + matHeight+ 10 ,100,30,"Scramble", function() {
		var k;
		for( k=0; k < countersInBox.length ; k+=1) {
			var randX = PRASAD.utils.randomIntForRange(matX+radius, matX+matWidth-radius);
			var randY = PRASAD.utils.randomIntForRange(matY+radius, matY+matHeight-radius);
			countersInBox[k].getShape().animate({cx: randX, cy:randY},500);
			
		}
		});
		
		/*
		 * Groups the counters in the specified number of rows and columns. It first fills
		 * one column by the column count before proceeding to the next row.
		 * rows - the number of rows, the last row could be partially filled
		 * columns - the number of columns
		 */
		function groupCountersBy(numRows, numCols) {
			var count = 0;	
			for( var row=1; row <= numRows; row += 1) {
				for (var col = 1; col <= numCols; col += 1) {
					var xx = PRASAD.utils.getX(matX,col,GAP,radius);
					var yy = PRASAD.utils.getY(matY,row,GAP,radius);
					countersInBox[count].getShape().animate({cx: xx, cy:yy},1000);
					count++;
					if( count ==  countersInBox.length) break;				
				}
			}
		}
		
	
	var rearrange = new PRASAD.widgets.Button(paper,matX,matY + matHeight+ 10 ,100,30,"Rearrange", function() {
		var numCols = getNumColumns();
		var numRows = getNumRows(numCols);
			
				
		console.log("numRows = " + numRows + "; numCols = " + numCols);
		groupCountersBy(numRows,numCols);
		
		function getNumRows(numCols) {
			var numCounters = countersInBox.length;
			var mod = numCounters % numCols;
			return  mod == 0 ? numCounters/numCols : Math.floor(numCounters/numCols)+1; 
		}
		
		function getNumColumns() {		
			var numCounters = countersInBox.length;
			var theNumber = 2;
			
			if( numCounters >= 10 ) {
				theNumber = 10;
			} else  if( numCounters >= 5 ) {
				theNumber = 5;
				
			} else if( numCounters >= 2 ) {
				theNumber = 2;
			}
			else {
				theNumber = 1;
			}
			return theNumber;
		}
	});
	
	
	
	function moveToAllowed(counter, x, y){
		if( counter.insideOf instanceof Mat) {
			if (!mat.pointIsInBox(x,y, radius)) {
				return false;
			}
			else {
				return true;
			}
		}
		return true;
	}
	
	function bankCounterEnable(flag) {
		bankCounter.getShape().attr({opacity:flag ? 1 :0.3});
	}
	
	/*
	 * Function called after the counter is dropped on the target
	 * circle - the counter that is dropped
	 * x - the x position of the drop
	 * y - the y position of the drop
	 */
	function callback(counter, x,y) {
		//console.log("Dropped at " + x +", " + y);
		if( mat.pointIsInBox(x,y,radius)) {			
			//console.log("is in box");
			if (counter.insideOf == undefined) {
				var sp = counter.getStartPoint();
				//bankCounter = new DraggableCircle(paper, sp.x, sp.y, radius, callback,moveToAllowed);
				bankCounter = getSingleCounter();
				counter.insideOf = mat;
				countersInBox.push(counter);			
				console.log("# of countersInBox: "+ countersInBox.length);
				countersMovedInThisRun++;
				//dice.setClickEnabled(countersMovedInThisRun == diceNumber);
				if(countersMovedInThisRun == diceNumber ) {
					countersMovedInThisRun = 0;
					//bankCounter.setDragEnabled(false);
					//bankCounterEnable(false);
					bankCounter.setEnabled(false);		
					dice.setEnabled(true);
					instruction.display(DICE_CLICK);
					//diceGoader.startAnimation();
				}
			}
		}		
		else {			
			//console.log("is NOT in box");
			
			// This scenario is not possible anymore since we prevent the counter from 
			// being moved out of the box once inside
			/*
			// Counter was inside the mat at start of drag
			if (counter.insideOf instanceof Mat) {
				//console.log("moved from mat to outside mat");
				counter.insideOf = null;				
				counter.getShape().remove();
			}
			else {
			*/			
			var sp = counter.getStartPoint();
			counter.moveTo(sp.x,sp.y);
			counter.insideOf = null;
			//}
		}
	}
}

function Mat(paper,x,y,width,height) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	var line = PRASAD.graphics.line;
	var rect = paper.rect(x,y,width,height);
	
	this.drawGrid = function(side) {
		var numCols = this.width/side;
		var numRows = this.height/side;
		console.log("side = " + side + " # rows = " + numRows + " numCols = " + numCols);
		// Draw the vertical grid lines
		var sx = this.x + side  ;
		var line1;
		var attr = {opacity :"0.1"};
		for( var k = 1; k < numCols; k+=1) {
			var kx = sx  +( k-1)* side;
			line1 = line(paper, kx, this.y , kx, this.y + this.height).attr(attr);
		}
		
		// Draw the horizontal grid lines
		var sy = y + side;
		for( k=1 ; k < numRows ; k +=1) {
			var ky = sy  +( k-1)* side;
			line1 = line(paper, this.x, ky, this.x + width ,ky).attr(attr);
		}
	}
	
}

Mat.prototype.pointIsInBox = function(xx,yy,tolerance) {
		var boxX = this.x + this.width;
		var boxY = this.y + this.height;
		return ( (xx > (this.x+tolerance) && xx < (boxX-tolerance)) && (yy > (this.y+tolerance) && yy < (boxY-tolerance))) ;
}


function Mat2(paper,x,y,width,height) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	
	var rect = paper.rect(x,y,width,height);
}

Mat2.prototype.pointIsInBox = function(xx,yy,tolerance) {
		var boxX = this.x + this.width;
		var boxY = this.y + this.height;
		return ( (xx > (this.x+tolerance) && xx < (boxX-tolerance)) && (yy > (this.y+tolerance) && yy < (boxY-tolerance))) ;
}


