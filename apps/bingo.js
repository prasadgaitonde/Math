window.onload = function(){
	
	document.getElementById("clear").onclick = clear;
	document.getElementById("check").onclick = verify;
	
	var paper = new Raphael(document.getElementById('canvas_container'), 600, 400);
	
	var label = new Shuffle(paper,450,100,100,100,10 , function(number) {
		document.getElementById("num").value = number;
	});
	var blocks = new Array();
	var startX = 50,
		startY = 300,
		side =30;
	var gap=3;
	for (var i = 1; i <= 10; i++) {
		var x = startX + (i-1) * (side + gap);
		//var y = startY - (i-1) * side;
		var y = startY;
		blocks.push(new BlockSet(paper, i, x, y, side,gap,callback));	
		paper.text(x+side/2,y+side+side/2,i).attr({'font-size':15});	
	}
	
	/*
	 * Callback called every time a block cell is clicked to keep track of the total number of
	 * clicks for all the blocks
	 */
	function callback() {
		var count =0;
		for (var k = 0; k < blocks.length; k += 1) {
			var num = blocks[k].getNumSelectedCells();
			if( num >0) {
				count += num;
			}
		}
		document.getElementById('currentSum').value = count;
	}
	
	function clear() {
		for( var k=0; k < blocks.length;k +=1) {
			blocks[k].markDeselected();
			blocks[k].repaint();			
		}		
		$("#mytable tr").remove();
		callback();
	}	
	
	function verify() {
		var sum = + document.getElementById("num").value;
		
		var otherSum = 0;
		var fullSelectedBlocks = [];
		for( var k=0; k < blocks.length;k +=1) {
			if( blocks[k].number == blocks[k].getNumSelectedCells()) {
				otherSum += blocks[k].number;
				fullSelectedBlocks.push(blocks[k]);
			}
		}
		
		//console.log("OTHER SUM = " + otherSum);
		if( sum != otherSum) {
			// The sum of selected blocks IS NOT equal to the required sum
			//console.log("NOT a MATCH");
			for (k = 0; k < blocks.length; k += 1) {
				if(blocks[k].getNumSelectedCells() >0) {
					blocks[k].markDeselected();
					blocks[k].repaint();
				}
			}
		}
		else {
			// The sum of selected blocks IS equal to the required sum
			var s = "<tr><td>" + sum + " = "
			
			for( var p=0; p < fullSelectedBlocks.length;p +=1) {
				fullSelectedBlocks[p].animate();
				fullSelectedBlocks[p].markCovered();
				s += fullSelectedBlocks[p].number;
				if( p < fullSelectedBlocks.length -1) {
					s += " + ";
				}
			}
			 s += "</td></tr>";
			$("#mytable > tbody").append(s);
			//console.log("IS a MATCH");
			
			//clear	
			for( var k=0; k < blocks.length;k +=1) {
				blocks[k].markDeselected();															
				blocks[k].repaint();
			}
		}
		callback();
		
		//var text = paper.text(100,100,"Bingo").attr({'font-size':15});
		//var text = paper.rect(100,100,50,50);
		//text.animate({scale:[2,2,100,100]},2000);
	}	
}


function BlockSet(paper, number, x,y,side,gap,callback) {
	var that = this;
	this.cells = new Array();
	this.number = number;
	

	for( var i=0; i <number ;i+=1) {
		var ys = y - i * (side + (gap || 0));	
		var rect = 	paper.rect(x,ys,side,side,4).attr({
			fill: this.DESELECT_COLOR
		});
		rect.selected = false;
		rect.covered= false;
		this.cells.push(rect);
		
		// Check the closure below to access the specific rect
		// Tip: to make outer variables that are in a loop (like rect above) be 
		/// available in a closure 
		rect.node.onclick = function(){
			var this_rect = rect;
			
			return function(){	
				this_rect.selected = this_rect.selected ? false: true;
				that.drawCell(this_rect);
				if( callback !== undefined) {
					callback();
				}
			};
		}();		
	}
}

BlockSet.prototype.SELECT_COLOR = "#d6f301";
BlockSet.prototype.DESELECT_COLOR = "white";
BlockSet.prototype.COVERED_COLOR = "#c0c0c0";

BlockSet.prototype.repaint = function(){
	for (var i = 0; i < this.cells.length; i += 1) {
		this.drawCell(this.cells[i]);
	}
}

BlockSet.prototype.drawCell = function(cell){
	if (cell.covered) {
		if (!cell.selected) {
			cell.attr({
				fill: this.COVERED_COLOR
			});
		}
		else {
			cell.attr({
				fill: this.SELECT_COLOR
			});
		}
	}
	else {
		var color = cell.selected ? this.SELECT_COLOR : this.DESELECT_COLOR;
		cell.attr({
			fill: color
		});
	}
}

BlockSet.prototype.print = function() {	
	for( var i=0 ; i < this.cells.length; i+=1) {
		var sel = this.cells[i].selected;
		console.log(this.number + " -> " + i + " : " + sel);			
	}	
}

BlockSet.prototype.getNumSelectedCells = function(){
	var count=0;
	for( var i=0 ; i < this.cells.length; i+=1) {
		if(this.cells[i].selected) {
			count++;
		}			
	}	
	return count;
}

BlockSet.prototype.animate = function(){
	for (var i = 0; i < this.cells.length; i += 1) {
		this.cells[i].animate({
			opacity: 0.5
		}, 300, function(){
			this.animate({
				opacity: 1
			}, 300);
		});
	}
}

/*
 * De-selects all the selected cells and internally marks all cells as unselected
 */
BlockSet.prototype.markDeselected = function(){
	for( var i=0 ; i < this.cells.length; i+=1) {
		this.cells[i].selected = false;	
		//this.drawCell(this.cells[i]);	
	}	
}

BlockSet.prototype.markCovered = function(){
	for( var i=0 ; i < this.cells.length; i+=1) {
		this.cells[i].covered = true;				
	}	
}




