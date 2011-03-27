window.onload = function(){
	
	 var R = Raphael("canvas_container", 500, 500),
    c = R.circle(100, 100, 50).attr({
        fill: "hsb(.8, 1, 1)",
        stroke: "none",
        opacity: .5
    }),
    d = R.circle(200, 200, 50).attr({
        fill: "hsb(1, 1, .8)",
        stroke: "none",
        opacity: .5
    }),        
    start = function () {
        // storing original coordinates
        this.ox = this.attr("cx");
        this.oy = this.attr("cy");
        this.attr({opacity: 1});
    },
    move = function (dx, dy) {
        // move will be called with dx and dy
        this.attr({cx: this.ox + dx, cy: this.oy + dy});
    },
    up = function () {
        // restoring state
        this.attr({opacity: .5});
        this.undrag(notDefinedVariable); // Try to make it undragable
    };

    c.drag(move, start, up);    
    d.drag(move, start, up);     
	
	/*
	//var elem = document.getElementById("test_div");
	var elem = $("#test_div");
	console.log("elem = " + typeof elem);
	console.log("attr class = " + elem.attr("class"));
	console.log("attr class = " + elem.css("width"));
	for( var i in elem.style)  {
		//if (i=== "offsetWidth" || i === "width" || i === "height") {
			console.log(i + " = " + elem.style[i]);
			//alert('width = ' + elem.style[i]);
		//}
		
	}
	//console.log('width = ' + elem.offsetWidth + " padding = " + elem.padding);
	*/
	
	//dothis();
}

function dothis() {
	
	var paper = new Raphael(document.getElementById('canvas_container'), 600, 300);
	
	
	//new AnimatedTick(paper,300,100).draw();
	
	/*
	var path1=paper.path("M114 253").attr({"stroke": "#f00", "stroke-width":3});
	path1.animate({path: "M114 253 L 234 253"},500,function(){
			var path2=paper.path("M234 253").attr({"stroke": "#f00","stroke-width":3});
			path2.animate({path: "M234 253 L 234 134"},500,function(){
			var path3=paper.path("M234 134").attr({"stroke": "#f00","stroke-width":3});	
            	path3.animate({path: "M234 134 L 97 134"},500);
        	});
    	});
	*/	
	
	/*
		var path1=paper.path("M100 100").attr({"stroke": "#f00", "stroke-width":5})
		path1.animate({path: "M100 100 L 120 150"},400,function(){
			var path2=paper.path("M120 150").attr({"stroke": "#f00","stroke-width":5});
			path2.animate({path: "M120 150 L 270 100"},200);
		});
	*/
	
	/*
	
	new PRASAD.widgets.math.NumberGrid(paper,10,10,300);
	var tick = new Tick(paper,100,100);
	
	new PRASAD.widgets.Button(paper,300,50, 100,50, "CLICK",function() {console.log("click")});
	var label = new PRASAD.widgets.Label(paper,300,100, 100,50, "CLICK");
	
			setTimeout(function() {
			label.setVisible(false);
		},1000);
		
		new PRASAD.widgets.math.NFrame(paper, 390,100,200,true,10,8);
	*/
	/*
	new Shuffle(paper,100,100,100,100,10,null,false,false);
	var dim = new ArrowDim(50,25);
	new GoadingArrow(paper, 200,200,"DTU").startAnimation();
	new GoadingArrow(paper, 200,200,"UTD",dim).startAnimation();
	new GoadingArrow(paper, 200,200,"LTR",dim).startAnimation();
	new GoadingArrow(paper, 200,200,"RTL",dim).startAnimation();
	*/
	var c1 = new DraggableCircle(paper, 20,20,10, function(x,y) {
		console.log("up called");
		console.log("(2) Dropped at " + x +", " + y);
		
	});
	//c1.setColor("red");
	/*
	setTimeout (function() {
		c1.setVisible(false);
		},2000);
		
	setTimeout (function() {
		c1.setVisible(true);
		},8000);
	*/	
	/*
	c1.shape.drag(move,start,up);
	function move(dx,dy) {
		c1.move(dx,dy);
	}
	
	function start() {
		c1.start();
	}
	
	function up() {
		console.log("up");
	}
	*/
	
	//new ArrowButton(paper,400,200,dim);
	//tick.display();
/*
	setInterval( function() {
		tick.display();
		setTimeout( function() {
			tick.remove();
		},1000);
	}, 1000);
*/	
	//tick.hide();	


}


var drawHorizondalLine = function(x1,y1,x2,y2, color) { 
          var width = Math.abs(x1 - x2);
          var posX  = (x1 > x2) ? x1 : x2;
          var id ='c_'+new Date().getTime()
          var line = "<div id='"+id+"'class='line'>&nbsp;</div>";
 
          $('body').append(line);

          $('#'+id).css({
            left: posX,
            top: y1,
            width: width,
            position:'absolute',
            backgroundColor: color
          });
 
};

function draw() {
	

$(document).ready(function() {
  drawHorizondalLine(0, 10, 200, 10, '#a00');
  drawHorizondalLine(0, 50, 100, 50, '#0a0');
});

}


