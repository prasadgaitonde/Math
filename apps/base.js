/**
 * @author prasad
 */

// Global namespace
var PRASAD = PRASAD || {};

PRASAD.utils = {};
PRASAD.utils.math = {};
PRASAD.widgets = {};
PRASAD.components = {};
PRASAD.components.math = {};
PRASAD.graphics = {};
PRASAD.widgets.math = {};

/*
 * Requires jquery
 * Gets the integer from the value of the specified CSS field for the specified element
 * e.g. 
 * 	css {
 * 		width:100px;
 * 	}
 *  element the selected element
 *  field: "width"
 *  returns 100
 */
PRASAD.utils.getCSSInteger = function(element,field) {
	return parseInt(element.css(field),10);
};

PRASAD.utils.waitAndRestartGame = function(game, interval) {
	setTimeout(function() {
				game.init();
				game.start();
			},interval);
};

PRASAD.utils.getpath = function(ml,x,y)  {
	return [ml,x,y].join(' ');
	//return ml + " " + x + " " + y + " ";
}

PRASAD.utils.createPath = function(pathArray){
	return pathArray.join(' ');
}

/*
 * Gets the number closest to the specified number that is a multiple of the specified multiple
 * theNumber - the number closest to which we have to find a value
 * multipleOfThis - the multiple
 * 
 *  e.g. 
 *  theNumber = 108, 
 *  multipleOfThis = 10
 *  returns 110
 *  
 *  102, 5 returns 100
 */
PRASAD.utils.getClosestMultipleOf = function(theNumber ,multipleOfThis) {
	var isMult = theNumber % multipleOfThis;
	var which;
	if(isMult == 0 ) {
		return theNumber;
	}
	else {
		which = Math.floor(multipleOfThis/2);
		if( isMult < which) {
			return theNumber - isMult;
		}
		else {
			return theNumber + (multipleOfThis -isMult);
		}
	}
}

/*
 * Maps the specified now to a row,column in a grid which is cellCount cells wide
 * Cells are numbered starting at left top and going left to right , then next row 
 * and so on
 * number starts at 1 
 * row, col start at index 1
 * e.g. if cellCount = 6
 *  number 1 : maps to row = 1 , col = 1
 * 	2 : row = 1, col = 2
 *  6 : row = 1, col = 6
 *  7 : row = 2, col = 1
 *  36: row = 6, col = 6
 */
PRASAD.utils.getRowColumn = function(number, cellCount) {
	var row;
	var col = number % cellCount;
	if (col == 0) {
		col = cellCount;
		row = Math.floor(number / cellCount);
	}
	else {
		row = Math.floor(number / cellCount) + 1;
	}
	return new RowColumn(row,col);
}

/*
 * Generates a random number between the specified lower and upper range(both inclusive)
 * Algorithm picked up from: http://www.webdevelopersnotes.com/tutorials/javascript/generating_random_numbers_javascript.php3
 */
PRASAD.utils.randomIntForRange = function(lower,upper) {
	return   Math.floor(Math.random() * (upper - (lower-1))) +  lower;	
}

PRASAD.utils.randomIntBetween1And10 = function() {
	return PRASAD.utils.randomIntForRange(1,10);
	/*
	var r = Math.random();
	return Math.floor(r * 10);
	*/
}

/*
 * Calculates the radius of the circle to be drawn within a square cell
 * width - the width of all the cells within a row
 * gap - the gap between the edge of the circle and the surrounding side of the cell. The circle will
 *       have this gap with all the 4 sides of the cell
 * cellsPerRow - the number of cells 
 */
PRASAD.utils.getRadius = function(width, gap, cellsPerRow) {
	return Math.floor((width - gap * (cellsPerRow * 2)) / (cellsPerRow  * 2));
}

/*
 * Gets the x location of the center of the circle to be drawn within a square cell
 * x - left most location of the first cell
 * column - the column in which the circle is to be drawn. Starts with 1 and proceeds from left to right
 * gap - gap between the edge of circle and sides of cell
 * radius - radius of circle
 */
PRASAD.utils.getX = function(x,column, gap,radius) {
	var startX = x + gap + radius;	
	return startX + (column - 1) * 2 * (radius + gap);
}

/*
 * Gets the y location of the center of the circle to be drawn within a square cell
 * y - top most location of the first cell
 * row - the row in which the circle is to be drawn. Starts with 1 and proceeds from top to bottom
 * gap - gap between the edge of circle and sides of cell
 * radius - radius of circle
 */
PRASAD.utils.getY = function(y, row, gap, radius){
	var startY = y + gap + radius;
	return startY + (row - 1) * 2 * (radius + gap);
}

// max has to be between 1 and 9
PRASAD.utils.randomIntBetween1AndMax = function(max) {
	return PRASAD.utils.randomIntForRange(1,max);
}

Array.prototype.isNumberPresent = function(number) {
 	for( var i=0; i < this.length; i++) {
		if( this[i] == number) return true;
	}
	return false;
}

/*
 * Draw a line from x1, y1 to x2, y2
 */
PRASAD.graphics.line = function(paper, x1,y1,x2,y2) {
	var ar = ['M', x1, y1 , 'L' ,x2, y2];
	return paper.path(ar.join(' '));
}

PRASAD.graphics.pointIsInRectangle = function(rect, xx,yy) {
	console.log(rect.attr('x') + "," + rect.attr('y') + " *** " +  rect.attr('width') + "  , " +  rect.attr('height') );
		var x = rect.attr('x');
		var y = rect.attr('y');
		var boxX =  x + rect.attr('width');
		var boxY = y + rect.attr('height');
		return ( (xx > x && xx < boxX) && (yy > y && yy < boxY)) ;
}

PRASAD.graphics.pointIsInRect = function(pointX, pointY, left, top,  right,bottom){
	//console.log("\t"+pointX+"," + pointY + " => " + left +"," + top + ","+ bottom + ","+ right);
		return ( (pointX >= left && pointX <= right) && (pointY >= top && pointY <= bottom)) ;	
}


/*
 * Returns the index of the specified number if present in array else returns -1
 */
Array.prototype.indexofNumber = function(number) {
 	for( var i=0; i < this.length; i++) {
		if( this[i] == number) return i;
	}
	return -1;
}

Array.prototype.occurencesOfNumber = function(number) {
	//TODO check if number is in fact instance of a number
	var occurences = 0;
 	for( var i=0; i < this.length; i++) {
		if( this[i] == number) {
			occurences++;
		}
	}
	return occurences;
}

function Point(x,y) {
 	this.x = Math.floor(x);
	this.y = Math.floor(y);
};

function RowColumn(row,col) {
 	this.row = row;
	this.col = col;
};

PRASAD.widgets.Label = function Label(paper, x,y,width, height, text,color) {
		this.rect = paper.rect(x,y,width,height);
		this.set = paper.set();
		if( color != null) {
			this.rect.attr({
				fill: color
			});
		}
		var fontSize = height;
		this.text = paper.text(x+width/2, y+height/2, text).attr({'font-size':fontSize,fill:"rgb(0,0,0)"});
		this.set.push(this.rect);
		this.set.push(this.text);		
}

PRASAD.widgets.Label.prototype.setVisible = function(flag){
	if(flag) {
		this.set.show();
	}
	else {
		this.set.hide();
		
	}
}

PRASAD.widgets.Label.prototype.setText = function(text) {
	this.text.attr({text:text});
}

PRASAD.widgets.Label.prototype.getText = function() {
	return this.text.attr('text');
}

PRASAD.widgets.createLabel = function(paper, x,y,width,height, text,color,needOutline) {
		var label =  new  PRASAD.widgets.Label(paper,x ,y, width, height,text,color);
		if(needOutline !== undefined && !needOutline) {
			label.rect.remove();
		}
		return label;
}

/*
 * Draws an equilateral triangle given the top vertex and side
 * options:
 * paper
 * x - x of top vertex of triangle
 * y - y of top vertex of triangle
 * side - side of traingle
 * color(optional) - triangle fill color
 */
PRASAD.graphics.EquiTriangle = function(options) {
	var radAngle = 30 * Math.PI/180;
	options.color = options.color || 'none';
	
	var pathStr = ['M', options.x , options.y , 
						'l', -options.side * Math.sin(radAngle) , options.side * Math.cos(radAngle),
						options.side, 0,
						'Z'  ];
	var triangle = options.paper.path(pathStr.join(' ')).attr({fill:options.color});					
}

/*
 * options:
 * paper
 * x - x center of cross
 * y - y center of cross
 * side(optional) default 10 - if the X is embedded in a square, then the  value of the side of this square
 * color(optional) default #F00
 * strokeWidth(optional) default 3
 * callback (optional)
 */
PRASAD.graphics.Cross = function(options) {
	var that = {};
	options.side = options.side || 10;
	options.color = options.color || '#F00';
	options.strokeWidth = options.strokeWidth || 3;
	
	var pathStr = [ 'M', options.x- options.side/2, options.y-options.side/2, 'l', options.side, options.side, 
					'M' , options.x+options.side/2, options.y-options.side/2, 'l' , -options.side, options.side];
	var cross = options.paper.path(pathStr.join(' ')).attr({stroke:options.color,'stroke-width':options.strokeWidth});
	
	cross.node.onclick = function() {
		// Not sure if it is a good idea to remove this, better hide it
		//cross.remove();
		//cross.hide();
		if( options.callback !== undefined) {
			options.callback();
		}
	}	
	
	that.setVisible = function(flag) {
		if( flag) {
			cross.show();
			cross.toFront();
		}
		else {
			cross.hide();
		}
	};
	return that;
};

/*
 * Replacement for PRASAD.widgets.Button
 * options:
 * x:
 * y:
 * width:
 * height:
 * onclick:
 */
//TODO visual effect on button press/release
PRASAD.components.Button = function(options) {
	var that = {};
	var DEFAULT_FILL = '#FFF';
	
	var rect = options.paper.rect(options.x,options.y,options.width,options.height,4);
	rect.attr({
				fill: options.color || DEFAULT_FILL
		});
		
	var fontSize = options.height/2;
	var text = options.paper.text(options.x+options.width/2, options.y+options.height/2, options.text).attr({'font-size':fontSize});
	var set = options.paper.set(rect, text);
	
	if (options.onclick !== undefined) {
		rect.node.onclick = options.onclick;
		text.node.onclick = options.onclick;
	}
	
	return that;
	
};

/*
 * options:
 * x
 * y
 * text
 * fontSize(optional)
 */
PRASAD.components.createText = function(options) {
	
	options.fontSize = options.fontSize || 20;
	
	var text = paper.text(options.x, options.y ,options.text).attr({'font-size' :options.fontSize, 'text-anchor':'start'});
	
	text.getDimensions = function() {
		var bbox = text.getBBox();
		return {
			x: options.x,
			y: options.y,
			width: bbox.width,
			height:bbox.height
		}
	};
	
	text.setVisible = function(flag) {
		if( flag) {
			text.show();
		}
		else {
			text.hide();
		}
	}
	return text;
	
}

PRASAD.components.makeButton = 	function makeButton(x,y,width,height, text, onclick) {
			return  PRASAD.components.Button(
							{
								paper:paper,
								x: x,
								y: y,
								width: width,
								height: height,
								text:text,
								onclick: onclick			
							}
						);
			
};

/*
 * options:
 * x
 * y
 * width
 * height
 * text
 * callback (optional)
 */
PRASAD.components.TextCell = function(options,privateVars) {
	var that = {};
	// For derived classes to access
	var privateVars = privateVars || {};
	var DEFAULT_FILL = '#FFF';
	options.color = options.color || DEFAULT_FILL;
	
	var shape = options.paper.rect(options.x,options.y,options.width,options.height);
	shape.attr({fill: options.color});
	privateVars.shape = shape;
		
	var fontSize = options.height/2;
	var textElement = options.paper.text(options.x+options.width/2, options.y+options.height/2, options.text).attr({'font-size':fontSize});
	privateVars.textElement = textElement;
	var set = options.paper.set(shape, textElement);
	var animatableElements = [shape,textElement];
	
	
	function onclick() {
		var cellText = that.getText();
		//console.log("cell text = "+ cellText);
		options.callback(cellText);
	}
	
	if (options.callback !== undefined) {
		shape.node.onclick = onclick;
		textElement.node.onclick = onclick;
	}
	
	that.getAnimatableElements = function() {
		return animatableElements;
	};
	
	
	that.getText = function() {
		return textElement.attr('text');
	};
	
	that.setText = function(textStr) {
		textElement.attr({
			text: textStr
		});
	};

	that.setVisible = function(flag) {
		if(flag) {
			set.show();
			set.toFront();
		}
		else {
			set.hide();
		}
	}
	
	that.getDimensions = function() {
		//console.log(shape.attrs);
		//printProperties(shape);
		return {
				x:options.x,
				//x:shape.attr('x'),
				y:options.y,
				//y:shape.attr('y'),
				width:options.width,
				height:options.height
				}
	}
	
	return that;
}
/*
 * options:
 * x
 * y
 * width
 * height
 * text
 * numRows - the number of rows in the grid
 * numCols(optional) - the number of colums in the grid
 * startNumber (optional) - the starting number to be displayed on the grid
 * callback:(optional)
*/

PRASAD.components.TextCellWithNumberSelection = function(options) {
	
	var callbackToCall = options.callback;
	options.callback = callback;
	var that = PRASAD.components.TextCell(options);
	function callback(text) {
		options.numCols = options.numCols || 10;
		
		var numberGrid = PRASAD.widgets.math.FloatingSelectableNumberGrid({
			paper: options.paper,
			x: options.x,
			y: options.y,
			width: options.width * options.numCols,
			numRows: options.numRows,
			numCols: options.numCols,
			startNumber: options.startNumber,
			callback: function(number){
				that.setText("" + number);
				if(callbackToCall !== undefined) {
					callbackToCall(number);
				}
			}
		}	
		);
	}
	return that;
	
}

/*
 * options:
 * x
 * y
 * width
 * height
 * text
 * callback (optional)
 */
PRASAD.components.RoundTextCell = function(options,privateVars) {
	var that = {};
	// For derived classes to access
	var privateVars = privateVars || {};
	var DEFAULT_FILL = '#FFF';
	options.color = options.color || DEFAULT_FILL;
	
	var shape = options.paper.ellipse(options.x+options.width/2,options.y+options.height/2,options.width/2,options.height/2);
	shape.attr({fill: options.color});
	privateVars.shape = shape;
		
	var fontSize = options.height/2;
	var textElement = options.paper.text(options.x+options.width/2, options.y+options.height/2, options.text).attr({'font-size':fontSize});
	privateVars.textElement = textElement;
	var set = options.paper.set(shape, textElement);
	
	
	function onclick() {
		var cellText = textElement.attr('text');
		options.callback(cellText);
	}
	
	if (options.callback !== undefined) {
		shape.node.onclick = onclick;
		textElement.node.onclick = onclick;
	}
	
	that.setText = function(textStr) {
		textElement.attr({
			text: textStr
		});
	};

	that.setVisible = function(flag) {
		if(flag) {
			set.show();
			set.toFront();
		}
		else {
			set.hide();
		}
	}
	
	that.getDimensions = function() {
		return {
				x: options.x,
				y:options.y,
				width:options.width,
				height:options.height
				}
	}
	
	return that;
}

/*
 * A specialized version of TextCell that highlights the cell when the mouse moves into it
 * and de highlights when it moves out 
 * 
 * options:
 * same as TextCell
 */
PRASAD.components.HighlightableTextCell = function(options) {
	var privateVars = privateVars || {};
	var that = PRASAD.components.TextCell(options,privateVars);
	
	privateVars.shape.node.onmousemove = function() {
		privateVars.shape.attr({fill:'yellow'});
	};
	
	privateVars.shape.node.onmouseout = function(){
		privateVars.shape.attr({fill:options.color});
	};
	
	privateVars.textElement.node.onmousemove = function() {
		privateVars.shape.node.onmousemove();
	};
	
	privateVars.textElement.node.onmouseout = function() {
		privateVars.shape.node.onmouseout();
	};
	
	return that;
}

PRASAD.components.HighlightableRoundTextCell = function(options) {
	var privateVars = privateVars || {};
	var that = PRASAD.components.RoundTextCell(options,privateVars);
	
	privateVars.shape.node.onmousemove = function() {
		privateVars.shape.attr({fill:'yellow'});
	};
	
	privateVars.shape.node.onmouseout = function(){
		privateVars.shape.attr({fill:options.color});
	};
	
	privateVars.textElement.node.onmousemove = function() {
		privateVars.shape.node.onmousemove();
	};
	
	privateVars.textElement.node.onmouseout = function() {
		privateVars.shape.node.onmouseout();
	};
	
	return that;
}


PRASAD.widgets.Button = function Button(paper, x,y,width, height, text, onclick,color) {
		var rect = paper.rect(x,y,width,height,4);
		var MS_DN_OPACITY=0.2;
		
		
		rect.attr({
				fill: color != null ? color : 'white'
		});
		
		
		var fontSize = height/2;
		var text = paper.text(x+width/2, y+height/2, text).attr({'font-size':fontSize,fill:"rgb(0,0,0)"});
		var set = paper.set();
		set.push(rect);
		set.push(text);
		
		
		rect.node.onmousedown = function() {
			//rect.attr({opacity:MS_DN_OPACITY});
			//text.attr({opacity:MS_DN_OPACITY});
			set.attr({opacity:MS_DN_OPACITY});
		};
		rect.node.onmouseup = function() {
			//rect.attr({opacity:1});
			//text.attr({opacity:1});
			set.attr({opacity:1});
		};
		
		text.node.onmousedown = rect.node.onmousedown;
		text.node.onmouseup = rect.node.onmouseup;
		
		rect.node.onclick = onclick;
		text.node.onclick = onclick;
		
		// this does not work on set , but attr() does as above
		//set.node.onclick = onclick;
}


//*****************************************************************************
//************************ > Grid ***************************************
//*****************************************************************************
PRASAD.widgets.math.Grid = function Grid(paper1, x, y, width, height, cellCount, include, exclude) {
	var DEFAULT_OPACITY = 1;
	//console.log("x =  " + x + "; y = " + y + "; width = " + width + "; height = " + height);
	this.rect = paper1.rect(x, y, width,height).attr({fill:'white'}); //.attr ({stroke:'red',"stroke-width":"1"});
	
	this.circles = new Array(); 
	var gap = 2;
	//var radius = (width - cellCount * gap)/(cellCount * 2);
	//radius = Math.floor(radius);
	var radius = PRASAD.utils.getRadius(width, gap,cellCount);
	
	//var startX = x + gap + radius;
	//var startY = y + gap + radius;


	for( var col=1; col <= cellCount; col++) {
		for( var row=1; row <= cellCount; row++) {
			var count = row * 10 + col; 
			var cond = true;
			if (exclude != null) {
				cond = !exclude.isNumberPresent(count);
			}
			else if (include != null){
				cond = include.isNumberPresent(count)
			}
			if (cond) {
				//var c = paper1.circle(startX + (col - 1) * (2 * radius + gap), 
				//						startY + (row - 1) * (2 * radius + gap), radius).attr({
				var c = paper1.circle( PRASAD.utils.getX(x,col,gap,radius), 										
										//startY + (row - 1) * (2 * radius + gap), radius)
										PRASAD.utils.getY(y,row,gap,radius),radius)
										.attr({
															fill: "rgb(0,0,0)",
															stroke: "none",
															opacity: DEFAULT_OPACITY
															});
				this.circles.push(c);
			}			
		}
	}
	
	this.getCount = function() {
		return this.circles.length;
	}
	
	this.restore = function() {
		this.rect.attr({
			'fill-opacity': DEFAULT_OPACITY
		});
		for (var i = 0; i < this.circles.length; i++) {
			var circle = this.circles[i];
			circle.attr({opacity: DEFAULT_OPACITY});
		}
		
	}
	
	this.animate = function(interval,callback) {
		var that = this;
		
		for( var i=0; i < this.circles.length;i++) {
			var circle = this.circles[i];
			circle.animate({ opacity:0}, interval, function(circle) {
				that.rect.node.onclick = function() {
					//console.log("click");
					that.restore();
					that.animate(interval,callback);
				}

				if( callback !== undefined) {
					callback();
				}		
				//circle.remove();				
			});
		}
		/*
		this.rect.animate({'fill-opacity':0}, interval, function() {
			that.rect.node.onclick = function() {
				//console.log("click");
				that.restore();
				that.animate(interval);
			}
			 });
		for( var i=0; i < this.circles.length;i++) {
			var circle = this.circles[i];
			circle.animateWith(this.rect, { opacity:0}, interval, function(circle) {
				if( callback !== undefined) {
					callback();
				}		
				//circle.remove();				
			});
		}
		*/
	}	
}

PRASAD.widgets.math.Grid.prototype.clear = function() {
	this.rect.remove();
	for (var i = 0; i < this.circles.length; i++) {
		this.circles[i].remove();
	}
}
// ************************ < Grid ***************************************

PRASAD.widgets.math.easyDotCardsArray = new Array( 
												[31,41], // 1
												[54,55],  //2 
												[22,46],   // 2
												[11,21,31], // 3
												[33,34,44],  // 3
												[43,52,61], // 3
												[22,23,32,33], //4
												[11,13,22,31,33],		// 5
												[23,33,43,22,32,42],   // 6	
												[42,43,44,52,53,54]  // 6	
										);
										
PRASAD.widgets.math.mediumDotCardsArray = new Array( 
												[21,22,23,42], // 4
												[22,23,26,36],  //4
												[25,26,31,51], // 4
												[24,25,26,32,42], // 5
												[33,34,35,43,44],  // 5
												[25,26,35,36,51,52],   // 6
												[16,26,36,61,62,63], // 6
												[11,12,21,22,44,45,54,55], // 8
												[32,33,34,42,43,44,52,53,54],  // 9
												[11, 21, 31, 44, 45, 54, 55],  // 7
												[21,22,31,32,44,54,64]				// 7
										);	

PRASAD.widgets.math.hardDotCardsArray = new Array( 
												[23,31,33,35,43],				// 5
												[24,25,31,32,56,66],			// 6
												[22,23,24,32,34,42,43,44],    // 8 
												[11,12,13,21,22,23,54,55,51], //9
												[22,23,24,32,33,34,53,54,64],  // 9 
												[11,12,21,22,25,44,45,54,55],  // 9
												[25,34,41,51,64,65,66],			// 7
												[12,21,22,34,43,44,56,65,66],		// 9
												[11,13,22,31,33, 44,46,55,64,66] , // 10
												[11, 12,13,21,22,23,44,45,54,55]	// 10
										);																			


// ************************ > RandomDotCardGenerator ***************************************
PRASAD.widgets.math.RandomDotCardGenerator = function RandomDotCardGenerator(paper, x,y,width,height) {
	// 3 arrays are created varying in difficulty from easy to hard.
	// The order in which dot cards are displayed in a session is:
	// starts with the easy array and randomly picks up a pattern. This goes on until all the patterns
	// have been displayed at which point it goes to the next difficult array. When all the arrays have
	// been covered it wraps around and starts with the first array
	
	var arrays = [
					PRASAD.widgets.math.easyDotCardsArray, 
					PRASAD.widgets.math.mediumDotCardsArray, 
					PRASAD.widgets.math.hardDotCardsArray
				];
							
	var arrayTypeCounter = 0;
	var activeArray = arrays[arrayTypeCounter];
	// Tip: to clone an Array
	var clone = activeArray.slice();
	
	
	this.getNextCard = function(){
		if(clone.length == 0 ) {
				console.log("moving to next grade...");
				arrayTypeCounter++;
				if( arrayTypeCounter == arrays.length) {
					console.log("You have done all the grades, reverting back to first grade");
					arrayTypeCounter =0;
				}
				activeArray = arrays[arrayTypeCounter];
				clone = activeArray.slice();
		}
		var rand = PRASAD.utils.randomIntForRange(1,clone.length);			
		//console.log("random # = " + rand);
		var array = clone[rand-1];
		clone.splice(rand-1,1);
		return new PRASAD.widgets.math.Grid(paper, x, y, width, height, 6, array);
	}
		
	/*	
	this.getNextCard1 = function(){
		if(clone.length == 0 ) {
			console.log("start all over")
			clone = list.slice();
		}
		var rand = PRASAD.utils.randomIntBetween1AndMax(clone.length);
		
		console.log("random # = " + rand);
		var array = clone[rand-1];
		clone.splice(rand-1,1);
		return new PRASAD.widgets.math.Grid(paper, x, y, width, height, 6, array);
	}
	*/
		
}
// ************************ < RandomDotCardGenerator ***************************************

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
	 * Gets the position of the circle at the start of the drag
	 */
	this.getStartPoint = function() {
		return startPoint;
	}	
}

/*
function LinkMgr() {
	
	this.getList = function(cube) {
		var first = cube;
		var temp = cube.previous;
		console.log("temp = " + temp);
		while(temp != null) {
			console.log("*");
			first = temp;
			temp = temp.previous;			
		}
		console.log("first = " + first.id);
		
		var list = [];
		var elem = first ;
		
		while(elem != null) {
			list.push(elem);
			elem = elem.next;
		}
		console.log("link list length = " + list.length);
		return list;
	}
	
	this.start = function(cube) {		
		var nextLink = cube.next;
		while(nextLink != null) {
			console.log("ns "+ cube.id);
			nextLink.start();
			nextLink = nextLink.next;
		}
		
		var prevLink = cube.previous;
		while(prevLink != null) {
			console.log("ps:"+ cube.id);
			prevLink.start();
			prevLink = prevLink.previous;
		}		
	}
	
	this.move = function(cube, dx, dy){
		var nextLink = cube.next;
		while(nextLink != null) {
			console.log("nm:"+ cube.id);
			nextLink.move(dx,dy);
			nextLink.getShape().toBack();
			nextLink = nextLink.next;
		}
		
		var prevLink = cube.previous;
		while(prevLink != null) {
			console.log("pm:"+ cube.id);
			prevLink.move(dx,dy);
			prevLink.getShape().toFront();
			prevLink = prevLink.previous;
		}
	}
	
	this.up = function(cube) {
		var nextLink = cube.next;
		while(nextLink != null) {
			console.log("nu:"+ cube.id);
			nextLink.up();
			nextLink = nextLink.next;
		}
		
		var prevLink = cube.previous;
		while(prevLink != null) {
			console.log("pu:"+ cube.id);
			prevLink.up();
			prevLink = prevLink.previous;
		}
	}
}
*/

//function DraggableUCube(paper, x,y,width, height, connectorWidth, connectorHeight, joinsSupported, otherCubes,callback,moveToAllowed,id){
function DraggableUCube(spec){	
	var that = this;
	var paper = spec.paper,
		x = spec.x,
		y = spec.y,
		width = spec.width,
		height = spec.height,
		connectorWidth = spec.connectorWidth,
		connectorHeight = spec.connectorHeight,
		joinsSupported = spec.supportsJoins,
		otherCubes = spec.otherCubes,
		callback = spec.callback,
		moveToAllowed = spec.moveToAllowed,
		id = spec.id;
	this.id = id;
	var DEFAULT_OPACITY = 1;
	
	var offset = (width - connectorWidth)/2;
	var pathArray = ['M', x, y , 'l', width,0, 0,height,-width,0, 0,-height, 
					'M' , (x+offset),y , 'l',0, -connectorHeight, connectorWidth,0, 0,connectorHeight];
	var pathStr = 	pathArray.join(' ');
	
	var shape = paper.path(pathStr);
	shape.attr({fill: "rgb(0,0,255)",opacity: DEFAULT_OPACITY});
	shape.drag(move,start, localUp);
	//shape.drag(this.move,this.start, this.up);
	console.log(shape);
	
	this.ox = x;
	this.oy = y;
	
	var actualX = x;
	var actualY = y;
		
	var startPoint;
	
	//var linkMgr = new LinkMgr();
	
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
		//console.log("START:"+ id);
		if (that.dragEnabled) {
			that.start();			
			/*
			if (supportsJoins()) {
				linkMgr.start(that);
			}
			*/
		}
	}
	
	function getCenterPoint() {
		return new Point(x+width/2,y+width/2);
	}
	
	function move(dx,dy) {
		//console.log("MOVE:"+ id);
		if (that.dragEnabled) {
			that.move(dx,dy);
			/*
			if (supportsJoins()) {
				linkMgr.move(that,dx,dy);			
			}
			*/	
		}
	}
	
	function localUp() {
		//console.log("UP:"+ id);
		if (that.dragEnabled) {
			that.up();
			/*
			if (supportsJoins()) {
				linkMgr.up(that);
			}
			*/				
		}				
	}
	
	function postUp() {
		// Move the connectors
		moveConnectors();
		
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
	
	//**********************************************************************************************
	// Following variables and methods do not necessarily belong to the Draggable interface, but 
	// support the functionality associated with joining cubes
		
	// These variables are not part of the Draggable functionality and support the joining of cubes
	// TODO: Move them to a subclass 
	this.prevConnector = paper.circle(actualX+width/2,actualY,6).attr({fill:'red',opacity:0.1});
	
	this.nextConnector = paper.circle(actualX+width/2,actualY+height,6).attr({fill:'blue',opacity:0.1});
	var connectorSet = paper.set(this.prevConnector, this.nextConnector);
	this.nextConnector.node.onmousemove = function() {
		if (that.next != null) {
			showConnector(that.nextConnector,true);
		}
	}
	
	this.nextConnector.node.onmouseout = function() {
		showConnector(that.nextConnector,false);
	}
	
	this.prevConnector.node.onmousemove = function() {
		if (that.prev != null) {
			showConnector(that.prevConnector,true);
		}
	}
	
	this.prevConnector.node.onmouseout = function() {
		showConnector(that.prevConnector,false);
	}

	this.prevConnector.node.onclick = function(){
		console.log("prev click");
	}
	
	this.nextConnector.node.onclick = function() {
		console.log("next click");
		var nextInLink = that.next ;
		while( nextInLink != null) {						
			nextInLink.animateTranslation(0,10);
			nextInLink = nextInLink.next;
		}
		if (that.next != null) {
			that.next.unlinkPreviousCube();
			that.unlinkNextCube();
		}		
	}

	function supportsJoins() {
		return typeof(joinsSupported) !== 'undefined';
	}
	
	this.isBaseFree = function() {
		return that.next == null;
	}
	
	this.isTopFree = function() {
		return that.previous == null;
	}

	
	this.start = function() {
		//console.log("calling start");
		startPoint = getCenterPoint();
		that.ox = 0;
		that.oy =0;
	}
	
	this.move = function(dx, dy){
		if (typeof(moveToAllowed) !== 'undefined' && !moveToAllowed(that, startPoint.x + dx, startPoint.y + dy)) {
				console.log("move disallowed");
			}
			else {						
				var transX = dx - that.ox;
				var transY = dy - that.oy;
				shape.translate(transX,transY);
				that.ox = dx;
				that.oy = dy;
				actualX = x + dx;
				actualY = y + dy;
				//console.log("ox = " + that.ox + ", oy = " + that.oy +";  dx = " + dx + "; dy = "+ dy + " actualX = " + actualX + "; actualY = " + actualY);
				shape.toFront();				
				//severLinks();
			}
	}
	
	this.up = function() {
		if (supportsJoins()) {
			checkPossibleLinks();			
		}
		else {
			x = actualX;
			y = actualY;
			postUp();				
		}	
	}
	
	
	function severLinks() {
		
		if( supportsJoins()) {
			if( that.next != null) {
				that.next.unlinkPreviousCube();
				that.unlinkNextCube();
				
			}
			if( that.previous != null) {
				that.previous.unlinkNextCube();
				that.unlinkPreviousCube();
			}						
		}
		
	}
	
	
	function checkPossibleLinks() {
		if (supportsJoins() && otherCubes.length > 1) {
			if (that.next != null && that.previous != null) {
				// There is already a cube attached to the base and the top, so no link/join possible
				x = actualX;
				y = actualY;
				postUp();
			}
			else {
				// Check if lock is possible with other cubes
				for (var i = 0; i < otherCubes.length; i++) {
					//console.log("cube : " + i);
					if (otherCubes[i] == that) {
						// exclude yourself
						continue;
					}
					if (that.overlaps(otherCubes[i])) {
						if (otherCubes[i].isTopFree()) {
							that.joinToTop(otherCubes[i], postUp);
							break;
						}
						else 
							if (otherCubes[i].isBaseFree()) {
								that.joinToBase(otherCubes[i], postUp);
								break;
							}
							else {
								console.log("there is already a cube in position");
							}
					}
					x = actualX;
					y = actualY;
					postUp();
				}
			}
		}
	}
	 function some(cube1,cube2,linked) {
		if (cube1 != null) {
			if (cube1.next == null && cube1.previous == null) {
				cube1.setDragEnabled(true);
			}
			else {
				cube1.setDragEnabled(false); // false
			}
		}
		if( cube2 != null) {
			if (cube2.next == null && cube2.previous == null) {
				cube2.setDragEnabled(true);
			}
			else {
				cube2.setDragEnabled(false); // false
			}
		}
	}
	
	this.linkNextCube = function(nextCube) {
		this.next = nextCube;	
		some(this,nextCube,true);
	}
	
	this.unlinkNextCube = function() {
		this.next = null;
		some(this,null,false);
	}
	
	this.linkPreviousCube = function(previousCube) {
		this.previous = previousCube;	
		some(this,previousCube,true);
	}
	
	this.unlinkPreviousCube = function() {
		this.previous = null;
		some(this,null,false);
	}

	this.animateTranslation = function(deltaX,deltaY) {
		var animStr = deltaX +","+ deltaY;
		shape.animate({translation:animStr},200, function() {
			x = actualX = x + deltaX ;
			y = actualY = y + deltaY;
			shape.toBack();
			moveConnectors();
		});
	}
	
	function showConnector(connector, flag) {
		connector.attr({opacity: flag ? 1 : 0.1});
		if(flag) {
			connector.toFront();
		}
	}
	
	function moveConnectors() {
		that.nextConnector.toFront();
		that.nextConnector.attr({
					cx: actualX + width / 2,
					cy: actualY + height
		});
		
		that.prevConnector.toFront();
		that.prevConnector.attr({
					cx: actualX + width / 2,
					cy: actualY
		});
	}
	
	/*
	shape.node.onmousemove = function(event) {
		//console.log("("+ event.x+"," + event.y + ")"   + "("+ event.offsetX+"," + event.offsetY + ")  + (" + actualX +"," + actualY+")");
		if(that.next != null ) {
			//console.log("mi " + event.x+"," + event.y + " end : " + (actualY+height));
			
			var diff = Math.abs(event.offsetY-(actualY+height));
			//console.log(diff);
			if (diff < 10) {
				that.nextConnector.attr({
					cx: actualX + width / 2,
					cy: actualY + height
				});
				that.nextConnector.toFront();
				that.nextConnector.show();
			}			
			else {
				that.nextConnector.hide();
			}
		}		
	}
	*/
	
	
	
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
				cube.linkPreviousCube(that);
				that.linkNextCube(cube);
				
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
				cube.linkNextCube(that);
				that.linkPreviousCube(cube);
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

function DropTarget() {
	
}

// ************************ > CircleCounter ***************************************
function CircleCounter(paper, x,y ,radius) {
	var that = this;
	var DEFAULT_OPACITY = 1;
	this.shape = paper.circle(x , y, radius);

	this.shape.attr({fill: "rgb(0,0,255)",stroke: "black",opacity: DEFAULT_OPACITY});
	
	
	this.setColor = function(color) {
		this.shape.attr({fill: color});
	}
	
	this.setVisible = function(flag) {
		if( flag ) {
			this.shape.show();
		}
		else {
			this.shape.hide();
		}
	}
	
	this.shape.drawAt = function(x,y) {
		this.attr({
			cx: x,
			cy: y
		});
	}
	
	this.shape.storeStartPoint = function() {
		var pos = this.getPoint();
		this.ox = pos.x;
		this.oy = pos.y;
	}
	
	this.shape.getPoint = function() {
		//console.log("CC : this = " + this);
		return new Point(this.attr('cx'), this.attr('cy'));
	}
	
	this.shape.revertToOrigPos = function(){
		this.attr({
					cx: this.ox,
					cy: this.oy					
				});
	}
	
	this.shape.move = function(dx,dy){
		//console.log("move assg values : " + (this.ox + dx) + " and " + (this.oy+dy));
		this.attr({cx: this.ox + dx, cy: this.oy + dy});
		this.toFront();
	}
	
	this.shape.getPosition = function(x, y ,count, numPerRow, height,padding){
		var xWidth = this.getBBox().width/2;
		var yWidth = this.getBBox().height/2;
		var rc = PRASAD.utils.getRowColumn(count,numPerRow);
		return  new Point(x + (2 * rc.col - 1) * xWidth + (rc.col - 1) * padding, 
							y + height - (2 * rc.row - 1) * yWidth - (rc.row - 1) * padding);	
	}
	
	this.move = function (dx, dy) {
    	// move will be called with dx and dy
		this.shape.move(dx,dy);
		//counter.shape.toFront();
	};
	
	this.start = function(){
		// storing original coordinates
		this.shape.storeStartPoint();
	}
	
}
// ************************ < CircleCounter ***************************************


// ************************ > SquareCounter ***************************************
function SquareCounter(paper, x,y,side) {
	var DEFAULT_OPACITY = 1;
	this.shape = paper.rect(x , y, side,side);
	this.shape.attr({fill: "rgb(0,0,255)",stroke: "black",opacity: DEFAULT_OPACITY});

	this.setColor = function(color) {
		this.shape.attr({fill: color});
	}
	
	this.shape.drawAt = function(x,y) {
		this.attr({
			x: x,
			y: y
		});
	}
	
	this.setVisible = function(flag) {
		if( flag ) {
			this.shape.show();
		}
		else {
			this.shape.hide();
		}
	}
	
	this.shape.storeStartPoint = function() {
		var pos = this.getPoint();
		this.ox = pos.x;
		this.oy = pos.y;
	}
	
	this.shape.getPoint = function() {
		return new Point(this.attr('x'), this.attr('y'));
	}
	
	this.shape.revertToOrigPos = function(){
		this.attr({
					x: this.ox,
					y: this.oy				
				});
	}
	
	this.shape.move = function(dx,dy){
		this.attr({x: this.ox + dx, y: this.oy + dy});
		this.toFront();
	}
	
	this.shape.getPosition = function(x, y ,count, numPerRow, height,padding){
		var xWidth = this.getBBox().width;
		var yWidth = this.getBBox().height;
		var rc = PRASAD.utils.getRowColumn(count,numPerRow);
		return  new Point(x + ( rc.col - 1) * xWidth + (rc.col - 1) * padding, 
							y + height - (rc.row ) * yWidth - (rc.row - 1) * padding);
		
	}
	
	
}
// ************************ < SquareCounter ***************************************
 
 function TextInRectCounter(rect,text){
 	var that = this;
	this.shape = this;
	this.rectShape  = rect;
	this.textShape = text;
	console.log("to front");
	this.textShape.toFront();

	this.setColor = function(color) {
		// TODO
	}

	
	this.rectShape.drawAt = function(x,y) {
		this.attr({
			x: x,
			y: y
		});
		that.textShape.drawAt(x,y);
	}
	
	this.textShape.drawAt = function(x,y) {
		this.attr({
			x: x,
			y: y
		});
		that.rectShape.drawAt(x,y);
	}
	
	this.rectShape.storeStartPoint = function() {
		var pos = this.getPoint();
		this.ox = pos.x;
		this.oy = pos.y;
		that.textShape.storeStartPoint();
	}
	
	this.textShape.storeStartPoint = function() {
		var pos = this.getPoint();
		this.ox = pos.x;
		this.oy = pos.y;
		that.rectShape.storeStartPoint();
	}
	
	this.rectShape.getPoint = function() {
		return new Point(this.attr('x'), this.attr('y'));
	}
	
	this.textShape.getPoint = function() {
		return new Point(this.attr('x'), this.attr('y'));
	}
	
	
	this.rectShape.revertToOrigPos = function(){
		this.attr({
					x: this.ox,
					y: this.oy					
				});
		that.textShape.revertToOrigPos();		
				
	}
	
	this.textShape.revertToOrigPos = function(){
		this.attr({
					x: this.ox,
					y: this.oy				
				});
		that.rectShape.revertToOrigPos();
	}
	
	this.rectShape.move = function(dx,dy){
		this.attr({x: this.ox + dx, y: this.oy + dy});
		that.textShape.move(dx,dy);
		that.textShape.toFront();
	}
	
	this.textShape.move = function(dx, dy){
		this.attr({
			x: this.ox + dx,
			y: this.oy + dy
		});
		that.rectShape.move(dx, dy);
		that.textShape.toFront();
	}
	
 }
 
 // ************************ > TextCounter ***************************************
function TextCounter(paper, x,y,side,textValue) {
	this.textValue = textValue;
	var DEFAULT_OPACITY = 1;
	
	this.shape = paper.text(x+side/2, y+side/2,textValue).attr({'font-size':side/2});
	//console.log(this.shape.attr('x') + ", " + this.shape.attr('y'));
	this.shape.attr({fill: "rgb(0,0,255)",stroke: "black",opacity: DEFAULT_OPACITY});

	this.setColor = function(color) {
		// TODO
	}

	
	this.shape.drawAt = function(x,y) {
		this.attr({
			x: x,
			y: y
		});
	}
	
	this.shape.storeStartPoint = function() {
		var pos = this.getPoint();
		this.ox = pos.x;
		this.oy = pos.y;
	}
	
	this.shape.getPoint = function() {
		return new Point(this.attr('x'), this.attr('y'));
	}
	
	this.shape.revertToOrigPos = function(){
		this.attr({
					x: this.ox,
					y: this.oy				
				});
	}
	
	this.shape.move = function(dx,dy){
		this.attr({x: this.ox + dx, y: this.oy + dy});
		this.toFront();
	}
	
	this.shape.getPosition = function(x, y ,count, numPerRow, height,padding){
		var xWidth = this.getBBox().width;
		var yWidth = this.getBBox().height;
		var rc = PRASAD.utils.getRowColumn(count,numPerRow);
		return  new Point(x + ( rc.col - 1) * xWidth + (rc.col - 1) * padding, 
							y + height - (rc.row ) * yWidth - (rc.row - 1) * padding);
		
	}
	
	
	
}
// ************************ < TextCounter ***************************************
 
 /* Not complete 11/19/2010
 // ************************ > SquareCounterWithText ***************************************
function SquareCounterWithText(paper, x,y,side,text) {
	var that = this;
	this.textValue = text;
	var DEFAULT_OPACITY = 1;
	this.shape = paper.rect(x , y, side,side);
	this.text = paper.text(x+side/2, y+side/2,text).attr({'font-size':side/2});
	this.shape.attr({fill: "white",stroke: "black",opacity: DEFAULT_OPACITY});
	
	this.shape.drawAt = function(x,y) {
		this.attr({
			x: x,
			y: y
		});
	}
	
	this.shape.storeStartPoint = function() {
		var pos = this.getPoint();
		this.ox = pos.x;
		this.oy = pos.y;
	}
	
	this.shape.getPoint = function() {
		return new Point(this.attr('x'), this.attr('y'));
	}
	
	this.shape.revertToOrigPos = function(){
		this.attr({
					x: this.ox,
					y: this.oy,					
				});
	}
	
	this.shape.move = function(dx,dy){
		this.attr({x: this.ox + dx, y: this.oy + dy});
		that.text.attr({x: this.ox + dx + side/2 , y: this.oy + dy + side/2});
		that.text.toFront();
	}
	
	this.shape.getPosition = function(x, y ,count, numPerRow, height,padding){
		var xWidth = this.getBBox().width;
		var yWidth = this.getBBox().height;
		var rc = PRASAD.utils.getRowColumn(count,numPerRow);
		return  new Point(x + ( rc.col - 1) * xWidth + (rc.col - 1) * padding, 
							y + height - (rc.row ) * yWidth - (rc.row - 1) * padding);
		
	}
}
*/
// ************************ < SquareCounterWithText ***************************************
  
// ************************ > DraggableCounter ***************************************
/*
 * counter: is one of CircleCounter, SquareCounter etc above
 */  
 /*
  function DraggableCounter(counter) {
 	
	this.counter = counter;												
	this.counter.inbox= null;
	
	this.setVisible = function(flag) {
		this.counter.setVisible(flag);
	}
	
	this.startDrag = function(dragComplete) {
		counter.shape.drag(move, start, dragComplete);
	}
	
	var move = function (dx, dy) {
    	// move will be called with dx and dy
		counter.shape.move(dx,dy);
		//counter.shape.toFront();
	};
	
	var start = function(){
		// storing original coordinates
		counter.shape.storeStartPoint();
	}
 }
 */
 // ************************ < DraggableCounter ***************************************
 
 // ************************ > TryAgain ***************************************
 function TryAgain(paper, x,y) {;
 	this.rect = paper.rect(x,y,100,50,2).attr({stroke:'none',fill:'yellow'});
	var boxWidth = this.rect.getBBox().width;
	var boxHeight = this.rect.getBBox().height;
 	this.text = paper.text(x + boxWidth/2, boxHeight/2 +y, "TRY AGAIN").attr({'font-size':boxHeight/3});
	this.text.hide();
	this.rect.hide();
	
	this.draw = function(){
		this.text.show();
		this.rect.show();
		this.rect.animate({scale:1.3}, 300 ,function() {
			this.animate({scale:1},300);
		});
		// Text cannot be animated on scale , so no point in the following:
		//this.text.animateWith(this.rect,{scale:1.3}, 300 ,function() {
		//	this.animate({scale:1},300);
		//});
		
	}
	
	this.hide = function(){
		this.text.hide();
		this.rect.hide();
	}
 }
 // ************************ < TryAgain ***************************************
 
// ************************ > Tick ***************************************
// A more elegant implementation than AnimatedTick
function Tick(paper, x, y){
	var that = this;
	this.thePath=[];
 	var getpath = PRASAD.utils.getpath;
	
	function createPath(path) {
		return paper.path(path).attr({"stroke": 'green', "stroke-width":5});
	}
	
	this.display = function() {
		//console.log("display");
		// A better way than clearing the path array may be to cache the previous paths
		if(this.thePath.length > 0 ) {
			this.thePath = [];
		}
		var path1= createPath(getpath("M",x,y));
		this.thePath.push(path1);
		var path = getpath("M",x,y) + getpath("L",x + 20,y +50);
		path1.animate({path:path},400,function(){
			path = getpath("M",x + 20,y + 50);
			var path2 = createPath(path);
			
			path = getpath("M",x + 20, y + 50) + getpath("L",x + 200,y);			
			path2.animate({path: path},200, function() {				
				that.thePath.push(path2);		
			});		
		});	
	}
	/*
	this.hide = function(){
		for( var k=0; k < this.thePath.length; k +=1 ) {
			this.thePath[k].hide();
		}
	}
	*/
	
	this.remove = function(){
		for( var k=0; k < this.thePath.length; k +=1 ) {
			this.thePath[k].remove();
		}
	}		
}
 // ************************ < Tick ***************************************
 
 //************************** > AnimatedTick ***************************
 
 function AnimatedTick(paper, x,y) {
	var that = this;
	
	// Create an arrays of the path that draws a tick. The individual elements of the path are
	// initially hidden
	this.mypath=[];
	var x2 = x, y2 = y;
	var xinc = 2, yinc = 2;
	// Create the paths for the descending part of the tick
	for( var k=0; k < 10 ; k++) {
		var s = "M " + x2 + "," + y2;
		x2 = x2 + xinc ;
		y2 = y2 + yinc;
		s += "L" + x2 + "," + y2;
		var path = makePath(s);
		path.hide();
		this.mypath.push(path);
	}
	// Create the paths for the ascending part of the tick
	xinc = 3;
	yinc = -2;
	for( k=0; k < 25 ; k++) {
		var s = "M " + x2 + "," + y2;
		x2 = x2 + xinc ;
		y2 = y2 + yinc;
		s += "L" + x2 + "," + y2;
		var path = makePath(s);
		path.hide();
		this.mypath.push(path);
	}
	
	function makePath(pathString) {
		return paper.path(s).attr({
				'stroke-width': 4,
				stroke: 'green'
			});;
	}
	
	
	this.hide = function(){
		for( var k=0; k < that.mypath.length; k +=1 ) {
			that.mypath[k].hide();
		}		
	}

	
	this.draw = function(){
		
		var id = setInterval(animate,10);		
		var count = 0;
		
		function animate(){
			if (count == that.mypath.length) {
				clearInterval(id);				
			}
			else {
				//console.log(count + ":" + that.mypath[count].toString());
				that.mypath[count].show();
				count++;
			}
		}
	}
}
//************************** < AnimatedTick ***************************



// ************************* > ScoreCard ***************************

/*
 * A score card which displays a graphic for a right response and another 
 * one for the wrong response, in a row one after the other
 * 
 * elementId is the id of the div specified in the markup in which this score card
 * will be displayed
 */
function ScoreCard(elementId) {
	
	
	var INIT_X =0;
	var INIT_Y=0;
	var CELL_GAP=2;
	//var CELLS_PER_ROW = 25;
	var CELLS_PER_ROW = $('#'+ elementId).attr("perRow") || 20;
	var CELLS_PER_COL = $('#'+ elementId).attr("perCol") || 2;
	var width = PRASAD.utils.getCSSInteger($('#' + elementId ), "width");
	var height = PRASAD.utils.getCSSInteger($('#' + elementId ), "height");
	
	var cellWidth= Math.floor(((width-2) - (CELLS_PER_ROW-1)* CELL_GAP )/CELLS_PER_ROW);
	var cellHeight = Math.floor( ((height-2) - (CELLS_PER_COL-1)* CELL_GAP )/CELLS_PER_COL);
	//var cellHeight = cellWidth;
	
	var CELLS_PER_ROW = $('#'+ elementId).attr("numRows");
		
	this.scPaper = new Raphael(elementId, width, height);
	
	this.x = INIT_X;
	this.y = INIT_Y;
	
	this.xCount=0;
	this.yCount =0;
	
	//this.scPaper.rect(this.x,this.y,width,height,2).attr({stroke: 'red'});
	
	this.drawCell = function(flag) {		
		this.xCount++;
		var color = flag ? "green" : "red";
		var drawX = this.x+ (this.xCount-1) * (cellWidth+CELL_GAP);
		if( (drawX+cellWidth) > width) {
			//console.log("next row");
			drawX = INIT_X;
			this.yCount++;
			this.xCount=1;
		}
		var drawY = this.y + this.yCount * (cellHeight+ CELL_GAP );
		if( (drawY + cellHeight)  > height) {
			this.xCount=1;
			this.yCount=0;
			//console.log("starting at top");
			drawY  = INIT_Y;
			drawX = INIT_X;
		}
		//console.log(drawX + "," + drawY);
		this.scPaper.rect(drawX ,drawY ,cellWidth,cellHeight,1).attr({fill:color, stroke:'none'});
	}
}

ScoreCard.prototype.correct = function(){
	
	this.drawCell(true);
}

ScoreCard.prototype.incorrect = function(){	
	this.drawCell(false);
}
// ************************* < ScoreCard ***************************


// ************************* > ScoreBoard ***************************
function ScoreBoard(paper,x,y) {
	var CELL_WIDTH=15;
	var CELL_HEIGHT = 15;
	this.paper = paper;
	this.x = x;
	this.y = y;
	this.count=0;
	
	this.rect = paper.rect(x,y, 200,CELL_HEIGHT).attr({stroke:'none'});
	
	this.drawCell = function(flag) {
		this.count++;
		var color = flag ? "green" : "red";
		this.paper.rect(this.x+ (this.count-1) * (CELL_WIDTH+1) , this.y,CELL_WIDTH,CELL_HEIGHT).attr({fill:color, stroke:'none'});
	}
}

ScoreBoard.prototype.correct = function(){
	this.drawCell(true);
}

ScoreBoard.prototype.incorrect = function(){
	this.drawCell(false);
}
// ************************* < ScoreBoard ***************************


/*
 * options:
 * x
 * y
 * width: width of the 5/10 Frame ( this has to be a multiple of 5)
 * frameType: 5 or 10
 * count: the initial value of how many counters are present
 */
// Replacement for PRASAD.widgets.math.NFrame
PRASAD.components.math.NFrame = function(options,myData) {
	var myData = myData || {};
	
	var GAP = 5,
		CELLS_PER_ROW = 5,
		DESELECT_COLOR = "#FFF",
		SELECT_COLOR = "#000";
		
	var numRows,
		radius,
		cellSide,
		height,
		outline,
		row,
		col,
		circle,
		cc,		
		kx,
		ky,
		k,
		getpath,
		line;
	
	var that = {};
	
	options.frameType = options.frameType || 10;
	numRows = options.frameType == 10 ? 2 : 1;
	
	getpath = PRASAD.utils.getpath;
	line = PRASAD.graphics.line;
	
	radius = PRASAD.utils.getRadius(options.width,GAP, CELLS_PER_ROW);
	cellSide = 2 * (radius + GAP);
	height = numRows * cellSide;
	
	// The outline of the NFrame
	outline = options.paper.rect(options.x, options.y, options.width, height).attr({fill: 'white'}); 
	
	that.circles = [];
	
	// This array stores the drawables which will need to be shown/hidden in order to make the 10/5 Frame
	// visible or invisible
	that.drawables = [];
	that.drawables.push(outline);
	myData.outline = outline;
	
	cc = 0;
	for (row = 1; row <= numRows; row++) {
		for (col = 1; col <= CELLS_PER_ROW; col++) {
			circle = options.paper.circle( 
										PRASAD.utils.getX(options.x,col,GAP,radius), 
										PRASAD.utils.getY(options.y,row,GAP,radius), 
										radius).attr({stroke:'none', fill: 'white'});
			circle.number = cc +1;									
			that.circles.push(circle);
			that.drawables.push(circle);
			cc++;
		}	
	}
	
	// Draw the vertical grid lines	
	for(k = 1; k < 5; k+=1) {
		kx = options.x + k * cellSide;
		that.drawables.push( line(options.paper, kx, options.y , kx, options.y+height));
	}
	
	// Draw the horizontal grid lines
	for( k=1 ; k < numRows ; k +=1) {
		ky = options.y + k * cellSide;
		that.drawables.push(line(options.paper, options.x, ky, options.x + options.width ,ky));
	}
	
	that.setVisible = function(flag){
		for( var k=0; k < that.drawables.length; k+=1) {
			if (flag) {
				that.drawables[k].show();
			}
			else {
				that.drawables[k].hide();
			}
		}
	};
	
	that.setCount = function(count){
		// the number of counters selected, if the count parameter is not specified it defaults to zero
		that.selectedCircleCount = count || 0;
		for (var i = 0; i < that.circles.length; i += 1) {
			var c = that.circles[i];
			
			if( count !== undefined) {
				if( i < count) {
					c.selected = true;											
				}
				else {
					c.selected = false;
				}
				that.drawCell(c);
			}
		}
	
	};
	
	that.getCount = function() {
		var count = 0,
		i;
		for (i = 0; i < that.circles.length; i += 1) {
			if (that.circles[i].selected) {
				count++;
			}
		}
		return count;
	};

	that.drawCell = function(circle){	
		var color = circle.selected ? SELECT_COLOR : DESELECT_COLOR;
		circle.attr({
			fill: color
		});
	
	}
	
	/*
	 * Gets the dimensions of the NFrame
	 * left, top, width, height
	 */
	that.getDimensions = function() {
		return {
			x: options.x,
			y: options.y,
			width: options.width,
			height:height
		}
	};
	
	that.setCount(options.count);
	
	return that;
	
}

/*
 * options:
 * x
 * y
 * width: width of the 5/10 Frame ( this has to be a multiple of 5)
 * frameType: 5 or 10
 * count: the initial value of how many counters are present
 * callback: the callback to be called after a cell in clicked on to increase/decrease the count
 */
PRASAD.components.math.InteractiveNFrame = function(options,myData){
	var myData = myData || {};
	var that = PRASAD.components.math.NFrame(options,myData);
	var circle,
	dim;
	that.interactEnabled = true;
	dim = that.getDimensions();
	for( var i=0; i < that.circles.length ;i++) {
		circle = that.circles[i];
		circle.node.onclick = function(){	
	
				
			var this_circle = circle;			
			return function(){
				if (!that.interactEnabled) {
					return;
				}
				if (this_circle.selected) {
					// if previously selected
					// deselect only if this cell is the last selected cell
					if (this_circle.number == that.selectedCircleCount) {
						this_circle.selected = false;
						that.drawCell(this_circle);
						that.selectedCircleCount--;
					}
				}
				else {
					// if previously de-selected
					// select only if it is one after the last selected cell
					if (this_circle.number == that.selectedCircleCount + 1) {
						this_circle.selected = true;
						that.drawCell(this_circle);
						that.selectedCircleCount++;
					}
				}
				if( options.callback !== undefined) {
					options.callback(that.getCount());
				}

			};
		}();
	}
	
	myData.outline.node.onmousemove = function(event) {
		if (!that.interactEnabled) {
			return;
		}
		var TOLERANCE =3;
		//console.log("offx = " + event.offsetX + " y = " + event.offsetY);
		//console.log("edge x  = " +( dim.x + dim.width) + " edge y = " + (dim.y + dim.height));
		var xoffset = Math.abs(event.offsetX - (dim.x + dim.width) );
		var yoffset = Math.abs(event.offsetY - (dim.y + dim.height));
		if( xoffset < TOLERANCE && yoffset <TOLERANCE && that.getCount() != options.frameType) {
			//console.log("click on edge");
			var marker = paper.circle(dim.x + dim.width,dim.y + dim.height,5).attr({fill:'#000'});
			setTimeout(function() {
					marker.remove();
					
				},1000);
			marker.node.onclick = function(){
				that.setCount(options.frameType);
				if( options.callback !== undefined) {
					options.callback(that.getCount());
				}
			}	
			
		}
	};
	
	/*
	 * Temporarily enabled/disable the interactivity with the 5/10 Frame
	 */
	that.enableInteraction = function(flag) {
		that.interactEnabled = flag;
	};
	
	return that;
}


// ************************* > NFrame ***************************
/*
 * A representation of either a 5 frame or a 10 frame depending on the
 * specified parameter
 * selectable : boolean indicating whether elements of the frame can be selected/deselected, i.e 
 *              if we can interactively change the # of elements in the frame
 * frameCount: 10 or 5 depending on whether it is a 10 frame or 5 frame
 * count: the initial value of how many counters are present
 */
// Note: DO NOT USE THIS : replaced by PRASAD.components.math.NFrame and PRASAD.components.math.InteractiveNFrame 
PRASAD.widgets.math.NFrame = function(paper1,x,y, width, selectable, frameCount, count){
	var that = this;
	
	this.frameCount = frameCount;
	var numRows = frameCount == 10 ? 2 : 1;
	var GAP = 5;
	var CELLS_PER_ROW = 5;
	
	var getpath = PRASAD.utils.getpath;
	var line = PRASAD.graphics.line;
	
	var radius = PRASAD.utils.getRadius(width,GAP, CELLS_PER_ROW);
	var cellSide = 2 * (radius+GAP);
	
	var height = numRows * 2 * ( radius + GAP);
	
	// The outline of the NFrame
	var outline = paper1.rect(x, y, width, height).attr({
		fill: 'white'
	}); 
	
	this.circles = [];
	
	// This array stores the drawables which will need to be shown/hidden in order to make the 10/5 Frame
	// visible or invisible
	this.drawables = [];
	this.drawables.push(outline);
	

	var cc = 0;
	
	for (var row = 1; row <= numRows; row++) {
		for (var col = 1; col <= CELLS_PER_ROW; col++) {
				var c = paper1.circle( //startX + (col - 1) * (2 * (radius + GAP)),
										PRASAD.utils.getX(x,col,GAP,radius), 
										PRASAD.utils.getY(y,row,GAP,radius),
										//startY + (yy - 1) * (2 * (radius + GAP)), 
										radius).attr({stroke:'none', fill: 'white'});
				c.number = 	cc +1;									
				this.circles.push(c);
				this.drawables.push(c);
				
				if (selectable) {
					c.node.onclick = function(){
						var this_circle = c;
						
						return function(){
							if (this_circle.selected) {
								// if previously selected
								// deselect only if this cell is the last selected cell
								if (this_circle.number == that.selectedCircleCount) {
									this_circle.selected = false;
									that.drawCell(this_circle);
									that.selectedCircleCount--;
								}
							}
							else {
								// if previously de-selected
								// select only if it is one after the last selected cell
								if (this_circle.number == that.selectedCircleCount + 1) {
									this_circle.selected = true;
									that.drawCell(this_circle);
									that.selectedCircleCount++;
								}
							}
						};
					}();
				}
				cc++;	
			}	
		}
		
		// if count has been specified in constructor, then select that many counters
		this.setCount(count);
		
	
	// Draw the vertical grid lines
	//var sx = x + 2 * (radius + GAP)  ;
	//var sx = x + cellSide  ;
	var line1;
	for( var k = 1; k < 5; k+=1) {
		//var kx = sx  +( k-1)* (2* (radius + GAP) );
		//var kx = sx  +( k-1)* cellSide ;
		var kx = x  + k * cellSide ;
		line1 = line(paper1, kx, y , kx, y+height);
		this.drawables.push(line1);
	}
	
	// Draw the horizontal grid lines
	//var sy = y + 2 * ( radius + GAP);
	//var sy = y + cellSide;
	for( k=1 ; k < numRows ; k +=1) {
		var ky = y + k * cellSide;
		line1 = line(paper1, x, ky, x + width ,ky);
		this.drawables.push(line1);
	}
}


PRASAD.widgets.math.NFrame.prototype.DESELECT_COLOR = "#FFF";
PRASAD.widgets.math.NFrame.prototype.SELECT_COLOR = "#000";

PRASAD.widgets.math.NFrame.prototype.setVisible = function(flag){
	
	for( var k=0; k < this.drawables.length; k+=1) {
		if (flag) {
			this.drawables[k].show();
		}
		else {
			this.drawables[k].hide();
		}
	}
	
}

PRASAD.widgets.math.NFrame.prototype.setCount = function(count){
	//console.log("setCount called with " + count);
	// the number of counters selected, if the count parameter is not specified it defaults to zero
	this.selectedCircleCount = count || 0;
	for (var i = 0; i < this.circles.length; i += 1) {
		var c = this.circles[i];
		c.selected = false;
		this.drawCell(c);
		
		if( count !== undefined) {
			if( i < count) {
				c.selected = true;
				this.drawCell(c);							
			}
		}
	}
}
PRASAD.widgets.math.NFrame.prototype.getCount = function() {
	var count = 0;
		for (var i = 0; i < this.circles.length; i += 1) {
			if (this.circles[i].selected) {
				count++;
			}
		}
		return count;
}

PRASAD.widgets.math.NFrame.prototype.drawCell = function(circle){	
		var color = circle.selected ? this.SELECT_COLOR : this.DESELECT_COLOR;
		circle.attr({
			fill: color
		});
	
}
// ************************* < NFrame ***************************

function SelectableNumbers3(paper, x, y, width, height, lower, upper, selectedCallback){
	var SELECT_BG = "green",
		SELECT_TEXT = "white",
		NORMAL_BG = "#6a6a6a",
		NORMAL_TEXT = "black";
		
	var RECT_NORMAL_OP = 0.6;	
	var RECT_SELECT_OP = 0.3;
	var RECT_DISABLED_OP = 0.2;
	
	this.shapes = [];
	this.outerRect = paper.rect(x,y,width,height,5).attr({'stroke-width':1,fill:'white'});
	var num = (upper -lower) +1;
	var horizontalGap = 2;
	var verticalGap =2;
	var rectWidth = Math.floor((width - (num+1) * horizontalGap)/num);
	horizontalGap =((width - (rectWidth * num))/(num+1));
	//console.log("gap = " + horizontalGap);
	//console.log("rect width = " + rectWidth);
	var rectHeight = height - 2 * verticalGap;
	for (var k = lower,  i=0; k <= upper; k += 1, i+=1) {
		var xx = x + i * rectWidth + (i+1) *  horizontalGap;
		var yy = y + verticalGap;
		var rect = paper.rect(xx,yy, rectWidth, rectHeight,5)
		this.shapes.push(rect);
		
		var text = paper.text(xx+rectWidth/2,yy+rectHeight/2,""+k);
		text.attr({fill: NORMAL_TEXT,'font-size':rectHeight/1.5});
		//rect.insertBefore(text);
		rect.toFront();
		//console.log(x + i * rectWidth + (i+1) *  gap);
		//console.log(this.shapes[i]);
		rect.attr({fill:NORMAL_BG,opacity:RECT_NORMAL_OP});
		rect.text = text;
		
		rect.node.onmouseover = function(){
			var this_rect = rect;			
			return function(){	
				//console.log("mouse in for "+ this_rect.text);
				if (!this_rect.disabled) {
					selectNumber(this_rect);
				}
			};
		}();
		
		rect.node.onmouseout = function(){
			var this_rect = rect;			
			return function(){	
				if (!this_rect.disabled) {
					//console.log("mouse in for "+ this_rect.text);
					deselectNumber(this_rect);
				}
			};
		}();


		rect.node.onmousedown = function(){
			var this_rect = rect;			
			return function(){	
					//console.log("down");
					if (!this_rect.disabled) {
						this_rect.attr({
							opacity: RECT_SELECT_OP
						});
					}		
			};
		}();
		
		
		rect.node.onmouseup = function(){	
			var this_rect = rect;
			return function(){
				//console.log("up");
				if (!this_rect.disabled) {
					this_rect.attr({
						opacity: RECT_NORMAL_OP
					});
					
					var numSelected = + this_rect.text.attr('text');
					//console.log("selected number is " + numSelected);
					if (selectedCallback !== undefined) {
						selectedCallback(numSelected);
					}
				}
			}			
		}();
		
		
	}
	
	// Tip: A good way to simulate the appearance of a button being active
	// i.e. when a mouse moves over, is
	// to change the stroke on the rectangle to none when clicked and some other
	// color (like black) when  the mouse moves out
	var selectNumber = function(rect) {
		rect.attr({fill:SELECT_BG, stroke:'none'});
	}
	
	var deselectNumber = function(rect) {
		rect.attr({fill:NORMAL_BG, stroke:'black'});
		
	}
	
	/*
	 * Enable or disable all the tiles
	 */
	this.setEnabled = function(flag) {
		
		for( var k=0; k < this.shapes.length; k +=1) {
			 
			this.shapes[k].disabled = !flag;
			if( !flag) {
				deselectNumber(this.shapes[k]);
			}
			var opacity = flag ? RECT_NORMAL_OP : RECT_DISABLED_OP;
			this.shapes[k].attr({opacity: opacity});
			var textOpacity = flag ? 1 : 0.2;
			this.shapes[k].text.attr({opacity: textOpacity});
		}
		var outerRectOpacity = flag ? 1 : 0.2;
		this.outerRect.attr({opacity: opacity});
	}
}

SelectableNumbers3.prototype.setVisible = function(flag){
	if(flag) {
		this.outerRect.show();
		for (var k = 0; k < this.shapes.length; k += 1) {
			this.shapes[k].show();
			this.shapes[k].text.show();
		}
	}
	else {
		this.outerRect.hide();
		for (k = 0; k < this.shapes.length; k += 1) {
			
			this.shapes[k].hide();
			this.shapes[k].text.hide();
		}
	}
}

SelectableNumbers3.prototype.animate = function() {
	this.outerRect.animate({scale:1.3}, 300 ,function() {
		this.animate({scale:1},300);
	});
}

// ************************* > SelectableNumbers ***************************
/*
 * A set of tiles that have numbers displayed on them and the tile under which the mouse is
 * is highlighted. On mouse click calls the specified callback with the number clicked on.
 * 
 * the 'div' passed in constructor is a div that has been specified in the markup.
 * The stylesheet should define the following:
  			#'div' > div[class='number'] {
				
		 	 	float:left;
				width:40px;
				height:40px;
				font-size:30px;
				background:yellow;
				text-align:center;	
				border: 1px solid #aaa;  				
		 	 } 
 */
PRASAD.widgets.math.SelectableNumbers = function SelectableNumbers(div, lower, upper, selectedCallback) {
	var SELECT_BG = "green",
		SELECT_FG = "white",
		DESELECT_BG = "yellow",
		DESELECT_FG = "black";
	this.ni = document.getElementById(div); 
	for (var k = lower; k <= upper; k += 1) {
		var newdiv = document.createElement('div');
		var divIdName = k;
		
		newdiv.setAttribute('id', divIdName);
		newdiv.setAttribute('class', "number");
		newdiv.innerHTML = k;
		newdiv.disabled = false;
		this.ni.appendChild(newdiv);
		
		
		newdiv.onmouseover = function(){
			if (!this.disabled) {
				selectNumber(this);		
			}
		}
		
		newdiv.onmouseout = function(){
			if (!this.disabled) {
				deselectNumber(this);
			}
		}
		
		newdiv.onmousedown = function(){
			if (!this.disabled) {
				this.style.opacity = "0.5";
			}
		}
		newdiv.onmouseup = function(){
			if (!this.disabled) {
				var numSelected = +this.innerHTML;
				//console.log("# selected: " + numSelected);
				this.style.opacity = "1";
				if (selectedCallback !== undefined) {
					selectedCallback(numSelected);
				}
			}
		}
	}
	
	var selectNumber = function(div) {
		div.style.background = SELECT_BG;
		div.style.color = SELECT_FG;
	}
	
	var deselectNumber = function(div) {
		div.style.background = DESELECT_BG;
		div.style.color = DESELECT_FG;
	}

	/*
	 * Enable or disable all the tiles
	 */
	this.setEnabled = function(flag) {
		var nodeList = this.ni.getElementsByClassName("number");
		for( var k=0; k < nodeList.length; k +=1) {
			//console.log(flag + ": value = " + nodeList[k].innerHTML); 
			nodeList[k].disabled = !flag;
			if( !flag) {
				deselectNumber(nodeList[k]);
			}
			nodeList[k].style.opacity = flag ? 1 : '0.4';
		}
	}
}

// ************************* < SelectableNumbers ***************************


// ************************* > SelectableNumbers2 ***************************

/*
 * A set of buttons that have numbers displayed on them and on mouse click calls
 * the specified callback with the number clicked on.
 * 
 * the 'div' passed in constructor is a div that has been specified in the markup.
 * The stylesheet should define the following:
 * 			 #'div' button {			 	
			 	width:40px;
				height:40px;
				font-size:20px;
			 }	
 * */
PRASAD.widgets.math.SelectableNumbers2 = function SelectableNumbers2(div, lower, upper, selectedCallback){
	
	this.ni = document.getElementById(div);
	for (var k = lower; k <= upper; k += 1) {
		
		var button = document.createElement('button');		
		button.setAttribute('id', k);		
		button.innerHTML = k;
		//button.disabled = true;
		this.ni.appendChild(button);
		
		button.onclick = function(){					
			var numSelected = +this.innerHTML;				
			if (selectedCallback !== undefined) {
				selectedCallback(numSelected);
			}		
		}
	}
	
	/*
	 * Enable or disable all the buttons
	 */
	this.setEnabled = function(flag) {		
		var nodeList = this.ni.getElementsByTagName("button");
		for( var k=0; k < nodeList.length; k +=1) { 
			nodeList[k].disabled = !flag;
		}
	}
	
}
//******************************** < SelectableNumbers2 ********************************

//******************************** > Shuffle ********************************
/*
 * A rectangular card that when you click into it a random number between 1 and 
 * the number specified in constructor is displayed. Once a number appears it can no
 * longer appear subsequently when you click. This means that with max number count of 10 
 * you can click at most 10 times and after that nothing happens.
 * 
 * x,y - left,top of the rectangle displaying the count
 * width of rectangle
 * height height of rectangle
 * numbersCount maximum count of numbers displayed , on each run the SHuffler will
 *              display a number between 1 and numbersCOunt
 * callback [optional] callback function that will be called after a shuffle is 
 * complete with the number 
 * repeat - a boolean that indicates whether you can repeat a number once it has appeared
 *          default value is false;
 * clickEnabled - a boolean that indicates if clicking enables the shuffling, default is true 
 */
function Shuffle(paper,x,y,width,height, numbersCount,callback,repeat,clickEnabled) {
	var that = this;
	repeat = repeat === undefined ? false: repeat;
	
	clickEnabled = clickEnabled === undefined ? true: clickEnabled;
	
	var getRand = PRASAD.utils.randomIntForRange;
	
	this.numbers= new Array(numbersCount);
	for (var c = 1; c <= numbersCount; c++) {
		this.numbers[c-1]=c;
	}
	
	var rect = paper.rect(x,y,width,height,3).attr({'stroke-width':2,fill:'white'});
	var fontSize = height/2;
	var count =1;
	var text = paper.text(x+width/2, y+height/2, "").attr({'font-size':fontSize,fill:"rgb(0,0,0)"});
	var set = paper.set(rect,text);

	
	var pulsate = false; 
	
	function setNumber(number) {
		text.attr({
			text: number
		});
	}
	
	setClickEnabled = function(flag) {
		if( !flag) {
			rect.node.onclick = null;
			text.node.onclick = null	;
		}
		else {
			rect.node.onclick = that.click;
			text.node.onclick = rect.node.onclick;
		}
		
	}
	
	this.setEnabled = function(flag) {
		setClickEnabled(flag);
		var opacity = flag ? 1: 0.3;
		set.attr({opacity:opacity});
		pulsate = flag;
	}
	
	/*
	 * Sets the background color of the tile to  the specified color
	 */
	this.setBackground = function(color) {
		rect.attr({fill:color});
	}
	
	this.click  =  function(){
		
		if(that.numbers.length == 0) {
			console.log("empty lotto");
			return;
		}
		var stop = false;
		pulsate = false;
		var number ;
		var r2 = getRand(1,3) * 1000;
		//console.log("timer  = " + r2);
		setTimeout(function() { 
			stop = true;
			count = getRand(1,10);
			if( repeat == false) {
				that.numbers.splice(that.numbers.indexofNumber(number),1);
			}
		},r2);
		
		var id = setInterval( function() {
			if (!stop) {
				
				var index = count % that.numbers.length;
				
				number = that.numbers[index];
				setNumber(number);
				count++;
			}
			else {
				clearInterval(id);
				pulsate = true;
				if(callback != undefined) {
					//console.log(callback.toString());
					callback(number);
				}
			}
		},100);
	};
	
	setClickEnabled(clickEnabled);
	
	this.setClickEnabled = function(flag) {
		setClickEnabled(flag);
	};
	
	/*
	 * Clears the number displayed
	 */
	this.clearDisplay = function() {
		setNumber("");
	};
	
	this.setVisible = function(flag) {
		if( flag) {
			set.show();
			pulsate = true;			
		}
		else {
			pulsate = false;
			set.hide();
		}
	}
	
	/*
	 * To enable the pulsating of the dice - this gives the appearance of an active entity
	 * needing some action
	 * Pulsating is acheivbed by animating the widtha and height to increase by 3 pixels and
	 * then reverting back to the original dim
	 */
	this.setPulsate = function(flag) {
		var INTERVAL1 = 200;
		var INTERVAL2 = 2000;
		if( !flag && this.pulsateId !== undefined) {
			clearInterval(this.puslateId);
		}	
		if (flag) {
			pulsate = true;
			if (this.pulsateId == undefined) {
				this.pulsateId = setInterval(function(){
					if (pulsate) {
						rect.animate({
							width: width + 3,
							height: height + 3
						}, INTERVAL1, function(){
							rect.animate({
								width: width,
								height: height
							}, INTERVAL1);
						});
					}
				}, INTERVAL2);
			}
		}
	}
};
//******************************** < Shuffle ********************************


/*
 * options: 
 * x - x location of start of grid
 * y - y location of start of grid
 * width - the width of the grid
 * numRows - the number of rows in the grid
 * numCols(optional) - the number of colums in the grid
 * startNumber (optional) - the starting number to be displayed on the grid
 * color(optional)
 * callback(optional) 
 */
PRASAD.widgets.math.SelectableNumberGrid = function(options) {
	
	var that = {};
	
	options.numCols  = options.numCols || 10;
	options.startNumber = options.startNumber == undefined ? 1: options.startNumber;
	options.color = options.color || '#FFF';
	
	var cellWidth = options.width/options.numCols;
	var cellHeight = cellWidth;	
	var height = cellHeight * options.numRows;
	
	var line = PRASAD.graphics.line;
	var cells = [];
	
	var number = options.startNumber;
	//console.log("start number = " +number);
	
	function callback(cellText) {
		//console.log("cell clicked: " + cellText);
		//that.setVisible(false);
		if( options.callback !== undefined) {
			options.callback(+ cellText);
		}
	}
	
	for( var row =1 ; row <= options.numRows; row +=1) {
		for (var col = 1; col <= options.numCols; col += 1) {
			var cell = PRASAD.components.HighlightableTextCell({
				paper:options.paper,
				x:options.x + (col -1) * cellWidth,
				y: options.y + (row-1) * cellHeight,
				width: cellWidth,
				height:cellHeight,
				text: ""+number,
				callback: callback
			});
			cells.push(cell);
			number++;			
		}
	}
	
	that.setVisible = function(flag) {
		for (var k = 0; k < cells.length; k += 1) {
			cells[k].setVisible(flag);
		}
	}
	
	that.getBBox = function() {
		return {
			width:options.width,
			height:height
		}
	}
	
	return that;
};
/*
 * options:
 * paper
 * x
 * y
 * width - the width of the grid
 * numRows - the number of rows in the grid
 * numCols(optional) - the number of colums in the grid
 * startNumber (optional) - the starting number to be displayed on the grid
 * color(optional)
 * callback
 * 
 */
PRASAD.widgets.math.FloatingSelectableNumberGrid = function(options){
	var BORDER=5;
	var that;
	var actualCallback = options.callback;
	
	options.callback = function(cellText) {
		that.setVisible(false);
		actualCallback(cellText);
	};
	
	that = PRASAD.widgets.math.SelectableNumberGrid(options);
	
	var cross = PRASAD.graphics.Cross( {
								paper:options.paper,
								x:options.x + options.width, 
								y: options.y,
								callback: function() {
									that.setVisible(false);
								}
							}
							);
	var superSetVisible = that.superior('setVisible');	
		
	that.setVisible = function(flag) {
		superSetVisible(flag);	
		cross.setVisible(flag);	
	};
	
	return that;
};

// ***************************************** >  NumberGrid ************************************
/*
 * A square grid (number of rows = number of columns) with the specified number of rows/columns
 * Each cell of the grid displays a number starting from 1 onwards, proceeding from top,left to the right
 * and then next row
 */
PRASAD.widgets.math.NumberGrid = function MGrid(paper,x,y,widthOrHeight,numRowsOrColls) {
	var that = this;
	
	this.x = x;
	this.y = y;
	this.width = widthOrHeight;
	this.height = widthOrHeight;
	this.paper = paper;
	
	this.NUM_COLS = numRowsOrColls || 10;
	this.NUM_ROWS = this.NUM_COLS;
	//console.log(this.NUM_COLS + " - " + this.NUM_ROWS);
	this.cellHeight = this.height/this.NUM_ROWS;
	this.cellWidth = this.width/this.NUM_ROWS;	
	
	this.display();
	
}

PRASAD.widgets.math.NumberGrid.prototype.display= function (){
	var that = this;
	var line = PRASAD.graphics.line;
	for (var row=1; row <= this.NUM_ROWS+1; row += 1 ) {
		var ypoint = this.y + (row-1)* this.cellHeight;
		drawLine(this.x,ypoint,(this.x + this.width),ypoint); 
	}
	
	for (var col = 1; col <= this.NUM_COLS+1; col += 1) {		
		var xpoint = this.x + (col-1)* this.cellWidth;
		drawLine(xpoint, this.y,xpoint,this.y + this.height);
	}
	
	for (var count = 1; count <= this.NUM_COLS * this.NUM_ROWS ; count += 1) {
		this.drawCellText(count,count);
	}
	
	function drawLine(x1,y1,x2,y2) {
		line(that.paper, x1,y1,x2,y2).attr({stroke:'black','stroke-width':1});
	}
	
	function drawText(x,y,text){
		that.paper.text(x,y,text).attr({'font-size':that.cellHeight/2, fill:"rgb(0,0,0)"});
	};
};



PRASAD.widgets.math.NumberGrid.prototype.drawCellText = function(index,text) {
	var that = this;
	var rc = this.getRowColPosition(index);
	var myX = this.x + (rc.col - 1) * this.cellWidth;
	var myY = this.y + (rc.row - 1) * this.cellHeight;
	drawText( myX + this.cellWidth/2, myY+this.cellHeight/2,index);
	
	function drawText(x,y,text){
		that.paper.text(x,y,text).attr({'font-size':that.cellHeight/2, fill:"rgb(0,0,0)"});
	};
}

PRASAD.widgets.math.NumberGrid.prototype.getRowColPosition = function (num) {	
	return PRASAD.utils.getRowColumn(num,this.NUM_ROWS);
};
// ***************************************** <  NumberGrid ************************************
 
 
 // ***************************************** >  HundredsChart ************************************
//PRASAD.widgets.math.HundredsChart = function(paper,x,y,width) {
//	this.prototype = new PRASAD.widgets.math.MGrid(paper,x,y,width,10);
//}
 
 // ***************************************** <  HundredsChart ************************************

 // ***************************************** > NumberTile ************************************
 /*
  * A visual display of a number in a container of sorts (like a Square)
  */
 PRASAD.widgets.math.NumberTile = function(paper,x,y,width,number) { 	
	this.label = new PRASAD.widgets.Label(paper, x,y,width,width,number,"white");
 }
 
 /*
  * Set the number displayed to the specified count
  */
 PRASAD.widgets.math.NumberTile.prototype.setCount = function(count){
 	this.label.setText(count);
 }
 
 /*
  * Get the value of the displayed number
  */
 PRASAD.widgets.math.NumberTile.prototype.getCount = function(){
 	var count = + this.label.getText();
	return count;
 }
 
 /*
  * Show/Hide the the NumberTile
  */
 PRASAD.widgets.math.NumberTile.prototype.setVisible = function(flag){
 	this.label.setVisible(flag);
 }
 // ***************************************** < NumberTile ************************************
 

 
 // **************************************** > Mediator ************************************
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
	
	// called when counter was in the box at the start of the drag	
 	this.up = function(){
		//console.log("Up called - mediator: ");
		// The this reference is the raw shape (circle etc)
		var pos = this.getPoint();
		var withinBox = that.findBox(pos.x,pos.y);
		// Check if this location is within any of the boxes
		
		// If the drop destination in a box and the box is the same as the 
		// drag source, then revert the counter to its original location within
		// the box. Else remove it from the box 
		if( withinBox != null && withinBox == this.inbox){
			this.revertToOrigPos();
		}
		else {			
			this.inbox.removeShape(this);				
			this.remove();			
		}
	}
 }
 
  // **************************************** > Counters ************************************
 function Counters(paper,x,y,radius,numCounters,mediator,alignVertical) {
 	var that = this;
		
	var alignVert = alignVertical || false; 
 	var gap =0;
	var offset = 20;
	this.counters = new Array();
	 
	
	this.countLabel = paper.text(!alignVert ? x  : x, 
								 !alignVert ? y : y, numCounters).attr({
			'font-size': 18,
			fill: "rgb(0,0,0)"
	});
	
	for(var i=0; i < numCounters;i++ ) {
		if (!alignVert) {
			this.counters[i] = createCounter(offset + x + (i + 1) * radius / 2, y, radius);
		}
		else {
			this.counters[i] = createCounter(x, offset + y + (i+1) * radius/2, radius);
		} 		
		//counters[i] = getCounter(x + (i+1) * radius/2-radius , y-radius/2, radius*2);	
	}

 	function createCounter(x, y, radius){
		return  new CircleCounter(paper,x , y, radius);		
		//return new SquareCounter(paper,x ,y , radius,radius);
	} 
	
	function revertCountersToOriginalPosition() {
		for (var i = 0; i < that.counters.length; i+=1) {
			that.counters[i].shape.revertToOrigPos();				
		}
	}
	
	// this function is called when the counters are in the bank at the start of the drag
	var up = function(){	
		var pos = this.getPoint();
		var box = mediator.findBox(pos.x,pos.y);
		if (box != null) {
			if (box instanceof DummyBaseBox) {
				if (that.counters.length > 0) {
					if (box.isCapacityExceeded(that.counters[0].shape, that.counters.length)) {
						console.log('Box has exceeded capacity');
						revertCountersToOriginalPosition();
						return;
					}				
				}
			// The dragged counters now have to be filled in the box.
			// The counters have to replenished in the bank. We use the same counters
			// used in the drag to do so, by reverting them to their original location
			// To create new counters for the destination box, create new stand alone counters
			// and add them individually to the box 	
			revertCountersToOriginalPosition();		
			for (var i = 0; i < that.counters.length; i += 1) {
				//recycle the counters back to the counters bank				
				//that.counters[i].shape.revertToOrigPos();
	
				// Create a new counter for the box (this is in a loop)				
				var ct = createCounter(x, y, radius);
				//ct.inbox = null;
				ct.shape.inbox = box;
				ct.shape.drag(ct.shape.move, function(){
					var this_counter = ct;
					return function(){
						this_counter.shape.storeStartPoint();
					};
				}(), mediator.up);
				// Adding the counter individually to box
				box.addShape(ct.shape);
			}
			if (box.done !== undefined) {
				box.done();
			}
		}
		else {
			// This is not an instance of a destination box that use currently :
			//- less-more-same
			// - part-part-whole-2
			// i.e. it is not supposed to just redistribute the counters in a 
			// orderly fashion
			// This is used so far in only the Counting app (counting.js)
			revertCountersToOriginalPosition();
			//box.add(that.counters.length,that.counters[0].shape.attr('fill'));
			box.drop(that.counters);
		}
		}
		else {	
			// Drag destination is not any box, revert the counter(s) to original location		
			revertCountersToOriginalPosition();
		}
	}
	
	//TODO:  Have to figure out where to call this from to stop the drag
	this.stopDrag = function(){
		for(var i=0; i < that.counters.length;i++ ) {				
			that.counters[i].shape.undrag();		
		}
	}
	
	this.startDrag = function(){
		for(var i=0; i < that.counters.length;i++ ) {				
			that.counters[i].shape.drag(move, start, up);
		}
	}
	
	var start = function(){
		//console.log("in start");
		for (var i = 0; i < that.counters.length; i++) {
			that.counters[i].start();
			//var c = that.counters[i].shape;
			//c.storeStartPoint();
		}
	}
	
	var move = function (dx, dy) {
		//console.log("in move");
		for(var i=0; i < that.counters.length;i++ ) {
			that.counters[i].move(dx,dy);
			//var c = that.counters[i].shape;
			//c.move(dx,dy);
			//c.toFront();
		}		
	};
 }
 
 Counters.prototype.setColor = function(color){
 	for( var i=0; i < this.counters.length;i++) {
			this.counters[i].setColor(color);
	}
 }
 
 /*
  * Show/Hide the counters
  */
Counters.prototype.setVisible = function (flag) {
	for( var i=0; i < this.counters.length;i++) {
			this.counters[i].setVisible(flag);
	}
	/*
	 Revisit: Why is this not working?		 
	var method1 = flag ? this.countLabel.show : this.countLabel.hide;
	method1();
	*/
	if( flag) {
		this.countLabel.show();
	}		
	else {
		this.countLabel.hide();
	}
}
// **************************************** < Counters ************************************
 

function DummyBaseBox() {
	
} 
 
// **************************************** > BaseBox ************************************
// This implementation is not complete
// When complete it should be used as base class for all boxes
  function BaseBox(paper, x, y, width, height, text){
	var Label = PRASAD.widgets.Label;
 	
 	this.x = x;
 	this.y = y;
 	this.width = width;
 	this.height = height;
	this.text = text;

 	var NUM_PER_ROW = 5;
 	var padding = 2;
 	var shapes = new Array();
	
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

/*
PRASAD.utils.Task = function(name,time, tries) {
	
	var subTasks = [];
	this.name = name;
	this.time = time || 0 ;
	this.tries = tries || 0;
	this.number  = 0;
	
	
	this.addSubTask = function(task) {
		subTasks.push(task);
	};
	
	this.getSubTask = function(index) {
		return subTasks[index];
	}
	
	this.print = function() {
		console.log("Task: " + this.name);
		console.log("Number: " + this.number);
		console.log("Total Time: " + this.time);		
		console.log("# Tries: " + this.tries);
		if (subTasks.length > 0) {
			console.log("Sub Tasks: ");
			for (var i = 0; i < subTasks.length; i++) {
				subTasks[i].print();
			}
		}
	}
	
}
*/



PRASAD.utils.Activity = function(name) {
	
	var that = {};
	
	var done = false;
	
	that.name  = name;	
	that.contextData = null;
	that.time = 0;
	//that.tries =0;
	that.tryData =[];
	var startDate = null,
		endDate = null;
	
	
	that.getTries = function() {
		return that.tryData.length;
	};
	
	/*
	 * Returns elapsed time for the activity in seconds
	 */
	that.getElapsedTime = function() {
		var millis = endDate  - startDate;
		return Math.round(millis / 1000);
	};		
		
	that.init = function() {
		that.tryData.splice(0,that.tryData.length);
		that.time = 0;
		startDate = null;
		endDate = null;
		done = false;
	};
	
	that.isDone = function() {
		return done;
	}
		
	that.start =  function(contextData){
		if( contextData !== undefined) {
			this.contextData = contextData;
			
		}
		startDate = new Date();
		that.done = false;
	};
	
	that.stop = function(){
		endDate = new Date();
		that.time = that.getElapsedTime();
		done = true;
	};
	
	that.addTry = function(number, comment) {
		that.tryData.push({
			number:number,
			comment:comment	
		})
	};
	

	
	that.print = function() {
		console.log("Activity Name: " + that.name + "; Tries: "+ that.getTries() + "; Time: " + that.time + "; ContextData: " + that.contextData);
	}
	
	return that;
}

PRASAD.utils.updateScore = function(activity, tableId) {
	
	$("#"+tableId).find('tbody')
    					.append($('<tr>')
							.append($('<td>')
            							.text("" + activity.contextData))	
							.append($('<td>')
            							.text("" + activity.time))							
							.append($('<td>')
            							.text("" + activity.getTries()))

							);
};


PRASAD.utils.ActivityList = function(){
	this.activities = [];
	this.activityNames = [];
}

PRASAD.utils.ActivityList.prototype = {
	
	addActivity : function(activity) {
		this.activities[activity.name] = activity;
		console.log("Added activity: " + activity.name );
		this.activityNames.push(activity.name);
		//this.activities.push(activity);
	},
	
	getActivity : function(name) {
		return this.activities[name];
	},
	
	print : function() {
		for( var i =0; i < this.activityNames.length;i++) {			
			this.activities[this.activityNames[i]].print();
		}
		
	},
	
	init : function() {
		for( var i =0; i < this.activityNames.length;i++) {			
			this.activities[this.activityNames[i]].init();
		}
	},
	
	
	isDone : function() {
		var isDone = true;
		for (var i = 0; i < this.activityNames.length; i++) {
			console.log("Activity: " + this.activityNames[i] + " : " +this.activities[this.activityNames[i]].isDone() );
			isDone = isDone && this.activities[this.activityNames[i]].isDone();
		}
		return isDone;
	},
	
	getPercentComplete : function() {
		var numComplete = 0;
		for (var i = 0; i < this.activityNames.length; i++) {
			if( this.activities[this.activityNames[i]].isDone()) {
				numComplete++;
			}
		}
		return 100 * numComplete/this.activityNames.length; 
	}
	
}

PRASAD.utils.Timer = function() {
	
	var start,
		end ;
	
	this.start = function() {
		start = new Date();
	}
	
	this.stop = function() {
		end = new Date();
	}
	
	this.getTimeInSeconds = function() {
		var millis = end - start;
		return Math.round(millis / 1000);
	
	}
	
	this.print = function() {
		console.log("Time (seconds) : " + this.getTimeInSeconds());
	}
}

function ScoreBoard(paper, x, y, width, height, interval){
	var that = this;
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.paper = paper;
	
	var radius = 10;
	var gap = 3;
	this.sessionActive = false;
	//var INCORRECT_COLOR = "red";
	this.COLORS = ['green', 'blue', '#F87431']; /* Sienna 1*/
	
	this.colorIndex = 0;
	
	
	this.outerRect = paper.rect(x, y, width, height, 4).attr({
		'stroke-width': 3,
		fill: '#CCFB5D'
	}); // Dark Olive Green1
	this.numStars = 0;
	
	var starsPerRow = Math.floor((width - gap) / (gap + 2 * radius));

	
	this.newSession = function(taskName){
		this.task = {};
		this.task.name = taskName;
		if (!this.sessionActive) {
			this.task.tries =0;
			this.sessionActive = true;
			this.numStars++;
			this.startDate = new Date();
			this.draw();
		}
		else {
			console.log("There is a current active session, cannot start new one...");
		}
	}
	
	this.incorrect = function(){
			
		if (that.sessionActive) {
			this.task.tries++;
		}
		else {
			console.log("no active session");
		}
	}
	
	
	this.correct = function(){
		if (that.sessionActive) {
			this.task.tries++;
			clearSession();
			
			var endDate = new Date();
			var millis = endDate - this.startDate;
			var seconds = Math.round(millis / 1000);
			console.log("# seconds = " + seconds + "; Num tries = " + that.numTries);
			that.task.seconds = seconds;
			console.log("Task Name: " + that.task.name +
						"; Number of tries: " + that.task.tries +
						"; Number of seconds: " + that.task.seconds);
		}
		else {
			console.log("no active session");
		}
	}
	
	function clearSession(){
		clearInterval(that.sessionId);
		that.sessionActive = false;
		that.colorIndex = 0;
	}
	
	

	this.draw = function(){
		var that = this;
		
		var rc = PRASAD.utils.getRowColumn(this.numStars, starsPerRow);
		//console.log(rc.row+"," + rc.col);
		var cx = this.x + gap * rc.col + radius * (2 * rc.col - 1);
		var cy = this.y + gap * rc.row + radius * (2 * rc.row - 1);
		var star = this.paper.circle(cx, cy, radius).attr({
			fill: that.COLORS[that.colorIndex],
			stroke: 'none'
		});
		that.activeStar = star;
		
		this.sessionId = setInterval(function(){
			
			var prevIndex = that.colorIndex;
			that.colorIndex = that.colorIndex < that.COLORS.length - 1 ? that.colorIndex + 1 : that.COLORS.length - 1;
			//console.log(prevIndex + " - " + that.colorIndex);
			if (prevIndex != that.colorIndex) {
				console.log("Color to draw: " + that.COLORS[that.colorIndex]);
				that.activeStar.attr({
					fill: that.COLORS[that.colorIndex]
				});
			}
			
		}, interval);
	}
	
}

Raphael.shadow = function (x, y, w, h, options) {
            // options format: {
            //     size: 0..1, shadow size
            //     color: "#000", placeholder colour
            //     stroke: "#000", placeholder stroke colour
            //     shadow: "#000", shadow colour
            //     r: 5, radius of placeholder rounded corners
            // }
            options = options || {};
            var t = ~~(size * .3 + .5),
                size = (options.size || 1) * 10,
                color = options.color || "#fff",
                stroke = options.stroke || color,
                shadowColor = options.shadow || "#000",
                R = options.r || 3,
                s = size,
                b = size * 2,
                r = b + s,
                rg = this.format("r{0}-{0}", shadowColor),
                rect = "rect",
                circ = "circle",
                none = "none";
				
			var res = this([
                x - s, y - t, w + (x = s) * 2, h + (y = t) + b,
				
                {type: rect, x: x - s, y: y - t, width: b + s, height: h + y + b, stroke: none, fill: this.format("180-{0}-{0}", shadowColor), opacity: 0, "clip-rect": [x - s + 1, y - t + r, b, h + y + b - r * 2 + .9]},
				
                {type: rect, x: x + w - b, y: y - t, width: b + s, height: h + y + b, stroke: none, fill: this.format("0-{0}-{0}", shadowColor), opacity: 0, "clip-rect": [x + w - s + 1, y - t + r, b, h + y + b - r * 2]},
                {type: rect, x: x + b - 1, y: y + h - s, width: w + b, height: b + s, stroke: none, fill: this.format("270-{0}-{0}", shadowColor), opacity: 0, "clip-rect": [x + b, y + h - s, w + b - r * 2, b + s]},
				
                {type: rect, x: x + s - 1, y: y - t, width: w + b, height: b + s, stroke: none, fill: this.format("90-{0}-{0}", shadowColor), opacity: 0, "clip-rect": [x + b, y - t, w + b - r * 2, s + t + 1]},
				
                {type: circ, cx: x + b, cy: y + h - s, r: r, stroke: none, fill: rg, opacity: 0, "clip-rect": [x - s, y + h - s + .999, r, r]},
			
                {type: circ, cx: x + w - b, cy: y + h - s, r: r, stroke: none, fill: rg, opacity: 0, "clip-rect": [x + w - b, y + h - s, r, r]},
				
                {type: circ, cx: x + b, cy: y - t + r, r: r, stroke: none, fill: rg, opacity: 0, "clip-rect": [x - s, y - t, r, r]},
			
                {type: circ, cx: x + w - b, cy: y - t + r, r: r , stroke: none, fill: rg, opacity: 0, "clip-rect": [x + w - b, y - t, r, r]},
				
                {type: rect, x: x, y: y, width: w, height: h, r: R, fill: color, stroke: stroke}
                
                ]);
            return res[0].paper;
        };
		
function ArrowDim(stickWidth, stickHeight, arrowWidth,arrowHeight) {
	this.stickWidth = stickWidth;
	this.stickHeight = stickHeight;
	this.arrowWidth = arrowWidth || stickHeight;
	this.arrowHeight = arrowHeight || stickHeight/2;	
}

/*
 * An arrow graphic
 * x - the x location that the arrow is to point to
 * y - the y location that the arrow is to point to
 * direction - the direction in which the arrow is animated. Permitted values are:
 * 				LTR: left to right
 * 				RTL: right to left
 * 				UTD: up to down
 * 				DTU: down to up
 * dim - the dimensions of the arrow which looks like this:
     __________|\
    |            \(x,y)
    |__________  /
               |/
 */
function Arrow(paper, x, y, direction , dim) {
	this.direction = direction || "LTR";
	this.dim = dim || new ArrowDim(40,20);
	
	//var DELTA = 20;
	var rotate = 0;
	switch (this.direction) {
		case "LTR":			
			//this.deltaX = 1 * DELTA;
			//this.deltaY = 0;
			rotate = 0;
			break;
		case "RTL":			
			///this.deltaX = -1 * DELTA;
			//this.deltaY = 0;
			rotate = -180;
			break;
		case "UTD":			
			//this.deltaX = 0;
			//this.deltaY = 1 * DELTA;
			rotate = 90;
			break;	
		case "DTU":
			//this.deltaX = 0;
			//this.deltaY = -1 * DELTA;
			rotate = -90;
			break;					
	}

	var arr = [	
			'M', x /*- DELTA*/, y,
			'l' , -this.dim.arrowWidth, this.dim.arrowHeight + this.dim.stickHeight/2,
			0, -this.dim.arrowHeight,
			-this.dim.stickWidth,0,
			0, -this.dim.stickHeight,
			this.dim.stickWidth, 0,
			0, -this.dim.arrowHeight,
			'Z'			
	];
	
	var path = arr.join(' ');
    this.arrowPath = paper.path(path).attr({fill:'#4CC417'});
	this.arrowPath.hide();	
	this.arrowPath.rotate(rotate,x,y); 	
	this.arrowPath.show();	
}
	

/*
 * A arrow that goads the user, this is done by animating the arrow forward-backward or up-down
 * pointing to the element on the screen
 * x - the x location that the arrow is to point to
 * y - the y location that the arrow is to point to
 * direction - the direction in which the arrow is animated. Permitted values are:
 * 				LTR: left to right
 * 				RTL: right to left
 * 				UTD: up to down
 * 				DTU: down to up
 * dim - the dimensions of the arrow which looks like this:
 * delta - the amount by which the arrow moves forward and backward
     __________|\
    |            \(x,y)
    |__________  /
               |/
 */	
function GoadingArrow(paper, x, y, direction,dim, delta, marker){
	this.arrow = new Arrow(paper,x,y,direction,dim);
	this.marker = marker;
	direction = this.arrow.direction;
	dim = this.arrow.dim;
	this.anim = true;
	
	var DELTA  = delta || 20;
	
	switch (direction) {
		case "LTR":			
			this.deltaX = 1 * DELTA ;
			break;
		case "RTL":			
			this.deltaX = -1 * DELTA;
			this.deltaY = 0;	
			break;
		case "UTD":			
			this.deltaX = 0;
			this.deltaY = 1 * DELTA;	
			break;	
		case "DTU":
			this.deltaX = 0;
			this.deltaY = -1 * DELTA;
			break;					
	}
	
}

GoadingArrow.prototype.startAnimation = function() {
	this.anim = true;

	//console.log("SA: " + this.intervalId + " for marker : " + this.marker);
	
	// clear a previously set interval, if any
	//clearInterval(this.id);
	// Show the arrow if it is currently hidden because of a previous stopAnimation()
	this.arrow.arrowPath.show();
	var that = this;
	var ADV_RETREAT_INTERVAL = 200;
	var dx = this.deltaX,
	dy = this.deltaY;
	//console.log(dx);
	that.arrow.arrowPath.translate(-1 * dx, -1 *dy);
	
	this.id = setInterval( function() {							
		
		
			var advance = 1 * dx + ", " + 1 * dy;
			// Advance motion of arrow
			that.arrow.arrowPath.animate({
				translation: advance
			}, ADV_RETREAT_INTERVAL, function(){
				// Stop the animation on the advance , so that when it is shown again ( on the next
				// startAnimation, it starts at the same point as the pointed to
				if (that.anim == false) {
					//console.log("Clearing interval for marker: " + that.marker + ", id: " + that.id );
					clearInterval(that.id);
					that.id = undefined;
					that.arrow.arrowPath.hide();
				}
				else {
					dx = -1 * dx;
					dy = -1 * dy;
					
					var retreat = dx + ", " + dy;
					dx = -1 * dx;
					dy = -1 * dy;
					// Retreat motion of arrow													
					that.arrow.arrowPath.animate({
						translation: retreat
					}, ADV_RETREAT_INTERVAL);
				}
				
			});
		
	},1000);	
	
}	

GoadingArrow.prototype.stopAnimation = function(){
	this.anim = false;
	/*
	console.log("Clearing interval for marker: " + this.marker);
	clearInterval(this.id);
	this.id = undefined;
	this.arrow.arrowPath.hide();
	*/
	
}

/*
 * This replaces ForwardArrow
 */
function ArrowButton(paper, x, y, dim, callback){
	
	var arrow = new Arrow(paper,x,y,"LTR",dim);
	var strokeColor = arrow.arrowPath.attr('stroke');

	arrow.arrowPath.node.onclick = function() {
		if( callback !== undefined) { 
			callback();
		}
	}
	
	new Shape(arrow.arrowPath);
} 

/*
		
function ForwardArrow(paper, x, y, callback){
	
	var stickWidth = 50, arHeight = 10, arWidth = 20, stickHeight = 20;
	
	var arr = ['M', x, y, 
				'l',stickWidth, 0, 
				0, -(arHeight), 
			
				arWidth, (arHeight + stickHeight / 2),
				
				-arWidth, arHeight + stickHeight / 2,
				 
				0, -arHeight,
				 
				-stickWidth, 0, 
				'Z'];	
	var path = arr.join(' ');
	var arrow = paper.path(path).attr({fill:'#4CC417'});
	//console.log(arrow.node);
	
	

	arrow.node.onclick = function() {
		if( callback !== undefined) { 
			callback();
		}
	}
	
	
	arrow.node.onmouseout = function(){		
		arrow.attr({'stroke-opacity':1.0});
	}
	arrow.node.onmouseover = function(){
		
		arrow.attr({'stroke-opacity':0.5});
	}
} 
*/

function Shape(shape) {
	var that = this;
	this.shape = shape;
	var stroke = this.shape.attr('stroke');
	
	shape.node.onmouseover = function(){	
		that.shape.attr({stroke:'none'});
	};
		
	shape.node.onmouseout = function(){
		that.shape.attr({stroke:stroke});
	};

	shape.node.onmousedown = function(){
		that.shape.attr({'fill-opacity':0.7});
	};
	
	shape.node.onmouseup = function(){
		that.shape.attr({'fill-opacity':1});
	};
}

/*
 * 
 * interval - timer interval in milliseconds
 */
function BarTimer(paper, x,y,width, height,interval, complete) {
	
	var rect = paper.rect(x,y,width,height);
	var progress = paper.rect(x,y,1,height).attr({fill:'green'});
	
	this.initialize = function() {
		progress.attr({
			x: x,
			y: y,
			width: 1,
			height: height
		});	
	};
	
	this.start = function() {		
		progress.animate({width: width},interval,complete);
	}	
	
	this.setVisible = function(flag) {
		if(flag) {
			rect.show();
			progress.show();
		}
		else {
			rect.hide();
			progress.hide();

		}
	}
}

function ProgressBar(paper, x, y, width, height){
	var color = "#C9BE62"; // Khaki3
	var fontSize = height/1.5;
	
	var dim = {
			x:x,
			y:y,
			width:width,
			height:height
	};
	var rect = paper.rect(x , y, width, height, 3).attr({fill: color});
	var text = paper.text(x+10, y +height/2 ,"").attr({'font-size':fontSize, 'text-anchor':'start'});
	var xgap = 2,
		ygap = 1;
	
	var correctnessRectWidth = width/10;
	var cx = x + width - xgap - correctnessRectWidth;
	var correctnessRect = paper.rect(cx , y + ygap, correctnessRectWidth, height - 2 * ygap).attr({stroke:'black',fill: 'white'});
	var bar = paper.rect(correctnessRect.attr('x'), correctnessRect.attr('y'),0,correctnessRect.attr('height')).attr({
		fill: 'green',
		stroke: 'none'
	});
	
	this.getDimensions = function() {
		return dim;
	}
	
	this.percentComplete = function(percent) {
		var nowWidth = correctnessRectWidth * percent/100;
		bar.attr({fill:'green',width:nowWidth});
	};
	
	this.correct = function() {
		this.percentComplete(100);
	}
	
	this.incorrect = function() {
		bar.attr({fill:'red',width:correctnessRectWidth});		
	}
	
	this.clearDisplay = function() {
		this.display("");
	};
	
	this.display = function(message){
		text.attr({
			text: message
		});
	}
	
	this.resetCorrectness = function() {
		bar.attr({fill:'green',width:0});
	}
	
	
}

/*
 * Displays instructions to the user
 */
function InstructionsBar(paper,x,y,width,height) {
	var that = this;
	var GAP = 2;
	var colorFrom = "#4AA02C";
	//var colorTo = "#57E964";
	var colorTo = "#FDD017";
	var dim = {
			x:x,
			y:y,
			width:width,
			height:height
	};
	var animateDisplay = true;
	//this.rect = paper.rect(x+GAP,y-height-GAP,width - 2 * GAP,height,3).attr({fill:colorFrom});
	this.rect = paper.rect(x,y,width,height,3).attr({fill:colorFrom});
	var fontSize = height/1.8;
	console.log("Instruction bar : height = " + height + " font-size = " + fontSize);
	//this.text = paper.text(x+10, y-height/2, "dummy text").attr({'font-size':fontSize,fill:"rgb(0,0,0)", 'text-anchor':'start'});
	this.text = paper.text(x+10, y+height/2, "dummy text").attr({'font-size':fontSize,fill:"rgb(0,0,0)", 'text-anchor':'start'});
	
	this.display = function(text){
		var that = this;
		this.text.attr({text:text});
		
		var interval = 2000;
			(function anim(){	
				if (animateDisplay) {
					that.rect.animate({
						fill: colorTo
					}, interval, function(){
						that.rect.animate({
							fill: colorFrom
						}, interval, anim);
					});
				}
				
		})();
	};
	
	this.clearDisplay = function() {
		animateDisplay = false;
		this.text.attr({text:""})
	};
	
	this.getDimensions = function() {
		return dim;
	}
}


Function.prototype.method = function(name, func){
	this.prototype[name] = func;
	return this;
};

if( typeof Object.create !== 'function') {
	Object.create = function(o) {
		var F = function() {};
		F.prototype = o;
		return new F();		
	};
}

/*
 * Calling the super class method
 */
Object.method('superior', function(name) {
		var that = this,
			method = that[name];
		return function() {
			return method.apply(that,arguments);
		};	
});


function printProperties(o) {
	for ( prop in o ) {
		if (o.hasOwnProperty(prop) && typeof prop != 'function') {
			console.log("> " + prop + ": " + o[prop]);
		}
	}
}

PRASAD.widgets.getCanvasDimensions = function(canvasDiv){
	var width = PRASAD.utils.getCSSInteger($("#"+ canvasDiv),"width");
	var height = PRASAD.utils.getCSSInteger($("#"+ canvasDiv),"height");
	console.log("width = " + width + " height = " +height);
	return {
		width: width,
		height: height
	}

}

PRASAD.widgets.addShell = function(paper, canvasDim){
	var xGap = 0;
	var yGap = 0;
	var rect = paper.rect(xGap,yGap,canvasDim.width,canvasDim.height,3).attr({fill:'#736AFF'}); // light slate Blue
	return rect;
}

PRASAD.widgets.addInstructionBar = function(paper,canvasDim) {	
	//console.log("cwidth = " + canvasDim.width + " cheight = " +canvasDim.height);
	var barHeight = canvasDim.height/15;
	var xGap = 2;
	var yGap = 2;
	var bar = new InstructionsBar(paper, xGap, yGap, canvasDim.width - 2 * xGap, barHeight);
	return bar;
	
}

PRASAD.widgets.addProgressBar = function(paper,canvasDim){
	//console.log("cwidth = " + canvasDim.width + " cheight = " +canvasDim.height);
	var barHeight = canvasDim.height/15;	
	var xGap = 2;
	var yGap = 2;
	
	var bar = new ProgressBar(paper, 
									xGap, 
									canvasDim.height - barHeight - yGap, 
									canvasDim.width - 2 * xGap, 
									barHeight);
									
	return bar;
}