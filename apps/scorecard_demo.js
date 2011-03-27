window.onload = function(){
	dothis();
}

function dothis() {
	
	
	var paper = new Raphael(document.getElementById('canvas_container'), 600, 300);
	var sc = new ScoreBoard(paper, 10,10, 300,100, 4000);
	
	//sc.newSession();
	 
	document.getElementById("get").onclick = function() {
	
		sc.newSession(" demo of score card");
	}
	
	document.getElementById("correct").onclick = function() {		
		sc.correct();
	}
	
	document.getElementById("incorrect").onclick = function() {		
		sc.incorrect();
	}
}


