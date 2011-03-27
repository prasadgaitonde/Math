
function DraggableCube(spec,my) {
	var that = {};
	var my = my || {};
	my.id = spec.identifier;
	my.move = move;
	my.start = start;
	my.hasMovedSinceDragStart = hasMovedSinceDragStart;
	//my.up = up;
	var paper = spec.paper,
		width = spec.width,
		height = spec.height,
		connectorWidth = spec.connectorWidth,
		connectorHeight = spec.connectorHeight,	
		callback = spec.callback,
		moveToAllowed = spec.moveToAllowed,
		id = spec.id;
	
	var DEFAULT_OPACITY = 1;
	
	var offset = (width - connectorWidth)/2;
	var pathArray = ['M', spec.x, spec.y , 'l', width,0, 0,height,-width,0, 0,-height, 
					'M' , (spec.x+offset),spec.y , 'l',0, -connectorHeight, connectorWidth,0, 0,connectorHeight];
	var pathStr = 	pathArray.join(' ');
	
	var shape = paper.path(pathStr);
	
	shape.attr({fill: "rgb(255,255,255)",opacity: DEFAULT_OPACITY});
	
	//console.log(shape);
	
	var ox = spec.x;
	var oy = spec.y;
	
	//var actualX = spec.x;
	//var actualY = spec.y;
	
	var tempX = spec.x;
	var tempY = spec.y;
		
	var startPoint;
	
	var dragEnabled = true;
	my.dragEnabled = dragEnabled;
	
	function start(x,y,event) {
		console.log("(B)start " + x + "," + y);
		//if (dragEnabled) {
			startPoint = getCenterPoint();
			ox = 0;
			oy =0;
			tempX = spec.x;
			tempY = spec.y;
		//}
	}
	
	/*
	 * Determines whether the cube has moved since the start of the drag
	 */
	function hasMovedSinceDragStart() {
		return !(ox == 0 && oy == 0);
	}
	
	function move(dx,dy) {
		if (dragEnabled) {
			//console.log("(B)move");
			if (typeof(moveToAllowed) !== 'undefined' && !moveToAllowed(that, startPoint.x + dx, startPoint.y + dy)) {
				console.log("move disallowed");
			}
			else {						
				var transX = dx - ox;
				var transY = dy - oy;
				shape.translate(transX,transY);
				ox = dx;
				oy = dy;
				spec.x = tempX + dx;
				spec.y = tempY + dy;
				shape.toFront();				
			}
		}
	}
	
	function up() {
		if (dragEnabled) {
			if (hasMovedSinceDragStart()) {
				console.log("no movement since start of drag");
				return;
			}
			console.log("(B)final location (top,left) = (" +spec.x + "," + spec.y+")" );
			postUp();			
		}				
	}
	
	function postUp() {
		that.callback();	
	}
	
	function getCenterPoint() {
		//return new Point(spec.x+width/2,spec.y+width/2);
		return new Point(spec.x,spec.y);
	}
	
	that.activateDrag = function() {
		shape.drag(move,start,up);
	}

	that.callback = function() {		
		//console.log("(B)callback");			
		if (typeof(spec.callback) !== 'undefined') {		
			var droppedPoint = getCenterPoint();	
			spec.callback(that, droppedPoint.x, droppedPoint.y);
		}
	}
	
	that.setDragEnabled = function(flag) {
		dragEnabled = flag;
		// this.shape.undrag(undefinedVar); //<-- revisit since once bug described above is fixed
	}
	
	that.setEnabled = function(flag) {		
		var opacity = flag ? 1: 0.3;
		shape.attr({opacity:opacity});
		that.setDragEnabled(flag);		
	}
		
	that.setColor = function(color) {
		shape.attr({fill: color});
	}
	
	that.setVisible = function(flag) {
		flag ? shape.show() : shape.hide();
	}
	
	that.moveTo = function(xx,yy) {
		shape.translate(xx-spec.x,yy-spec.y);
		spec.x = xx;
		spec.y = yy;
		shape.toFront();
	}
	
	that.getShape = function() {
		return shape;
	}
	
	/*
	 * Gets the position of the draggable at the start of the drag
	 */
	that.getStartPoint = function() {
		return startPoint;
	}	
	
	that.getId = function() {
		return spec.identifier;
	}
	
	return that;
}

//**************************************************************
function DraggableAndJoinableCube(spec) {
	var my = {};
	var that = DraggableCube(spec,my);
	var shape = that.getShape();
	var superCallback = that.superior('callback');
	var superMoveTo = that.superior('moveTo');
	/*
	try {
		that.getShape().undrag(fff);
	}
	catch(e) {
		console.log("MSG:" + e.message);
	}
	*/
	
	
	//that.getShape().drag(my.move,my.start,ups);
	var otherCubes = spec.otherCubes;
	
	/*
	var prevConnector = spec.paper.circle(spec.x+spec.width/2,spec.y,6).attr({fill:'red',opacity:0.1});
	
	var nextConnector = spec.paper.circle(spec.x+spec.width/2,spec.y+spec.height,6).attr({fill:'blue',opacity:0.1});
	var connectorSet = spec.paper.set(prevConnector, nextConnector);
	*/
	
	that.nextCube = null;
	that.previousCube = null;
	
	function showConnector(connector, flag) {
		connector.attr({opacity: flag ? 1 : 0.1});
		if(flag) {
			connector.toFront();
		}
	}
	
	function printCubes() {
		for ( var i=0; i < spec.otherCubes.length; i += 1) {
			var cube = spec.otherCubes[i];
			console.log(cube.getId() + 
					": Prev = " + (cube.previousCube ? cube.previousCube.getId():"<nil>") 
					+ ", Next = " + (cube.nextCube ? cube.nextCube.getId():"<nil>"));
		}
	}
	/*
	var connector;
	shape.node.onmouseout1 = function(event){
		if( connector !== undefined) {
				// Hack: Have seen cases occasional where more than one connector are active
				connector.remove();
		}
	}
	*/
	shape.node.onmousemove = function(event) {
		var connector;
		// The offset within which if we approach the edge of the cube, the delink glyph is displayed
		// is a function of height of the cube
		var OFFSET =  spec.height/10; 
		var TRANSLATE = spec.connectorHeight+3;
		if (!that.isTopEdgeFree() && Math.abs(event.offsetY - spec.y) < OFFSET) {
			//console.log("mm up");
			
			if( connector !== undefined) {
				// Hack: Have seen cases occasional where more than one connector are active
				connector.remove();
			}
			
			connector = spec.paper.rect(spec.x, spec.y-OFFSET,spec.width,2 * OFFSET).attr({fill:'red',opacity:0.5});
			connector.node.onmouseout = function() {
				connector.remove();
			}
			connector.node.onclick = function() {
				
				var prevInLink = that.previousCube ;
				while( prevInLink != null) {	
					//console.log("Next: " + nextInLink.getId());					
					prevInLink.animateTranslation(0,-1 * TRANSLATE);
					prevInLink = prevInLink.previousCube;
				}
				if (that.previousCube != null) {
					//that.previousCube.unlinkNextCube();
					that.unlinkPreviousCube();
				}						
				connector.remove();
			}
		}
		else 
		if (!that.isBaseEdgeFree() && Math.abs(event.offsetY - (spec.y+spec.height)) < OFFSET) {
			
			if( connector !== undefined) {
				// Hack: Have seen cases ocassionally where more than one connector are active
				connector.remove();
			}
			
			
			connector = spec.paper.rect(spec.x, spec.y+spec.height-OFFSET,spec.width,2 * OFFSET).attr({fill:'red',opacity:0.5});
			connector.node.onmouseout = function() {
				connector.remove();
			}
			connector.node.onclick = function(){
				var nextInLink = that.nextCube;
				while (nextInLink != null) {
					nextInLink.animateTranslation(0, 1 * TRANSLATE);
					nextInLink = nextInLink.nextCube;
				}
				if (that.nextCube != null) {
					//that.nextCube.unlinkPreviousCube();
					that.unlinkNextCube();
				}
				connector.remove();
			}
		}
		
	};
	
	function printLink() {
		printCubes();
	}
	
	var nextConnector;
	
	that.moveTo = function(x,y) {
		//that.nextCube = null;
		//that.previousCube = null;
		
		superMoveTo(x,y);
	};
	
	that.createConnectorToNext = function(nxtCube) {
		/*
		//console.log("next conn");		
		nextConnector = spec.paper.circle(spec.x+spec.width/2,spec.y+spec.height,6).attr({fill:'red',opacity:0.1});
		nextConnector.node.onmousemove = function() {
			if (that.nextCube != null) {
				showConnector(nextConnector,true);
			}
		}
		nextConnector.node.onmouseout = function() {
			showConnector(nextConnector,false);
		}
		
		nextConnector.node.onclick = function() {
			//console.log("next click");
			var nextInLink = that.nextCube ;
			//console.log("Starting with: " + nextInLink.getId());
			while( nextInLink != null) {	
				//console.log("Next: " + nextInLink.getId());					
				nextInLink.animateTranslation(0,15);
				nextInLink = nextInLink.nextCube;
			}
			if (that.nextCube != null) {
				that.nextCube.unlinkPreviousCube();
				that.unlinkNextCube();
			}		
		}
		*/
		
	};
		
	function moveConnectors() {
		/*
		if (nextConnector !== undefined) {
			nextConnector.toFront();
			nextConnector.attr({
				cx: spec.x + spec.width / 2,
				cy: spec.y + spec.height
			});
		}
		*/
		
		/*
		prevConnector.toFront();
		prevConnector.attr({
					cx: spec.x + spec.width / 2,
					cy: spec.y
		});
		*/
	}
	
	function _postUp() {
		moveConnectors();
		//console.log("(D.)final location (top,left) = (" +spec.x + "," + spec.y+")" );
		superCallback();
	}
	
	function ups() {
		if (my.dragEnabled) {
			//console.log("(D) final location (top,left) = (" +spec.x + "," + spec.y+")" );
			if (!my.hasMovedSinceDragStart()) {
				console.log("no drag");
				return;
			}
			var potentialLink = getLinkCube();
			if (potentialLink == null) {
				_postUp();
			}
			else {
				console.log();
				if (potentialLink.isTopEdgeFree()) {
					//console.log(that.getId() + " has a potential link with top edge of " + potentialLink.getId());
					that.joinToTop(potentialLink, _postUp);
				}
				else {
					// Bottom edge is free
					//console.log(that.getId() + " has a potential link with bottom edge of " + potentialLink.getId() );
					that.joinToBase(potentialLink, _postUp);
				}
			}
		}	
	}
	
	that.up = ups;
	that.move= move;
	that.start = start;
	//console.log(that.up)
	
	function move(dx,dy) {
		/*
		if( that.previousCube != null) {
			that.previousCube.move(dx,dy);
			that.previousCube.getShape().toBack();
		}
		*/
		my.move(dx,dy);
		
		/*
		if( that.nextCube != null) {
			that.nextCube.move(dx,dy);
		}
		*/
	}
	
	function start(x,y,event) {
		if( that.previousCube != null) {
			that.previousCube.start(x,y,event);
		}

		my.start(x,y,event);
	}

	
	that.activateDrag = function() {
		shape.drag(move,start,ups);
	};
	
	that.animateTranslation = function(deltaX,deltaY) {
		//console.log("animating id : " + that.getId());
		var animStr = deltaX +","+ deltaY;
		var tempX = spec.x;
		var tempY = spec.y;
		shape.animate({translation:animStr},200, function() {
			spec.x = tempX + deltaX ;
			spec.y = tempY + deltaY;
			// If deltaY is negative than you are translation in the upward direction
			// Each successive cube should appear in front of the previous one
			// If deltaY is positive than you are translation in the downwards
			// Each successive cube should appear behind the previous one
			
			
			if (deltaY < 0) {
				shape.toFront();
			}
			else {
				shape.toBack();
			}
			moveConnectors();
		});
	};
	
	/*
	 * Gets the cube to which this cube can be linked to, if any
	 * Returns null if no such cube exists
	 */
	function getLinkCube() {
		var bothEdgesEngaged =  (that.nextCube != null && that.previousCube != null);
		if( bothEdgesEngaged) return null;
		for (var i = 0; i < spec.otherCubes.length; i++) {
			var otherCube = spec.otherCubes[i];
			if (otherCube == that) {
				// exclude yourself
				continue;
			}
			if( otherCube.areBothEdgesEngaged()) {
				continue;
			}
			if (overlaps(otherCube)) {
				if (otherCube.isTopEdgeFree()) {
					//console.log(that.getId() + " overlaps " + otherCube.getId() + " at top");
					return otherCube;
				}
				else 
					if (otherCube.isBaseEdgeFree()) {
						//console.log(that.getId() + " overlaps " + otherCube.getId() + " at base");
						return otherCube;
					}
					else {
						
						return null;
					}
			}
			/*
			else {
				//console.log(that.getId() + "  does not overlap " + otherCube.getId());
			}
			*/
		}
		return null;
	}
	
	
	function overlaps(cube) {
		var inside = cube.pointIsInBox(spec.x, spec.y);
		if( !inside) {
			inside = cube.pointIsInBox(spec.x + spec.width, spec.y);
			if( !inside) {
				inside = cube.pointIsInBox(spec.x+ spec.width,spec.y+spec.height);
				if (!inside) {						
					inside = cube.pointIsInBox(spec.x, spec.y + spec.height);						
				}
			}
		}
		return inside;
	}
	
	
	
	/*
	// Uses memoization
	var overlaps = (function() {
		var memo = {};
		
		var _overlaps = function(cube){		
			var result = memo[cube];
			if( typeof result != 'boolean') {
				var inside = cube.pointIsInBox(spec.x, spec.y);
				if( !inside) {
					inside = cube.pointIsInBox(spec.x + spec.width, spec.y);
					if( !inside) {
						inside = cube.pointIsInBox(spec.x+ spec.width,spec.y+spec.height);
						if (!inside) {						
							inside = cube.pointIsInBox(spec.x, spec.y + spec.height);						
						}
					}
				}
				//result = memo[cube] = inside;
			}
			return result;
		};
		return _overlaps;
	}());
	*/
	
	that.areBothEdgesEngaged = function() {
		return !that.isTopEdgeFree() && !that.isBaseEdgeFree();
	}
	
	that.isTopEdgeFree = function() {
		return that.previousCube == null;
	}
	
	that.isBaseEdgeFree = function() {
		return that.nextCube == null;
	}
	
	/*
	 * Returns the point at which another cube can attach itself at the  upper edger of this
	 * cube. This is 2 pixels above the (left,top) of the rectangular portion of the cube
	 */
	that.getUpperJoinPoint = function() {
		return new Point(spec.x,spec.y-0);
	}
	
	/*
	 * Returns the point at which another cube can attach itself at the lower edger of this
	 * cube. This is 2 pixels below the (left,bottom) of the rectangular portion of the cube
	 * 
	 */
	that.getLowerJoinPoint = function() {
		return new Point(spec.x,spec.y+spec.height+0);
	}
	
	/*
	 * Joins this cube to specified cube's top
	 */
	that.joinToTop = function(cube,postUp) {
					
		var jp = cube.getUpperJoinPoint();			
		var s = (jp.x-spec.x) + ", " + ((jp.y - spec.height)-spec.y);
		var shape = that.getShape();
		shape.animate({translation:s},200, function() {
			// If attaching to top then the attached cube should be in front
			shape.toFront();
			spec.x = jp.x ;
			spec.y = jp.y- spec.height;
			
			// Create the  link between the cubes
			//cube.linkPreviousCube(that);
			that.linkNextCube(cube);
			
			//that.createConnectorToNext(cube);
			
			if(typeof(postUp) !== 'undefined') {
				postUp();
			}
			//printLink();
		});
		
	}
	
	/*
	 * Joins this cube to specified cube's base
	 */
	that.joinToBase = function(cube,postUp) {
						
			var jp = cube.getLowerJoinPoint();			
			var s = (jp.x-spec.x) + ", " + (jp.y - spec.y);
			var shape = that.getShape();
			shape.animate({translation:s},200, function() {
				// If attaching to bottom then the attached cube should be at the back
				shape.toBack();
				spec.x  = jp.x ;
				spec.y  = jp.y;
				
				// Create the  link between the cubes
				cube.linkNextCube(that);
				//that.linkPreviousCube(cube);
				//cube.createConnectorToNext(that);
				if(typeof(postUp) !== 'undefined') {
					postUp();
				}
				//printLink();
			});
			
	}
	
	function checkDragEnability(cube1,cube2) {
		
		if (cube1 != null) {
			if (cube1.nextCube == null && cube1.previousCube == null) {
				cube1.setDragEnabled(true);
			}
			else {
				cube1.setDragEnabled(false); // false
			}
		}
		if( cube2 != null) {
			if (cube2.nextCube == null && cube2.previousCube == null) {
				cube2.setDragEnabled(true);
			}
			else {
				cube2.setDragEnabled(false); // false
			}
		}
		
	}
	
	that.linkNextCube = function(ntCube) {
		//console.log("Linking next cube of " + that.getId() + " to " + ntCube.getId());
		that.nextCube = ntCube;	
		ntCube.previousCube = that;			
		checkDragEnability(that,that.nextCube);
	}
	
	that.unlinkNextCube = function() {		
		that.nextCube.previousCube = null;
		var temp = 	that.nextCube;	
		that.nextCube = null;	
		checkDragEnability(that,temp);	
	}
	
	that.linkPreviousCube = function(prevCube) {
		//console.log("Linking previous cube of " + that.getId() + " to " + prevCube.getId());
		//console.log("setting previous cube of : " + that.getId() + " to " + prevCube.getId());
		that.previousCube = prevCube;
		prevCube.nextCube = that;
		checkDragEnability(that,that.previousCube);
	}
	
	that.unlinkPreviousCube = function() {		
		that.previousCube.nextCube = null;
		var temp = 	that.previousCube;	
		that.previousCube = null;	
		checkDragEnability(that,temp);	
	}
	
	that.pointIsInBox = function(pointX, pointY) {
		//console.log("Checking if ("+ pointX +"," + pointY +") is inside (" + spec.x + "," + spec.y  + "," + (spec.x+spec.width) +"," + (spec.y+spec.height)+")");
		return PRASAD.graphics.pointIsInRect(pointX,pointY, spec.x, spec.y, spec.x + spec.width, spec.y+spec.height);
	}
	return that;	
}

function SelectableCircle(spec) {
	var that = {};
	var shape = spec.paper.circle(spec.cx, spec.cy,spec.radius).attr({fill:spec.color||'white'});
	var outline;
	var selected = false;
	
	that.toggleSelection = function() {
		selected = !selected;
		//that.drawOutline();		
	}
	
	shape.node.onclick = function() {
		that.toggleSelection();
		that.drawOutline();	
	}
	
	var updateOutline = function() {
		if(selected ) {
			if (outline == undefined ) {
				outline = spec.paper.circle(spec.cx, spec.cy, spec.radius + 5).attr({
					stroke: '#B1FB17',
					'stroke-dasharray': '- '
				});
			}
			else {
				console.log("Don't know how this is possible, outline=" + outline);
			}
		}
		else {
			outline.remove();
			outline = null;
		}
	}
	
	that.drawOutline = function() {
		updateOutline();
	}
	
	that.animateTo = function(cx,cy) {
		shape.toFront();
		shape.animate({cx:cx,cy:cy},500, function() {
			//circle.attr({cx:cx,cy:cy});
			spec.cx = cx;
			spec.cy = cy;
			});
	}
	
	that.moveTo = function(cx,cy) {
		shape.toFront();
		shape.attr({cx:cx,cy:cy});
		spec.cx = cx;
		spec.cy = cy;
	}
		
	that.removeOutline = function() {
		selected = false;
		outline.remove();
		outline = null;
	}
	
	that.isSelected = function() {
		return selected;
	}
	
	return that;
};

function Cube(spec, my) {
	var that = {};
	
	var off = spec.width/5;
	spec.connectorWidth  = spec.width - 2 * off,			
	spec.connectorHeight = spec.height/5,
	
	that.width= spec.width;
	that.height = spec.height;
	var my = my || {};
	
	var DEFAULT_OPACITY = 1;
	
	var shape = getShape();
	var enabled = true;
	
	
	function getShape() {
		if( shape === undefined) {	
			var offset = (spec.width - spec.connectorWidth) / 2;
			var pathArray = ['M', spec.x, spec.y, 
								'l', spec.width, 0, 
								0, spec.height, 
								-spec.width, 0, 
								0, -spec.height, 
								'M', (spec.x + offset), spec.y, 
								'l', 0, -spec.connectorHeight, 
								spec.connectorWidth, 0, 
								0, spec.connectorHeight];
			var pathStr = pathArray.join(' ');
			
			shape = spec.paper.path(pathStr);
			
			shape.attr({
				fill: spec.color || "rgb(255,255,255)",
				opacity: DEFAULT_OPACITY
			});
		}
		return shape;
	};
	
	that.isEnabled = function() {
		return enabled;
	}
	
	that.setEnabled = function(flag) {
		enabled = flag;		
		var opacity = flag ? 1: 0.3;
		shape.attr({opacity:opacity});
	};
	
	that.getShape = function() {
		return shape;
	};
	
	that.moveTo = function(xx,yy) {
		shape.translate(xx-spec.x,yy-spec.y);
		spec.x = xx;
		spec.y = yy;
		shape.toFront();
		that.removeLabel();
	};
	
	that.animateTo = function(xx,yy) {		
		shape.toFront();
		
		var deltaX = xx- spec.x;
		var deltaY = yy - spec.y;
		
		var animStr = deltaX +","+ deltaY;
		var tempX = spec.x;
		var tempY = spec.y;
		shape.animate({translation:animStr},500, function() {
			spec.x = xx;
			spec.y = yy;	
		});
	};
	
	that.setVisible = function(flag) {
		if(flag) {
			shape.show();
		}
		else {
			shape.hide();
		}
	}
	
	return that;
	
}

function SelectableCube(spec,my) {
	var that = Cube(spec,my);
	
	var my = my || {};
	var outline;
	var selected = false;			
	var CUBE_OUTLINE_COLOR = '#FDD017';
	
	that.toggleSelection = function() {
		//console.log("select : changing " + selected + " to " + !selected);
		selected = !selected;		
	}
	
	that.select = function(flag) {
		selected = flag;
	}
		
	that.getShape().node.onclick = function() {
		// Only if enabled
		if (isEnabled()) {
			that.toggleSelection();
			that.drawOutline();
		}
	}
	
	that.createOutline = function() {
		var ot =  //spec.paper.rect(spec.x-5, spec.y-spec.connectorHeight-5, spec.width+10,spec.height+spec.connectorHeight+10).attr({
		spec.paper.rect(spec.x-5, spec.y-spec.connectorHeight-5, spec.width+10,spec.height+spec.connectorHeight+5).attr({
					stroke:'none',
					//'stroke-dasharray': '- '
					fill:CUBE_OUTLINE_COLOR
				});
		ot.insertBefore(shape);
		return ot;
	}
	
	that.drawOutline = function() {
		if(selected ) {
			if (outline == undefined ) {
				outline = that.createOutline();
				//outline.toBack();
			}
			else {
				console.log("Don't know how this is possible, outline=" + outline);
			}
		}
		else {
			if (outline != null) {
				outline.remove();
			}
			outline = null;
		}
	}
	
	that.isSelected = function() {
		return selected;
	};
	
	that.removeOutline = function() {
		selected = false;
		outline.remove();
		outline = null;
	};
	
	that.label = function(label) {
		that.cubeLabel = spec.paper.text(spec.x+spec.width/2, spec.y+spec.height/2,label).attr({'font-size':spec.height});
		that.cubeLabel.insertBefore(shape);
	}
	
	return that;
	
};

/*
function SCube(spec,my) {
	var that = {};
	that.width= spec.width;
	that.height = spec.height;
	var my = my || {};
	var outline;
	var selected = false;	
	
	var DEFAULT_OPACITY = 1;
	
	var shape = getShape();
	var enabled = true;
	//my.shape = shape;
	var CUBE_OUTLINE_COLOR = '#FDD017';

	
	function getShape() {
		if( shape === undefined) {	
			var offset = (spec.width - spec.connectorWidth) / 2;
			var pathArray = ['M', spec.x, spec.y, 
								'l', spec.width, 0, 
								0, spec.height, 
								-spec.width, 0, 
								0, -spec.height, 
								'M', (spec.x + offset), spec.y, 
								'l', 0, -spec.connectorHeight, 
								spec.connectorWidth, 0, 
								0, spec.connectorHeight];
			var pathStr = pathArray.join(' ');
			
			shape = spec.paper.path(pathStr);
			
			shape.attr({
				fill: spec.color || "rgb(255,255,255)",
				opacity: DEFAULT_OPACITY
			});
		}
		return shape;
	};
	
	that.isEnabled = function() {
		return enabled;
	}
	
	that.setEnabled = function(flag) {
		enabled = flag;		
		var opacity = flag ? 1: 0.3;
		shape.attr({opacity:opacity});
	};
	
	that.toggleSelection = function() {
		console.log("select : changing " + selected + " to " + !selected);
		selected = !selected;
		//that.drawOutline();		
	}
	
	that.getShape = function() {
		return shape;
	}
	
	that.select = function(flag) {
		selected = flag;
	}
	
	
	shape.node.onclick = function() {
		// Only if enabled
		if (isEnabled()) {
			that.toggleSelection();
			that.drawOutline();
		}
	}
	
	that.createOutline = function() {
		var ot =  //spec.paper.rect(spec.x-5, spec.y-spec.connectorHeight-5, spec.width+10,spec.height+spec.connectorHeight+10).attr({
		spec.paper.rect(spec.x-5, spec.y-spec.connectorHeight-5, spec.width+10,spec.height+spec.connectorHeight+5).attr({
					stroke:'none',
					//'stroke-dasharray': '- '
					fill:CUBE_OUTLINE_COLOR
				});
		ot.insertBefore(shape);
		return ot;
	}
	
	that.drawOutline = function() {
		if(selected ) {
			if (outline == undefined ) {
				outline = that.createOutline();
				//outline.toBack();
			}
			else {
				console.log("Don't know how this is possible, outline=" + outline);
			}
		}
		else {
			if (outline != null) {
				outline.remove();
			}
			outline = null;
		}
	}
	
	that.moveTo = function(xx,yy) {
		shape.translate(xx-spec.x,yy-spec.y);
		spec.x = xx;
		spec.y = yy;
		shape.toFront();
		that.removeLabel();
	}
	
	that.animateTo = function(xx,yy) {		
		shape.toFront();
		
		var deltaX = xx- spec.x;
		var deltaY = yy - spec.y;
		
		var animStr = deltaX +","+ deltaY;
		var tempX = spec.x;
		var tempY = spec.y;
		shape.animate({translation:animStr},500, function() {
			spec.x = xx;
			spec.y = yy;	
		});
	};
	
	that.isSelected = function() {
		return selected;
	};
	
	that.removeOutline = function() {
		selected = false;
		outline.remove();
		outline = null;
	};
	
	that.setVisible = function(flag) {
		if(flag) {
			shape.show();
		}
		else {
			shape.hide();
		}
	}
	
	that.label = function(label) {
		that.cubeLabel = spec.paper.text(spec.x+spec.width/2, spec.y+spec.height/2,label).attr({'font-size':spec.height});
		that.cubeLabel.insertBefore(shape);
	}
	
	
	//that.label("1");
	return that;
	
};
*/
/*
 * options:
 * x
 * y
 * width
 * height
 * color
 * otherCubes
 * linkMgr
 * linkUpdateCallback (optional)- callback to be called when this cube is joined to or unjoined
 *                 from another cube
 */
function SJCube(spec){
	var my = my || {};
	var that = SelectableCube(spec,my);	
	var shape = that.getShape();
	var superMoveTo = that.superior('moveTo');
	var superAnimateTo = that.superior('animateTo');
	
	that.nextCube = null;
	that.previousCube = null;
	
	var CUBE_OUTLINE_COLOR = '#FDD017';
	
	function linkNext(nextCube) {
		that.nextCube = nextCube;
		nextCube.previousCube = that;
	}
	function delinkNext(nextCube){
		nextCube.previousCube = null;
		that.nextCube = null;
	}
	function linkPrevious(previousCube) {
		that.previousCube = previousCube;
		previousCube.nextCube = that;
	}
	function delinkPrevious(previousCube){
		previousCube.nextCube = null;
		that.previousCube = null;
	}
	
	function joinIfPossible() {
		if (!that.isSelected()) {
		
			if (that.previousCube == null) {
				var cubeToJoin = spec.linkMgr.getLastSelectedCube();
				if (cubeToJoin != null) {
					linkPrevious(cubeToJoin);
					spec.linkMgr.moveLastLinkTo(cubeToJoin, spec.x, spec.y - spec.height, spec.height);
					cubeToJoin.drawOutline();
					if (spec.linkUpdateCallback !== undefined) {
						spec.linkUpdateCallback();
					}
					return true;
				}
				
			}
			else {
				if (that.nextCube == null) {
					var cubeToJoin = spec.linkMgr.getFirstSelectedCube();
					if (cubeToJoin != null) {
						linkNext(cubeToJoin);
						spec.linkMgr.moveLinkTo(cubeToJoin, spec.x, spec.y + spec.height, spec.height);
						cubeToJoin.drawOutline();
						if (spec.linkUpdateCallback !== undefined) {
							spec.linkUpdateCallback();
						}
						return true;
					}
					
				}
			}			
		}
		return false;
	}
	
	var unlinkOptions = {
		active:false,
		cutBeforeThis: null,
		cutafterThis : null
	}
	
	function setUnlinkBeforeOptions(beforeWhat) {
		unlinkOptions.active = true;
		unlinkOptions.cutBeforeThis = beforeWhat;
		unlinkOptions.cutAfterThis = null;
	}
	
	function setUnlinkAfterOptions(afterWhat) {
		unlinkOptions.active = true;
		unlinkOptions.cutBeforeThis = null;
		unlinkOptions.cutAfterThis = afterWhat;
	}
	
	function noUnlinks() {
		unlinkOptions.active = false;
		unlinkOptions.cutBeforeThis = null;
		unlinkOptions.cutAfterThis = null;
	}
	
	shape.node.onmouseout = function(event){
		if(unlinkOptions.active) {
			noUnlinks();
		}
	}
	shape.node.onmousemove = function(event) {
		
		if( that.previousCube != null) {
			if (Math.abs(event.offsetY - spec.y) < 5) {
				shape.attr({cursor:'hand'});
				setUnlinkBeforeOptions(that);
				//deleteOptions.active = true;
				//deleteOptions.cutBeforeThis = that;
				//deleteOptions.cutAfterThis = null;
			}
			else {
				shape.attr({cursor:'default'})
				noUnlinks();
				//deleteOptions.active = false;
				//deleteOptions.cutBeforeThis = null;
				//deleteOptions.cutAfterThis = null;
			};
		}	
		
		if( that.nextCube != null) {
			if (Math.abs(event.offsetY - (spec.y+spec.height)) < 5) {
				shape.attr({cursor:'hand'});
				setUnlinkAfterOptions(that);
				//deleteOptions.active = true;
				//deleteOptions.cutBeforeThis = null;
				//deleteOptions.cutAfterThis = that;
			}
			else {
				shape.attr({cursor:'default'})
				noUnlinks();
				//deleteOptions.active = false;
				//deleteOptions.cutBeforeThis = null;
				//deleteOptions.cutAfterThis = null;
			};
		}		
	}
	
	

	shape.node.onclick = function(event) {
		if( that.isEnabled()) {
			
			if( unlinkOptions.active) {
				if (unlinkOptions.cutBeforeThis == that) {		
					delinkPrevious(that.previousCube);						
					spec.linkMgr.moveLinkTo(that,spec.x, spec.y + 10,spec.height);
					if( spec.linkUpdateCallback !== undefined) {
						spec.linkUpdateCallback();
					}										
				}
				else 
					if (unlinkOptions.cutAfterThis == that) {				
						delinkNext(that.nextCube);					
						spec.linkMgr.moveLastLinkTo(that,spec.x, spec.y - 10,spec.height);
						if( spec.linkUpdateCallback !== undefined) {
							spec.linkUpdateCallback();
						}					
					}
				noUnlinks();
				shape.attr({cursor:'default'})
				return;
			}
			if (isPartOfLink()) {
				if (!that.isSelected()) {
					if(joinIfPossible() ) {
						return true;
					}
				}
				var link = spec.linkMgr.getLink(that);
				for (var k = 0; k < link.length; k += 1) {
					link[k].toggleSelection();
					link[k].drawOutline();					
				}
			}
			else {
				if (!that.isSelected()) {
					if( joinIfPossible() ) {
						return true;
					}				
				}
				that.toggleSelection();
				that.drawOutline();	
			}
		}
	}
	
	that.moveTo = function(xx,yy) {
		if (isPartOfLink()) {
			var link = getLink();
			
			var startY = yy;
			for (var i = 0; i < link.length-1; i += 1) {
				console.log("y = " + startY);
				link[i].moveTo(xx,startY);
				startY += spec.height;
			}
			//var end = link[link.length-1];
		}
		else {
			superMoveTo(xx,yy);
		}		
	};
	
	that.createOutline = function(){
		var h1 = spec.y-spec.connectorHeight-5;
		var h2 = spec.height+spec.connectorHeight+10;
		
		if( that.previousCube != null) {
			h1 = spec.y-spec.connectorHeight-5;
		}
		if( that.nextCube != null) {
			h2 = spec.height+spec.connectorHeight;
		}
		var ot =  spec.paper.rect(spec.x-5, h1, spec.width+10,h2).attr({
					stroke:'none',
					//'stroke-dasharray': '- '
					fill:CUBE_OUTLINE_COLOR
				});
		ot.insertBefore(shape);
		return ot;
	}
	
	function isPartOfLink() {
		return that.previousCube != null || that.nextCube != null;
	}
	
	return that;
}

// ****************************************************************************************
/*
 * options:
 * x
 * y
 * width
 * height
 * color
 * otherCubes
 * linkMgr
 * linkUpdateCallback (optional)- callback to be called when this cube is joined to or unjoined
 *                 from another cube
 */
// Update: use SJCube instead - more user friendly join and separate visual operations
function SelectableAndJoinableCube(spec){
	var my = my || {};
	var that = SelectableCube(spec,my);	
	var shape = that.getShape();
	var superMoveTo = that.superior('moveTo');
	var superAnimateTo = that.superior('animateTo');
	
	that.nextCube = null;
	that.previousCube = null;
	
	var CUBE_OUTLINE_COLOR = '#FDD017';
	
	shape.node.onmousemove = function(event) {
		var  linkMarkerWidth = spec.connectorWidth/3;
		var marker ;
		var markerOpacity =1;
		var delinkMarker;
		
		function createLinkMarker(y) {
			/*
			var marker = spec.paper.rect(spec.x,y-5,spec.width,10).attr({
											fill: 'green',
											opacity: markerOpacity
											});;
											*/
			
			var marker = spec.paper.circle(spec.x + spec.width / 2, y, linkMarkerWidth).attr({
											fill: 'green',
											opacity: markerOpacity
											});
														
			setTimeout(function() {
					marker.remove();
					marker = undefined;
				},1000);											
			return marker;											
		}
		
		function createDelinkMarker(y) {
			var marker = spec.paper.circle(spec.x + spec.width / 2,y, linkMarkerWidth).attr({
											fill: 'red',
											opacity: markerOpacity
											});
			setTimeout(function(){
					marker.remove();
					marker = undefined;
				}, 1000);											
			return marker;
		}
		
		if (that.previousCube != null  && !that.isSelected() ) {			
			if ((Math.abs(event.offsetY- spec.y) < 5 && Math.abs(event.offsetX - (spec.x+spec.width/2)) < 5)  && delinkMarker == undefined) {
				delinkMarker = createDelinkMarker(spec.y);				
				delinkMarker.node.onclick = function(){					
					delinkPrevious(that.previousCube);						
					//that.previousCube.nextCube = null;
//					/that.previousCube = null;
					console.log("delink prev");
					spec.linkMgr.moveLinkTo(that,spec.x, spec.y + 10,spec.height);
					if( spec.linkUpdateCallback !== undefined) {
						spec.linkUpdateCallback();
					}														
				}	
				return;		
			}			
		}
		
		// If mouse is hovering near the top of a cube that is the first in the link 
		if( that.previousCube == null && !that.isSelected() && marker == undefined) {			
			var cubeToJoin = spec.linkMgr.getLastSelectedCube();
			if (cubeToJoin != null && event.offsetY == spec.y - spec.connectorHeight) {
				//console.log("on top edge");
				marker = createLinkMarker(event.offsetY);
				marker.node.onclick = function(){
					linkPrevious(cubeToJoin);
					spec.linkMgr.moveLastLinkTo(cubeToJoin,spec.x, spec.y - spec.height,spec.height);
					cubeToJoin.drawOutline();	
					if( spec.linkUpdateCallback !== undefined) {
						spec.linkUpdateCallback();
					}																									
				}
				return;
			}	
			
		}	
		
		if (that.nextCube != null  && !that.isSelected() ) {			
			if ((Math.abs(event.offsetY- (spec.y+spec.height)) < 5 && Math.abs(event.offsetX - (spec.x+spec.width/2)) < 5) && delinkMarker == undefined) {
				delinkMarker = createDelinkMarker(spec.y+spec.height);

				delinkMarker.node.onclick = function(){
					console.log("delink next");
					delinkNext(that.nextCube);					
					//that.nextCube.previousCube = null;
					//that.nextCube = null;
					spec.linkMgr.moveLastLinkTo(that,spec.x, spec.y - 10,spec.height);
					if( spec.linkUpdateCallback !== undefined) {
						spec.linkUpdateCallback();
					}					
				}
				return;
			}
		}
		
		// If mouse is hovering near the base of a cube that is the last in the link
		if( that.nextCube == null && !that.isSelected() && marker == undefined) {			
			var cubeToJoin = spec.linkMgr.getFirstSelectedCube();
			if (cubeToJoin != null && event.offsetY == spec.y+spec.height) {
				console.log("on bottom edge");
				marker = createLinkMarker(spec.y+spec.height);
				marker.node.onclick = function(){
					linkNext(cubeToJoin);
					spec.linkMgr.moveLinkTo(cubeToJoin,spec.x, spec.y+spec.height,spec.height);					
					cubeToJoin.drawOutline();
					if( spec.linkUpdateCallback !== undefined) {
						spec.linkUpdateCallback();
					}																				
				}
				return;
			}	
			
		}
	}
	
	function linkNext(nextCube) {
		that.nextCube = nextCube;
		nextCube.previousCube = that;
	}
	function delinkNext(nextCube){
		nextCube.previousCube = null;
		that.nextCube = null;
	}
	function linkPrevious(previousCube) {
		that.previousCube = previousCube;
		previousCube.nextCube = that;
	}
	function delinkPrevious(previousCube){
		previousCube.nextCube = null;
		that.previousCube = null;
	}
	
	that.moveTo = function(xx,yy) {
		if (isPartOfLink()) {
			var link = getLink();
			
			var startY = yy;
			for (var i = 0; i < link.length-1; i += 1) {
				console.log("y = " + startY);
				link[i].moveTo(xx,startY);
				startY += spec.height;
			}
			//var end = link[link.length-1];
		}
		else {
			superMoveTo(xx,yy);
		}		
	};
	
	that.createOutline = function(){
		var h1 = spec.y-spec.connectorHeight-5;
		var h2 = spec.height+spec.connectorHeight+10;
		
		if( that.previousCube != null) {
			h1 = spec.y-spec.connectorHeight-5;
		}
		if( that.nextCube != null) {
			h2 = spec.height+spec.connectorHeight;
		}
		var ot =  spec.paper.rect(spec.x-5, h1, spec.width+10,h2).attr({
					stroke:'none',
					//'stroke-dasharray': '- '
					fill:CUBE_OUTLINE_COLOR
				});
		ot.insertBefore(shape);
		return ot;
	}
	
	function printLink(link) {
		for( var k=0; k < link.length ;k +=1) {
			console.log(link[k].isSelected());
		}
	}

	function isPartOfLink() {
		return that.previousCube != null || that.nextCube != null;
	}
	
	/*
	 * Cannot allow multiple selection. If this cube is being selected and another  cube is already selected 
	 * than deselect that cube and select this one
	 */
	shape.node.onclick = function() {
		if( that.isEnabled()) {
			if (isPartOfLink()) {
				//console.log("is part of link");
				if (!that.isSelected()) {
					// if any other cube has been selected
					var selectedCubes = spec.linkMgr.getSelectedCubes();
					for (var j = 0; j < selectedCubes.length; j += 1) {
						if (selectedCubes[j] != null) {
							selectedCubes[j].toggleSelection();
							selectedCubes[j].drawOutline();
						}
					}
				}
				
				var link = spec.linkMgr.getLink(that);
				for (var k = 0; k < link.length; k += 1) {
					link[k].toggleSelection();
					link[k].drawOutline();
					
				}
				printLink(link);
			}
			else {
				// if this cube is being selected (not previously selected)
				if (!that.isSelected()) {
					// if any other cube has been selected
					var selectedCubes = spec.linkMgr.getSelectedCubes();
					for (var j = 0; j < selectedCubes.length; j += 1) {
						if (selectedCubes[j] != null) {
							selectedCubes[j].toggleSelection();
							selectedCubes[j].drawOutline();
						}
					}
					that.toggleSelection();
					that.drawOutline();
				}
				else {
					that.toggleSelection();
					that.drawOutline();
				}
			}
		}
	}
	return that;	
};

function SelectableCounterTarget(spec) {
	var that = {};
	//var line = PRASAD.graphics.line;
	var rect = spec.paper.rect(spec.x,spec.y,spec.width,spec.height,5).attr({fill: spec.color||'white'});
	
	rect.node.onclick = function(event) {
		//console.log("clicked at " + event.offsetX + "," + event.offsetY);
		spec.callback(event.offsetX,event.offsetY);
		
	}
	
	that.getShape = function() {
		return rect;
	}
	
	/*
	that.drawGrid = function(side) {
		var numCols = spec.width/side;
		var numRows = spec.height/side;
		console.log("side = " + side + " # rows = " + numRows + " numCols = " + numCols);
		// Draw the vertical grid lines
		var sx = spec.x + side  ;
		var line1;
		var attr = {opacity :"0.1"};
		for( var k = 1; k < numCols; k+=1) {
			var kx = sx  +( k-1)* side;
			line1 = line(spec.paper, kx, spec.y , kx, spec.y + spec.height).attr(attr);
		}
		
		// Draw the horizontal grid lines
		var sy = spec.y + side;
		for( k=1 ; k < numRows ; k +=1) {
			var ky = sy  +( k-1)* side;
			line1 = line(paper, spec.x, ky, spec.x + spec.width ,ky).attr(attr);
		}
	}
	*/
	
	return that;
};

/*
 * options:
 * gridSide
 * border
 * 
 * This could change the options.width and/or options.height depending on whether the specified width/height
 * is a multiple of the gridSide
 */
function SnapableMat(options) {
	var that = {};
	
	var line = PRASAD.graphics.line;
	
	console.log("1 : " + options.width + ", " + options.height);
	var side = options.gridSide;
	var k = options.width % side;
	if ( k != 0) {
		options.width = Math.floor(options.width/side) * side;
	}
	k = options.height % side;
	if ( k != 0) {
		options.height = Math.floor(options.height/side) * side;
	}
	console.log("2 : " + options.width + ", " + options.height);
	
	var width = options.width;
	var height = options.height;
	
	
	options.width = options.width + options.border *2;
	options.height = options.height + options.border *2;
	
	// So that the outside world knows what the new dimensions are (don't like this!)
	that.width = options.width;
	that.height = options.height;
	
	console.log("3 : " + options.width + ", " + options.height);
	
	var rect = options.paper.rect(options.x,options.y,options.width ,options.height).attr({fill: options.color||'white'});
	
	var outerRect = options.paper.rect(options.x + options.border, options.y + options.border, width,height).attr({opacity :"0.1",stroke:'black'});
	
	// For Grid
	
	var numCols = Math.floor(options.width/side);
	var numRows = Math.floor(options.height/side);
	
	rect.node.onclick = function(event) {
		console.log("Clicked at: " + event.offsetX + "," + event.offsetY);
		var snapTo = that.getSnapPoint(event.offsetX, event.offsetY);
		
		if (options.callback !== undefined) {
			console.log("Snapping to: " + snapTo.x + "," + snapTo.y);
			options.callback(snapTo.x, snapTo.y);
		}
		
	};
	
	/*
	 * Returns the (top,left) snap point given the x and y locations
	 */
	that.getSnapPoint = function(x,y){
		var snapX,
			snapY;
		for( var k=0; k < numCols ; k +=1)  {
			// If x location is within the left border
			if( x < options.x + options.border) {
				snapX = options.x + options.border;
				break;
			}
			var xx = options.x + options.border + (k) * side;
			var nextX = options.x + options.border + (k+1) * side;
			
			//console.log("for x : " + x + " and " + nextX);
			//if( k != numCols -1 ) {
				if( x >= xx && x < nextX) {
					snapX = xx;
					break;
				}
			//}
			/*
			else {
				snapX = xx;
				break;
			}
			*/
		}
		
		for( k=0; k < numRows ; k +=1)  {
			// If y location is within the top border
			if( y < options.y + options.border) {
				snapY = options.y + options.border;
				break;
			}		
			var yy = options.y + options.border + (k) * side;
			var nextY = options.y + options.border + (k+1) * side;
					
			//console.log("for y : " + y + " and " + nextY);					
			//if( k != numRows -1 ) {
				if( y >= yy && y < nextY) {
					snapY = yy;
					break;
				}
			//}
			/*
			else {
				snapY = yy;
				break;
			}
			*/
		}
		//console.log(snapX + "," + snapY);
		return {
			x: snapX,
			y: snapY
		}
	}
	
	that.drawGrid = function() {
		var kx, 
			ky;
		console.log("side = " + side + " # rows = " + numRows + " numCols = " + numCols);
		// Draw the vertical grid lines
		var sx = options.x  ;
		var line1;
		var attr = {opacity :"0.1"};
		// Draw the vertical grid lines
		for( var k = 1; k <= numCols; k+=1) {
			kx = options.border + sx  +( k-1)* side;
			ky = options.border +  options.y;
			line1 = line(options.paper, kx, ky , kx, ky + height).attr(attr);
		}
		
		// Draw the horizontal grid lines
		var sy = options.y;
		for( k=1 ; k <= numRows ; k +=1) {
			ky = options.border + sy  +( k-1)* side;
			kx = options.x + options.border;
			line1 = line(options.paper, kx, ky, kx + width ,ky).attr(attr);
		}
	};
	
	return that;
	
}

function LinkMgr(cubes) {
	
	var that = {};
	that.getSelectedCubes = function(){
		var selCubes = [];
		//console.log("LInkMgr has  " + cubes.length);
		for (var i = 0; i < cubes.length; i += 1) {
			if (cubes[i].isSelected()) {
				selCubes.push(cubes[i]);
			}			
		}
		return selCubes;
	};
	
	/*
	 * Gets the last in the chain of selected cubes 
	 */
	that.getLastSelectedCube = function() {		
		for (var i = 0; i < cubes.length; i += 1) {
			var cube = cubes[i];
			if(cube.isSelected() && cube.nextCube == null) {
				return cube;
			}			
		}
		return null;
	};

	/*
	 * Gets the first in the chain of selected cubes 
	 */
	
	that.getFirstSelectedCube = function() {		
		for (var i = 0; i < cubes.length; i += 1) {
			var cube = cubes[i];
			if(cube.isSelected() && cube.previousCube == null) {
				return cube;
			}			
		}
		return null;
	}
	
	/*
	 * Creates a link starting from the first to the last cube of the link
	 * of which the specified cube is a (any) part
	 */
	that.getLink = function(cube) {
		var link = [];
		var start = cube;
		
		while( start.previousCube != null) {
			start = start.previousCube;
		}
		
		while( start != null) {
			link.push(start);
			start = start.nextCube;			
		}
		return link;		
	}
	
	/*
	 * Animate the chain of cubes starting at the specified cube and proceeding in the forward direction, 
	 * to the specified y location
	 * linkStart - the first cube in the link
	 * moveToX - the x location to move the first cube to - which will be the x location of all successive cubes as well
	 * moveToY - the y location to move the first cube to 
	 * heightOfCube - the height of the cube excluding the cube connector, in in words the height of each 
	 *                cube in the linked state 
	 */
	that.moveLinkTo = function(linkStart,moveToX,moveToY, heightOfCube) {
		var start = linkStart;
		var startY = moveToY;
		while (start != null) {
			//start.toggleSelection();
			//start.removeLabel();
			start.select(false); // deselect
			start.drawOutline();
			start.animateTo(moveToX, startY);
			startY += heightOfCube;
			if (start.previousCube != null) {
				start.getShape().insertBefore(start.previousCube.getShape());
			}
			start = start.nextCube;
		}
		//that.reLabel(linkStart);
	}
	
	/*
	 * Animate the chain of cubes starting at the specified cube and proceeding in the backward direction, 
	 * to the specified y location
	 * linkStart - the last cube in the link
	 * moveToX - the x location to move the first cube to - which will be the x location of all successive cubes as well
	 * moveToY - the y location to move the first cube to 
	 * heightOfCube - the height of the cube excluding the cube connector, in in words the height of each 
	 *                cube in the linked state 
	 */
	that.moveLastLinkTo = function(linkStart,moveToX,moveToY, heightOfCube) {
		var start = linkStart;
		var startY = moveToY;
		while (start != null) {
			//start.toggleSelection();
			start.select(false); // deselect
			start.drawOutline();
			//start.removeLabel();
			start.animateTo(moveToX, startY);
			startY -= heightOfCube;
			start = start.previousCube;
		}
		//that.reLabel(linkStart);
	}
	/*
	that.reLabel = function(someCubeInLink) {
		var link = that.getLink(someCubeInLink);
		for( var k=0; k < link.length; k +=1) {
			link[k].label("" + (k+1));
		}
	}
	*/

	/*
	 * Returns aan array, each element of which contains a count of the number of elements
	 * in a link, for every link managed
	 * e.g suppose we have:
	 * ## # # #### ### # #
	 * then this method returns [2 1 1 4 3 1 1]
	 */
	that.getGroups = function() {
		var firstCubes = [];
		for (var i = 0; i < cubes.length; i += 1) {
			if (cubes[i].previousCube == null) {
				firstCubes.push(cubes[i]);
			}			
		}
		
		var groups = [];
		for( i=0; i < firstCubes.length ; i+=1) {
			var link = that.getLink(firstCubes[i]);
			groups.push(link.length);
		}
		
		return groups;		
	}
	
	return that;
	
}

