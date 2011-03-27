window.onload = function(){
	dothis();
}

function dothis() {
	var MORE_INDEX=0;
	var LESS_INDEX=1;
	var DOUBLE_INDEX=2;
	var questions = ["MORE", "LESS"];
	var paper = new Raphael(document.getElementById('canvas_container'),400, 120);
	
	var tenFrame = new PRASAD.widgets.math.NFrame(paper, 10, 10, 200, false, 10);
	
	var getRand = PRASAD.utils.randomIntForRange;
	
	var n1 = new PRASAD.widgets.math.SelectableNumbers("numbers",0,12,  function(selectedNumber) {
										$("#answer")[0].value = selectedNumber;
										var answer = getAnswer();										
										if(  answer == selectedNumber) {											
											scoreCard.correct();											
											next();
										}
										else {
											scoreCard.incorrect();											
										}												
									});
	
	var scoreCard = new ScoreCard("score");
	$("#answer")[0].value = "";
	
	
	next();
	
	function next() {
		$("#answer")[0].value = "";	
		var tenFrameCount = getRand(1,10);
		tenFrame.setCount(tenFrameCount);	
		var rand1Or2= getRand(1,2);
		//console.log("var = " + rand1Or2);
		$("#variable")[0].value  = rand1Or2;
		var questionIndex = getRand(0,questions.length-1);
		if( questionIndex == LESS_INDEX ) {
			if( tenFrameCount - rand1Or2 < 0) {
				console.log("changing question from less to more becuase of negatives, var = " + rand1Or2);
				questionIndex = MORE_INDEX;
			}
		}
		$("#question")[0].innerHTML =  questions[questionIndex];	
	}
	
	function getAnswer() {
		var ques = $("#question")[0].innerHTML;
		var variable = + $("#variable")[0].value;
		if( ques == questions[MORE_INDEX]) {
			
			return tenFrame.getCount() + variable;
		}
		else if( ques == questions[LESS_INDEX]) {
			return tenFrame.getCount() - variable ;
		}
	}								
}