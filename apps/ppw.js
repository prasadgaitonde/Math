window.onload = function(){
	dothis();
}

function dothis(){	
	var paper = new Raphael(document.getElementById('canvas_container'),700, 300);
	
	var scoreCard = new ScoreCard("score");
	document.getElementById("next").onclick = next;
	var number;
	var coveredNumber;
	var n1 = new PRASAD.widgets.math.SelectableNumbers("numbers",1,9,  function(selectedNumber) {									
										var answer = getAnswer();	
										console.log("answer = :" + answer);
										document.getElementById("number1").value = selectedNumber;
										var number1 = + document.getElementById("number1").value;
										if( answer == number1 ) {
											scoreCard.correct();
											next();
										}
										else {
											scoreCard.incorrect();
										}
										
									});
	next();								
	
	function getAnswer() {
		console.log("number = " + number + " covered # = " + coveredNumber);		
		return  coveredNumber;	
	}
	
	function next(){
		paper.clear();
		var getRand = PRASAD.utils.randomIntForRange;
		number = getRand(2, 10);
		
		document.getElementById("sum").value = number;
		document.getElementById("number1").value = "?";
		
		var START_X = 100;
		
		var startX = START_X, startY = 100;
		radius = 15, gap = 10;
		for (var i = 0; i < number; i += 1) {
			paper.circle(startX, startY, radius).attr({
				stroke: 'none',
				fill: 'blue'
			});
			startX += radius * 2 + gap;
		}
		
		coveredNumber = getRand(1, number - 1);
		document.getElementById("number2").value = number - coveredNumber;
		console.log("number to cover = " + coveredNumber);
		var xgap = gap / 2;
		var ygap = 5;
		var width = (radius * 2 * coveredNumber) + gap * (coveredNumber - 1) + 2 * xgap;
		var rect = paper.rect(START_X - radius - gap / 2, startY - radius - ygap, width, (radius * 2) + 2 * ygap, 5);
		var COVER_OPACITY = 1;
		var REVEAL_OPACITY = 0.5;
		rect.attr({
			fill: '#c4c4c4',
			opacity: REVEAL_OPACITY,
			//stroke: 'none'
		});
		rect.animate({
			opacity: COVER_OPACITY
		}, 500);
		rect.node.onclick = function(){
			var op = +rect.attr('opacity');
			//console.log("opacity = "+ op);
			var newOp = op == COVER_OPACITY ? REVEAL_OPACITY : COVER_OPACITY;
			rect.animate({
				opacity: newOp
			}, 2000, function(){
				rect.animate({
					opacity: COVER_OPACITY
				}, 1000);
			});
		}
	}			
}