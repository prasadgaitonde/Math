window.onload = function(){
	
	dothis();
}

function dothis() {
	document.getElementById("lower").value = "";	
	document.getElementById("upper").value = "";
	
	document.getElementById("get").onclick = function(){	
	document.getElementById("rand").value = "";	
		var rand = PRASAD.utils.randomIntForRange(+ document.getElementById("lower").value, + document.getElementById("upper").value);
		//console.log("rand # = " + rand);
		document.getElementById("rand").value = rand;
	}
	
	new PRASAD.widgets.math.SelectableNumbers("numbers", 0,10, function(selected) {
		console.log("The # that was selected is " + selected);
	});


	
	
}



