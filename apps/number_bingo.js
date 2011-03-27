window.onload = function(){
	dothis();
}

function dothis() {
	var that = this;
	var paper = new Raphael(document.getElementById('canvas_container'), 600, 300);
	var x=10, y=10; width=500, height=50;
	var rectWidth = Math.floor(width/12);
	var rectHeight = height;
	var selectedNumbers = [];
	var NORMAL_BG = "yellow";
	var SELECTED_BG = "green";
	
	
	function select(rectangle, select) {
		if( select) {
			rectangle.attr({fill:SELECTED_BG});
		}
		else {
			rectangle.attr({fill:NORMAL_BG});
		}
	}
	
	var tiles = [];
	
	for(var k=0; k < 12 ;k +=1) {
		var rect = paper.rect(x +  k * rectWidth , y, rectWidth, rectHeight);
		tiles.push(rect);
		select(rect,false);
		var text = paper.text( x +  k * rectWidth + rectWidth/2, y + rectHeight/2,(k+1)).attr({'font-size':rectHeight/2.5});
		
		rect.node.onclick = function() {
			var number = + (k+1);
			var this_rect = rect;
			return function() {
				//console.log("number is " + number);
				if( selectedNumbers.isNumberPresent(number)) {
					//console.log(number + ": # already selected");
				}
				else {
					var sum = that.number1 + that.number2;
					
					var diff = Math.abs(that.number1 - that.number2);
					if( number == sum) {
						//console.log("# selected is the sum");
						selectedNumbers.push(number);						
						select(this_rect,true);
						that.number1=0;
						that.number2=0;
					}
					else if( number == diff) {
						//console.log("# selected is the difference");
						selectedNumbers.push(number);
						select(this_rect,true);
					
						that.number1=0;
						that.number2=0;
					}
				}
				
				
			};
		}();
		text.node.onclick = rect.node.onclick;
	}
	
	var compositeDiceWidth = 150;
	var compositeDiceHeight = 100;
	var compositeDiceX = x + 40;
	var compositeDiceY = 150;
	var gap =20;
	
	var diceWidth = (compositeDiceWidth- 3 * gap)/2;
	var rect = paper.rect(compositeDiceX,compositeDiceY, compositeDiceWidth,compositeDiceHeight,2).attr({fill:'white','stroke-width':2});
	rect.attr({fill:'#BCE954'});
	
	
	var dice1 = new Shuffle(paper,
							compositeDiceX+gap,
							compositeDiceY+gap,
							diceWidth,
							diceWidth,
							10 , 
							function(number) {
								//console.log("Number is " + number);
								that.number1 = number;
							},true, false);
	
	var dice2 = new Shuffle(paper,compositeDiceX+gap+diceWidth+gap,
							compositeDiceY+gap,
							diceWidth,
							diceWidth,
							10 , 
							function(number) {
								//console.log("Number is " + number);	
								that.number2 = number;		
							},true,false);
	
	// Mouse down and mouseup simulates appearance of a button press 
	

	
	rect.node.onmouseout = function(){		
		rect.attr({'stroke-opacity':1.0});
	}
	rect.node.onmouseover = function(){
		
		rect.attr({'stroke-opacity':0.5});
	}
	
	rect.node.onclick = function() {		
		dice1.click();
		dice2.click();
		
	}	
	var dim = new ArrowDim(50,25);
	
	new ArrowButton(paper,400,200, dim,function() {
		
		for( var k=0; k < tiles.length; k +=1) {
			select(tiles[k],false);
			selectedNumbers =[];
		}
	});
	//var paper2 = Raphael.shadow(400, 150, 100, 100);
}

