/**
 * @author prasad
 */
 

window.onload = function(){	
	var DISPLAY_INTERVAL=1500;
	var canvas =  $('#canvas');
	var width = PRASAD.utils.getCSSInteger(canvas, "width");
	var height = PRASAD.utils.getCSSInteger(canvas, "height");
	console.log("width = " + width+ "; height = " + height);
	
	var paper = new Raphael(canvas.get(0), width, height);
	//console.log("paper:" + paper );
	var tick = new AnimatedTick(paper,250,200);
	var tryAgain = new TryAgain(paper,250,200);
	
	var dotCardGen = new PRASAD.widgets.math.RandomDotCardGenerator(paper,width/2 - width/4,10,width/4,width/4);
	var dotCard = dotCardGen.getNextCard();
	dotCard.animate(DISPLAY_INTERVAL);
	
	var againElem = $("#again").get(0);
	againElem.onclick = function(){
		dotCard.restore();
		dotCard.animate(DISPLAY_INTERVAL);
		tick.hide();
		tryAgain.hide();
	}
	againElem.disabled = false;
	
	var nextElem = $("#next").get(0);
	nextElem.onclick = function(){
		dotCard = dotCardGen.getNextCard();
		dotCard.animate(DISPLAY_INTERVAL);
		//tick.hide();
		tryAgain.hide();
		againElem.disabled = false;
		nextElem.disabled = true;
	}
	/*
	new PRASAD.widgets.Button(paper, 50, 200, 70, 30, "Again", againElem.onclick);
	new PRASAD.widgets.Button(paper, 150, 200, 70, 30, "Next", nextElem.onclick);
	*/
	//var scoreCard = new ScoreBoard(paper,50, 250);
	
	var scoreCard = new ScoreCard("score");
	
	var numbers = ["one", "two" , "three" , "four", "five" , "six", "seven", "eight", "nine" , "ten"];
	for( var k=0; k < numbers.length;k +=1 ) {
		var elem = document.getElementById(numbers[k]);
		elem.onclick = function(){
									var buttonNum = (k+1);
									return function() {
										//console.log("DC count = " + dotCard.getCount() + "i = " + buttonNum);
										if( dotCard.getCount() == buttonNum) {
											//console.log("correct");											
											againElem.disabled =true;
											nextElem.disabled =false;
											
											scoreCard.correct();
											//tick.draw();
											//tryAgain.hide();
										}
										else {
											//tryAgain.draw();
											scoreCard.incorrect();
											againElem.disabled = false;
											nextElem.disabled = true;
											//console.log("wrong")
										}										
									}
						}();
	}
}
