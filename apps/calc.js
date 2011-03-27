/**
 * @author prasad
 */
 
 

window.onload = function(){
	var board = new Board();
}; 

function Board() {
	var that = this;
	this.sum =0;
	this.paper = new Raphael(document.getElementById('canvas_container'), 600, 500);
	elem = document.getElementById("equals");
	elem.onclick = calculate;
	document.getElementById("answer").value= "";
	
	clearElem = document.getElementById("clear");
	clearElem.onclick = clear;
	
	this.grid = new PRASAD.widgets.math.NumberGrid(this.paper,50,150,300,10);
	//this.grid = new PRASAD.widgets.math.HundredsChart(this.paper,50,150,300);
	
	function setElementValue(id, value) {
		document.getElementById(id).value = value;
	}
	
	function clear(){		
		setElementValue("answer", "");
		that.sum = 0;
		that.paper.clear();
		that.grid.display();
	}
	
	function calculate(){
		num = document.getElementById("num");
		that.sum += + num.value;
		if (that.sum <= 100) {
			setElementValue("answer", that.sum);
			that.grid.highlight(that.sum);
		}	
	}	
}


/*
 * row and col index start at 1
 */
PRASAD.widgets.math.NumberGrid.prototype.highlight = function(num){

	var rc = this.getRowColPosition(num);
	var row = rc.row;
	var col = rc.col;
	var fillColor = 'blue';
	var myX = this.x + (col - 1) * this.cellWidth;
	var myY = this.y + (row - 1) * this.cellHeight;
	
	var rect = this.paper.rect(myX, myY, this.cellWidth, this.cellHeight).attr({
		stroke:'none',
		fill: fillColor,
		'opacity':0.7
	});
	if(this.highlightedNum !== undefined ) {
		this.unhilite(this.highlightedNum);
	}
	this.highlightedNum = num;
	rect.animate({scale:1.3}, 300 ,function() {
		rect.animate({scale:1},300);
	});
};

/*
 * row  and col index start at 1
 */
PRASAD.widgets.math.NumberGrid.prototype.unhilite = function(num){
	var rc = this.getRowColPosition(num);
	var row = rc.row;
	var col = rc.col;
	var fillColor = '#0c0';
	var myX = this.x + (col - 1) * this.cellWidth;
	var myY = this.y + (row - 1) * this.cellHeight;
	this.paper.rect(myX, myY, this.cellWidth, this.cellHeight).attr({
		stroke:'none',
		fill: fillColor,
		'opacity':0.3
	});
};



