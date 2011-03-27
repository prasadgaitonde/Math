window.onload = function(){
	dothis();
}

function dothis() {
	var paper = new Raphael(document.getElementById('canvas_container'), 700, 500);
	var x = 50, y =50, width=250, height=300;
	var counterBox = new CountingBox(paper,x,y,width,height);
	
	var mediator = new Mediator( [counterBox]);
	var bank = new Bank(paper, x,y+height+50,15,mediator);
}

function CountingBox(paper,x,y,width, height) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;

	this.outerRect = paper.rect(x,y, width,height,5).attr({'stroke-width':3});
	var margin = 10;
	var frameWidth = width - 2 * margin;
	this.tenFrame1 = new PRASAD.widgets.math.NFrame(paper, x+margin, y+margin, frameWidth, false, 10);
	this.tenFrame2 = new PRASAD.widgets.math.NFrame(paper, x+margin, y+ margin + 120, frameWidth, false, 10);
	this.tenFrame1.next = this.tenFrame2;	
	this.tenFrame2.next = null;
	
	
	var rectWidth=40;
	var rectHeight=40;
	var sumX = x+width - rectWidth/2 - 5; // x+width/2;
	var sumY = y + height - rectHeight/2 - 5 //y - rectHeight/2;
	
	this.sumText = paper.text(sumX,sumY,"?").attr({'font-size':rectHeight/2});	
	this.textCover = paper.rect(sumX-rectWidth/2,sumY-rectHeight/2,rectWidth,rectHeight,5).attr({fill:'grey'});
	
	var that = this;
	this.textCover.node.onclick = function() {
		var sum = that.tenFrame1.getCount() + that.tenFrame2.getCount();
		that.sumText.attr({
			text: sum
		});
		that.textCover.animate({opacity:0.5}, 300 ,function() {
			that.textCover.animate({opacity:1},1000);
	});
	}
	this.textCover.toFront();
	
	var buttonHeight=30;
	var buttonWidth = 50;
	var clearAll = new PRASAD.widgets.Button(paper, x+margin, y+height-buttonHeight-margin,buttonWidth,buttonHeight,"Clear", function() {
		that.tenFrame1.setCount(0);
		that.tenFrame2.setCount(0);
	}, "#c0c0c0");
}

CountingBox.prototype.pointIsInBox = function(xx,yy) {
		var boxX = this.x + this.width;
		var boxY = this.y + this.height;
		return ( (xx > this.x && xx < boxX) && (yy > this.y && yy < boxY)) ;
}

/*
 * Since this is a drag destination it has to implement drop()
 */
CountingBox.prototype.drop = function(counters){
	
	var number = counters.length;
	var color = counters[0].shape.attr('fill');
	
		//console.log("have to add " + number + " to myself with color :" + color);
	fill(this.tenFrame1,number,color);
		
	function fill(frame, number, color) {
		var count = frame.getCount();
		var nextFrame = frame.next;
		
		if( count == frame.frameCount) {			
			if (nextFrame != null) {
				fill(nextFrame,  number, color);
				return;
			}
		}
		var temp = number + count;
		if( temp <= frame.frameCount) {
			//frame.selectColor = color;
			frame.setCount(temp);
		}
		else {
			if (nextFrame != null) {
				//frame.selectColor = color;
				frame.setCount(frame.frameCount);
				fill(nextFrame,  temp-frame.frameCount,color);
			}
		}
	}


}



function Bank(paper, left, top, radius, mediator){
	var that = this;
	this.countersArray = [];
	var padding = 2;
	var boxTop = top;
	
	var leftX = left;
	
	var alignVert = true;
	/*
	 * This is if you want a color selector for the counters
	 *
	var colors = ['blue', 'green', 'yellow'];
	
	for (var i = 0; i < colors.length; i += 1) {
	
		var colorCircle = paper.circle(leftX, boxTop + i * 15, 5).attr({fill: colors[i]});
		
		colorCircle.node.onclick = function(){		
			var this_circle = colorCircle;
			return function(){
				
				var color = this_circle.attr('fill');
				console.log("onclick: " + color);
				for( var j=0; j < that.countersArray.length ; j+=1 ) {
					that.countersArray[j].setColor(color);
				}
			}
		}();
	}
	*/
	
	
	leftX += 40;
	
	for (var k = 1; k <= 10; k += 1) {	
		var counters = new Counters(paper, leftX, boxTop - 10, radius, k, mediator, alignVert);
		this.countersArray.push(counters);
		counters.startDrag();
		leftX += (radius * 2 + padding) + 10;
	}		
}

Bank.prototype.setVisible = function(flag) {
	for( var i=0; i < this.countersArray.length;i+=1) {
		this.countersArray[i].setVisible(flag);
	}
}	


