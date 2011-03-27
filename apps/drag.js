/*
window.onload = function(){
	var R = Raphael("canvas_container", 500, 500), c = R.circle(100, 100, 50).attr({
		fill: "hsb(.8, 1, 1)",
		stroke: "none",
		opacity: .5
	}), d = R.circle(200, 200, 50).attr({
		fill: "hsb(1, 1, .8)",
		stroke: "none",
		opacity: .5
	}), start = function(){
		// storing original coordinates
		this.ox = this.attr("cx");
		this.oy = this.attr("cy");
		this.attr({
			opacity: 1
		});
	}, move = function(dx, dy){
		// move will be called with dx and dy
		this.attr({
			cx: this.ox + dx,
			cy: this.oy + dy
		});
	}, up = function(){
		// restoring state
		this.attr({
			opacity: .5
		});
		this.undrag(notDefinedVariable); // Try to make it undragable
	};
	
	c.drag(move, start, up);
	d.drag(move, start, up);
};
*/

window.onload = function(){
	dothis();
}

function dothis() {
	var paper = new Raphael(document.getElementById('canvas_container'), 600, 300);
	var x = 100,
	y=100, text = "23";
	var text = paper.text(x, y, text).attr({'font-size':20,fill:"rgb(0,0,0)"});
	
	paper.text(x+100, y, "32").attr({'font-size':20,fill:"rgb(0,0,0)"});
	paper.text(x, y+100, "79").attr({'font-size':20,fill:"rgb(0,0,0)"});
	
	text.drag(move,start, up);
	text.node.onclick = function() {
		console.log("Node clicked");
		
	}
	
	var startX, startY;
	function move(dx, dy) {
		text.attr({x: startX + dx, y : startY + dy});
	}
	
	
	function start() {
		startX = text.attr("x");
		startY = text.attr("y");
	}
	
	function up() {
		//text.undrag(notdefined);
	}
}

