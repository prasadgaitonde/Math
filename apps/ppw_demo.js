window.onload = function(){
	dothis();
}

function dothis(){

	var paper = new Raphael(document.getElementById('canvas_container'),700, 500);
	var demo = new PartPartWholeDemo(paper);
	
	var INITIAL_X = 10;
	
	function animate(number) {
		paper.clear();
		demo.getFactors(number);
		demo.animateNumber( function() {
			document.getElementById("showParts").disabled = false;
		});
		
	}
	document.getElementById("number").value ="";
	document.getElementById("showParts").disabled = true;

	var n1 = new PRASAD.widgets.math.SelectableNumbers("numbers",1,10,  function(selectedNumber) {
										document.getElementById("number").value = selectedNumber;
										animate(selectedNumber);
									});
	
	var count=0;
	
	
	document.getElementById("showParts").onclick = function() {
		var number = + document.getElementById("number").value;
		demo.animateFactors();
	}
	
	/*
	document.getElementById("number").value = "";
	
	document.getElementById("get").onclick = function(){		
		var number = + document.getElementById("number").value;
		
		
		demo.ground = demo.ground - demo.HEIGHT -10;
		
		if (count < demo.factors.length) {
			var factor1 = demo.factors[count][0];
			var factor2 = demo.factors[count][1];
			console.log("Factors are " + factor1 + " and " + factor2);
			var indexInShapesArray = 0;
						
			demo.showParts(INITIAL_X, indexInShapesArray, factor1, 1, function(){
				indexInShapesArray += factor1;
				demo.showParts(INITIAL_X + 20, indexInShapesArray, factor2, 2, function(){
					demo.replenish();
					busy = false;
				});
			});
			count++;
		}
		
		
	}
	*/
}

function PartPartWholeDemo(paper){	
	this.paper = paper;	
	//console.log("height = " + paper.height);
	this.WIDTH = this.paper.width/25;
	this.HEIGHT = this.WIDTH;	
}

/*
 * Animate the displaying of the parts of the number
 */
PartPartWholeDemo.prototype.animateFactors = function(){
	var that = this;
	
	this.ground = this.paper.height-20;
	var busy = false;
	// Interval between successive pair of factors
	var ANIMATE_INTERVAL = 3000;
	
	// Y offset between successive pair of factors
	var Y_OFFSET = 10;
	
	var count =0;
	
	var interval = 0;
	var intervalId = setTimeout(fn,500);
	
	function fn(){
		if( count == 0) {
			intervalId = setInterval(fn, ANIMATE_INTERVAL);
		}
		if( count > that.factors.length -1) {
			//console.log("Clearing interval id: " + intervalId);
			clearInterval(intervalId);
			return;
		}
		if (busy) {
			return;
		}
		busy = true;
		that.ground = that.ground - that.HEIGHT - Y_OFFSET;
		var factor1 = that.factors[count][0];
		var factor2 = that.factors[count][1];
		//console.log("Factors are " + factor1 + " and " + factor2);
		var indexInShapesArray = 0;
		that.showParts(indexInShapesArray, factor1, 1, function(){
			indexInShapesArray += factor1;
			that.showParts( indexInShapesArray, factor2, 2, function(){
				count++;
				if (count < that.factors.length) {
					// Replenish the numbers block only if we havn't finished with all the 
					// factors
					that.replenish();
				}				
				busy = false;
			});
		});
		
	}
	
}

PartPartWholeDemo.prototype.getFactors = function(number) {
	this.number = number;
	this.factors = [];
	for (var i = 0; i <= this.number; i++) {
		var a = [];
		a.push(i);		
		a.push(this.number - i);		
		this.factors.push(a);
	}
	
	//console.log("Factors for " + this.number + " are : ");
	//for( k=0; k < this.factors.length;k++) {
	//	console.log(this.factors[k]);
	//}
	
	return this.factors;
}

/*
 * Animate  the formation of the number for which you need to eventually 
 * show the parts
 */
PartPartWholeDemo.prototype.animateNumber = function(animDone) {
	var that = this;
	var x= this.paper.width - this.paper.width/3, y=10;
	this.shapes = [];
	
	var startX = 60;
	(function animateRect(){
		var rect = that.paper.rect(x, y, that.WIDTH, that.HEIGHT).attr({
			fill: 'green'
		});
		that.shapes.push(rect);
		
		rect.animate({
			x: startX
		}, 700, function(){
			startX += that.WIDTH;
			if (that.shapes.length < that.number) {
				animateRect();
			}
			else {
				if (animDone !== undefined) {
					animDone();
				}
			}
		});
	})();

}

PartPartWholeDemo.prototype.replenish = function() {
	var x=60, y=10;
	this.shapes = [];
	
	for (var i = 0; i < this.number; i +=1 ) {
		 this.shapes.push( this.paper.rect(x,y,this.WIDTH, this.HEIGHT).attr({
						fill: 'green'
						}));
		 x += this.WIDTH ;
	}
}
/*
 * Animates one factor of the number
 * e.g Consider number = 8 which has one set of factors as 6 and 2
 * index: index of the array that holds the shapes that are being animated
 * factor: is the factor that is being animated e.g. 6 or 2 in the e.g above
 * factorNum: either 1 or 2 depending on whether this is the first or the second factor. In the 
 *            example above for 6 the value of factorNum is 1 and for 2 it is 2
 * callback: the method to be called after the animation is complete           
 */
PartPartWholeDemo.prototype.showParts = function(index, factor, factorNum, callback) {
	// The start X location for the destination of the left of the 2 factor blocks
	var START_OFFSET=10;
	var DISTANCE_BET_FACTOR_BLOCKS=10;
	
	// X Offset from the start position of the cell (when they are all together)
	var CELL_XOFFSET_FROM_START_POSITION = 50	;
	
	// Time interval in which the faux zero factor cell fades away
	var ZERO_FACTOR_FADING_INTERVAL = 2000;
	
	var that = this;
	var shapesClone = this.shapes.slice();
	var interval = 500;
	var k = 0;
	var offset ;
	
	if( factorNum == 1) {
		// If animating the first factor
		offset = START_OFFSET;
	}
	else {
		// If animating the second factor
		offset = START_OFFSET + DISTANCE_BET_FACTOR_BLOCKS;
	}
	if (factor == 0) {
		// If factor is zero there is nothing to animate in terms of a part
		// of the source blocks moving to the destination. Instead we just
		// display a faux zero block and fade out
		writeText();
		
		var xx ;
		if (index < shapesClone.length - 1) {
			xx = offset + shapesClone[index].attr('x')+ CELL_XOFFSET_FROM_START_POSITION - that.WIDTH +	DISTANCE_BET_FACTOR_BLOCKS;	
		}
		else {
			xx = offset + shapesClone[shapesClone.length-1].attr('x');
		}
		var fauxZero = that.paper.rect(xx , that.ground, that.WIDTH, that.HEIGHT).attr({fill: 'grey'});
						fauxZero.animate({opacity:0}, ZERO_FACTOR_FADING_INTERVAL ,function() {
				fauxZero.remove();
				
			});		
		return;
	}
	
	var xCur = shapesClone[k+index].attr('x');
	var animateAttr = {x: offset + xCur+CELL_XOFFSET_FROM_START_POSITION,y:this.ground};	
	
	var first = shapesClone[k+index];
	if (factor > 1) {
		first.animate(animateAttr, interval);
	}
	else {		
		first.animate(animateAttr, interval, writeText);
	}

	for( var k = 1; k < factor ; k+= 1)  {
		xCur = shapesClone[k+index].attr('x');
		animateAttr = {x: offset + xCur + CELL_XOFFSET_FROM_START_POSITION, y:this.ground};
		// 
		if (k < factor - 1) {
			shapesClone[k + index].animateWith(first, animateAttr, interval);			
		}
		else {
			// At the end of the last block for this factor
			shapesClone[k + index].animateWith(first, animateAttr, interval, function() {
				writeText();				
			});
		}
	}
	
	/*
	 * Writes the factor as number by the side the animated blocks
	 */
	function writeText(){		
		var FACTOR1_X = that.paper.width - that.paper.width/3 ;
		var PLUS_X = FACTOR1_X + 50;
		var FACTOR2_X = FACTOR1_X + 75;
		
		//console.log("factor to write = " + factor);
		var text = "" + factor;
		var attr = {
			'font-size': that.HEIGHT/1.5,
			
		};
		if (factorNum == 1) {
			drawText(FACTOR1_X, that.ground,that.WIDTH,that.HEIGHT,text,"#FFF");
			that.paper.text(PLUS_X,that.ground + that.HEIGHT/2, "+").attr(attr);
		}
		else {
			//console.log("factorNum = " + factorNum);
			drawText(FACTOR2_X, that.ground,that.WIDTH,that.HEIGHT,text,"#FFF");
			//new PRASAD.widgets.Label(that.paper, 425, that.ground,that.WIDTH,that.HEIGHT,text);
		}
		if (callback !== undefined) {
			callback();
		}
		
		function drawText(x,y,width,height,text,color){
			var rect = that.paper.rect(x, y, width, height,2);
			if (color != null) {
				rect.attr({
					fill: color
				});
			}
			var fontSize = height/1.5;
			var text = that.paper.text(x + width/2, y + height/2, text).attr({
				'font-size': fontSize,
				fill: "rgb(0,0,0)"
			});
			rect.animate({scale:1.3}, 300 ,function() {
				rect.animate({scale:1},300);
			});
		}
		
	}
}