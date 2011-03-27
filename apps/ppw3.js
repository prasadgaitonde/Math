//*******************************************************
// REPLACED BY SEESAW.pS
//*******************************************************
window.onload = function(){
	dothis();
}

function createText(paper, x, y, text ) {
	return paper.text(x,y,text).attr({'font-size':25});
}

function dothis() {
	var paper = new Raphael(document.getElementById('canvas_container'), 700, 400);
	
	var DEFAULT_PART_VALUE="0";
	var x= 30, y = 200, width = 300;
	var rectSide = 30;
	var strokeWidth=4;
	var centerX = x + width/2
	var line = PRASAD.graphics.line(paper, x,y,x+width,y).attr({'stroke-width': strokeWidth});
	var leftRect = paper.rect(x,y-rectSide-strokeWidth,rectSide,rectSide);
	var partRectFillColor = "#657383";
	var gapBetweenParts =5;
	var rightRect1 = paper.rect(x+width-rectSide,
								y-rectSide-strokeWidth,
								rectSide,
								rectSide).attr({fill:partRectFillColor});
	var partText1 = createText(paper,
								x+width-rectSide+rectSide/2,
								y-rectSide+rectSide/2,
								DEFAULT_PART_VALUE);
												
									
	
	var rightRect2 = paper.rect(x+width-rectSide*2-gapBetweenParts,
								y-rectSide-strokeWidth,
								rectSide,
								rectSide).attr({fill:partRectFillColor});
	var partText2 = createText(paper,
								x+width-rectSide*2-gapBetweenParts + rectSide/2,
								y-rectSide+rectSide/2,
								DEFAULT_PART_VALUE);
	
	
	var wholeText = createText(paper,x+rectSide/2 , y-rectSide+rectSide/2, "" + "?");
	
	var suppXOff = 20;
	var suppYOff =40
	var supportStr = ['M' , centerX, y,  'l', -1 * suppXOff, suppYOff,  suppXOff *2, 0, 'Z'];
	var support =  paper.path(supportStr.join(' ')).attr({fill:'#000'});
	
	var set = paper.set();
	set.push(line);
	set.push(leftRect);
	set.push(wholeText);
	set.push(rightRect1);
	set.push(rightRect2);
	set.push(partText2);
	set.push(partText1);
	//set.push(dupeBubble);
	
	var bpx1 = x+width+50;
	var bpy1 = 120;
	var bpWidth1= 300;
	var bpHeight1 = 30;
	var bpx2 = bpx1;
	var bpy2 = 160;
	var bpWidth2= bpWidth1;
	var bpHeight2 = bpHeight1;
	
	var g1 = new GoadingArrow(paper, bpx1, bpy1 + bpHeight1/2, "LTR", new ArrowDim(20,8),10, "A1");
	//g1.startAnimation();
	var n1  = new SelectableNumbers3(paper, bpx1, bpy1 , bpWidth1,bpHeight1,1,10, 
									function(selectedNumber) {
										
										partText2.attr({
												text: selectedNumber
											});	
										animate();	
										g1.stopAnimation();
																
									});
	
	var g2 = new GoadingArrow(paper, bpx2, bpy2+ bpHeight2/2, "LTR", new ArrowDim(20,8),10, "A2");
	//g2.startAnimation();								
	var n2  = new SelectableNumbers3(paper, bpx2, bpy2 , bpWidth2,bpHeight2,1,10, 
									function(selectedNumber) {
										
										partText1.attr({
												text: selectedNumber
											});
											animate();
										g2.stopAnimation();								
									});
															
	next();
	
	new ArrowButton(paper,x+width+200,300, new ArrowDim(50,25), function() {
		next();
	});
	
	function next() {
		var whole = "" + PRASAD.utils.randomIntForRange(2,10);
		wholeText.attr({text: whole});
		partText1.attr({text: DEFAULT_PART_VALUE});
		partText2.attr({text: DEFAULT_PART_VALUE});
		animate();
		//g1.stopAnimation();
		//g2.stopAnimation();
		g1.startAnimation();
		g2.startAnimation();
	}			
	
	
	function animate() {
		var KEEL_FACTOR = 4;
		var whole = + wholeText.attr('text');
		var part1 = + partText1.attr('text');
		var part2 = + partText2.attr('text');
		//console.log("part1 = " + part1 + " part2 = " + part2);
		var partCombo = part1 + part2;
		
		var s;
		var diff = whole - partCombo;
		var angle ;
		if (diff == 0) {
			angle = 0;
			
		}
		else {
			if (diff < 0) {
				//+
				angle = -1 * diff * KEEL_FACTOR;				
			}
			else {
				// - 
				angle = -1 * diff * KEEL_FACTOR;
			}
			
		}
		
		// Rotate around the center of the support 
		s = angle  + " " + (x + width/2) + " " + y;		
		
		set.animate({rotation:s},2000,"bounce", function() {
			//console.log("anim complete");
			/*
			if( diff == 0) {
				g1.stopAnimation();
				g2.stopAnimation();
			}
			else {
				g1.startAnimation();			
				g2.startAnimation();
			}
			*/
			
		});		
		
	}
	
	
}

