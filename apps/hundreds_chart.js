window.onload = function(){
	dothis();
}
/* This app is not complete */

function dothis(){
	
	var paper = new Raphael(document.getElementById('canvas_container'), 400, 500);
	
	var hundredsChart = new PRASAD.widgets.math.NumberGrid(paper,50,150,300,10);

	var counter2 = new TextCounter(paper,350 ,100,30,1);
	//var counter1 = new SquareCounter(paper,350 ,100,30);
	
	var counter = new TextInRectCounter(counter1,counter2);
	//paper.text(50,125,"12345").attr({'font-size':20});
	var dc = new DraggableCounter(counter);
	dc.startDrag(dragComplete);

	
	function dragComplete() {
		console.log("drag is complete");
		var pos = this.getPoint();
		console.log("Point x: " + pos.x + "; y: " + pos.y);
		//pos.x += Math.floor(hundredsChart.cellWidth/2);
		//pos.y += Math.floor(hundredsChart.cellHeight/2);
		var rc = hundredsChart.getNumberForPoint(pos);
		if( rc != null) {
			console.log("number dropped on is " + rc);
			if( + counter.textValue == rc) {
				console.log("correct #");
				hundredsChart.drawCellText(rc,rc);
				counter.shape.remove();
				
				
			}
			else {
				counter.shape.revertToOrigPos();
			}
		}
		else {
			counter.shape.revertToOrigPos();
			console.log("not in grid");
		}
	}
}

/*
 * Gets the cell number (index starts from from 1) that the specified point
 * is within 
 */
PRASAD.widgets.math.NumberGrid.prototype.getNumberForPoint = function(point){
	var xx = point.x;
	var yy = point.y;
	
	for (var count = 1; count <= this.NUM_COLS * this.NUM_ROWS; count += 1) {
		var rc = this.getRowColPosition(count);
		var myX = this.x + (rc.col - 1) * this.cellWidth;
		var myY = this.y + (rc.row - 1) * this.cellHeight;
		//console.log("\t row: " + rc.row + " col: " + rc.col);
		
		var boxX = myX + this.cellWidth;
		var boxY = myY + this.cellHeight;
		//console.log("limits: " + this.x + "," + this.y + " to " + boxX +"," + boxY);
		if(( (xx > myX && xx < boxX) && (yy > myY && yy < boxY)) ) {
			return count;		
		}
	}
	return null;
}