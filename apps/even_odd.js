window.onload = function(){
	dothis();
}

function dothis(){

	var paper = new Raphael(document.getElementById('canvas_container'),500, 300);
	var demo = new EvenOddDemo(paper);
	
	
	
	
				
	document.getElementById("get").onclick = function(){
		
		demo.animate();
	}
}

function EvenOddDemo(paper){
	

	this.paper = paper;
	this.shapes = [];
	this.text = [];
	this.startX = 50;
	this.startY = 70;
	
	this.WIDTH = 30;
	this.HEIGHT = 30;
	
	var x=10, y=10, width = this.WIDTH, height=this.HEIGHT;
	for (var i = 0; i <3; i +=1 ) {

		 this.shapes.push( paper.rect(x,y,width, height).attr({
						fill: 'green'
						}));
						
		var fontSize = height/2;
		this.text.push(paper.text(x+width/2, y+height/2, (i+1)).attr({'font-size':fontSize,fill:"rgb(0,0,0)"}));
						
		 x += width + 10;
	}
	
}


EvenOddDemo.prototype.animate = function() {
	var getpath = PRASAD.utils.getpath;
	var that = this;
	
	var index = 0;
	//console.log(this.startX+", " + this.startY);
	this.shapes[index].animate({x:this.startX,y:this.startY}, 500, animEnd);
	this.text[index].animateWith(this.shapes[index], {x:this.startX + that.WIDTH/2,y:this.startY+ that.HEIGHT/2}, 500);
	
	function drawArrow(x,y) {
		var stickWidth=20;
		var stickHeight=4;
		var arHeight =4;
		var arWidth =8;
		var spinnerPath = 	
				getpath("M",x,y-3 )+ 
				getpath("l", stickWidth,0) + //1
				getpath("l",0,-arHeight) + 		//2		
				getpath("l",arWidth,arHeight+stickHeight) + //3
				getpath("l",-arWidth,arHeight+stickHeight) +  		//4		
				getpath("l",0,-arHeight) + //5
				getpath("l",-stickWidth,0) + //6
				"z";
				
		var arrow = that.paper.path(spinnerPath).attr({fill:'black'});
		arrow.rotate(-150);
		arrow.animate({translation:'-20,-20'},300,"elastic", function() {
			arrow.animate({ translation:'20,20'},500, function() {
			arrow.remove();
			});
		});
	}
	
	function animEnd() {
		index ++;
		//console.log(index);
		if (index == that.shapes.length) {
			var n = index % 2;
			if (n != 0) {
				
			
				var n1 = Math.floor((index) / 2);
				var x1 = that.startX + n * that.WIDTH;
				var y1 = that.startY + (n1) * that.HEIGHT;
				
				drawArrow(x1 + that.WIDTH,y1+ that.HEIGHT);
				/*
				var rect = that.paper.rect(x1, y1, that.WIDTH, that.HEIGHT).attr({
					fill: 'red'
				});
				
				rect.animate({scale: 1.2}, 300, function(){
					rect.animate({scale: 1}, 500, function(){
						rect.animate({opacity: 0}, 1000);
					})
				});
				*/
			}
			return;
		}
		var n = index % 2;
		var n1 = Math.floor((index)/2);
		var x1 = that.startX + n * that.WIDTH;
		var y1 = that.startY + (n1) * that.HEIGHT;
		
		that.shapes[index].animate({x:x1,y:y1}, 500, animEnd);
		that.text[index].animateWith(that.shapes[index], {x:x1 + that.WIDTH/2,y:y1+ that.HEIGHT/2}, 500);
	}
}
