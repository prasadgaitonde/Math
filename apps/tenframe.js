window.onload = function(){
	dothis();
}

function dothis() {
	var questions = ["How many counters: ", "How many spaces: "];
	var paper = new Raphael(document.getElementById('canvas_container'),400, 120);
	
	var tenFrame = new PRASAD.widgets.math.NFrame(paper, 10, 10, 200, false, 10);
	
	var getRand = PRASAD.utils.randomIntForRange;
	
	var n1 = new PRASAD.widgets.math.SelectableNumbers("numbers",0,10,  function(selectedNumber) {
										$("#answer")[0].value = selectedNumber;
										
										if( getAnswer() == selectedNumber) {											
											scoreCard.correct();
											//$('#next').get(0).disabled = false;					
											//n1.setEnabled(false);
											next();
										}
										else {
											scoreCard.incorrect();
											//$('#next').get(0).disabled = true;
											//n1.setEnabled(true);
										}												
									});
	/*								
	var n2 = 	new PRASAD.widgets.math.SelectableNumbers2("numbers2",0,10,  function(selectedNumber) {
										$("#answer")[0].value = selectedNumber;
										
										if( getAnswer()== selectedNumber) {											
											scoreCard.correct();
											//$('#next').get(0).disabled = false;	
											n2.setEnabled(false);
											next();
										}
										else {
											scoreCard.incorrect();
											//$('#next').get(0).disabled = true;	
											n2.setEnabled(true);
										}										
									});		
			
	*/
	var scoreCard = new ScoreCard("score");
	$("#answer")[0].value = "";
	
	next();
	
	
	//$('#next').get(0).disabled = true;	
	//document.getElementById("next").onclick = function(){		
	//	next();
	//}
	
	function next() {
		$("#answer")[0].value = "";
		//$('#next').get(0).disabled = true;
		tenFrame.setCount(getRand(0,10));	
		$("#question")[0].innerHTML = questions[getRand(0,questions.length-1)];	
		//n1.setEnabled(true);
		//n2.setEnabled(true);
	}
	
	function getAnswer() {
		var ques = $("#question")[0].innerHTML;
		if( ques == questions[0]) {
			return tenFrame.getCount();
		}
		else {
			return 10 - tenFrame.getCount();
		}
	}								
	
	/*
	 Use the following if keyboard entry required 
	 
	$("#answer").keypress(function(event) {
		
		var which = event.which;
		// 8 - ascii for backspace
		// 48 - ascii for 0
		// 5 -  ascii for 9
		if (which != 8 && (which < 48 || which > 57 ) ) return false;
		if( which >= 48 && which <=57) {
			var number = which - 48;
			//console.log("number entered : "+ number + " ; this.value = " + this.value);
			var fullNumber = this.value * 10 + number;
			if (fullNumber == tenFrame.getCount()) {
				scoreCard.correct();
				console.log("Full number = " + fullNumber);
			}
		}
	});
	*/
}