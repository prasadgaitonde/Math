window.onload = function(){
	dothis();
}

function dothis() {
	document.getElementById("get").onclick = function() {
		console.log("animate");
		//circle.rotate(30,x,y);
		circle.animate({rotation:'20 200 200'},2000);
		print();
	}
	var paper = new Raphael(document.getElementById('canvas_container'), 600, 300);
	var x =100,
	y=100, radius=50;
	
	var circle = paper.circle(x,y,radius);
	
	print();
	
	
	function print(){
		var coor = circle.attr('cx') + "," + circle.attr('cy');
		paper.text(x,y, coor);
		//console.log(circle);
	}
	
	
}

