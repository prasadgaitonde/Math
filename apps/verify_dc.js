window.onload = function(){
	
	dothis();
}

function dothis() {
	
	var paper = new Raphael(document.getElementById('canvas_container'), 600, 300);
	
	document.getElementById("clear").onclick = (function(){
		console.log("cleared");
		document.getElementById("array").value="";
	});

	document.getElementById("get").onclick = function(){		
		var arrayStr = document.getElementById("array").value;
		//console.log(arrayStr);
		var ar = arrayStr.split(",");
		console.log("arry = " + ar + " length = " + ar.length);
		new PRASAD.widgets.math.Grid(paper, 10, 10, 200, 200, 6, ar);
	}

}




