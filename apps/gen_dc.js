window.onload = function(){
	dothis();
}

PRASAD.widgets.math.GridDraw = function GridDraw(paper1, x, y, width, height, cellCount) {
	var that = this;
	var DEFAULT_OPACITY = 1;

	this.rect = paper1.rect(x, y, width,height).attr({fill:'white'}); //.attr ({stroke:'red',"stroke-width":"1"});
	
	this.circles = new Array(); 
	var gap =5;
	var radius = (width - cellCount * gap)/(cellCount * 2);
	radius = Math.floor(radius);
	
	var startX = x + gap + radius;
	var startY = y + gap + radius;

	for( var yy=1; yy <= cellCount; yy++) {
		for( var xx=1; xx <= cellCount; xx++) {
			
			var c = paper1.circle(startX + (xx - 1) * (2 * radius + gap), 
									startY + (yy - 1) * (2 * radius + gap), 
									radius).attr({
								fill: PRASAD.widgets.math.GridDraw.prototype.DESELECT_COLOR,
							});
			this.circles.push(c);
			
			c.node.onclick = function(){
				var this_circle = c;
				
				return function(){	
					this_circle.selected = this_circle.selected ? false: true;
					that.drawCell(this_circle);
				};
			}();		
		}	
	}
	
	
	this.clear = function(){
		for (var i = 0; i < this.circles.length; i += 1) {
			this.circles[i].selected = false;
			this.drawCell(this.circles[i]);
		}
	}
	
	this.getArray = function() {
		var a = [];
		for( var i =0 ; i < this.circles.length ; i += 1) {
			if( this.circles[i].selected) {
				var rc = PRASAD.utils.getRowColumn(i+1, cellCount);
				//console.log(row + "," +  col);
				a.push((rc.row * 10 + rc.col));
			}	
		}
		return a;
	}
	
	this.getCount = function() {
		return this.circles.length;
	}
}

PRASAD.widgets.math.GridDraw.prototype.SELECT_COLOR = "#000";
PRASAD.widgets.math.GridDraw.prototype.DESELECT_COLOR = "#FFF";

PRASAD.widgets.math.GridDraw.prototype.drawCell = function(circle){	
		var color = circle.selected ? this.SELECT_COLOR : this.DESELECT_COLOR;
		circle.attr({
			fill: color
		});
	
}

function dothis() {
	
	var paper = new Raphael(document.getElementById('canvas_container'), 600, 300);
	var gd = new PRASAD.widgets.math.GridDraw(paper,10,10, 200,200,6);
	
	
	document.getElementById("get").onclick = function(){
		console.log("get click");
		var a = gd.getArray();
		console.log("array = " + a);
	}
	
	document.getElementById("clear").onclick = function(){
		gd.clear();	
	}
}



