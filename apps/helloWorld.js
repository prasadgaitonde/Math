
function buildWindow() {
	//console.log("hello");
	var win = new Ext.Window( {
		id: 'myWindow',
		title: 'My first Ext Js Window',
		width: 300,
		height: 150,
		layout: 'fit',
		
		autoLoad : {
			url: 'sayHi.html',
			scripts:true
		}
		
		
	});
	win.show();
}


Ext.onReady(function() {
	
	
	//console.log("loaded....");
	//Ext.MessageBox.alert("The DOM is ready");
	Ext.Msg.show ( {
		title:'Box',
		msg:'Hello there',
		buttons : { 
				cancel : true, 
				yes : true, 
				no : true
		},
		fn: function(button) {
			Ext.Msg.alert("You clicked " + button);
			switch(button) {
				case 'yes' : Ext.Msg.prompt("Prasad","So where is it?", function(btn, txt) {
					//Ext.get('my_id').dom.innerHTML = "Dull work";
					Ext.get('my_id').highlight('FF0000', { endColor:'0000FF', duration: 3});
				}); break;
				case 'cancel' : Ext.Msg.wait("Time consuming task");
			}
		}
	}
	);
	//buildWindow();
});




