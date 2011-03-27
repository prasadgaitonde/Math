/**
 * @author prasad
 */
 

window.onload = function(){

	var width = 400;
	var height = 400;
	var paper = new Raphael(document.getElementById('canvas_container'), width, height);
	
	//var rect = paper.ellipse(100,100, 50,50).attr({stroke:'none',fill:'r(1,1)#fff-#00F'});
	
	var x = 100;
	var y = 200;
	var radius = 30;
	var face = paper.circle(x,y, radius);
	var i1 = paper.circle(x - radius/2, y - radius/3,3).attr({fill:'black'});
	var i2 = paper.circle(x + radius/2, y - radius/3,3).attr({fill:'black'});
	var noseString = PRASAD.utils.getpath("m",x,y-5) + PRASAD.utils.getpath("L",x,y+10);
	var nose = paper.path(noseString);
	
	var mouthWidth=20;
	var mouthHeight =15;
	var x1 = x-mouthWidth/2;
	var y1 = y  +mouthHeight;
	var x2 = x;
	var y2 = y1+mouthHeight;
	var x3 = x1 + mouthWidth;
	var y3 = y1;
	
	var mouthString = PRASAD.utils.getpath("M", x1, y1) + "C" + x1 + ", " + y1 + ", " +
									x2 + ", " +  y2 + "," + x3 + "," + y3 + "Z";
	//paper.path('M50,50 C50 50 ,100,100, 150,50 Z').attr({fill:'black'});
	console.log(mouthString);
	var mouth = paper.path(mouthString).attr({fill:'black'});
	
	

	
	var scale = 1;
	face.animate({scale:scale, translation:'50,50'},1000);
	
	var ratio = radius/50;
	var d = radius * scale * ratio;
	d=50;
	console.log("d = "+ d);
	var ds = d + "," + d;
	
	i1.animateWith(face, {scale:scale, translation:ds},1000, function() {
		
		var newX = i1.attr('cx');
		var newY = i1.attr('cy');
		console.log(newX + " , " + newY);
		//console.log(i1);
		var wink = PRASAD.utils.getpath("m",newX,newY) + PRASAD.utils.getpath("L",newX+10,newY);
		console.log(wink);
		i1.hide();
		paper.path(wink);
	});
	
	i2.animateWith(face, {scale:scale, translation:ds},1000);
	
	nose.animateWith(face, {scale:scale, translation:'50,50'},1000);
	mouth.animateWith(face, {scale:scale, translation:'50,50'},1000);
	
}
	
