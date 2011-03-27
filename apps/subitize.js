/**
 * @author prasad
 */
 

window.onload = function(){	
	var DISPLAY_INTERVAL=1500;

	var width = 500;
	var height = 300;
	
	var paper = new Raphael(document.getElementById('canvas_container'), width, height);
	
	var dotCardGen = new PRASAD.widgets.math.RandomDotCardGenerator(paper,width/2 - width/4,10,width/4,width/4);
	var dotCard = dotCardGen.getNextCard();
	dotCard.animate(DISPLAY_INTERVAL);
	
	/*
	var againElem = $("#again").get(0);
	againElem.onclick = function(){
		dotCard.restore();
		dotCard.animate(DISPLAY_INTERVAL);
	}
	againElem.disabled = false;
	
	
	var nextElem = $("#next").get(0);
	nextElem.onclick = function(){
		next();
	}
	*/
	
	function next() {
		dotCard = dotCardGen.getNextCard();
		dotCard.animate(DISPLAY_INTERVAL);		
		//againElem.disabled = false;
		//nextElem.disabled = true;
	}
		
	var n1  = new SelectableNumbers3(paper, 50, 200 , 400,40,1,10, function(selectedNumber) {
		
					if( dotCard.getCount() == selectedNumber) {																				
						//againElem.disabled =true;
						//nextElem.disabled =false;										
						scoreCard.correct();
						// Wait for some time before moving to next
						setTimeout(next,1000);						
					}
					else {					
						scoreCard.incorrect();
						//againElem.disabled = false;
						//nextElem.disabled = true;
						
					}										
				});										
				
	
	var scoreCard = new ScoreCard("score");
}
