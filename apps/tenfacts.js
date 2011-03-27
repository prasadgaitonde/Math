window.onload = function(){
	dothis();
}

function dothis() {
	var getLabel = PRASAD.widgets.createLabel;
	
	//var correctAnswerTextColor = document.getElementById("answer").style.color;
	//var wrongAnswerTextColor = "red";
	//console.log("Color = " + correctAnswerTextColor);
	
	var paper = new Raphael(document.getElementById('canvas_container'),700, 300);	
	
	var numberDisplayers = [
				 			new PRASAD.widgets.math.NFrame(paper, 10, 10, 200, false, 10),
							new PRASAD.widgets.math.NumberTile(paper, 10,10,90,"?")
						];
	var active = numberDisplayers[0];	
	numberDisplayers[1].setVisible(false);
	
	var getRand = PRASAD.utils.randomIntForRange;
	
	var startX =  250, startY= 40, gap = 10, aWidth = 50, aHeight=40 ; 
	var plus = getLabel(paper,startX, startY, aWidth,aHeight,"+", "white",false);	
	var answerDisplay = getLabel(paper,startX + aWidth + gap ,startY, aWidth,aHeight,"?", "white");	
	var equals = getLabel(paper,startX + 2 *(aWidth + gap) ,startY, aWidth,aHeight,"=","white",false);	
	var theTen = getLabel(paper,startX + 3 *(aWidth + gap) ,startY, aWidth,aHeight,"10","white",false);
	
	
	var n2  = new SelectableNumbers3(paper, 10, 120, 400,40,0,10, function(selectedNumber) {
		var answer = getAnswer();										
										if(  answer == selectedNumber) {
											//console.log("Color (correct)= " + correctAnswerTextColor);
											answerDisplay.setText(""+answer);										
											//document.getElementById("answer").style.color = correctAnswerTextColor;	
											scoreCard.correct();	
											setTimeout(next,1000);										
											//next();
										}
										else {
											//document.getElementById("answer").style.color = wrongAnswerTextColor;
											scoreCard.incorrect();											
										}		
		});
	/*
	var n1 = new PRASAD.widgets.math.SelectableNumbers("numbers",0,10,  function(selectedNumber) {
										$("#answer")[0].value = selectedNumber;
										var answer = getAnswer();										
										if(  answer == selectedNumber) {
											//console.log("Color (correct)= " + correctAnswerTextColor);										
											document.getElementById("answer").style.color = correctAnswerTextColor;	
											scoreCard.correct();											
											next();
										}
										else {
											document.getElementById("answer").style.color = wrongAnswerTextColor;
											scoreCard.incorrect();											
										}												
									});
 */									
	
	var scoreCard = new ScoreCard("score");
	//$("#answer")[0].value = "?";
	next();
	
	function getNumberDisplay() {
		// Randomly chose between the 2 number displayers
		// Another option could be to start with the easier of the 2, i.e. the
		// 10 - Frame and display this for a while and then shift to the number tile
		return numberDisplayers[getRand(0,1)]
	}
	
	function makeDisplayActive(display) {
		if (active != display) {
			// Make the previous active number displayer invisible 
			active.setVisible(false);
			active = display;
			// Make the active one visible
			active.setVisible(true);
		}
	}
	
	function next() {
		var count = getRand(1,10);		
		makeDisplayActive(getNumberDisplay());
		active.setCount(count);
		//$("#answer")[0].value = "?";
		answerDisplay.setText("?");			
	}
	
	function getAnswer() {		
		return 10 - active.getCount();		
	}								
}