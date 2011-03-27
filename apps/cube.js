window.onload = function(){

/*
	var o = {
		name:'prasad',
		surname:'gaitonde',
	}


	var emp = Object.create(o);
	emp.title = "VP";
	printProperties(emp);
	//console.log(emp.name + "," + emp.surname);
*/	
	dothis();
}

function dothis(){
	var paper = new Raphael(document.getElementById('canvas_container'), 700, 500);
	
	var x = 100, y =100, width =30, height=width;
	var offset = width/5, connWidth=width-2*offset;
	var connHeight=height/5;
	var pathArray = ['M', x, y , 'l', width,0, 0,height,-width,0, 0,-height, 
					'M' , (x+offset),y , 'l',0, -connHeight, connWidth,0, 0,connHeight];
	var pathStr = 	pathArray.join(' ');
	console.log(pathStr);			
	
	var otherCubes = [];
	/*
	for( var i=0; i < 5 ; i+=1) {
		var spec = {
			paper:paper,
			x:x+ i*(width+2),
			y:y,
			width:width,
			height:height,
			connectorWidth:connWidth,
			connectorHeight:connHeight,
			//supportsJoins:true,
			otherCubes:otherCubes,
			callback:callback,
			moveToAllowed: moveToAllowed,
			identifier:"" + (i+1)			
		};
		
		//var d1 = new DraggableUCube(paper,x+ i*(width+2),y,width,height,connWidth,connHeight,true, otherCubes,callback,moveToAllowed,""+i);
		//var d1 = DraggableCube(spec);
		var d1 = DraggableAndJoinableCube(spec);
		d1.activateDrag();
		otherCubes.push(d1);
		
	}
	/*
	var counter = SelectableCircle( {
								paper: paper,
								cx: 200,
								cy:250,
								radius:15,
								color:'#00F'
								});
	*/
								
	var linkMgr = LinkMgr(otherCubes);	
	var counter = createSelectableCounter();
		
	
	var target = new SelectableCounterTarget(
							{
								paper:paper,
								x: 300,
								y:100,
								width:300,
								height:300,
								color:'black',
								callback: function(x,y) {									
									console.log("Target clicked at " + x + ","+y);
									var selectedCounters = linkMgr.getSelectedCubes();
									var numSelectedCounters = selectedCounters.length;
									console.log("# cubes selected  = " + numSelectedCounters);
									if (numSelectedCounters > 0) {
										if (numSelectedCounters == 1) {
											for (var i = 0; i < selectedCounters.length; i += 1) {
												var selCounter = selectedCounters[i];
												if (selCounter.insideOf == undefined) {
													selCounter.insideOf = target;
													counter = createSelectableCounter();
												}
												selCounter.animateTo(x, y);
												selCounter.removeOutline();
											}
										}
										else {
											// Multiple counters have been selected																		
											var startOfLink = linkMgr.getFirstSelectedCube();
											linkMgr.moveLinkTo(startOfLink,x,y,height);								
										}
									}
								}
							}
	);
	/*
	var cross = new PRASAD.graphics.Cross(
					{	
						paper:paper,
						x:320,
						y:150,
						callback:function() {
							
						}
					}
				);
				*/
	counter.getShape().insertAfter(target.getShape());
	
	function createSelectableCounter() {
		var counter = SJCube( {
								paper:paper,
								x:200,
								y:100,
								width:width,
								height:height,
								otherCubes:otherCubes,
								connectorWidth:connWidth,
								connectorHeight:connHeight,
								linkMgr:linkMgr
								});		
		otherCubes.push(counter);
		if (target !== undefined) {
			counter.getShape().insertAfter(target.getShape());
		}
		return counter;						
	}
	
								
	printProperties(paper);								
	
	function callback(counter, x,y) {
		//console.log("cb called");
	}
	
	function moveToAllowed(circle, x, y){
		return true;
	}
	
	
	
	document.getElementById("get").onclick = function() {
		/*
		console.log("click");
		setTimeout( function() {
		d1.moveTo(200,100);
		},200);
		*/
		d2.join(d1);
	}
						
}

