
/*
 * x - the x location of center of circle
 * y - the y location of center of circle
 * radius - radius of circle
 * callback - the function called when the draggable to drop at a point
 * moveToAllowed - the function called to check whether a move is permitted
 */
function DraggableCircle(paper, x, y, radius, callback, moveToAllowed){
	var that = this;
	var DEFAULT_OPACITY = 1;
	var shape = paper.circle(x , y, radius);
	shape.attr({fill: "rgb(0,0,255)",opacity: DEFAULT_OPACITY});
	shape.drag(move,start, localUp);
	
	var startPoint;
	
	// Hack Alert:
	// Currently there is a bug in Raphael 1.5.2 on Chrome where shape.undrag(undefinedVar) does not
	// work - get an expection  "Uncaught ReferenceError: undefinedVar is not defined" and nothing after that 
	// line is executed. Until this is fixed use a  flag dragEnabled that keeps track of whether drag is
	// permitted and check this flag every time in the start(), move() and up() method. Once the bug is fixed
	// use the undrag() method as currently shown commented in setDragEnabled(flag)
	this.dragEnabled = true;

	this.setDragEnabled = function(flag) {
		this.dragEnabled = flag;
		// this.shape.undrag(undefinedVar); //<-- revisit since once bug described above is fixed
	}
	
	
	this.setEnabled = function(flag) {
		
		var opacity = flag ? 1: 0.3;
		shape.attr({opacity:opacity});
		this.setDragEnabled(flag);
		
	}
	
	function start() {
		if (that.dragEnabled) {
			startPoint = getCenterPoint();
		}
	}
	
	function getCenterPoint() {
		return new Point(shape.attr('cx'), shape.attr('cy'));
	}
	
	function move(dx,dy) {
		if (that.dragEnabled) {
			if (moveToAllowed != undefined && !moveToAllowed(that, startPoint.x + dx, startPoint.y + dy)) {
				console.log("move disallowed");
			}
			else {
				that.moveTo(startPoint.x + dx, startPoint.y + dy);
			}
		}
	}
	
	function localUp() {
		if (that.dragEnabled) {
			var droppedPoint = getCenterPoint();			
			callback(that, droppedPoint.x, droppedPoint.y);
		}				
	}
	
	this.setColor = function(color) {
		shape.attr({fill: color});
	}
	
	this.setVisible = function(flag) {
		flag ? shape.show() : shape.hide();
	}
	
	this.moveTo = function(x,y) {
		shape.attr({cx: x, cy: y});
		shape.toFront();
	}
	
	this.getShape = function() {
		return shape;
	}
	
	/*
	 * Gets the postion of the circle at the start of the drag
	 */
	this.getStartPoint = function() {
		return startPoint;
	}	
}

function DraggableUCube(paper, x,y,width, height, connectorWidth, connectorHeight, supportsJoins, otherCubes,callback,moveToAllowed){
	var that = this;
	var DEFAULT_OPACITY = 1;
	
	var offset = (width - connectorWidth)/2;
	var pathArray = ['M', x, y , 'l', width,0, 0,height,-width,0, 0,-height, 
					'M' , (x+offset),y , 'l',0, -connectorHeight, connectorWidth,0, 0,connectorHeight];
	var pathStr = 	pathArray.join(' ');
	
	var shape = paper.path(pathStr);
	shape.attr({fill: "rgb(0,0,255)",opacity: DEFAULT_OPACITY});
	shape.drag(move,start, localUp);
	console.log(shape);
	
	this.ox = x;
	this.oy = y;
	
	var actualX = x;
	var actualY = y;
	
	
	var startPoint;
	
	// Hack Alert:
	// Currently there is a bug in Raphael 1.5.2 on Chrome where shape.undrag(undefinedVar) does not
	// work - get an exception  "Uncaught ReferenceError: undefinedVar is not defined" and nothing after that 
	// line is executed. Until this is fixed use a  flag dragEnabled that keeps track of whether drag is
	// permitted and check this flag every time in the start(), move() and up() method. Once the bug is fixed
	// use the undrag() method as currently shown commented in setDragEnabled(flag)
	this.dragEnabled = true;

	this.setDragEnabled = function(flag) {
		this.dragEnabled = flag;
		// this.shape.undrag(undefinedVar); //<-- revisit since once bug described above is fixed
	}
	
	
	this.setEnabled = function(flag) {		
		var opacity = flag ? 1: 0.3;
		shape.attr({opacity:opacity});
		this.setDragEnabled(flag);		
	}
	
	function start(x,y,event) {
		if (that.dragEnabled) {
			//console.log("started at " + x + "," +y + event);
			startPoint = getCenterPoint();
			that.ox = 0;
			that.oy =0;
		}
	}
	
	function getCenterPoint() {
		return new Point(x+width/2,y+width/2);
	}
	
	function move(dx,dy) {
		if (that.dragEnabled) {
			
			if (typeof(moveToAllowed) !== 'undefined' && !moveToAllowed(that, startPoint.x + dx, startPoint.y + dy)) {
				console.log("move disallowed");
			}
			else {
				if( supportsJoins()) {
					if( that.next != null) {
						that.next.previous = null;
						that.next = null;
						
					}
					if( that.previous != null) {
						that.previous.next = null;
						that.previous = null;
					}
				}
				
				var transX = dx - that.ox;
				var transY = dy - that.oy;
				shape.translate(transX,transY);
				that.ox = dx;
				that.oy = dy;
				actualX = x + dx;
				actualY = y + dy;
				//console.log("ox = " + that.ox + ", oy = " + that.oy +";  dx = " + dx + "; dy = "+ dy + " actualX = " + actualX + "; actualY = " + actualY);
				shape.toFront();
			}
		}
	}
	
	function supportsJoins() {
		return typeof(supportsJoins) !== 'undefined';
	}
	

	
	function localUp() {
		if (that.dragEnabled) {			
			if (supportsJoins() && otherCubes.length > 1) {
				// Check if lock is possible with other cubes
				for (var i = 0; i < otherCubes.length; i++) {
					//console.log("cube : " + i);
					if (otherCubes[i] == that) 
						continue;
					if (that.overlaps(otherCubes[i])) {
						//console.log("ov");
						
						if (otherCubes[i].previous == null) {						
							that.joinToTop(otherCubes[i],postUp);
							break;
						}
						else 
							if (otherCubes[i].next == null) {						
								that.joinToBase(otherCubes[i],postUp);
								break;
							}
							else {
								console.log("there is already a cube in position");
							}
						
					}
					else {
						//console.log("no OV");						
						x = actualX;
						y = actualY;
						postUp();
					}
						
				}
			}
			else {
				x = actualX;
				y = actualY;
				postUp();				
			}
			
			
			
		}				
	}
	
	function postUp() {
		var droppedPoint = getCenterPoint();			
		// Tip: to check if a passed in function parameter
		// callback !== undefined does not work in this case 
		if (typeof(callback) !== 'undefined') {			
			callback(that, droppedPoint.x, droppedPoint.y);
		}
	}
	
	this.setColor = function(color) {
		shape.attr({fill: color});
	}
	
	this.setVisible = function(flag) {
		flag ? shape.show() : shape.hide();
	}
	

	this.moveTo = function(xx,yy) {
		//console.log("At x: " + actualX + "; y:"+ actualY + " Move to xx: " + xx + "; yy: " + yy);
		shape.translate(xx-actualX,yy-actualY);
		x = actualX = xx;
		y = actualY = yy;
		shape.toFront();
	}
	
	this.getShape = function() {
		return shape;
	}
	
	/*
	 * Gets the position of the draggable at the start of the drag
	 */
	this.getStartPoint = function() {
		return startPoint;
	}	
	
	
	// Following methods do not necessarily belong to the Draggable interface, but 
	// support the functionality associated with joining cubes
	
	/*
	 * Returns the point at which another cube can attach itself at the  upper edger of this
	 * cube. This is 2 pixels above the (left,top) of the rectangular portion of the cube
	 */
	this.getUpperJoinPoint = function() {
		return new Point(actualX,actualY-2);
	}
	
	/*
	 * Returns the point at which another cube can attach itself at the lower edger of this
	 * cube. This is 2 pixels below the (left,bottom) of the rectangular portion of the cube
	 * 
	 */
	this.getLowerJoinPoint = function() {
		return new Point(actualX,actualY+height+2);
	}

	/*
	 * Joins this cube to specified cube's top
	 */
	this.joinToTop = function(cube,postUp) {
		if (cube instanceof DraggableUCube) {
			
			
			var jp = cube.getUpperJoinPoint();			
			var s = (jp.x-actualX) + ", " + ((jp.y - height)-actualY);
			shape.animate({translation:s},200, function() {
				// If attaching to top then the attached cube should be in front
				shape.toFront();
				x = actualX = jp.x ;
				y = actualY = jp.y-height;
				
				// Create the  link between the cubes
				cube.previous = that;
				that.next = cube;
				
				if(typeof(postUp) !== 'undefined') {
					postUp();
				}
			});
		}
	}
	
	/*
	 * Joins this cube to specified cube's base
	 */
	this.joinToBase = function(cube,postUp) {
		if (cube instanceof DraggableUCube) {
			
			
			var jp = cube.getLowerJoinPoint();			
			var s = (jp.x-actualX) + ", " + (jp.y -actualY);
			shape.animate({translation:s},200, function() {
				// If attaching to bottom then the attached cube should be at the back
				shape.toBack();
				x = actualX = jp.x ;
				y = actualY = jp.y;
				
				// Create the  link between the cubes
				cube.next = that;
				that.previous = cube;
				
				if(typeof(postUp) !== 'undefined') {
					postUp();
				}
			});
		}
	}
	
	
	
	this.pointIsInBox = function(pointX, pointY) {
		//console.log("Checking if ("+ pointX +"," + pointY +") is inside (" + actualX + "," + actualY  + "," + (actualX+width) +"," + (actualY+height));
		return PRASAD.graphics.pointIsInRect(pointX,pointY, actualX, actualY, actualX + width, actualY+height);
	}
	
	this.overlaps = function(cube){
		if (cube instanceof DraggableUCube) {
			var px = actualX;
			var py = actualY;			
			var inside = cube.pointIsInBox(actualX,actualY);
			if( inside) {
				return true;
			}
			inside = cube.pointIsInBox(actualX+width,actualY);
			if( inside) {
				return true;
			}
			inside = cube.pointIsInBox(actualX+width,actualY+height);
			if( inside) {
				return true;
			}
			inside = cube.pointIsInBox(actualX,actualY+height);
			//console.log("inside = " + inside);
			if( inside) {			
				return true;
			}			
			return false;
		}	
	}
}