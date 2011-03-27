window.onload = function(){
	var myCallback = function(result) {
		console.log("result is " + result);
		document.getElementById("number").value  = result;
	}
	
	var x = 200,
		y =100,
		radius = 105,
		numbers =10;
	new Dial(500,300, radius, numbers, myCallback);
	
}
/*
 * width is the width of the display area in which to center the dial
 * height is the height of the display area in which to center the dial
 * radius is the radius of the dial
 * numbers is the number of number to be displayed in dial
 * callback [optional] is the callback function which will be called after the
 * dial stops spinning with the selected number

*/
function Dial(width,height,radius,numbers,callback) {
	var x = width/2;
	var y = height/2;
	var paper = new Raphael(document.getElementById('canvas'), width, height);
	
	var spinner;
	var Button = PRASAD.widgets.Button;
	
	new Button(paper,x+ radius + 10 , y,radius/2,radius/3,"Start", function() {
		spinner.animate();
	});
	
	
	var sectorAngle = 360/numbers;
		
	paper.circle(x,y,radius).attr({stroke:'green',fill:'yellow'});
	
	drawSectors();	
	drawNumbers();
	
	spinner = new Spinner(paper,x,y,radius,interCallback);
	
	function drawSectors(){
		var getpath = PRASAD.utils.getpath;
		var x1,y1,path,rad,angle;
		for (var i = 0, angle = 0; i < numbers; i++, angle += sectorAngle) {

			rad = angle * Math.PI/180;
			x1 = x +  radius * Math.cos(rad);
			y1 = y -  radius * Math.sin(rad);
		
			path = getpath("M",x ,y) + getpath("L", x1, y1);
			paper.path(path)
		}
	}
	
	function interCallback(endAngle) {
		var count = endAngle/sectorAngle;
		var sectorNum = Math.ceil(count) % numbers  + 1;
		//console.log("sectorNum =" + sectorNum);
		callback(sectorNum);
	}
	
	function drawNumbers() {
		var rad = Math.PI / 180,
   			 cx = x,cy =y ,r1 = radius/1.5,
   			 startangle = -1 * (sectorAngle + sectorAngle/2),			 
			 xk,
			 yk, 
			 endangle;
		 
		for(var i=1;i< numbers + 1;i += 1) 	{
			 endangle = startangle + sectorAngle  ;
	
			 xk = cx + (r1)  * Math.cos(endangle * rad);
			 yk = cy + (r1) * Math.sin(endangle * rad);
	
			 paper.text(xk,yk,i+"").attr({'font-size':radius/6});	
	
			startangle = endangle  ;
	 	}
	}
	
}

function Spinner(paper,x,y,radius,callback) {
	var that = this;
	var getpath = PRASAD.utils.getpath;
	var randomIntBetween1And10 = PRASAD.utils.randomIntBetween1And10;
	var randomIntBetween1AndMax = PRASAD.utils.randomIntBetween1AndMax;
	
	var arWidth =radius/5;
	var arHeight= radius/18;
	var stickWidth = radius - arWidth;
	var spinnerPath;
	var spinner;
	var stickHeight = radius/30; 		 // height of stick;
	
	
	var spinnerPath = 	
				getpath("M",x,y-3 )+ 
				getpath("l", stickWidth,0) + //1
				getpath("l",0,-arHeight) + 		//2		
				getpath("l",arWidth,arHeight+stickHeight) + //3
				getpath("l",-arWidth,arHeight+stickHeight) +  		//4		
				getpath("l",0,-arHeight) + //5
				getpath("l",-stickWidth,0) + //6
				"z";

	spinner = paper.path(spinnerPath).attr({
		fill: 'red', stroke:'none'
	});
	
	/**
	 // Not yet ready for flicking the spinner 
	 
	var deltaY = 0;
	var deltaX = 0;
	function move(dx,dy) {
		deltaY += dy;
		deltaX += dx;
		
		spinner.rotate(count,x,y);
		var ybyr =dy/radius;
		var xbyr = dx/radius; 
		
		var arc ;
		if(Math.abs(dy) > Math.abs(dx) ) {
			arc = Math.asin(ybyr) * 180/Math.PI;
		}
		else {
			arc = Math.asin(xbyr) * 180/Math.PI;
		}
		console.log("arc sin = " + arc);
		count += arc;
	}
	
	function start() {
		deltaY=0;
		deltaX =0;
		console.log("start");
	}
	function complete() {
		//console.log("complete: deltaX = " + deltaX + "; deltaY = " + deltaY);
	}
	
	spinner.drag(move, start, complete);


	
	spinner.node.onmousedown1 = function() {
		console.log("mouse click");
		//that.animate();
	}
	//spinner.node.onmousedown =  spinner.node.click;
	 
	 */
	
	paper.circle(x,y,stickHeight+2).attr({stroke:'none',fill:'red'});
	var count=0;
	this.animate = function () {
		
		var s = count + " " +  x + " " + y;
		var TIME = randomIntBetween1And10();
	
		var r2 = randomIntBetween1AndMax(4) * 1000;
		//console.log("timer  = " + r2);
		setTimeout(timer,r2);
		spinner.animate({rotation:s},TIME,endSpin);
		var stop = false;
		
		function endSpin(){
			if (!stop) {
				count += 10;
				TIME += 1;
				var s = count + " " + x + " " + y;
				this.animate({
					rotation: s
				}, TIME, endSpin);
			}
			else {
				if (callback !== undefined) {					
					callback(count);
				}
			}
		}
		
		function timer() {
			stop = true;
		}			
	}
		
}

